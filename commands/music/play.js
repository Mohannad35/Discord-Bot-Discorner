const { ApplicationCommandOptionType } = require('discord.js');
const { useQueue, useMainPlayer } = require('discord-player');
const { wrongEmbed, errorEmbed, sendMsg } = require('../../functions/embeds');
const logger = require('../../functions/logger');

module.exports = {
	name: 'play',
	description: 'Play a track or playlist from url or name',
	category: 'music',
	options: [
		{
			name: 'track',
			description: 'The track name/url, you want to play.',
			type: ApplicationCommandOptionType.String,
			required: true
		},
		{
			name: 'top',
			description: 'Add track to top of the queue.',
			type: ApplicationCommandOptionType.Boolean,
			required: false
		}
	],

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false });

		const isTop = await interaction.options.getBoolean('top', false);
		const query = interaction.options.getString('track', true);
		const player = useMainPlayer();
		const queue = useQueue(interaction.guild.id);
		const userChannel = interaction.member?.voice?.channel;

		if (!userChannel)
			return await wrongEmbed(
				interaction,
				`${interaction.member.toString()} You have to join a voice channel first.`
			);

		if (queue && queue.channel.id !== userChannel.id)
			return await wrongEmbed(
				interaction,
				`I'm already playing in a different voice channel ${queue.channel.toString()}.`
			);

		if (!userChannel.viewable)
			return await wrongEmbed(interaction, 'I need `View Channel` permission.');

		if (!userChannel.joinable)
			return await wrongEmbed(interaction, 'I need `Connect Channel` permission.');

		if (userChannel.full)
			return await wrongEmbed(interaction, "Can't join, the voice channel is full.");

		if (interaction.member.voice.deaf)
			return await wrongEmbed(
				interaction,
				`${interaction.member.toString()} You cannot run this command while deafened.`
			);

		if (interaction.guild.members.me.voice.mute)
			return await wrongEmbed(
				interaction,
				`${interaction.member.toString()} Please unmute me before playing.`
			);

		const searchResult = await player
			.search(query, { requestedBy: interaction.user })
			.catch(error => logger.error('Play Search Result', error));

		if (!searchResult?.hasTracks())
			return await wrongEmbed(interaction, `❌ | No track was found for ${query}!`);

		try {
			if (isTop && queue) {
				if (searchResult.tracks.length >= 1) {
					searchResult.tracks.forEach(track => queue.insertTrack(track));
				}
			} else {
				await player.play(userChannel, searchResult, {
					nodeOptions: {
						metadata: interaction
					}
				});
			}

			// const replyString = searchResult.hasPlaylist()
			// 	? `> ${interaction.member.toString()} loaded ${searchResult.playlist.title} with ${
			// 			searchResult.tracks.length
			// 	  } tracks.`
			// 	: `> ${interaction.member.toString()} loaded ${searchResult.tracks.length} tracks.`;

			// return await sendMsg(interaction, replyString, 'Play Command');
			return await interaction.deleteReply();
		} catch (e) {
			logger.error('Play Err', e);
			return await errorEmbed(interaction, `Something went wrong: ${e.message}`);
		}
	}
};
