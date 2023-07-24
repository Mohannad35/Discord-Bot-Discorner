const { ApplicationCommandOptionType } = require('discord.js');
const { useQueue, useMainPlayer } = require('discord-player');
const { wrongEmbed, successEmbed, errorEmbed } = require('../../functions/embeds');

module.exports = {
	name: 'play',
	description: 'Play a track or playlist from url or name',
	category: 'music',
	options: [
		{
			type: ApplicationCommandOptionType.String,
			name: 'track',
			description: 'The track name/url, you want to play.',
			required: true
		},
		{
			type: ApplicationCommandOptionType.Boolean,
			name: 'top',
			description: 'Add track to top of the queue.',
			required: false
		}
	],

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const isTop = await interaction.options.getBoolean('top', false);
		const query = interaction.options.getString('track', true);
		const player = useMainPlayer();
		const queue = useQueue(interaction.guild.id);

		const channel = interaction.member.voice.channel;

		if (!channel) return await wrongEmbed(interaction, 'You have to join a voice channel first.');

		if (queue && queue.channel.id !== channel.id)
			return await wrongEmbed(interaction, "I'm already playing in a different voice channel!");

		if (!channel.viewable)
			return await wrongEmbed(interaction, 'I need `View Channel` permission.');

		if (!channel.joinable)
			return await wrongEmbed(interaction, 'I need `Connect Channel` permission.');

		if (channel.full)
			return await wrongEmbed(interaction, "Can't join, the voice channel is full.");

		if (interaction.member.voice.deaf)
			return await wrongEmbed(interaction, 'You cannot run this command while deafened.');

		if (interaction.guild.members.me.voice.mute)
			return await wrongEmbed(interaction, 'Please unmute me before playing.');

		const searchResult = await player
			.search(query, { requestedBy: interaction.user })
			.catch(() => null);

		if (!searchResult?.hasTracks())
			return await wrongEmbed(interaction, `❌ | No track was found for ${query}!`);

		try {
			if (isTop && queue) {
				if (searchResult.tracks.length >= 1) {
					searchResult.tracks.forEach(track => queue.insertTrack(track));
				}
			} else {
				await player.play(channel, searchResult, {
					nodeOptions: {
						metadata: interaction
					}
				});
			}

			return await successEmbed(interaction, `Loading your track`);
		} catch (e) {
			console.log(e);
			return await errorEmbed(interaction, `Something went wrong: ${e.message}`);
		}
	}
};
