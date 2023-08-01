const { EmbedBuilder, Colors } = require('discord.js');
const logger = require('./logger');

function baseEmbed(resolvable) {
	let color = Colors.DarkGold;

	if (resolvable && typeof resolvable === 'number') color = resolvable;
	if (resolvable && typeof resolvable === 'object')
		color =
			('guild' in resolvable ? resolvable.guild : resolvable).members.me.displayColor ||
			Colors.DarkGold;

	return new EmbedBuilder().setColor(color);
}

async function successEmbed(interaction, text, ephemeral = false) {
	if (!interaction || !text)
		return logger.error("'interaction' and 'text' must be passed down as param! (successEmbed)");

	const sEmbed = new EmbedBuilder()
		.setDescription(text)
		.setColor(interaction.guild.members.me.displayColor || Colors.Fuchsia);

	if (interaction.replied || interaction.deferred) {
		try {
			const msg = await interaction.followUp({ ephemeral, embeds: [sEmbed] });
			setTimeout(() => interaction.deleteReply(msg), 5000);
			return { msg };
		} catch (error) {
			logger.error(type, error);
			return { error: true };
		}
	}

	try {
		const msg = await interaction.reply({ ephemeral, embeds: [sEmbed] });
		setTimeout(() => msg.delete(), 5000);
		return { msg };
	} catch (error) {
		logger.error(type, error);
		return { error: true };
	}
}

async function wrongEmbed(interaction, text) {
	if (!interaction || !text)
		return logger.error("'interaction' and 'text' must be passed down as param! (wrongEmbed)");

	const wEmbed = new EmbedBuilder().setDescription(text).setColor(Colors.Orange);

	if (interaction.replied || interaction.deferred) {
		try {
			const msg = await interaction.followUp({ ephemeral: true, embeds: [wEmbed] });
			setTimeout(() => interaction.deleteReply(msg), 5000);
			return { msg };
		} catch (error) {
			logger.error(type, error);
			return { error: true };
		}
	}

	try {
		const msg = await interaction.reply({ ephemeral: true, embeds: [wEmbed] });
		setTimeout(() => msg.delete(), 5000);
		return { msg };
	} catch (error) {
		logger.error(type, error);
		return { error: true };
	}
}

async function errorEmbed(interaction, text) {
	if (!interaction || !text)
		return logger.error("'interaction' and 'text' must be passed down as param! (errorEmbed)");

	const eEmbed = new EmbedBuilder().setDescription(text).setColor(Colors.Red);

	if (interaction.replied || interaction.deferred) {
		try {
			const msg = await interaction.followUp({ embeds: [eEmbed], ephemeral: true });
			setTimeout(() => interaction.deleteReply(msg), 5000);
			return { msg };
		} catch (error) {
			logger.error(type, error);
			return { error: true };
		}
	}

	try {
		const msg = await interaction.reply({ ephemeral: true, embeds: [eEmbed] });
		setTimeout(() => msg.delete(), 5000);
		return { msg };
	} catch (error) {
		logger.error(type, error);
		return { error: true };
	}
}

function queueEmbed(queue, text, length, page) {
	const invalidInput = !queue || !text || !length || !page;
	if (invalidInput)
		return logger.error(
			"'queue', 'text', 'length', and 'page' must be passed down as param! (queueEmbed)"
		);

	const channel = queue.metadata;
	const { havePermissions } = require('./utils');
	if (!havePermissions(channel)) return;

	const embedQ = new EmbedBuilder()
		.setTitle(`Queue ${length ?? '~'} songs`)
		.setDescription(text)
		.setColor(queue.guild.members.me.displayColor ?? Colors.Fuchsia)
		.setFooter({ text: `Page ${page ?? '~'} of ${length ? Math.ceil(length / 9) : '~'}` });

	return embedQ;
}

async function sendMsg(interaction, text, type = 'SendMsg') {
	if (!interaction || !text) {
		throw Error("'interaction' and 'text' must be passed down as param! (sendMsg)");
	}

	if (interaction.replied || interaction.deferred) {
		try {
			const msg = await interaction.followUp(text);
			setTimeout(() => interaction.deleteReply(msg), 5000);
			return { msg };
		} catch (error) {
			logger.error(type, error);
			return { error: true };
		}
	}

	try {
		const msg = await interaction.reply(text);
		setTimeout(() => msg.delete(), 5000);
		return { msg };
	} catch (error) {
		logger.error(type, error);
		return { error: true };
	}
}

module.exports = {
	baseEmbed,
	errorEmbed,
	wrongEmbed,
	successEmbed,
	queueEmbed,
	sendMsg
};
