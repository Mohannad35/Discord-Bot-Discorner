module.exports = {
	name: 'audioTrackAdd',

	async execute(bot, queue, track) {
		const embed = bot.utils
			.baseEmbed(queue)
			.setAuthor({ name: `Track queued - Position ${queue.node.getTrackPosition(track) + 1}` })
			.setTitle(`${track.title}`)
			.setURL(`${track.url}`)
			.setFooter({
				text: `Requested by: ${track.requestedBy.tag}`,
				iconURL: track.requestedBy.displayAvatarURL({ dynamic: true })
			});

		const msg = await queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
		setTimeout(() => msg.delete(), 10000);
	}
};
