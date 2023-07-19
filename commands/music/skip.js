module.exports = {
	name: 'skip',
	description: 'Skip current track',
	category: 'music',

	async execute(bot, interaction, queue) {
		if (queue.size < 1 && queue.repeatMode !== 3) {
			const msg = await bot.say.errorEmbed(interaction, '❌ | The queue has no more track.');
			setTimeout(() => msg.delete(), 10000);
		}
		queue.node.skip();

		const msg = await bot.say.successEmbed(interaction, '✅ | Skipped the current track.');
		setTimeout(() => msg.delete(), 10000);
	}
};
