const spotifyWebApi = require('spotify-web-api-node');
const axios = require('axios');

const spotifyApi = new spotifyWebApi();

async function getAccessToken() {
	let access_token = '';
	await axios
		.post(
			'https://accounts.spotify.com/api/token',
			{
				grant_type: 'client_credentials',
				client_id: process.env.SPOTIFY_CLIENT_ID,
				client_secret: process.env.SPOTIFY_CLIENT_SECRET
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
