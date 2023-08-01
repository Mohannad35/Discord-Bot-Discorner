const { useMainPlayer } = require('discord-player');
const glob = require('glob');
const logger = require('../functions/logger');
const { bot } = require('../functions/bot');

module.exports = function loadEvents() {
	const eventFiles = glob.sync('events/**/*.js', { absolute: true });
	const player = useMainPlayer();

	for (const file of eventFiles) {
		const event = require(file);

		if (!event.execute) {
			throw new TypeError(`[ERROR]: execute function is required for events! (${file})`);
		}

		if (!event.name) {
			throw new TypeError(`[ERROR]: name is required for events! (${file})`);
		}


		// GuildQueueEvent
		if (event.type === 'player') {
			player.events.on(event.name, event.execute);
		} else if (event.once) {
			bot.once(event.name, event.execute);
		} else {
			bot.on(event.name, event.execute);
		}

		delete require.cache[require.resolve(file)];

		logger.debug('EVENTS', `Loaded ${event.type}: ${event.name}`);
	}
	logger.debug('EVENTS', `All ${eventFiles.length} events loaded!`);
};
