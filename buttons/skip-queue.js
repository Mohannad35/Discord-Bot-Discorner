const { useQueue } = require('discord-player');

module.exports = {
	name: 'skipQueue',

	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);

		if (queue.size < 1 && queue.repeatMode !== 3) {
			const msg = await interaction.reply(`> ❌ | The queue has no more track.`);
			return setTimeout(() => msg.delete(), 5000);
		}

		queue.node.skip();

		const msg = await interaction.reply(
			`> ${interaction.member.toString()} skipped the current track.`
		);
		return setTimeout(() => msg.delete(), 5000);
	}
};
