const { useQueue } = require('discord-player');
const { ActionRowBuilder, ButtonStyle } = require('discord.js');
const { wrongEmbed, queueEmbed } = require('../../functions/embeds');
const { getButton } = require('../../functions/get-button');

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

		const next = getButton('nextInQueue', null, ButtonStyle.Primary, false, '▶️');

		const prev = getButton('prevInQueue', null, ButtonStyle.Primary, true, '◀️');

		const first = getButton('firstInQueue', null, ButtonStyle.Primary, true, '⏮️');

		const last = getButton('lastInQueue', null, ButtonStyle.Primary, false, '⏭️');

		const row = new ActionRowBuilder().addComponents(first, prev, next, last);

		const queueEmb = queueEmbed(queue, tracks.slice(0, 9).join('\n'), tracks.length, 1);
		const msg = await interaction.editReply({ embeds: [queueEmb], components: [row] });
		// setTimeout(() => interaction.deleteReply(msg), 60000);
	}
};
