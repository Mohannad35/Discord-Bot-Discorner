const glob = require('glob');
const { ApplicationCommandType } = require('discord.js');
const logger = require('../functions/logger');
const { commands, bot } = require('../functions/bot');

module.exports = async () => {
	const commandFiles = glob.sync('commands/**/*.js', { absolute: true });
	// const commandFiles = glob.sync(
	// 	['commands/music/back.js', 'commands/music/play.js', 'commands/music/skip.js'],
	// 	{ absolute: true }
	// );

	for (const file of commandFiles) {
		const command = require(file);

		if (!command.name) {
			throw new TypeError(`[ERROR][COMMANDS]: name is required for commands! (${file})`);
		}

		if (!command.execute) {
			throw new TypeError(
				`[ERROR][COMMANDS]: execute function is required for commands! (${file})`
			);
		}

		if (!command.category) {
			logger.warn(
				'[COMMANDS]',
				`${command.name} command will not be shown in the help command because no category is set.`
			);
		}

		const data = {
			type: ApplicationCommandType.ChatInput,
			name: command.name,
			description: command.description ?? 'Empty description',
			options: command.options ?? []
		};

		await bot.application.commands.create(data);
		delete require.cache[require.resolve(file)];

		// debug
		logger.debug('COMMANDS', `Loaded: ${command.name}`);

		commands.set(command.name, command);
	}
	logger.debug('COMMANDS', `All ${commands.size} commands loaded!`);
};
