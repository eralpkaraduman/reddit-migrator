import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Button,
  Grid,
  Card,
  Message,
  Container,
  Header
} from 'semantic-ui-react';

import UserSubscriptionList from './UserSubscriptionList';

class SelectSubscriptionsState extends Component {

  static propTypes = {
    accessTokens: PropTypes.array.isRequired,
    onStepCompleted: PropTypes.func.isRequired
  };

  render() {
    
    return (
      <Grid centered>
        <Grid.Row centered divided columns={2}>

          <Grid.Column stretched>
            <UserSubscriptionList alignRight/>
          </Grid.Column>

          <Grid.Column stretched>
            <UserSubscriptionList />
          </Grid.Column>

        </Grid.Row>
      </Grid>
    );
  }
}

SelectSubscriptionsState.propTypes = {

};

export default SelectSubscriptionsState;