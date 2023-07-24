const { useQueue } = require('discord-player');
const { errorEmbed, successEmbed } = require('../../functions/embeds');

module.exports = {
	name: 'clear',
	description: 'Clear the tracks in the queue.',
	category: 'music',

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const queue = useQueue(interaction.guild.id);

		if (queue.size < 2) return await errorEmbed(interaction, '❌ | The queue has no more track.');

		queue.tracks.clear();

		await successEmbed(interaction, '✅ | Cleared the queue tracks.');
	}
};
