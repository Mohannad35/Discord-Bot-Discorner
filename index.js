const { Client, GatewayIntentBits, Collection } = require('discord.js');
const { Player } = require('discord-player');
const {
	SpotifyExtractor,
	YouTubeExtractor,
	SoundCloudExtractor
} = require('@discord-player/extractor');

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

const player = new Player(bot);
player.extractors.register(SpotifyExtractor, {});
player.extractors.register(YouTubeExtractor, {});
player.extractors.register(SoundCloudExtractor, {});

bot.player = player;
bot.commands = new Collection();
bot.cooldowns = new Collection();
bot.logger = require('./functions/logger');
bot.utils = require('./functions/utils');
bot.say = require('./functions/reply');

require('./handlers/event')(bot, bot.player);

bot.login(process.env.DISCORD_BOT_TOKEN);
