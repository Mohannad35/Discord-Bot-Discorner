const { useQueue } = require('discord-player');

module.exports = {
	name: 'shuffleButton',
	category: 'music',

	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (!queue || !queue.isPlaying()) {
			const msg = await interaction.reply('> ❌ | No music is being played!');
			return setTimeout(() => msg.delete(), 5000);
		}

		if (queue.size < 3) {
			const msg = await interaction.reply('> Need at least 3 tracks in the queue to shuffle.');
			return setTimeout(() => msg.delete(), 5000);
		}

		queue.tracks.shuffle();

		const msg = await interaction.reply(`> ${interaction.member.toString()} shuffled the Queue!`);
		return setTimeout(() => msg.delete(), 5000);
	}
};
