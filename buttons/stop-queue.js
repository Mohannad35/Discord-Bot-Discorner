const { useQueue } = require('discord-player');

module.exports = {
	name: 'pauseQueue',

	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (!queue || queue.isEmpty()) {
			const msg = await interaction.reply(`> ❌ | Nothing in queue.`);
			return setTimeout(() => msg.delete(), 5000);
		}

		queue.delete();

		const msg = await interaction.reply(`> ${interaction.member.toString()} stopped playback.`);
		return setTimeout(() => msg.delete(), 5000);
	}
};
