const logger = require('../../functions/logger');
const { sendErrorLog } = require('../../functions/utils');

module.exports = {
	name: 'error',
	type: 'player',

	async execute(queue, error) {
		sendErrorLog(error, 'error');
		queue.playbackDashboard &&
			(await queue.playbackDashboard
				.delete()
				.catch(error =>
					logger.error(
						'emptyQueue dashboard',
						error.message ?? 'Failed to delete playbackDashboard'
					)
				));
		queue.playbackDashboard = null;

		const msg = await queue.metadata.channel
			.send(`An error occurred while playing.\nReason: \`${error.message}\``)
			.catch(error => logger.error('error', error));
		setTimeout(() => msg.delete(), 5000);
	}
};
