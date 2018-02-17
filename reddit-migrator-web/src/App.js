import React, { Component } from 'react';
import { Icon, Step, Grid } from 'semantic-ui-react';
import _ from 'underscore';

import AuthStep from './steps/auth/AuthStep';
import SelectSubscriptionsState from './steps/selectSubscriptionsState/SelectSubscriptionsState';
import MoveState from './steps/moveState/MoveState';

const AppStep = {
  AUTH: 'AUTH',
  SELECT: 'SELECT',
  MOVE: 'MOVE',
};

const stepConfiguration = {
  [AppStep.AUTH]: {
    title: 'Authenticate',
    icon: 'key',
    description: 'Grant access to your Reddit accounts',
    component: AuthStep
  },
  [AppStep.SELECT]: {
    title: 'Select Subscriptions',
    icon: 'checkmark box',
    description: 'Choose subscriptions to move',
    component: SelectSubscriptionsState
  },
  [AppStep.MOVE]: {
    title: 'Move!',
    icon: 'truck',
    description: 'View progress of moving subscriptions',
    component: MoveState
  }
};

const initialState = {
  currentStepId: AppStep.AUTH,
  accessTokens: []
}

class App extends Component {
  state = {...initialState};

  handleOnStepCompleted = (data) => {
    switch (this.state.currentStepId) {

      case AppStep.AUTH:
        this.setState(() => ({
          accessTokens: data.accessTokens,
          currentStepId: AppStep.SELECT
        }));
        break;

      case AppStep.SELECT:
        console.log('handleOnStepCompleted of SELECT is not implemented');
        break;

      case AppStep.MOVE:
        console.log('handleOnStepCompleted of MOVE is not implemented');
        break;

    }
    this.setState(() => data);
  }

  render() {
    const {currentStepId} = this.state;
    const ContentComponent = stepConfiguration[currentStepId].component;
    const arrayOfSteps = _.keys(stepConfiguration).map(stepId => ({
      ...stepConfiguration[stepId],
      id: stepId
    }));

    return (
      <div style={{margin: 10}}>
        <Grid>
          <Grid.Column>
            <h1>Reddit Migrator</h1>
            <Step.Group fluid vertical={false} unstackable>
              {arrayOfSteps.map(step => 
                <Step
                  key={step.id}
                  completed={currentStepId > step.id}
                  active={currentStepId === step.id}
                >
                  <Icon name={step.icon} />
                  <Step.Content>
                    <Step.Title>{step.title}</Step.Title>
                    <Step.Description>{step.description}</Step.Description>
                  </Step.Content>
                </Step>
              )}
            </Step.Group>
            
            <ContentComponent
              accessTokens={this.state.accessTokens}
              onStepCompleted={this.handleOnStepCompleted}
            />
            
          </Grid.Column>
        </Grid>
      </div>
    );
  }
}

export default App;
