const { useQueue } = require('discord-player');
const { Events, Collection } = require('discord.js');
const { sendErrorLog } = require('../../functions/utils');
const { wrongEmbed, errorEmbed } = require('../../functions/embeds');
const { commands, cooldowns, buttons } = require('../../functions/bot');
const logger = require('../../functions/logger');

module.exports = {
	name: Events.InteractionCreate,
	type: 'interaction',

	async execute(interaction) {
		if (!interaction.inGuild()) return;

		if (interaction.isChatInputCommand()) {
			try {
				const command = commands.get(interaction.commandName);
				if (!command)
					return logger.error(`No command matching ${interaction.commandName} was found.`);

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
						interaction.reply({
							content: `You are on a cooldown for this command. You can use it again <t:${expiredTimestamp}:R>.`,
							ephemeral: true
						});
						return setTimeout(() => interaction.deleteReply(), expirationTime - now);
					}
				}

				timestamps.set(userId, now);
				setTimeout(() => timestamps.delete(userId), cooldownAmount);
				if (command.category === 'music' && command.name !== 'play') {
					const queue = useQueue(interaction.guild.id);
					const busyQueue = !queue || !queue.isPlaying() || queue.isTransitioning();
					if (busyQueue) return await wrongEmbed(interaction, '❌ | No music is being played!');

					const memberChannelId = interaction.member.voice.channelId;
					const queueChannelId = queue.channel.id;
					if (!memberChannelId)
						return await wrongEmbed(interaction, 'You need to join a voice channel first!');
					if (memberChannelId !== queueChannelId)
						return await wrongEmbed(interaction, 'You must be in the same voice channel as me!');
				}
				await command.execute(interaction);
			} catch (error) {
				logger.error('Command', error);
				await sendErrorLog(error, 'Command error');
				await errorEmbed(
					interaction,
					`${error.message ?? '❌ | There was an error while executing this command!'}`
				);
			}
		} else if (interaction.isButton()) {
			try {
				const name = interaction.customId;
				const button = buttons.get(name);

				if (!button) {
					logger.error(`No button matching ${interaction.customId} was found.`);
					return await wrongEmbed(interaction, 'This button is not registered!');
				}

				const userId = interaction.user.id;
				if (!cooldowns.has(button.name)) {
					cooldowns.set(button.name, new Collection());
				}

				const now = Date.now();
				const timestamps = cooldowns.get(button.name);
				const defaultCooldownDuration = 5;
				const cooldownAmount = (button.cooldown ?? defaultCooldownDuration) * 1000;
				if (timestamps.has(userId)) {
					const expirationTime = timestamps.get(userId) + cooldownAmount;
					if (now < expirationTime) {
						const expiredTimestamp = Math.round(expirationTime / 1000);
						interaction.reply({
							content: `You are on a cooldown for this command. You can use it again <t:${expiredTimestamp}:R>.`,
							ephemeral: true
						});
						return setTimeout(() => interaction.deleteReply(), expirationTime - now);
					}
				}

				timestamps.set(userId, now);
				setTimeout(() => timestamps.delete(userId), cooldownAmount);
				if (button.category === 'music') {
					const queue = useQueue(interaction.guild.id);
					const busyQueue = !queue || !queue.isPlaying() || queue.isTransitioning();
					if (busyQueue) return await wrongEmbed(interaction, '❌ | No music is being played!');

					const memberChannelId = interaction.member.voice.channelId;
					const queueChannelId = queue.channel.id;
					if (!memberChannelId)
						return await wrongEmbed(interaction, 'You need to join a voice channel first!');
					if (memberChannelId !== queueChannelId)
						return await wrongEmbed(interaction, 'You must be in the same voice channel as me!');
				}
				await button.execute(interaction);
			} catch (error) {
				logger.error('Button', error);
				await sendErrorLog(error, 'Button error');
				await errorEmbed(
					interaction,
					`${error.message ?? '❌ | There was an error while executing this button!'}`
				);
			}
		}
	}
};
