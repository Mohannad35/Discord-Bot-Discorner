module.exports = {
	name: 'audioTracksAdd',

	async execute(bot, queue, tracks) {
		const embed = bot.utils
			.baseEmbed(queue)
			.setTitle(`${tracks.length} tracks queued.`)
			.setFooter({
				text: `Requested by: ${tracks[0].requestedBy.tag}`,
				iconURL: tracks[0].requestedBy.displayAvatarURL({ dynamic: true })
			});

		const msg = await queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
		setTimeout(() => msg.delete(), 10000);
	}
};
