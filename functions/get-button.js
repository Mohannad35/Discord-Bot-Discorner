const { ButtonBuilder, ButtonStyle } = require('discord.js');

module.exports.getButton = (name, label, style, disabled, emoji) => {
	const button = new ButtonBuilder()
		.setCustomId(name)
		.setStyle(style ?? ButtonStyle.Primary)
		.setDisabled(disabled ?? false);
	if (emoji) button.setEmoji(emoji);
	if (label) button.setLabel(label);
	return button;
};
