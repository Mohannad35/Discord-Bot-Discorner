const { ApplicationCommandOptionType } = require('discord.js');
const { useQueue } = require('discord-player');
const { wrongEmbed, sendMsg } = require('../../functions/embeds');

module.exports = {
	name: 'move',
	description: 'Move songs!',
	category: 'music',
	options: [
		{
			name: 'from',
			description: `The song's current position.`,
			type: ApplicationCommandOptionType.Number,
			required: true
		},
		{
			name: 'to',
			description: `The song's target position.`,
			type: ApplicationCommandOptionType.Number,
			required: true
		}
	],

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false });

		const queue = useQueue(interaction.guild.id);
		const from = interaction.options.getNumber('from') - 1;
		const to = interaction.options.getNumber('to') - 1;

		if (!queue || queue.isEmpty())
			return await errorEmbed(interaction, '❌ | The queue has no more track.');
		const invalidFrom = !from || from < 1 || from > queue.tracks.length;
		if (invalidFrom) return await wrongEmbed(interaction, '❌ | Invalid from position!');
		const invalidTo = !to || to < 1 || to > queue.tracks.length;
		if (invalidTo) return await wrongEmbed(interaction, '❌ | Invalid to position!');

		const fromTrack = queue.tracks.toArray()[from];
		queue.moveTrack(fromTrack, to);

		return await sendMsg(
			interaction,
			`> ${interaction.member.toString()} moved ${fromTrack.title} to position ${to}!`,
			'Move Command'
		);
	}
};
