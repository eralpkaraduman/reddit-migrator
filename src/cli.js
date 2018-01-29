const connect = require('connect');
const http = require('http');
const migrator = require('.');

const app = connect();

http.createServer(app).listen(3131);

console.log('Auth for Account A');
console.log('Sign in to account A, then open this url');




migrator.getToken(
  function onAuthUrl(authUrl) {
    console.log(authUrl);
  }
)