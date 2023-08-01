const { useQueue } = require('discord-player');
const { baseEmbed } = require('../../functions/embeds');
const { bot } = require('../../functions/bot');

module.exports = {
	name: 'nowplaying',
	description: 'Show the currently playing track.',
	category: 'music',

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false });

		const queue = useQueue(interaction.guild.id);

		const track = queue?.currentTrack;

		const embed = baseEmbed(interaction)
			.setAuthor({ name: 'Now playing 🎵', iconURL: bot.user.displayAvatarURL() })
			.setTitle(`${track.title}`)
			.setURL(`${track.url}`)
			.setThumbnail(`${track.thumbnail}`)
			.setDescription(`${queue.node.createProgressBar({})}`)
			.setFooter({ text: 'Now Playing 🎶' })
			.setTimestamp();

		const msg = await interaction
			.editReply({ embeds: [embed] })
			.catch(error => logger.error('Now Playing', error));
		setTimeout(() => interaction.deleteReply(msg), 5000);
	}
};
