const { useQueue } = require('discord-player');
const { sendMsg } = require('../../functions/embeds');

module.exports = {
	name: 'stop',
	description: 'Stop the playback.',
	category: 'music',

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false });

		const queue = useQueue(interaction.guild.id);

		queue.delete();

		return await sendMsg(
			interaction,
			`> ${interaction.member.toString()} stopped the playback.`,
			'Repeat Command'
		);
	}
};
