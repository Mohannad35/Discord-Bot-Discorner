const { ApplicationCommandOptionType } = require('discord.js');
const { useQueue } = require('discord-player');
const { wrongEmbed, successEmbed } = require('../../functions/embeds');

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
		await interaction.deferReply({ ephemeral: true });

		const queue = useQueue(interaction.guild.id);
		const position = interaction.options.getString('position');

		if (!queue || !queue.isPlaying())
			return await wrongEmbed(interaction, '❌ | No music is being played!');
		if (!position.match(/^[0-9]+$/))
			return await wrongEmbed(interaction, '❌ | Invalid position!');
		if (position < 1 || position > queue.tracks.length)
			return await wrongEmbed(interaction, '❌ | Invalid position!');

		queue.removeTrack(queue.tracks.toArray()[position - 1]);

		return await successEmbed(interaction, `✅ | Track removed from queue!`);
	}
};
