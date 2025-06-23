import './ace-config';  // Import Ace configuration first
import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import * as serviceWorker from './serviceWorker';
import ResizeObserverWrapper from './components/ResizeObserverWrapper';

ReactDOM.render(
  <React.StrictMode>
    <ResizeObserverWrapper>
    <App />
    </ResizeObserverWrapper>
  </React.StrictMode>,
  document.getElementById('root')
);

// If you want your app to work offline and load faster, you can change
// unregister() to register() below. Note this comes with some pitfalls.
// Learn more about service workers: https://bit.ly/CRA-PWA
serviceWorker.unregister();
