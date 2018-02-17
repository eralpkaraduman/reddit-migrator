import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
	Button,
	Grid,
	Card,
	Header,
	Image,
	Icon,
	Label,
	Dimmer,
	Loader
} from 'semantic-ui-react';
import dummyUserImage from './dummy-user.jpg';
import _ from 'underscore';
import * as Reddit from '../../RedditUtils';

class RedditUserDisplay extends Component {
	
	state = {
		userData: undefined,
		authenticated: undefined,
		userDataFetchStatus: undefined
	}
	
	componentWillReceiveProps(nextProps) {
		const {accessToken} = nextProps
		const accessTokenChanged = accessToken !== this.props.accessToken;
		if (accessTokenChanged) {
			if (!_.isNull(accessToken) && !_.isEmpty(accessToken)) {

				this.setState(() => ({
					authenticated: undefined,
					userDataFetchStatus: 'pending'
				}));
				
				// Fetcing user data from reddit
				Reddit.fetchRedditApi(accessToken, 'me')
				.then(userData => {
					this.setState(() => ({
						userData,
						authenticated: true,
						userDataFetchStatus: 'success'
					}));
				})
				.catch((error) => {
					console.log(`DECK ${this.props.deckIndex}: failed`);
					const authenticated = error === 'unauthorized' ? false : undefined;
					this.setState(() => ({
						authenticated,
						userDataFetchStatus: 'failed'
					}));
				});
				
			}
			else {
				console.log(`DECK ${this.props.deckIndex}: failed2`);
				this.setState(() => ({
					authenticated: false,
					userData: undefined,
					userDataFetchStatus: undefined
				}))
			}
		}
	}
	
	componentDidUpdate(prevProps, prevState) {
		if (!_.isEqual(this.state.userData, prevState.userData)) {
			const prevUserData = prevState.userData;
			const prevUserId = prevUserData && prevUserData.id;
			
			const currentUserData = this.state.userData;
			const currentUserId = currentUserData && currentUserData.id;
			
			if (!_.isEqual(currentUserId, prevUserId)) {
				this.props.onUserIdChanged(currentUserId);
			}
		}
		
		if (!_.isEqual(this.state.authenticated, prevState.authenticated)) {
			this.props.onReadyStatusChanged(!!this.state.authenticated);
		}
	}
	
	render() {
		const deck = this.props.deckIndex === 0 ? 'A' : 'B';
		const {userData, authenticated, userDataFetchStatus} = this.state;
		const userDataFetchStatusPending = userDataFetchStatus === 'pending';
		const userName = (userData && userData.name) || `Reddit User ${deck}`;
		const userPictureUrl = (userData && userData.icon_img) || dummyUserImage;
		const userId = (userData && userData.id) || 'N/A';
		
		return (
			<Card>
				<Dimmer inverted active={userDataFetchStatusPending}>
					<Loader inverted content='Loading' />
				</Dimmer>
				<Card.Content>

					<Image floated='right' size='mini' src={userPictureUrl} />
        	<Card.Header>{userName}</Card.Header>
					<Card.Meta>{`Deck ${deck}`}</Card.Meta>
					
					<Card.Description>
						<Label>
							<Icon name='id card outline'/>
							{userId}
						</Label>

						<div style={{marginTop: 8}}>
							{authenticated && <div style={{color: 'green', fontWeight: 'bold'}}>Ready</div>}
							{!authenticated && <div style={{color: 'red', fontWeight: 'bold'}}>Not Ready</div>}
						</div>

					</Card.Description>

				</Card.Content>

				<Card.Content extra>
					<Button
						basic
						fluid
						disabled={userDataFetchStatusPending}
						color={!authenticated ? 'green' : undefined}
						onClick={() => {
							if (authenticated) {
								this.props.onClearToken();
							}
							else {
								this.props.onAuthenticate();
							}
						}}
					>
						{!authenticated ? 'Connect' : 'Disconnect'}
					</Button>
				</Card.Content>

			</Card>
		);
	}
}

RedditUserDisplay.propTypes = {
	deckIndex: PropTypes.number.isRequired,
	accessToken: PropTypes.string,
	onAuthenticate: PropTypes.func.isRequired,
	onClearToken: PropTypes.func.isRequired,
	onReadyStatusChanged: PropTypes.func.isRequired,
	onUserIdChanged: PropTypes.func.isRequired
};

export default RedditUserDisplay;
