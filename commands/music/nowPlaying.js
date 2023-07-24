const { useQueue } = require('discord-player');
const { baseEmbed } = require('../../functions/embeds');

module.exports = {
	name: 'nowplaying',
	description: 'Show the currently playing track.',
	category: 'music',

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const queue = useQueue(interaction.guild.id);

		const track = queue.currentTrack;

		const embed = baseEmbed(interaction)
			.setAuthor({ name: 'Nowplaying 🎵' })
			.setTitle(`${track.title}`)
			.setURL(`${track.url}`)
			.setThumbnail(`${track.thumbnail}`)
			.setDescription(`Played by: ${track.requestedBy.toString()}\n
${queue.node.createProgressBar()}`);

		const msg = await interaction
			.editReply({ ephemeral: true, embeds: [embed] })
			.catch(console.error);
		setTimeout(() => interaction.deleteReply(msg), 5000);
	}
};
