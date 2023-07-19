module.exports = {
	name: 'shuffle',
	description: 'Shuffle the queue!',
	category: 'music',

	execute(bot, interaction, queue) {
		if (!queue || !queue.isPlaying())
			return bot.say.wrongEmbed(interaction, '❌ | No music is being played!');

		if (queue.size < 3)
			return bot.say.wrongEmbed(interaction, 'Need at least 3 tracks in the queue to shuffle.');

		queue.tracks.shuffle();

		return bot.say.successEmbed(interaction, '✅ | Queue shuffled!');
	}
};
