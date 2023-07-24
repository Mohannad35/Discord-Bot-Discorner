const { useQueue } = require('discord-player');
const { ApplicationCommandOptionType } = require('discord.js');
const { errorEmbed, wrongEmbed, successEmbed } = require('../../functions/embeds');

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
		await interaction.deferReply({ ephemeral: true });

		const queue = useQueue(interaction.guild.id);

		if (queue.size < 1)
			return await errorEmbed(interaction, '❌ | The queue has no more track.');

		const index = interaction.options.getNumber('index', true) - 1;

		if (index > queue.size || index < 0)
			return await wrongEmbed(interaction, '❌ | Provided track index does not exist.');

		queue.node.skipTo(index);

		return await successEmbed(interaction, `✅ | Skipped to track ${index + 1}.`);
	}
};
