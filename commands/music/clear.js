module.exports = {
	name: 'clear',
	description: 'Clear the tracks in the queue.',
	category: 'music',

	async execute(bot, interaction, queue) {
		if (queue.size < 2) {
			const msg = await bot.say.errorEmbed(interaction, 'The queue has no more track.');
			return setTimeout(() => msg.delete(), 10000);
		}

		await queue.tracks.clear();

		const msg = await bot.say.successEmbed(interaction, 'Cleared the queue tracks.');
		setTimeout(() => msg.delete(), 10000);
	}
};
