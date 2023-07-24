const { Player } = require('discord-player');
const { bot } = require('./bot');
const {
	SpotifyExtractor,
	YouTubeExtractor,
	SoundCloudExtractor
} = require('@discord-player/extractor');

const player = new Player(bot, { ignoreInstance: true });
// const player = Player.singleton(client);
player.extractors.register(SpotifyExtractor, {});
player.extractors.register(YouTubeExtractor, {});
player.extractors.register(SoundCloudExtractor, {});

module.exports = {
	player
};
