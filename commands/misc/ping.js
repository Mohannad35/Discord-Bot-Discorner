const { bot } = require('../../functions/bot');
const { baseEmbed } = require('../../functions/embeds');

module.exports = {
	name: 'ping',
	description: 'Ping? Pong!',
	category: 'misc',

	async execute(interaction) {
		const embed1 = baseEmbed(interaction).setDescription('Pinging...');

		await interaction.reply({ ephemeral: true, embeds: [embed1] }).catch(console.error);

		const embed2 = baseEmbed(interaction).setTitle('🏓 Pong').setDescription(`💓: ${Math.round(
			bot.ws.ping
		)} ms
⏱️: ${Date.now() - interaction.createdTimestamp} ms`);

		await interaction.editReply({ embeds: [embed2] });
		setTimeout(() => interaction.deleteReply(), 5000);
	}
};
