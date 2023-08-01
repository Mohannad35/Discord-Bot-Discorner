const { useQueue } = require('discord-player');
const { errorEmbed, sendMsg } = require('../../functions/embeds');

module.exports = {
	name: 'clear',
	description: 'Clear the tracks in the queue.',
	category: 'music',

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false });

		const queue = useQueue(interaction.guild.id);

		if (queue?.isEmpty()) return await errorEmbed(interaction, '❌ | The queue has no more track.');

		queue.clear();

		return await sendMsg(
			interaction,
			`> ${interaction.member.toString()} cleared all tracks.`,
			'Clear Command'
		);
	}
};
