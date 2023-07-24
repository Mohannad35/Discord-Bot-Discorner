const { GatewayIntentBits, Collection, Client } = require('discord.js');

const buttons = new Collection();
const commands = new Collection();
const cooldowns = new Collection();

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

module.exports = {
	bot,
	buttons,
	commands,
	cooldowns
};
