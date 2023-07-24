const { bot } = require('../../functions/bot');
const { baseEmbed } = require('../../functions/embeds');

module.exports = {
	name: 'playerStart',

	async execute(queue, track) {
		if (!track.requestedBy) track.requestedBy = bot.user;

		const embed = baseEmbed(queue)
			.setAuthor({ name: 'Now playing 🎵' })
			.setTitle(`${track.title}`)
			.setDescription(`${queue.node.createProgressBar()}`)
			.setURL(`${track.url}`)
			.setThumbnail(`${track.thumbnail}`)
			.setFooter({
				text: `Played by: ${
					track.requestedBy.displayName ?? track.requestedBy.username ?? track.requestedBy.tag
				}`,
				iconURL: `${track.requestedBy.displayAvatarURL({ dynamic: true })}`
			});

		if (!bot.lastEmbed || !queue.metadata.replied)
			bot.lastEmbed = await queue.metadata.channel.send({ ephemeral: true, embeds: [embed] });
		else bot.lastEmbed.edit({ ephemeral: true, embeds: [embed] });
	}
};
