const { Events } = require('discord.js');
const { sendErrorLog } = require('../../functions/utils');

module.exports = {
	name: Events.Warn,

	execute(error) {
		return sendErrorLog(error, 'warning');
	}
};
