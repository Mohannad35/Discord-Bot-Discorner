const logger = require('../../functions/logger');

module.exports = {
	name: 'playerSkip',
	type: 'player',

	async execute(queue, track) {
		const msg = await queue.metadata.channel
			.send(`⚠️ | Skipping **${track.title}** due to an issue!`)
			.catch(error => logger.error('playerSkip', error));
		setTimeout(() => msg.delete(), 5000);
	}
};
