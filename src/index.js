const config = {
  reddit: {
    CLIENT_ID: 'bOBuokmX6o0WCA',
    REDIRECT_URI: 'http://localhost:3131/handle-reddit-redirect',
    SCOPE: 'identity subscribe'
  }
}

const getRedditAuthUrl = state => encodeURI([
  'https://www.reddit.com/api/v1/authorize',
  `?client_id=${config.reddit.CLIENT_ID}`,
  '&response_type=token',
  `&state=${state}`,
  `&redirect_uri=${config.reddit.REDIRECT_URI}`,
  `&scope=${config.reddit.SCOPE}`
].join(''));

function getToken(onAuthUrl, onToken, onError) {
  const state = new Date().getTime().toString();
  const authUrl = getRedditAuthUrl(state);
  onAuthUrl(authUrl);
}

module.exports = {
  getToken
}