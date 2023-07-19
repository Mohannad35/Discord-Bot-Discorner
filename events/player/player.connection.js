module.exports = {
	name: 'connection',

	async execute(bot, queue) {
		const embed = bot.utils
			.baseEmbed(queue)
			.setAuthor({ name: `${bot.user.username}`, iconURL: bot.user.displayAvatarURL() })
			.setDescription(
				`👍 Joined ${queue.channel.toString()} and 📄 queued ${queue.metadata.toString()}`
			);

		const msg = await queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
		setTimeout(() => msg.delete(), 10000);
	}
};
