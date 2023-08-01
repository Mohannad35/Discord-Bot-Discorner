const { bot } = require('../../functions/bot');
const logger = require('../../functions/logger');

module.exports = {
	name: 'disconnect',
	type: 'player',

	async execute(queue) {
		await queue.playbackDashboard
			.delete()
			.catch(error =>
				logger.error('disconnect dashboard', error.message ?? 'Failed to delete playbackDashboard')
			);
		queue.playbackDashboard = null;

		const msg = await queue.metadata.channel
			.send(`> 👋 | Looks like my job here is done, leaving now.`)
			.catch(error => logger.error('disconnect', error));
		setTimeout(() => msg.delete(), 5000);
	}
};
