import React, { Component } from 'react';
import { Menu, Icon, Step } from 'semantic-ui-react';

class App extends Component {

  handleTitleClick = () => {

  }

  render() {
    return (
      <div style={{margin: 10}}>
        <Menu>
          <Menu.Item
            name='Reddit Migrator'
            active={false}
            onClick={this.handleTitleClick}
          />
        </Menu>

        <Step.Group>
          <Step>
            <Icon name='key' />
            <Step.Content>
              <Step.Title>Authenticate</Step.Title>
              <Step.Description>Grant access to your Reddit accounts</Step.Description>
            </Step.Content>
          </Step>

          <Step>
            <Icon name='checkmark box' />
            <Step.Content>
              <Step.Title>Select Subscriptions</Step.Title>
              <Step.Description>Choose subscriptions to move</Step.Description>
            </Step.Content>
          </Step>

          <Step>
            <Icon name='truck' />
            <Step.Content>
              <Step.Title>Move!</Step.Title>
              <Step.Description>View progress of moving subscriptions</Step.Description>
            </Step.Content>
          </Step>

        </Step.Group>
      </div>
    );
  }
}

export default App;
