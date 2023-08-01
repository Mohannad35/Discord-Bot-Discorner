const { useQueue } = require('discord-player');
const { ApplicationCommandOptionType } = require('discord.js');
const { errorEmbed, wrongEmbed, sendMsg } = require('../../functions/embeds');

module.exports = {
	name: 'jump',
	description: 'Jump to specific track on the queue without removing other tracks',
	category: 'music',
	options: [
		{
			name: 'index',
			description: 'The track index to jump to',
			type: ApplicationCommandOptionType.Number,
			required: true
		}
	],

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false });

		const queue = useQueue(interaction.guild.id);

		if (queue?.isEmpty()) return await errorEmbed(interaction, '❌ | The queue has no more track.');

		const index = interaction.options.getNumber('index', true) - 1;

		if (index > queue.size || index < 0)
			return await wrongEmbed(interaction, '❌ | Provided track index does not exist.');

		queue.node.jump(index);

		return await sendMsg(
			interaction,
			`> ${interaction.member.toString()} jumped to track ${queue.tracks.toArray()[index].title}.`,
			'Jump Command'
		);
	}
};
