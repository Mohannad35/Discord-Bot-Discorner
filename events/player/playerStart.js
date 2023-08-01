const { ButtonStyle, ActionRowBuilder } = require('discord.js');
const { bot } = require('../../functions/bot');
const { baseEmbed } = require('../../functions/embeds');
const { getButton } = require('../../functions/get-button');

module.exports = {
	name: 'playerStart',
	type: 'player',

	async execute(queue, track) {
		if (!track.requestedBy) track.requestedBy = bot.user;
		const modes = ['off', 'track', 'queue', 'autoplay'];

		const embed = baseEmbed(queue)
			.setAuthor({ name: 'Now playing 🎵', iconURL: bot.user.displayAvatarURL() })
			.setTitle(`${track.title}`)
			.setDescription(`${queue.node.createProgressBar()}`)
			.setURL(`${track.url}`)
			.setThumbnail(`${track.thumbnail}`)
			.addFields(
				{ name: 'Played by:', value: `${track.requestedBy.toString()}`, inline: true },
				{ name: 'Repeat:', value: `\`${modes[queue.repeatMode]}\``, inline: true }
			);

		if (track.author) embed.addFields({ name: 'Artist:', value: `${track.author}`, inline: true });
		if (track.playlist)
			embed.addFields({ name: 'Playlist:', value: `${track.playlist.title}`, inline: true });

		const shuffle = getButton('shuffleButton', null, ButtonStyle.Primary, false, '🔀');
		const back = getButton('backButton', null, ButtonStyle.Success, false, '⏮️');
		const pause = getButton('playPauseButton', null, ButtonStyle.Danger, false, '⏯️');
		const skip = getButton('skipButton', null, ButtonStyle.Success, false, '⏭️');
		const repeat = getButton('repeatButton', null, ButtonStyle.Primary, false, '🔁');
		// const stop = getButton('stopQueue', null, ButtonStyle.Danger, false, '⏹️');
		const row = new ActionRowBuilder().addComponents(shuffle, back, pause, skip, repeat);
		// const row2 = new ActionRowBuilder().addComponents(stop);

		// ? try this in two servers at once
		if (!queue.playbackDashboard)
			queue.playbackDashboard = await queue.metadata.channel.send({
				embeds: [embed],
				components: [row]
			});
		else queue.playbackDashboard.edit({ embeds: [embed], components: [row] });
	}
};
