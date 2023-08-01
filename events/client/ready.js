const { Events, ActivityType } = require('discord.js');
const { formatNumber } = require('../../functions/utils');
const logger = require('../../functions/logger');
const { bot } = require('../../functions/bot');

module.exports = {
	name: Events.ClientReady,
	type: 'client',
	once: true,

	async execute() {
		// initializing commands
		await require('../../handlers/command')();

		const serverCount = formatNumber(bot.guilds.cache.size);
		const userCount = formatNumber(
			bot.guilds.cache.reduce((acc, guild) => acc + guild.memberCount, 0)
		);

		const statuses = [
			{
				name: `${serverCount} servers & ${userCount} users`,
				type: ActivityType.Watching
			},
			{ name: '/play', type: ActivityType.Listening },
			{ name: '/help', type: ActivityType.Playing }
		];

		const data = `${bot.user.tag} is ready in ${serverCount} servers.`;

		logger.info('BOT_READY', data);

		setInterval(() => {
			const status = statuses[Math.floor(Math.random() * statuses.length)];
			bot.user.setActivity(status.name, { type: status.type });
		}, 60000);
	}
};
