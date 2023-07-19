const { ApplicationCommandOptionType } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	name: 'move',
	description: 'Move songs!',
	category: 'music',
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: 'from',
			description: `The song's current position.`,
			required: true
		},
		{
			type: ApplicationCommandOptionType.String,
			name: 'to',
			description: `The song's target position.`,
			required: true
		}
	],

	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);
		const from = interaction.options.getString('from');
		const to = interaction.options.getString('to');

		if (!queue || !queue.isPlaying()) return interaction.reply('❌ | No music is being played!');
		if (!from.match(/^[0-9]+$/)) return interaction.reply('❌ | Invalid position!');
		if (!to.match(/^[0-9]+$/)) return interaction.reply('❌ | Invalid position!');
		if (from < 1 || from > queue.tracks.length)
			return interaction.reply('❌ | Invalid from position!');
		if (to < 1 || to > queue.tracks.length) return interaction.reply('❌ | Invalid to position!');

		queue.moveTrack(queue.tracks.toArray()[from - 1], to - 1);

		return interaction.reply(`✅ | Track moved from ${from} to ${to}!`);
	}
};
