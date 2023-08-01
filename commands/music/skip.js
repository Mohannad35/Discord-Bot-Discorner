const { useQueue } = require('discord-player');
const { errorEmbed, sendMsg } = require('../../functions/embeds');

module.exports = {
	name: 'skip',
	description: 'Skip current track',
	category: 'music',

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false });

		const queue = useQueue(interaction.guild.id);

		if (queue.size < 1 && queue.repeatMode !== 3)
			return await errorEmbed(interaction, '❌ | The queue has no more track.');

		queue.node.skip();

		return await sendMsg(
			interaction,
			`> ${interaction.member.toString()} skipped the current track.`,
			'Skip Command'
		);
	}
};
