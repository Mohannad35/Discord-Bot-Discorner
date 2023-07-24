const { useQueue } = require('discord-player');
const { ApplicationCommandOptionType } = require('discord.js');
const { errorEmbed, wrongEmbed, successEmbed } = require('../../functions/embeds');

module.exports = {
	name: 'swap',
	description: 'Swap two tracks in the queue',
	category: 'music',
	options: [
		{
			name: 'first',
			description: 'The first track to swap',
			type: ApplicationCommandOptionType.Number,
			required: true
		},
		{
			name: 'second',
			description: 'The second track to swap',
			type: ApplicationCommandOptionType.Number,
			required: true
		}
	],

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const queue = useQueue(interaction.guild.id);

		if (queue.size < 3)
			return await errorEmbed(
				interaction,
				'❌ | Need at least 3 songs in the queue to use this command.'
			);

		const first = interaction.options.getNumber('first', true);
		const second = interaction.options.getNumber('second', true);

		if (first < 1 || first >= queue.size)
			return await wrongEmbed(interaction, '❌ | Provided `first` track index is not valid.');

		if (second < 1 || second >= queue.size)
			return await wrongEmbed(interaction, '❌ | Provided `second` track index is not valid.');

		if (first === second)
			return await wrongEmbed(interaction, '❌ | The tracks are already in this position.');

		queue.node.swap(queue.tracks.toArray()[first - 1], queue.tracks.toArray()[second - 1]);

		return await successEmbed(interaction, `✅ | Track ${first} & ${second} has been swapped.`);
	}
};
