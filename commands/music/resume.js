const { useQueue } = require('discord-player');
const { wrongEmbed, successEmbed } = require('../../functions/embeds');

module.exports = {
	name: 'resume',
	description: 'Resume the playback',
	category: 'music',

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const queue = useQueue(interaction.guild.id);

		if (queue.node.isPlaying())
			return await wrongEmbed(interaction, '❌ | The playback is already playing.');

		queue.node.resume();

		return await successEmbed(interaction, '✅ | Resumed the playback.');
	}
};
