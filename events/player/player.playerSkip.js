const { baseEmbed } = require('../../functions/embeds');

module.exports = {
	name: 'playerSkip',

	async execute(queue, track) {
		const embed = baseEmbed(queue).setDescription(
			`⚠️ | Skipping **${track.title}** due to an issue!`
		);

		const msg = await queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
		setTimeout(() => msg.delete(), 10000);
	}
};
