import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Card } from 'semantic-ui-react';
import RedditUserDisplay from './RedditUserDisplay';
import * as Reddit from '../../RedditUtils';


class AuthStep extends Component {

  state = {
    tokenDataDeckA: null,
    tokenDataDeckB: null,
    userIdDeckA: null,
    userIdDeckB: null,
    isDeckAReady: false,
    isDeckBReady: false
  }

  componentDidMount() {
    let hashJson = Reddit.getAuthResponseAsJsonFromHash();
    
    if (hashJson) {
      Reddit.loadAuthDataFromHashJson(hashJson);
      window.location.hash = ''; // removed the hash and reloads the page
    }
    
    this.loadAuthDataFromLocalStorage();
  }

  loadAuthDataFromLocalStorage() {
    const tokenDataDeckA =  Reddit.loadAuthResponseDataFromLocalStorage(0);
    const tokenDataDeckB =  Reddit.loadAuthResponseDataFromLocalStorage(1);
    this.setState(() => ({tokenDataDeckA, tokenDataDeckB}));
  }

  handleOnContinueClicked = () => {
    this.props.onStepCompleted({
      accessTokens: [
        'dsgfdhgjh',
        'jhkgfhdgf',
      ]
    });
  }
  
  handleOnClearToken = (deckIndex) => {
    Reddit.removeAuthResponseDataFromLocalStorage(deckIndex);
    this.loadAuthDataFromLocalStorage();
  }
  
  onDeckReadyStatusChanged = (deckIndex, ready) => {
    if (deckIndex === 0) {
      this.setState(() => ({isDeckAReady: ready}));
    }
    else if (deckIndex === 1) {
      this.setState(() => ({isDeckBReady: ready}));
    }
  }
  
  onDeckUserIdChanged = (deckIndex, userId) => {
    if (deckIndex === 0) {
      this.setState(() => ({userIdDeckA: userId}));
    }
    else if (deckIndex === 1) {
      this.setState(() => ({userIdDeckA: userId}));
    }
  }

  canContinue = () => {
    const {
      tokenDataDeckA,
      tokenDataDeckB,
      userIdDeckA,
      userIdDeckB,
      isDeckAReady,
      isDeckBReady
    } = this.state;
    
    const hasBothTokens = !_.isNull(tokenDataDeckA) && !_.isNull(tokenDataDeckB);
    const hasBothUserIds = !_.isNull(userIdDeckA) && !_.isNull(userIdDeckB);
    const bothAreReady = isDeckAReady && isDeckBReady;
    const userIdsAreDifferent = !_.isEqual(userIdDeckA, userIdDeckB);
  }

  render() {
    const {tokenDataDeckA, tokenDataDeckB} = this.state;
    const tokenA = tokenDataDeckA && tokenDataDeckA.access_token || null;
    const tokenB = tokenDataDeckB && tokenDataDeckB.access_token || null;
    return (
      <Grid>
        <Grid.Column >
          
            <Card.Group centered>

                <RedditUserDisplay
                  deckIndex={0}
                  accessToken={tokenA}
                  onAuthenticate={() => Reddit.launchAuthUrl(0)}
                  onClearToken={() => this.handleOnClearToken(0)}
                  onReadyStatusChanged={ready => this.onDeckReadyStatusChanged(0, ready)}
                  onUserIdChanged={userId => this.onDeckUserIdChanged(0, userId)}
                />

                <RedditUserDisplay
                  deckIndex={1}
                  accessToken={tokenB}
                  onAuthenticate={() => Reddit.launchAuthUrl(1)}
                  onClearToken={() => this.handleOnClearToken(1)}
                  onReadyStatusChanged={ready => this.onDeckReadyStatusChanged(1, ready)}
                  onUserIdChanged={userId => this.onDeckUserIdChanged(1, userId)}
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
