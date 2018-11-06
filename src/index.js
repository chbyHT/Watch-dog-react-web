import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';


import RouterPage from './components/RouterPage';
import App from './components/App';
import AuthExample from './components/AuthExample';

import './components/App.css';
// import registerServiceWorker from './registerServiceWorker';

ReactDOM.render(
  <div>
    <AuthExample/>
  </div>
  , document.getElementById('root'));
// registerServiceWorker();
