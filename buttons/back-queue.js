const { useHistory, useQueue } = require('discord-player');

module.exports = {
	name: 'backQueue',

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false });

		const history = useHistory(interaction.guild.id);
		const queue = useQueue(interaction.guild.id);

		if (history.isEmpty()) {
			await queue.node.seek(0);
			const msg = await interaction.followUp(
				`> ${interaction.member.toString()} replied the current track.`
			);
			return setTimeout(() => interaction.deleteReply(msg), 5000);
		}

		await history.previous();

		const msg = await interaction.followUp(
			`> ${interaction.member.toString()} Backed the history track.`
		);
		return setTimeout(() => interaction.deleteReply(msg), 5000);
	}
};
