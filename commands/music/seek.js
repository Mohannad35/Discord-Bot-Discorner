const { useQueue } = require('discord-player');
const { ApplicationCommandOptionType } = require('discord.js');
const { toMilliseconds } = require('../../functions/utils');
const { errorEmbed, wrongEmbed, sendMsg } = require('../../functions/embeds');

module.exports = {
	name: 'seek',
	description: 'Seek the player',
	category: 'music',
	options: [
		{
			name: 'duration',
			description: 'The duration to seek to <mm:ss>',
			type: ApplicationCommandOptionType.String,
			required: true
		}
	],

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false });

		const queue = useQueue(interaction.guild.id);

		let timeString = interaction.options.getString('duration', true);

		if (isNaN(timeString) && !timeString.includes(':'))
			return await errorEmbed(interaction, '❌ | Provide a valid duration to seek.');

		if (!isNaN(timeString)) timeString = `00:${timeString}`;

		const time = toMilliseconds(timeString);

		const isInvalidTime = !time || isNaN(time) || time > queue.currentTrack.durationMS || time < 0;
		if (isInvalidTime)
			return await wrongEmbed(interaction, '❌ | Provide a valid duration to seek.');

		await queue.node.seek(time);

		return await sendMsg(
			interaction,
			`> ${interaction.member.toString()} seeked to \`${timeString}\`.`,
			'Seek Command'
		);
	}
};
