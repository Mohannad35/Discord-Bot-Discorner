const { useHistory, useQueue } = require('discord-player');
const { sendMsg } = require('../../functions/embeds');

module.exports = {
	name: 'back',
	description: 'Play the history track',
	category: 'music',

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false });

		const history = useHistory(interaction.guild.id);
		const queue = useQueue(interaction.guild.id);

		if (history.isEmpty()) {
			await queue.node.seek(0);

			return await sendMsg(
				interaction,
				`> ${interaction.member.toString()} replayed the current track.`,
				'Back Command'
			);
		}

		await history.previous();

		return await sendMsg(
			interaction,
			`> ${interaction.member.toString()} backed \`${history.previousTrack.title}\`.`,
			'Back Command'
		);
	}
};
