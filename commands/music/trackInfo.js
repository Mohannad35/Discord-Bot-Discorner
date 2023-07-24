const { useQueue } = require('discord-player');
const { ApplicationCommandOptionType } = require('discord.js');
const { baseEmbed, errorEmbed, wrongEmbed } = require('../../functions/embeds');

module.exports = {
	name: 'trackinfo',
	description: 'Show details of a track.',
	category: 'music',
	options: [
		{
			name: 'index',
			type: ApplicationCommandOptionType.Number,
			description: 'That track index.',
			required: true
		}
	],

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const queue = useQueue(interaction.guild.id);

		const index = interaction.options.getNumber('index', true) - 1;

		if (index > queue.size || index < 0)
			return await errorEmbed(interaction, '❌ | Provided track Index does not exist.');

		const track = queue.tracks.toArray()[index];

		if (!track) return await wrongEmbed(interaction, '❌ | The track was not found.');

		const embed = baseEmbed(interaction)
			.setAuthor({ name: 'Trackinfo 🎵' })
			.setTitle(`${track.title}`)
			.setURL(`${track.url}`)
			.setThumbnail(`${track.thumbnail}`)
			.setDescription(`~ Requested by: ${track.requestedBy.toString()}
Duration: ${track.duration}
Position in queue: ${index + 1}`);

		const msg = await interaction
			.editReply({ ephemeral: true, embeds: [embed] })
			.catch(console.error);
		setTimeout(() => interaction.deleteReply(msg), 5000);
	}
};
