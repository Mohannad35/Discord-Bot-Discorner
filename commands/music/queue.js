const { ButtonBuilder, ActionRowBuilder, ButtonStyle } = require('discord.js');

module.exports = {
	name: 'queue',
	description: 'Show tracks in the queue.',
	category: 'music',

	async execute(bot, interaction, queue) {
		if (!queue || !queue.isPlaying())
			return await bot.say.wrongEmbed(interaction, 'There is no track in the queue.');

		//Converts the queue into a array of tracks
		const tracks = queue.tracks.toArray().map((track, i) => `${++i}. ${track.raw.title}`);

		const next = new ButtonBuilder()
			.setCustomId('nextInQueue')
			.setLabel('Next')
			.setStyle(ButtonStyle.Success);

		const prev = new ButtonBuilder()
			.setCustomId('prevInQueue')
			.setLabel('Prev')
			.setStyle(ButtonStyle.Primary)
			.setDisabled(true);

		const row = new ActionRowBuilder().addComponents(prev, next);

		const queueEmbed = await bot.say.queueEmbed(
			queue,
			tracks.slice(0, 9).join('\n'),
			tracks.length
		);
		return interaction.reply({ embeds: [queueEmbed], components: [row] });
	}
};
