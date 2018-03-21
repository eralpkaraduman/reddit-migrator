import _ from 'underscore';

export function getAuthResponseAsJsonFromHash() {
	let hashJson = null;
	const {hash} = window.location;
	if (!_.isNull(hash) && !_.isEmpty(hash) && _.isString(hash)) {
		const encodedHashJsonText = hash.split('#')[1];
		const hashJsonText = decodeURIComponent(encodedHashJsonText);
		
		try {
			hashJson = JSON.parse(hashJsonText);
		}
		catch(error) {
			console.error(`Failed to parse hash string as json: ${hashJsonText} error: ${error}`);
		}
		
	}
	return hashJson;
}

export function loadAuthDataFromHashJson(hashJson) {
	const {status, state} = hashJson;
	if (status === 'success') {
		const deckIndex = parseInt(state.split('DECK_')[1]);
		if (!_.isNaN(deckIndex)) {
			console.log(`received auth response for deck ${deckIndex}`);
			hashJson = _.omit(hashJson, 'state');
			hashJson = _.omit(hashJson, 'status');
			saveAuthResponseDataToLocalStorage(deckIndex, hashJson);
		}
		else {
			console.log(`received auth response for invalid deck index`);
		}
	}
}

export function launchAuthUrl(deckIndex) {
	const state = `DECK_${deckIndex}`;
	window.location = `http://localhost:3333?state=${state}`;
}

export function saveAuthResponseDataToLocalStorage(deckIndex, data) {
	localStorage.setItem(`REDDIT_TOKEN_DECK_${deckIndex}`, JSON.stringify(data));
}

export function removeAuthResponseDataFromLocalStorage(deckIndex) {
	localStorage.removeItem(`REDDIT_TOKEN_DECK_${deckIndex}`);
}

export function loadAuthResponseDataFromLocalStorage(deckIndex) {
	const dataJsonString = localStorage.getItem(`REDDIT_TOKEN_DECK_${deckIndex}`);
	let dataJson = null;
	try {
		dataJson = JSON.parse(dataJsonString)
	}
	catch (error) {
		console.error('failed to parse loaded auth responseData from localstorage error: ' + error);
	}
	return dataJson;
}

export function fetchRedditApi(accessToken, endpoint, method = 'GET') {
	return new Promise((resolve, reject) => {
		
		const headers = new Headers();
		headers.append('Authorization', `bearer ${accessToken}`);
		
		const fetchOptions = {
			method,
			headers
		}
		
		fetch(`https://oauth.reddit.com/api/v1/${endpoint}`, fetchOptions)
		.then(response => {
			if(response.ok) {
				return response;
			}
			else {
				if (response.status === 401) {
					throw `unauthorized`;
				}
				else {
					throw `response was not ok (${response.status})`;
				}
			}
		})
		.catch(reject)
		.then(response => response.json())
		.catch(reject)
		.then(json => resolve(json));
	});
}

export function refreshSession(accessToken, refreshToken) {
	return new Promise((resolve, reject) => {
		console.log({accessToken, refreshToken});

		// https://github.com/reddit-archive/reddit/wiki/OAuth2#refreshing-the-token

		// const fetchOptions = {
		// 	method: 'post'
		// }

		// fetch(`https://www.reddit.com/api/v1/access_token`, fetchOptions)

		resolve();
	});
}
