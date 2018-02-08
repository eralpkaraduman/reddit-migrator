import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Button, Grid, Card } from 'semantic-ui-react';
import RedditUserDisplay from './RedditUserDisplay';
import * as Reddit from '../../RedditUtils';
import _ from 'underscore';

class AuthStep extends Component {

  state = {
    tokenDataDeckA: null,
    tokenDataDeckB: null
  }

  componentDidMount() {
    let hashJson = this.checkhashForAuthResponse();
    
    if (hashJson) {
      const {status, state} = hashJson;
      if (status === 'success') {
        const deckIndex = parseInt(state.split('DECK_')[1]);
        if (!_.isNaN(deckIndex)) {
          console.log(`received auth response for deck ${deckIndex}`);
          hashJson = _.omit(hashJson, 'state');
          hashJson = _.omit(hashJson, 'status');
          this.saveAuthResponseData(deckIndex, hashJson);
        }
        else {
          console.log(`received auth response for invalid deck index`);
        }
      }

      window.location.hash = '';
    }

    this.loadAuthDataFromLocalStorage();
  }

  checkhashForAuthResponse() {
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

  saveAuthResponseData(deckIndex, data) {
    localStorage.setItem(`REDDIT_TOKEN_DECK_${deckIndex}`, JSON.stringify(data));
  }

  loadAuthResponseData(deckIndex) {
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

  loadAuthDataFromLocalStorage() {
    const tokenDataDeckA = this.loadAuthResponseData(0);
    const tokenDataDeckB = this.loadAuthResponseData(1);
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
  
  beginGetToken = index => {
    const state = `DECK_${index}`;
    window.location = `http://localhost:3333?state=${state}`;
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
                  isDeckA
                  accessToken={tokenA}
                  onAuthenticate={() => this.beginGetToken(0)}
                />

                <RedditUserDisplay
                  accessToken={tokenB}
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
