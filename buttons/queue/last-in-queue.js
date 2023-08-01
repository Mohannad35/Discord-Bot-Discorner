const { ButtonStyle, ActionRowBuilder } = require('discord.js');
const { getButton } = require('../../functions/get-button');
const { queueEmbed, wrongEmbed } = require('../../functions/embeds');
const { useQueue } = require('discord-player');

module.exports = {
	name: 'lastInQueue',
	category: 'queue',

	async execute(interaction) {
		const queue = useQueue(interaction.guild.id);
		if (!queue || !queue.isPlaying())
			return await wrongEmbed(interaction, '❌ | No music is being played!');
		//Converts the queue into a array of tracks
		const tracks = queue.tracks.toArray().map((track, i) => `${i + 1}. ${track.raw.title}`);
		const lastTracks = parseInt(tracks.length) % 9;
		const offset = parseInt(tracks.length) - (lastTracks === 0 ? 9 : lastTracks);

		let disabled = false;
		if (offset > tracks.length - 9) disabled = true;
		const next = getButton('nextInQueue', null, ButtonStyle.Primary, disabled, '▶️');

		disabled = false;
		if (offset <= 0) disabled = true;
		const prev = getButton('prevInQueue', null, ButtonStyle.Primary, disabled, '◀️');

		disabled = false;
		if (offset <= 0) disabled = true;
		const first = getButton('firstInQueue', null, ButtonStyle.Primary, disabled, '⏪');

		disabled = false;
		if (offset > tracks.length - 9) disabled = true;
		const last = getButton('lastInQueue', null, ButtonStyle.Primary, disabled, '⏩');

		const row = new ActionRowBuilder().addComponents(first, prev, next, last);

		const queueEmb = queueEmbed(
			queue,
			tracks.slice(offset).join('\n'),
			tracks.length,
			Math.ceil(tracks.length / 9)
		);

		return interaction.update({ embeds: [queueEmb], components: [row] });
	}
};
