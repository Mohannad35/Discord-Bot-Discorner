const { bot } = require('../../functions/bot');
const logger = require('../../functions/logger');

module.exports = {
	name: 'emptyQueue',
	type: 'player',

	async execute(queue) {
		await queue.playbackDashboard
			.delete()
			.catch(error =>
				logger.error('emptyQueue dashboard', error.message ?? 'Failed to delete playbackDashboard')
			);
			queue.playbackDashboard = null;

		const msg = await queue.metadata.channel
			.send(`> 👋 | No more tracks to play, leaving now.`)
			.catch(error => logger.error('emptyQueue', error));
		setTimeout(() => msg.delete(), 5000);
	}
};
