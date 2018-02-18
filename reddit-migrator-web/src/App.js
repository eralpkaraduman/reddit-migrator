import React, { Component } from 'react';
import { Icon, Step, Grid } from 'semantic-ui-react';
import _ from 'underscore';
import { withRouter } from 'react-router'

import AuthStep from './steps/auth/AuthStep';
import SelectSubscriptionsState from './steps/selectSubscriptionsState/SelectSubscriptionsState';
import MoveState from './steps/moveState/MoveState';

const AppStep = {
  AUTH: 'auth',
  SELECT: 'select',
  MOVE: 'move',
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

const arrayOfSteps = _.keys(stepConfiguration).map(stepId => ({
  ...stepConfiguration[stepId],
  id: stepId
}));

const initialState = {
  accessTokens: []
}

class App extends Component {
  state = {...initialState};

  componentDidUpdate() {
  }

  hashPathToStepId() {
    const {location} = this.props;
    const pathname = (location && location.pathname) || `/`;
    const pathWithoutSlash = pathname.split('/')[1];
    const compareIdToPath = stepId => stepId === pathWithoutSlash;
    return _.values(AppStep).find(compareIdToPath) || AppStep.AUTH;
  }

  handleOnStepCompleted = (data) => {
    const currentStepId = this.hashPathToStepId();
    switch (currentStepId) {

      case AppStep.AUTH:
        this.setState(() => ({
          accessTokens: data.accessTokens,
        }));
        window.location.hash = AppStep.SELECT;
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
    const currentStepId = this.hashPathToStepId();
    console.log({currentStepId});
    const ContentComponent = stepConfiguration[currentStepId].component;
    
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

export default withRouter(App);
