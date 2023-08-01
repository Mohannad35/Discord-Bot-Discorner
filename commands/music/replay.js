const { useQueue } = require('discord-player');
const { wrongEmbed, sendMsg } = require('../../functions/embeds');

module.exports = {
	name: 'replay',
	description: 'Replay the current track.',
	category: 'music',

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const queue = useQueue(interaction.guild.id);

		if (!queue?.isPlaying())
			return await wrongEmbed(interaction, `❌ | The queue isn't playing right now.`);

		await queue.node.seek(0);

		return await sendMsg(
			interaction,
			`> ${interaction.member.toString()} replayed the current track.`,
			'Replay Command'
		);
	}
};
