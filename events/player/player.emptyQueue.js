module.exports = {
	name: 'emptyQueue',

	async execute(bot, queue) {
		await bot.lastEmbed.delete().catch(() => bot.logger.error('Failed to delete lastEmbed'));

		const embed = bot.utils
			.baseEmbed(queue)
			.setDescription(`👋 | No more tracks to play, leaving now.`);

		const msg = await queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
		setTimeout(() => msg.delete(), 10000);
	}
};
