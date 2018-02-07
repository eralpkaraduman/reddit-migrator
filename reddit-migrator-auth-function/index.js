'use strict';
var passport = require('passport');
var RedditStrategy = require('passport-reddit').Strategy;
var session = require('express-session');

require('dotenv').config();

passport.use(new RedditStrategy({
	clientID: process.env.REDDIT_CONSUMER_KEY,
	clientSecret: process.env.REDDIT_CONSUMER_SECRET,
	callbackURL: process.env.REDDIT_REDIRECT_URI,
	state: true
},
	function (accessToken, refreshToken, profile, done) {
		process.nextTick(function () {
			return done(null, profile);
		});
	}
));


exports.handleAuth = (req, res, next) => {
	session({
		resave: false,
		saveUninitialized: false,
		secret: 'SECRET'
	})(req, res, () => {
		passport.initialize()(req, res, () => {
			passport.session()(req, res, () => {
				
				
				var state = req.query.state;
				var code = req.query.code;
				
				
			
				// begin auth
				if (state && !code) {
					console.log('MODE: DO AUTH');
					passport.authenticate('reddit', {
						state: state
					})(req, res, next);
				}
				
				// handle redirect
				else if (code) {
					console.log('MODE: HANDLE AUTH REDIRECT');
					passport.authenticate('reddit', {
						successRedirect: '/#SUCCESS',
						failureRedirect: '/#FAILED'
					})(req, res, next);
				}
				
				else {
					console.log('MODE: LOL');
					
				}
				
				
			})
		});
		
	})
	
	
	 
}


