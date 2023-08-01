const { version, time } = require('discord.js');
const { formatNumber, formatDuration } = require('../../functions/utils');
const { baseEmbed } = require('../../functions/embeds');
const { commands, bot } = require('../../functions/bot');

module.exports = {
	name: 'botinfo',
	description: 'Get some info about the bot',
	category: 'misc',

	async execute(interaction) {
		const serverCount = formatNumber(bot.guilds.cache.size);
		const channelCount = formatNumber(bot.guilds.cache.size);
		const userCount = formatNumber(bot.guilds.cache.reduce((a, g) => a + g.memberCount, 0));
		const commandCount = formatNumber(commands.size);
		const createdAt = new Date(bot.user.createdAt);
		const uptime = formatDuration(Math.floor(bot.uptime / 1000));

		const embed = baseEmbed(interaction)
			.setAuthor({
				name: `${bot.user.username}’s Info`,
				iconURL: bot.user.displayAvatarURL()
			})
			.addFields([
				{
					name: 'General Info',
					value: `Bot Id: ${bot.user.id}
Bot Tag: ${bot.user.tag}\nCreated At : ${time(createdAt, 'F')}
Developer: [Mohannad(cyber_psycho)](https://github.com/Mohannad35)
Prefix: /`
				},
				{
					name: 'Bot Stats',
					value: `Servers: ${serverCount}\nCommands: ${commandCount}
Channels:${channelCount}\nUsers:${userCount}`
				},
				{
					name: 'System Info',
					value: `RAM Usage:  ${(process.memoryUsage().heapUsed / 1024 / 1024).toFixed(2)} MB
Bot Uptime: ${uptime}
Node Version: ${process.version}
Discord.js Version: ${version}
Platform: ${process.platform}`
				}
			]);

		// const supportButton = new ButtonBuilder()
		// 	.setLabel('Support')
		// 	.setStyle(ButtonStyle.Link)
		// 	.setURL(`${config.supportServerLink}`);

		// const inviteButton = new ButtonBuilder()
		// 	.setLabel('Invite')
		// 	.setStyle(ButtonStyle.Link)
		// 	.setURL(`${config.botInviteLink}`);

		// const buttonsRow = new ActionRowBuilder().addComponents([supportButton, inviteButton]);

		await interaction.reply({
			ephemeral: false,
			embeds: [embed]
			// components: [buttonsRow]
		});
		setTimeout(() => interaction.deleteReply(), 15000);
	}
};
