const { useHistory } = require('discord-player');

module.exports = {
	name: 'back',
	description: 'Play the history track',
	category: 'music',

	async execute(bot, interaction) {
		const history = useHistory(interaction.guildId);

		if (history.isEmpty()) {
			const msg = await bot.say.errorEmbed(interaction, 'The queue has no history track.');
			return setTimeout(() => msg.delete(), 10000);
		}

		history.previous();

		const msg = bot.say.successEmbed(interaction, 'Backed the history track.');
		setTimeout(() => msg.delete(), 10000);
	}
};
