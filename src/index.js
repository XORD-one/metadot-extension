/* global chrome */
import React from 'react';
import ReactDOM from 'react-dom';
import './App.css';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { Provider } from 'react-redux';

//REDUX
import store, { persistor } from './redux/store';

// REDUX-PERSIST
import { PersistGate } from 'redux-persist/integration/react';

// fonts
import './assets/fonts/Roboto-Bold.ttf';
import './assets/fonts/Roboto-Regular.ttf';

import { BrowserRouter as Router } from 'react-router-dom'

ReactDOM.render(
  <React.StrictMode>
    <Provider store={store}>
      <PersistGate loading={null} persistor={persistor}>  
        <Router>
          <App />
        </Router>
      </PersistGate>
    </Provider>
  </React.StrictMode>,
  document.getElementById('root'),
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
