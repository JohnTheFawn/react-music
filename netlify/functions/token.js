var request = require('request');
require('dotenv').config();

function getToken(){
  var client_id = process.env.SPOTIFY_CLIENT_ID;
  var client_secret = process.env.SPOTIFY_CLIENT_SECRET;

  // your application requests authorization
  var authOptions = {
    url: 'https://accounts.spotify.com/api/token',
    headers: {
      Authorization:
        'Basic ' +
        new Buffer(client_id + ':' + client_secret).toString('base64')
    },
    form: {
      grant_type: 'client_credentials'
    },
    json: true
  };

  return new Promise((resolve, reject) => {
    request.post(authOptions, function(error, response, body) {
      if (!error && response.statusCode === 200) {
        resolve(body.access_token);
      }
    });
  });
}

exports.handler = async function(event, context) {
  // your server-side functionality
  var token = await getToken();
  return {
    statusCode: 200,
    body: {token: token}
  };
}
