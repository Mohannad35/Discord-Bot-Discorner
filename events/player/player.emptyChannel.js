module.exports = {
	name: 'emptyChannel',

	async execute(bot, queue) {
		await bot.lastEmbed.delete().catch(() => bot.logger.error('Failed to delete lastEmbed'));

		const embed = bot.utils.baseEmbed(queue).setDescription(`👋 | Feeling lonely, leaving now.`);

		const msg = await queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
		setTimeout(() => msg.delete(), 10000);
	}
};
