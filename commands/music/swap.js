const { useQueue } = require('discord-player');
const { ApplicationCommandOptionType } = require('discord.js');
const { errorEmbed, wrongEmbed, sendMsg } = require('../../functions/embeds');

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
		await interaction.deferReply({ ephemeral: false });

		const queue = useQueue(interaction.guild.id);

		if (queue.size < 3)
			return await errorEmbed(
				interaction,
				'❌ | Need at least 3 songs in the queue to use this command.'
			);

		const first = interaction.options.getNumber('first', true) - 1;
		const second = interaction.options.getNumber('second', true) - 1;

		if (first < 0 || first >= queue.size)
			return await wrongEmbed(interaction, "❌ | Provided `first` track index doesn't exist");

		if (second < 0 || second >= queue.size)
			return await wrongEmbed(interaction, "❌ | Provided `second` track index doesn't exist");

		if (first === second)
			return await wrongEmbed(interaction, "Yeah sure I'll swap the track with itself 🧐.");

		const queueArray = queue.tracks.toArray();
		queue.node.swap(queueArray[first], queueArray[second]);

		const text = `> ${interaction.member.toString()} swapped \`${queueArray[first].title}\` & \`${
			queueArray[second].title
		}\` (\`${first + 1}\` & \`${second + 1})\`.`;
		return await sendMsg(interaction, text, 'Swap Command');
	}
};
