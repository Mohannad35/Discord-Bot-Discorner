const { useQueue } = require('discord-player');
const { ApplicationCommandOptionType } = require('discord.js');
const { errorEmbed, wrongEmbed, successEmbed, sendMsg } = require('../../functions/embeds');

module.exports = {
	name: 'skipto',
	description: 'Skip to the given track, removing others on the way',
	category: 'music',
	options: [
		{
			name: 'index',
			description: 'The track index to skip to',
			type: ApplicationCommandOptionType.Number,
			required: true
		}
	],

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false });

		const queue = useQueue(interaction.guild.id);

		if (queue.isEmpty()) return await errorEmbed(interaction, '❌ | The queue has no more track.');

		const index = interaction.options.getNumber('index', true) - 1;

		if (index > queue.size || index < 0)
			return await wrongEmbed(interaction, '❌ | Provided track index does not exist.');

		queue.node.skipTo(index);

		return await sendMsg(
			interaction,
			`> ${interaction.member.toString()} skipped to track ${index + 1}.`,
			'Repeat Command'
		);
	}
};
