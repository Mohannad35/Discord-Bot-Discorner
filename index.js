require('dotenv/config');
const config = require('config');
require('./functions/checkValid');
require('./functions/logger');
const { bot } = require('./functions/bot');
require('./functions/player');
require('./functions/utils');
require('./handlers/event')();

bot.login(config.get('DiscordBotToken'));
