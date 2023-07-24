const { useHistory } = require('discord-player');
const { errorEmbed, successEmbed } = require('../../functions/embeds');

module.exports = {
	name: 'back',
	description: 'Play the history track',
	category: 'music',

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: true });

		const history = useHistory(interaction.guild.id);

		if (history.isEmpty())
			return await errorEmbed(interaction, '❌ | The queue has no history track.');

		await history.previous();

		await successEmbed(interaction, '✅ | Backed the history track.');
	}
};
