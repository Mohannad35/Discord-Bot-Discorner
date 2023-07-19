module.exports = {
	name: 'playerSkip',

	async execute(bot, queue, track) {
		const embed = bot.utils
			.baseEmbed(queue)
			.setDescription(`⚠️ | Skipping **${track.title}** due to an issue!`);

		const msg = await queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
		setTimeout(() => msg.delete(), 10000);
	}
};
