const config = require('config');
const { Logtail } = require('@logtail/node');
const { LogtailTransport } = require('@logtail/winston');
const { format, transports, createLogger } = require('winston');
const chalk = require('chalk');

const { combine, timestamp, errors, prettyPrint, json, simple, colorize, align, printf } = format;
const consoleFormat = printf(({ message, label, timestamp }) => {
	return `[${timestamp}] [${label}] ${message}`;
});

const logger = createLogger({
	level: process.env.LOG_LEVEL || 'info',
	format: combine(
		errors({ stack: true }),
		timestamp({ format: 'YYYY-MM-DD hh:mm:ss.SSS A' }),
		json()
	),
	defaultMeta: { service: 'user-service' },
	transports: [
		new transports.File({ filename: 'logs/error.log', level: 'error' }),
		new transports.File({ filename: 'logs/combined.log', level: 'info' })
	],
	exceptionHandlers: [new transports.File({ filename: 'logs/exception.log' })],
	rejectionHandlers: [new transports.File({ filename: 'logs/rejections.log' })]
});

if (config.get('env') === 'development') {
	if (config.has('logtailSourceToken')) {
		const logtail = new Logtail(config.get('logtailSourceToken'));
		logger.add(new LogtailTransport(logtail));
	}
	logger.add(
		new transports.Console({
			level: 'info',
			format: consoleFormat,
			handleExceptions: true,
			handleRejections: true
		})
	);
}

class Logger {
	get now() {
		return Intl.DateTimeFormat('en-IN', {
			minute: '2-digit',
			day: '2-digit',
			hour: '2-digit',
			month: '2-digit',
			year: 'numeric',
			second: '2-digit'
		}).format(Date.now());
	}

	/**
	 * @param {string} type
	 * @param {unknown} error
	 */
	error(type, error) {
		const err = error instanceof Error ? error.message : error;
		return logger.error(`${chalk.red('[ERROR]')}: ${err}`, { label: type });
	}

	/**
	 * @param {string} type
	 * @param {string} warning
	 */
	warn(type, warning) {
		return logger.warn(`${chalk.yellow('[WARNING]')}: ${warning}`, { label: type });
	}

	/**
	 * @param {string} type
	 * @param {string} content
	 */
	info(type, content) {
		return logger.info(`${chalk.blueBright('[INFO]')}: ${content}`, { label: type });
	}

	/**
	 * @param {string} type
	 * @param {string} text
	 */
	debug(type, text) {
		return logger.info(`${chalk.green('[DEBUG]')}: ${text}`, { label: type });
	}
}

module.exports = new Logger();
