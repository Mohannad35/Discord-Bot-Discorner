const { useQueue } = require('discord-player');
const { wrongEmbed, successEmbed } = require('../../functions/embeds');

module.exports = {
	name: 'replay',
	description: 'Replay the current track.',
	category: 'music',

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const queue = useQueue(interaction.guild.id);

		if (!queue || !queue.isPlaying())
			return await wrongEmbed(interaction, '❌ | There is no track in the queue.');

		await queue.node.seek(0);

		return await successEmbed(interaction, '✅ | Replayed the current track.');
	}
};
