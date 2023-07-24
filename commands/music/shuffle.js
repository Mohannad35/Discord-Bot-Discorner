const { useQueue } = require('discord-player');
const { wrongEmbed, successEmbed } = require('../../functions/embeds');

module.exports = {
	name: 'shuffle',
	description: 'Shuffle the queue!',
	category: 'music',

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const queue = useQueue(interaction.guild.id);

		if (!queue || !queue.isPlaying())
			return await wrongEmbed(interaction, '❌ | No music is being played!');

		if (queue.size < 3)
			return await wrongEmbed(interaction, 'Need at least 3 tracks in the queue to shuffle.');

		queue.tracks.shuffle();

		return await successEmbed(interaction, '✅ | Queue shuffled!');
	}
};
