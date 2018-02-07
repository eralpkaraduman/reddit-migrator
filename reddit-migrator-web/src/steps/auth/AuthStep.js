import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Card } from 'semantic-ui-react';
import RedditUserDisplay from './RedditUserDisplay';
import * as Reddit from '../../RedditUtils';

class AuthStep extends Component {
  
  handleOnContinueClicked = () => {
    this.props.onStepCompleted({
      accessTokens: [
        'dsgfdhgjh',
        'jhkgfhdgf',
      ]
    });
  }
  
  beginGetToken = index => {
    console.log('beginGetToken ' + index);
    console.log(Reddit.getAuthUrl());
  }
  
  render() {
    return (
      <Grid>
        <Grid.Column >
          
            <Card.Group centered>

                <RedditUserDisplay
                  isDeckA
                  accessToken={this.props.accessTokens[0]}
                  onAuthenticate={() => this.beginGetToken(0)}
                />

                <RedditUserDisplay
                  accessToken={this.props.accessTokens[1]}
                  onAuthenticate={() => this.beginGetToken(1)}
                />

            </Card.Group>

          <Button
            floated='right'
            style={{marginTop: 12}}
            primary
            onClick={this.handleOnContinueClicked}>
            Continue
          </Button>
        </Grid.Column>
      </Grid>
    );
  }
}

AuthStep.propTypes = {
  accessTokens: PropTypes.array.isRequired,
  onStepCompleted: PropTypes.func.isRequired
};

export default AuthStep;
