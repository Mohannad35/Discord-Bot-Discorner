const logger = require('../../functions/logger');

module.exports = {
	name: 'audioTracksAdd',
	type: 'player',

	async execute(queue, tracks) {
		const msg = await queue.metadata.channel
			.send(
				`> ${tracks[0].requestedBy.toString()} loaded \`${tracks.length}\` tracks at position \`${
					queue.node.getTrackPosition(tracks[0]) + 1
				}\` ${tracks[0].playlist ? `from \`${tracks[0].playlist.title}\`` : ''}`
			)
			.catch(error => logger.error('audioTracksAdd', error));
		setTimeout(() => msg.delete(), 5000);
	}
};
