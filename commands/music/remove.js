const { ApplicationCommandOptionType } = require('discord.js');
const { useQueue } = require('discord-player');
const { wrongEmbed, sendMsg } = require('../../functions/embeds');

module.exports = {
	name: 'remove',
	description: 'Remove song from the queue!',
	category: 'music',
	options: [
		{
			name: 'index',
			description: `The song's index.`,
			type: ApplicationCommandOptionType.Number,
			required: true
		}
	],

	async execute(interaction) {
		await interaction.deferReply({ ephemeral: false });

		const queue = useQueue(interaction.guild.id);
		const index = interaction.options.getNumber('index') - 1;

		if (!queue || queue.isEmpty())
			return await wrongEmbed(interaction, '❌ | No more tracks in queue.');

		if (index < 1 || index > queue.tracks.length)
			return await wrongEmbed(interaction, '❌ | Provided track index does not exist.');

		const removeTrack = queue.tracks.toArray()[index];
		queue.removeTrack(removeTrack);

		return await sendMsg(
			interaction,
			`> ${interaction.member.toString()} removed track \`${
				removeTrack.title
			}\` at index \`${index}\`.`,
			'Remove Command'
		);
	}
};
