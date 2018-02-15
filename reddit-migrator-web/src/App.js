import React, { Component } from 'react';
import { Icon, Step, Grid } from 'semantic-ui-react';
import _ from 'underscore';

import AuthStep from './steps/auth/AuthStep';

const AppStep = {
  AUTH: 'AUTH',
  SELECT: 'SELECT',
  MOVE: 'AUTH',
}

const getIndexOfStepId = stepId => _.indexOf(Object.keys(Step), stepId);

const steps = [
  {
    id: AppStep.AUTH,
    title: 'Authenticate',
    icon: 'key',
    description: 'Grant access to your Reddit accounts',
    component: AuthStep
  },
  {
    id: AppStep.SELECT,
    title: 'Select Subscriptions',
    icon: 'checkmark box',
    description: 'Choose subscriptions to move',
    component: AuthStep
  },
  {
    id: AppStep.MOVE,
    title: 'Move!',
    icon: 'truck',
    description: 'View progress of moving subscriptions',
    component: AuthStep
  }
];

const initialState = {
  currentStepIndex: 0,
  accessTokens: []
}

class App extends Component {
  
  state = {...initialState};

  handleOnStepCompleted = (data) => {
    const {currentStepIndex} = this.state;
    const currentStepId = steps[currentStepIndex].id;
    switch (currentStepId) {
      case AppStep.AUTH:
        const {accessTokens} = data;
        this.setState(() => ({
          accessTokens,
          currentStepIndex: getIndexOfStepId(AppStep.SELECT)
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
    const {currentStepIndex} = this.state;
    const ContentComponent = steps[this.state.currentStepIndex].component;
    return (
      <div style={{margin: 10}}>
        <Grid>
          <Grid.Column>
            <h1>Reddit Migrator</h1>
            <Step.Group fluid vertical={false} unstackable>
              {steps.map((step, stepIndex) => 
                <Step
                  key={stepIndex}
                  completed={this.state.currentStepIndex > stepIndex}
                  active={this.state.currentStepIndex === stepIndex}
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
