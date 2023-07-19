const { ApplicationCommandOptionType } = require('discord.js');
const { useQueue } = require('discord-player');

module.exports = {
	name: 'remove',
	description: 'Remove song from the queue!',
	category: 'music',
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: 'position',
			description: `The song's current position.`,
			required: true
		}
	],

	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);
		const position = interaction.options.getString('position');

		if (!queue || !queue.isPlaying()) return interaction.reply('❌ | No music is being played!');
		if (!position.match(/^[0-9]+$/)) return interaction.reply('❌ | Invalid position!');
		if (position < 1 || position > queue.tracks.length)
			return interaction.reply('❌ | Invalid position!');

		queue.removeTrack(queue.tracks.toArray()[position - 1]);

		return interaction.reply(`✅ | Track removed from queue!`);
	}
};
