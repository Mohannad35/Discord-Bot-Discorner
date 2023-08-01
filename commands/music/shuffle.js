const { useQueue } = require('discord-player');
const { wrongEmbed, sendMsg } = require('../../functions/embeds');

module.exports = {
	name: 'shuffle',
	description: 'Shuffle the queue!',
	category: 'music',

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false });

		const queue = useQueue(interaction.guild.id);

		if (queue.isEmpty() || queue.size < 3)
			return await wrongEmbed(interaction, 'Need at least 3 tracks in the queue to shuffle.');

		queue.tracks.shuffle();

		return await sendMsg(
			interaction,
			`> ${interaction.member.toString()} shuffled the queue.`,
			'Repeat Command'
		);
	}
};
