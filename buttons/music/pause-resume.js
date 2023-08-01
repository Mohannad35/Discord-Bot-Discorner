const { useQueue } = require('discord-player');

module.exports = {
	name: 'playPauseButton',
	category: 'music',

	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue.node.isPaused()) {
			queue.node.resume();

			const msg = await interaction.reply(`> ${interaction.member.toString()} resumed playback.`);
			return setTimeout(() => msg.delete(), 5000);
		}

		queue.node.pause();

		const msg = await interaction.reply(`> ${interaction.member.toString()} paused playback.`);
		return setTimeout(() => msg.delete(), 5000);
	}
};
