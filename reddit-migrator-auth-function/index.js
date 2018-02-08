var request = require('request');

'use strict';
require('dotenv').config();

var TYPE = 'code';
var CLIENT_ID = process.env.REDDIT_CONSUMER_KEY;
var CLIENT_SECRET = process.env.REDDIT_CONSUMER_SECRET;
var REDDIT_REDIRECT_URI = process.env.REDDIT_REDIRECT_URI;
var RESULT_REDIRECT_URI = process.env.RESULT_REDIRECT_URI;
var DURATION = 'temporary';
var GRANT_TYPE='authorization_code';
var SCOPE_STRING = encodeURIComponent([
	'identity',
	'mysubreddits',
	'subscribe',
].join(' '));

function getAuthorizationURL(state) {
	return `https://www.reddit.com/api/v1/authorize` +
	`?client_id=${CLIENT_ID}` +
	`&response_type=${TYPE}` + 
	`&state=${state}` +
	`&redirect_uri=${REDDIT_REDIRECT_URI}` + 
	`&duration=${DURATION}` +
	`&scope=${SCOPE_STRING}`;
};

function getResultRedirectUri(data) {
	return `${RESULT_REDIRECT_URI}#${encodeURIComponent(JSON.stringify(data))}`;
}

exports.handleAuth = (req, res) => {
	var code = req.query.code;
	var state = req.query.state;

	if (code) {
		var bodyText = `grant_type=${GRANT_TYPE}` +
		`&code=${code}` +
		`&redirect_uri=${REDDIT_REDIRECT_URI}`;

		request.post(`https://${CLIENT_ID}:${CLIENT_SECRET}@www.reddit.com/api/v1/access_token`, {
			body: bodyText
		}, (error, response) => {
			if (error) {
				res.redirect(getResultRedirectUri({
					status: 'failed',
					error: 'Failed to access reddit for getting token (error: ' + error + ')'
				}));
			}
			else if (response.statusCode !== 200){
				res.redirect(getResultRedirectUri({
					status: 'failed',
					error: 'Failed to get token (status code: ' + response.statusCode + ')'
				}));
			}
			else {
				var json = null;
				try {
					json = JSON.parse(response.body)
				} catch(error) {
					res.redirect(getResultRedirectUri({
						status: 'failed',
						error: 'json parse error'
					}));
					return;
				}

				json.status = 'success';
				json.state = state;
				res.redirect(getResultRedirectUri(json));
			}
		});
	}
	else {
		var state = req.query.state || 'STATE_NOT_SPECIFIED';
		res.redirect(getAuthorizationURL(state));
	}
}
