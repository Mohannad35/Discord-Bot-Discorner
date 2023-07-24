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
const { commands, cooldowns } = require('../../functions/bot');

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
			// respond to the button
			if (interaction.customId === 'nextInQueue') {
				const description = interaction.message.embeds[0].description;
				const offset = parseInt(description.split('\n')[8].slice(0, description.indexOf('.')));

				getQueue(interaction, offset, true);
			} else if (interaction.customId === 'prevInQueue') {
				const description = interaction.message.embeds[0].description;
				const offset = parseInt(description.split('\n')[0].slice(0, description.indexOf('.'))) - 10;

				getQueue(interaction, offset < 0 ? 0 : offset, true);
			}
		}
	}
};

async function getQueue(interaction, offset = 0) {
	const queue = useQueue(interaction.guild.id);

	if (!queue || !queue.isPlaying())
		return await wrongEmbed(interaction, '❌ | No music is being played!');
	//Converts the queue into a array of tracks
	const tracks = queue.tracks.toArray().map((track, i) => `${i + 1}. ${track.raw.title}`);

	const next = new ButtonBuilder()
		.setCustomId('nextInQueue')
		.setLabel('Next')
		.setStyle(ButtonStyle.Success);
	offset > tracks.length - 9 && next.setDisabled(true);

	const prev = new ButtonBuilder()
		.setCustomId('prevInQueue')
		.setLabel('Prev')
		.setStyle(ButtonStyle.Primary);
	offset === 0 && prev.setDisabled(true);

	const row = new ActionRowBuilder().addComponents(prev, next);

	const queueEmb = queueEmbed(queue, tracks.slice(offset, offset + 9).join('\n'), tracks.length);

	return interaction.update({ embeds: [queueEmb], components: [row] });
}
