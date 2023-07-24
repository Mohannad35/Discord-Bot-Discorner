const { useQueue } = require('discord-player');
const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');
const { wrongEmbed, queueEmbed } = require('../../functions/embeds');

module.exports = {
	name: 'queue',
	description: 'Show tracks in the queue.',
	category: 'music',

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const queue = useQueue(interaction.guild.id);

		if (!queue || !queue.isPlaying())
			return await wrongEmbed(interaction, '❌ | There is no track in the queue.');

		//Converts the queue into a array of tracks
		const tracks = queue.tracks.toArray().map((track, i) => `${++i}. ${track.raw.title}`);

		const next = new ButtonBuilder()
			.setCustomId('nextInQueue')
			.setLabel('▶️')
			.setStyle(ButtonStyle.Primary);

		const prev = new ButtonBuilder()
			.setCustomId('prevInQueue')
			.setLabel('◀️')
			.setStyle(ButtonStyle.Primary)
			.setDisabled(true);

		const first = new ButtonBuilder()
			.setCustomId('firstInQueue')
			.setLabel('⏪')
			.setStyle(ButtonStyle.Primary)
			.setDisabled(true);

		const last = new ButtonBuilder()
			.setCustomId('lastInQueue')
			.setLabel('⏩')
			.setStyle(ButtonStyle.Primary);

		const row = new ActionRowBuilder().addComponents(first, prev, next, last);

		const queueEmb = await queueEmbed(queue, tracks.slice(0, 9).join('\n'), tracks.length);
		const msg = await interaction.editReply({ embeds: [queueEmb], components: [row] });
		// setTimeout(() => interaction.deleteReply(msg), 60000);
	}
};
