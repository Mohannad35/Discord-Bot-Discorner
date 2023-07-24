const { ApplicationCommandOptionType } = require('discord.js');
const { QueueRepeatMode, useQueue } = require('discord-player');
const { baseEmbed } = require('../../functions/embeds');

module.exports = {
	name: 'repeat',
	description: 'Set repeat mode for the queue',
	category: 'music',
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: 'method',
			description: 'Repeat method.',
			required: true,
			choices: [
				{
					name: 'Show',
					value: 'show',
					description: 'Show the current repeat mode'
				},
				{
					name: 'Off',
					value: 'off',
					description: 'Default mode with no loop active'
				},
				{
					name: 'Track',
					value: 'track',
					description: 'Repeat the current track'
				},
				{
					name: 'Queue',
					value: 'queue',
					description: 'Loop the current queue'
				},
				{
					name: 'Autoplay',
					value: 'autoplay',
					description: 'Play related songs automatically based on your existing queue'
				}
			]
		}
	],

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const queue = useQueue(interaction.guild.id);

		const method = await interaction.options.getString('method');

		let description;
		switch (method) {
			case 'off':
				queue.setRepeatMode(QueueRepeatMode.OFF);
				description = '✅ | Turned off repeat mode.';
				break;

			case 'track':
				queue.setRepeatMode(QueueRepeatMode.TRACK);
				description = '🔂 | Looping the current track.';
				break;

			case 'queue':
				queue.setRepeatMode(QueueRepeatMode.QUEUE);
				description = '🔁 | Looping the current queue.';
				break;

			case 'autoplay':
				queue.setRepeatMode(QueueRepeatMode.AUTOPLAY);
				description = '🔄️ | Autoplay mode activated.';
				break;

			// case "show":
			default:
				let status = 'none';
				if (queue.repeatMode === 3) {
					status = 'autoplay';
				} else if (queue.repeatMode === 2) {
					status = 'queue';
				} else if (queue.repeatMode === 1) {
					status = 'track';
				} else if (queue.repeatMode === 0) {
					status = 'off';
				}
				const embed = baseEmbed(interaction)
					.setDescription(`Playback repeat status: \`${status}\`.`)
					.setFooter({ text: `Use '/repeat <off|track|queue|autoplay>' to change repeat mode.` });
				const msg = await interaction
					.editReply({ ephemeral: true, embeds: [embed] })
					.catch(console.error);
				setTimeout(() => interaction.deleteReply(msg), 5000);
				return;
		}

		const msg = await interaction.editReply({
			embeds: [baseEmbed(interaction).setDescription(description)]
		});
		setTimeout(() => interaction.deleteReply(msg), 5000);
	}
};
