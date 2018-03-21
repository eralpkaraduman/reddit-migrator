import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Card, Message } from 'semantic-ui-react';
import RedditUserDisplay from './RedditUserDisplay';
import * as Reddit from '../../RedditUtils';
import _ from 'underscore';
import R from 'ramda';

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
      window.location.hash = ''; // removes the hash and reloads the page
    }

    this.loadAuthDataFromLocalStorage();
  }

  loadAuthDataFromLocalStorage() {
    const tokenDataDeckA = Reddit.loadAuthResponseDataFromLocalStorage(0);
    const tokenDataDeckB = Reddit.loadAuthResponseDataFromLocalStorage(1);

    const refreshDeckSession = deckData => {
      const {access_token, refresh_token} = deckData;
      return Reddit.refreshSession(access_token, refresh_token);
    }

    // TODO: Maybe refresh these tokens here?
    refreshDeckSession(tokenDataDeckA)
    .then(refreshDeckSession(tokenDataDeckB))
    .then(() => this.setState(() => ({
      tokenDataDeckA,
      tokenDataDeckB 
    })));
  }

  handleOnContinueClicked = () => {
    this.props.onStepCompleted({
      accessTokens: [
        this.state.tokenDataDeckA,
        this.state.tokenDataDeckB,
      ]
    });
  }

  handleOnClearToken = (deckIndex) => {
    Reddit.removeAuthResponseDataFromLocalStorage(deckIndex);
    this.loadAuthDataFromLocalStorage();
  }

  onDeckReadyStatusChanged = (deckIndex, ready) => {
    if (deckIndex === 0) {
      this.setState(() => ({ isDeckAReady: ready }));
    }
    else if (deckIndex === 1) {
      this.setState(() => ({ isDeckBReady: ready }));
    }
  }

  onDeckUserIdChanged = (deckIndex, userId) => {
    if (deckIndex === 0) {
      this.setState(() => ({ userIdDeckA: userId }));
    }
    else if (deckIndex === 1) {
      this.setState(() => ({ userIdDeckB: userId }));
    }
  }

  getError = () => {
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

    if (!hasBothTokens) {
      return 'One of the decks missing access token.';
    }
    else if (!hasBothUserIds) {
      return 'One of the user ids is missing.';
    }
    else if (!bothAreReady) {
      return 'One of the decks is not ready.';
    }
    else if (!userIdsAreDifferent) {
      return 'Connected users in both decks are the same.';
    }
    else {
      return null;
    }
  }

  render() {
    const { tokenDataDeckA, tokenDataDeckB } = this.state;
    const tokenA = tokenDataDeckA && tokenDataDeckA.access_token || null;
    const tokenB = tokenDataDeckB && tokenDataDeckB.access_token || null;
    const error = this.getError();
    const canContinue = !!error;
    return (
      <Grid>
        <Grid.Column >

          <Card.Group centered>

            <RedditUserDisplay
              deckIndex={ 0 }
              accessToken={ tokenA }
              onAuthenticate={ () => Reddit.launchAuthUrl(0) }
              onClearToken={ () => this.handleOnClearToken(0) }
              onReadyStatusChanged={ ready => this.onDeckReadyStatusChanged(0, ready) }
              onUserIdChanged={ userId => this.onDeckUserIdChanged(0, userId) }
            />

            <RedditUserDisplay
              deckIndex={ 1 }
              accessToken={ tokenB }
              onAuthenticate={ () => Reddit.launchAuthUrl(1) }
              onClearToken={ () => this.handleOnClearToken(1) }
              onReadyStatusChanged={ ready => this.onDeckReadyStatusChanged(1, ready) }
              onUserIdChanged={ userId => this.onDeckUserIdChanged(1, userId) }
            />

          </Card.Group>

          { error &&
            <Message negative>
              <Message.Header>Can't continue yet!</Message.Header>
              <p>{ error }</p>
            </Message>
          }

          <Button
            primary
            floated='right'
            disabled={ canContinue }
            style={ { marginTop: 12 } }
            onClick={ this.handleOnContinueClicked }>
            Continue
          </Button>

          {/* <Button
            primary
            floated='right'
            style={ { marginTop: 12 } }
            onClick={ this.handleOnContinueClicked }>
            ContinueLOL
          </Button> */}
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
