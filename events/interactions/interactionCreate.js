const { useQueue } = require('discord-player');
const {
	Events,
	ButtonBuilder,
	ButtonStyle,
	ActionRowBuilder,
	EmbedBuilder,
	Collection
} = require('discord.js');
const { sendErrorLog } = require('../../functions/utils');
const { wrongEmbed, queueEmbed } = require('../../functions/embeds');
const { commands, cooldowns, buttons } = require('../../functions/bot');

module.exports = {
	name: Events.InteractionCreate,
	async execute(interaction) {
		if (!interaction.inGuild()) return;

		if (interaction.isChatInputCommand()) {
			try {
				const command = commands.get(interaction.commandName);
				if (!command)
					return console.error(`No command matching ${interaction.commandName} was found.`);

				const userId = interaction.user.id;
				if (!cooldowns.has(command.name)) {
					cooldowns.set(command.name, new Collection());
				}

				const now = Date.now();
				const timestamps = cooldowns.get(command.name);
				const defaultCooldownDuration = 5;
				const cooldownAmount = (command.cooldown ?? defaultCooldownDuration) * 1000;
				if (timestamps.has(userId)) {
					const expirationTime = timestamps.get(userId) + cooldownAmount;
					if (now < expirationTime) {
						const expiredTimestamp = Math.round(expirationTime / 1000);
						return interaction.reply({
							content: `You are on a cooldown for this command. You can use it again <t:${expiredTimestamp}:R>.`,
							ephemeral: true
						});
					}
				}

				timestamps.set(userId, now);
				setTimeout(() => timestamps.delete(userId), cooldownAmount);
				if (command.category === 'music' && command.name !== 'play') {
					const queue = useQueue(interaction.guild.id);
					if (!queue || !queue.isPlaying())
						return await wrongEmbed(interaction, '❌ | No music is being played!');

					const memberChannelId = interaction.member.voice.channelId;
					const queueChannelId = queue.channel.id;
					if (!memberChannelId)
						return await wrongEmbed(interaction, 'You need to join a voice channel first!');
					if (memberChannelId !== queueChannelId)
						return await wrongEmbed(interaction, 'You must be in the same voice channel as me!');
				}
				await command.execute(interaction);
			} catch (error) {
				console.error(error);
				await sendErrorLog(error, 'error');
				if (interaction.deferred)
					return interaction.editReply({
						content: `${error.message ?? '❌ | There was an error while executing this command!'}`
					});
				if (interaction.replied)
					return interaction.followUp({
						content: `${error.message ?? '❌ | There was an error while executing this command!'}`,
						ephemeral: true
					});
				return interaction.reply({
					content: `${error.message ?? '❌ | There was an error while executing this command!'}`,
					ephemeral: true
				});
			}
		} else if (interaction.isButton()) {
			const name = interaction.customId;
			const button = buttons.get(name);

			if (!button)
				return await interaction.reply({
					content: 'This button is not registered!',
					ephemeral: true
				});
			await button.execute(interaction);
		}
	}
};
