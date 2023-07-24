const { bot } = require('../../functions/bot');
const { baseEmbed } = require('../../functions/embeds');
const logger = require('../../functions/logger');

module.exports = {
	name: 'emptyChannel',

	async execute(queue) {
		await bot.lastEmbed.delete().catch(() => logger.error('Failed to delete lastEmbed'));

		const embed = baseEmbed(queue).setDescription(`👋 | Feeling lonely, leaving now.`);

		const msg = await queue.metadata.channel.send({ embeds: [embed] }).catch(console.error);
		setTimeout(() => msg.delete(), 10000);
	}
};
