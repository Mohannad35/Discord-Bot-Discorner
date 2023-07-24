const { PermissionsBitField } = require('discord.js');
const logger = require('./logger');

async function sendErrorLog(error, type) {
	try {
		console.log(error);
		if (error.message?.includes('Missing Access')) return;
		if (error.message?.includes('Unknown Message')) return;
		if (error.message?.includes('Unknown interaction')) return;

		if (
			error.stack?.includes("TypeError: Cannot read properties of undefined (reading 'messages')")
		) {
			return logger.error('ERR_LOG', error);
		}

		return logger.error('ERR_LOG', error.stack || `${error}`);
	} catch (e) {
		console.error({ error });
		console.error(e);
	}
}

function havePermissions(resolvable) {
	const channel = 'channel' in resolvable ? resolvable.channel : resolvable;
	const permissions = channel.permissionsFor(resolvable.guild.members.me);
	return (
		permissions.has(PermissionsBitField.Flags.ViewChannel) &&
		permissions.has(PermissionsBitField.Flags.SendMessages) &&
		permissions.has(PermissionsBitField.Flags.EmbedLinks)
	);
}

function formatNumber(n) {
	return Number.parseFloat(String(n)).toLocaleString('en-IN');
}

function formatDuration(millisec) {
	if (!millisec || !Number(millisec)) return '0 Second';
	const seconds = Math.round((millisec % (60 * 1000)) / 1000);
	const minutes = Math.floor((millisec % (60 * 60 * 1000)) / (60 * 1000));
	const hours = Math.floor(millisec / (60 * 60 * 1000));

	if (hours > 0) return `${hours} Hour, ${minutes} Minute & ${seconds} Second`;
	if (minutes > 0) return `${minutes} Minute & ${seconds} Second`;
	return `${seconds} Second`;
}

function toMilliseconds(input) {
	if (!input) return 0;
	if (typeof input !== 'string') return Number(input) || 0;
	if (input.match(/:/g)) {
		const time = input.split(':').reverse();
		let s = 0;
		for (let i = 0; i < 3; i++)
			if (time[i]) s += Number(time[i].replace(/[^\d.]+/g, '')) * Math.pow(60, i);
		if (time.length > 3) s += Number(time[3].replace(/[^\d.]+/g, '')) * 24 * 60 * 60;
		return Number(s * 1000);
	}
	return Number(input.replace(/[^\d.]+/g, '') * 1000) || 0;
}

module.exports = {
	sendErrorLog,
	havePermissions,
	formatNumber,
	formatDuration,
	toMilliseconds
};
