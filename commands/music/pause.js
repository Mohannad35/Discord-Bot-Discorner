const { useQueue } = require('discord-player');
const { wrongEmbed, successEmbed } = require('../../functions/embeds');

module.exports = {
	name: 'pause',
	description: 'Pause the playback',
	category: 'music',

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const queue = useQueue(interaction.guild.id);

		if (queue.node.isPaused())
			return await wrongEmbed(interaction, 'The playback is already paused.');

		queue.node.pause();

		return await successEmbed(interaction, 'Paused the playback.');
	}
};
