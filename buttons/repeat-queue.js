const { useQueue, QueueRepeatMode } = require('discord-player');
const { execute: refreshDashboard } = require('./../events/player/player.playerStart');
module.exports = {
	name: 'repeatQueue',

	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);
		const methods = [
			QueueRepeatMode.OFF,
			QueueRepeatMode.TRACK,
			QueueRepeatMode.QUEUE,
			QueueRepeatMode.AUTOPLAY
		];
		const modes = ['off', 'track', 'queue', 'autoplay'];

		queue.setRepeatMode(methods[(queue.repeatMode + 1) % 4]);

		const msg = await interaction.reply(
			`> ${interaction.member.toString()} set repeat mode to \`${modes[queue.repeatMode]}\` !`
		);
		setTimeout(() => msg.delete(), 5000);
		refreshDashboard(queue, queue.currentTrack);
	}
};
