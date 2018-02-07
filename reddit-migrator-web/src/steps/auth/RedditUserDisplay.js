import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Card, Header, Image, Icon, Label } from 'semantic-ui-react';
import dummyUserImage from './dummy-user.jpg';

class RedditUserDisplay extends Component {
	render() {
		const deck = this.props.isDeckA ? 'A' : 'B';
		return (
			<Card>

				<Card.Content>

					<Image floated='right' size='mini' src={dummyUserImage} />
        	<Card.Header>
						{`Reddit User ${deck}`}
					</Card.Header>
					<Card.Meta>
						{`Deck ${deck}`}
					</Card.Meta>
					
					<Card.Description>
						
					</Card.Description>

				</Card.Content>

				<Card.Content extra>
					<div className='ui two buttons'>
						<Button
							basic
							onClick={() => this.props.onAuthenticate()}
							color='green'>
							Authenticate
						</Button>
					</div>
				</Card.Content>

			</Card>
		);
	}
}

RedditUserDisplay.propTypes = {
	isDeckA: PropTypes.bool,
	accessToken: PropTypes.string,
	onAuthenticate: PropTypes.func.isRequired
};

export default RedditUserDisplay;
