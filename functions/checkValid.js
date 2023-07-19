const config = require('config');
const logger = require('./logger');

function checkValid() {
	const nodeV = parseFloat(process.versions.node);
	const npmV = parseFloat(process.versions.npm);

	if (nodeV < 16.9) {
		throw Error(
			'[ERROR]: This bot requires version 16.9 of nodejs! Please upgrade to version 16.9 or more.'
		);
	}

	if (npmV < 7) {
		throw Error('[ERROR]: Please upgrade npm to version 7 or more.');
	}

	if (!config.has('DiscordBotToken') || config.get('DiscordBotToken') === '') {
		throw Error('[ERROR][BOT]: DISCORD_BOT_TOKEN is required');
	}

	if (!config.has('DiscordBotClientId') || config.get('DiscordBotClientId') === '') {
		throw Error('[ERROR][BOT]: DISCORD_BOT_CLIENT_ID is required');
	}

	if (!config.has('SpotifyClientId') || config.get('SpotifyClientId') === '') {
		throw Error('[ERROR][BOT]: SPOTIFY_CLIENT_ID is required');
	}

	if (!config.has('SpotifyClientSecret') || config.get('SpotifyClientSecret') === '') {
		throw Error('[ERROR][BOT]: SPOTIFY_CLIENT_SECRET is required');
	}

	if (!config.has('botInviteLink')) {
		logger.warn('config', 'botInviteLink is required to invite the bot');
	}

	if (!config.has('supportServerLink')) {
		logger.warn('config', 'supportServerLink is required for discord support');
	}
}

checkValid();
