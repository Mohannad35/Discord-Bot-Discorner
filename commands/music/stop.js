const { useQueue } = require('discord-player');
const { successEmbed } = require('../../functions/embeds');

module.exports = {
	name: 'stop',
	description: 'Stop the playback.',
	category: 'music',

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const queue = useQueue(interaction.guild.id);

		queue.delete();

		return await successEmbed(interaction, '✅ | Stopped the playback.');
	}
};
