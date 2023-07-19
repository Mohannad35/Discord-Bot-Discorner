const glob = require('glob');
const { ApplicationCommandType } = require('discord.js');

module.exports = async bot => {
	const commandFiles = glob.sync('commands/**/*.js', { absolute: true });

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
			bot.logger.warn(
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
		bot.logger.debug('COMMANDS', `Loaded: ${command.name}`);

		bot.commands.set(command.name, command);
	}
	bot.logger.debug('COMMANDS', `All ${bot.commands.size} commands loaded!`);
};
