const { EmbedBuilder, Colors } = require('discord.js');

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
	if (!interaction) {
		throw Error("'interaction' must be passed down as param! (successEmbed)");
	}

	if (!text) {
		throw Error("'text' must be passed down as param! (successEmbed)");
	}

	const sEmbed = new EmbedBuilder()
		.setDescription(text)
		.setColor(interaction.guild.members.me.displayColor || Colors.Fuchsia);

	if (interaction.deferred) {
		const msg = await interaction.editReply({ embeds: [sEmbed] }).catch(console.error);
		setTimeout(() => interaction.deleteReply(msg), 5000);
		return;
	}

	if (interaction.replied) {
		const msg = await interaction.followUp({ ephemeral, embeds: [sEmbed] });
		setTimeout(() => msg.delete(), 5000);
		return;
	}

	const msg = await interaction.reply({ ephemeral, embeds: [sEmbed] });
	setTimeout(() => msg.delete(), 5000);
	return;
}

async function wrongEmbed(interaction, text) {
	if (!interaction) {
		throw Error("'interaction' must be passed down as param! (wrongEmbed)");
	}

	if (!text) {
		throw Error("'text' must be passed down as param! (wrongEmbed)");
	}

	const wEmbed = new EmbedBuilder().setDescription(text).setColor(Colors.Orange);

	if (interaction.deferred) {
		const msg = await interaction.editReply({ embeds: [wEmbed] });
		setTimeout(() => interaction.deleteReply(msg), 5000);
		return;
	}

	if (interaction.replied) {
		const msg = await interaction
			.followUp({ ephemeral: true, embeds: [wEmbed] })
			.catch(console.error);
		setTimeout(() => msg.delete(), 5000);
		return;
	}

	const msg = await interaction.reply({ ephemeral: true, embeds: [wEmbed] });
	setTimeout(() => msg.delete(), 5000);
	return;
}

async function errorEmbed(interaction, text) {
	if (!interaction) {
		throw Error("'interaction' must be passed down as param! (errorEmbed)");
	}

	if (!text) {
		throw Error("'text' must be passed down as param! (errorEmbed)");
	}

	const eEmbed = new EmbedBuilder().setDescription(text).setColor(Colors.Red);

	if (interaction.deferred) {
		const msg = await interaction.editReply({ embeds: [eEmbed] });
		setTimeout(() => interaction.deleteReply(msg), 5000);
		return;
	}

	if (interaction.replied) {
		const msg = await interaction.followUp({ ephemeral: true, embeds: [eEmbed] });
		setTimeout(() => msg.delete(), 5000);
		return;
	}

	const msg = await interaction.reply({ ephemeral: true, embeds: [eEmbed] });
	setTimeout(() => msg.delete(), 5000);
	return;
}

function queueEmbed(queue, text, length) {
	if (!queue) {
		throw Error("'queue' must be passed down as param! (queueEmbed)");
	}

	if (!text) {
		throw Error("'text' must be passed down as param! (queueEmbed)");
	}

	const channel = queue.metadata;
	const { havePermissions } = require('./utils');
	if (!havePermissions(channel)) return;

	const embedQ = new EmbedBuilder()
		.setTitle(`Queue ${length} songs`)
		.setDescription(text)
		.setColor(queue.guild.members.me.displayColor || Colors.Fuchsia)
		.setFooter({ text: `Page 1 of ${Math.ceil(length / 9)}` });

	return embedQ;
}

module.exports = {
	baseEmbed,
	errorEmbed,
	wrongEmbed,
	successEmbed,
	queueEmbed
};
