const logger = require('../../functions/logger');

module.exports = {
	name: 'connection',
	type: 'player',

	async execute(queue) {
		const msg = await queue.metadata.channel
			.send(`> 👍 Joined ${queue.channel.toString()}`)
			.catch(error => logger.error('connection', error));
		setTimeout(() => msg.delete(), 5000);
	}
};
