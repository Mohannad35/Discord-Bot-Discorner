const { useQueue } = require('discord-player');
const { ApplicationCommandOptionType } = require('discord.js');
const { baseEmbed, successEmbed } = require('../../functions/embeds');

module.exports = {
	name: 'volume',
	description: 'Check or change the volume',
	category: 'music',
	options: [
		{
			name: 'amount',
			description: 'Volume amount to set',
			type: ApplicationCommandOptionType.Number,
			required: false,
			minValue: 1,
			maxValue: 200
		}
	],

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const queue = useQueue(interaction.guild.id);

		const newVol = interaction.options.getNumber('amount', false);

		if (!newVol) {
			const embed = baseEmbed(interaction)
				.setDescription(`Current volume is \`${queue.node.volume}%\`.`)
				.setFooter({ text: "Use '/volume <1-200>' to change the volume." });

			const msg = await interaction
				.editReply({ ephemeral: true, embeds: [embed] })
				.catch(console.error);
			return setTimeout(() => interaction.deleteReply(msg), 5000);
		}

		queue.node.setVolume(newVol);

		return await successEmbed(interaction, `✅ | Volume is updated to ${newVol}.`);
	}
};
