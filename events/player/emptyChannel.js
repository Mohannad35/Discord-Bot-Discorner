const { bot } = require('../../functions/bot');
const logger = require('../../functions/logger');

module.exports = {
	name: 'emptyChannel',
	type: 'player',

	async execute(queue) {
		await queue.playbackDashboard
			.delete()
			.catch(error =>
				logger.error(
					'emptyChannel dashboard',
					error.message ?? 'Failed to delete playbackDashboard'
				)
			);
			queue.playbackDashboard = null;

		const msg = await queue.metadata.channel
			.send(`> 👋 | Feeling lonely, leaving now.`)
			.catch(error => logger.error('emptyChannel', error));
		setTimeout(() => msg.delete(), 5000);
	}
};
