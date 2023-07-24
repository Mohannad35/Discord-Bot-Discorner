const { EmbedBuilder, Colors } = require('discord.js');
const { sendErrorLog } = require('../../functions/utils');

module.exports = {
	name: 'playerError',

	async execute(queue, error) {
		sendErrorLog(error, 'error');

		const embed = new EmbedBuilder()
			.setTitle('An error occured while playing')
			.setDescription(`Reason: \`${error.message}\``)
			.setColor(Colors.Red);

		const msg = await queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
		setTimeout(() => msg.delete(), 10000);
	}
};
