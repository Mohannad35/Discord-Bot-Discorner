const logger = require('../../functions/logger');

module.exports = {
	name: 'audioTrackAdd',
	type: 'player',

	async execute(queue, track) {
		const msg = await queue.metadata.channel
			.send(
				`> ${track.requestedBy.toString()} loaded \`${track.title}\` at position \`${
					queue.node.getTrackPosition(track) + 1
				}\`.` + track.playlist
					? `from \`${track.playlist.title}\``
					: ''
			)
			.catch(error => logger.error('audioTrackAdd', error));
		return setTimeout(() => msg.delete(), 5000);
	}
};
