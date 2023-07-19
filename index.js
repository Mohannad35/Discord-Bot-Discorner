const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const {
	SpotifyExtractor,
	YouTubeExtractor,
	SoundCloudExtractor
} = require('@discord-player/extractor');
const config = require('config');

require('dotenv/config');
require('./functions/checkValid');

const bot = new Client({
	intents: [
		GatewayIntentBits.Guilds,
		GatewayIntentBits.GuildMessages,
		GatewayIntentBits.GuildMembers,
		GatewayIntentBits.GuildVoiceStates,
		GatewayIntentBits.DirectMessages,
		GatewayIntentBits.MessageContent
	]
});
bot.commands = new Collection();
bot.cooldowns = new Collection();
bot.logger = require('./functions/logger');
bot.utils = require('./functions/utils');
bot.say = require('./functions/reply');

const player = new Player(bot, { ignoreInstance: true });
// const player = Player.singleton(client);
player.extractors.register(SpotifyExtractor, {});
player.extractors.register(YouTubeExtractor, {});
player.extractors.register(SoundCloudExtractor, {});

require('./handlers/event')(bot, player);

bot.login(config.get('DiscordBotToken'));
