const spotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');
const config = require('config');

const spotifyApi = new spotifyWebApi();

async function getAccessToken() {
	let access_token = '';
	await axios
		.post(
			'https://accounts.spotify.com/api/token',
			{
				grant_type: 'client_credentials',
				client_id: config.get('SpotifyClientId'),
				client_secret: config.get('SpotifyClientSecret')
			},
			{ headers: { 'Content-Type': 'application/x-www-form-urlencoded' } }
		)
		.then(async res => {
			access_token = res.data.access_token;
			spotifyApi.resetAccessToken();
			spotifyApi.setAccessToken(access_token);
		})
		.catch(err => console.log(err.data));
	return access_token;
}
