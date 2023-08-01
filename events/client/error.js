const { Events } = require('discord.js');
const { sendErrorLog } = require('../../functions/utils');

module.exports = {
	name: Events.Error,
	type: 'client',

	execute(error) {
		return sendErrorLog(error, 'error');
	}
};
