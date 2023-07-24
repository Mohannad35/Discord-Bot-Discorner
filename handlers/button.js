const glob = require('glob');
const logger = require('../functions/logger');
const { buttons } = require('../functions/bot');

module.exports = async () => {
	const buttonFiles = glob.sync('buttons/**/*.js', { absolute: true });

	for (const file of buttonFiles) {
		const button = require(file);

		if (!button.name) {
			throw new TypeError(`[ERROR][BUTTONS]: name is required for buttons! (${file})`);
		}

		if (!button.execute) {
			throw new TypeError(`[ERROR][BUTTONS]: execute function is required for buttons! (${file})`);
		}

		delete require.cache[require.resolve(file)];

		// debug
		logger.debug('BUTTONS', `Loaded: ${button.name}`);

		buttons.set(button.name, button);
	}
	logger.debug('BUTTONS', `All ${buttons.size} buttons loaded!`);
};
