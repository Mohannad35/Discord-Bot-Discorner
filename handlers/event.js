const glob = require('glob');

module.exports = function loadEvents(bot, player) {
	const eventFiles = glob.sync('events/**/*.js', { absolute: true });

	for (const file of eventFiles) {
		const event = require(file);

		let type = 'bot';
		if (file.includes('player.')) type = 'player';

		if (!event.execute) {
			throw new TypeError(`[ERROR]: execute function is required for events! (${file})`);
		}

		if (!event.name) {
			throw new TypeError(`[ERROR]: name is required for events! (${file})`);
		}

		if (type === 'player') {
			player.events.on(event.name, event.execute.bind(null, bot));
		} else if (event.once) {
			bot.once(event.name, event.execute.bind(null, bot));
		} else {
			bot.on(event.name, event.execute.bind(null, bot));
		}

		delete require.cache[require.resolve(file)];

		bot.logger.debug('EVENTS', `Loaded ${type}: ${event.name}`);
	}
	bot.logger.debug('EVENTS', `All ${eventFiles.length} events loaded!`);
};
