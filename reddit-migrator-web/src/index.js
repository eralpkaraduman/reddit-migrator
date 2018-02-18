import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';
import 'semantic-ui-css/semantic.min.css';
import { HashRouter } from 'react-router-dom'

ReactDOM.render((
    <HashRouter hashType='noslash'>
      <App />
    </HashRouter>
  ), 
  document.getElementById('root')
);

registerServiceWorker();
