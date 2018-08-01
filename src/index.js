import React from 'react';
import { render } from 'react-dom';
import { Provider } from 'react-redux';
import { ConnectedRouter } from 'connected-react-router';
import store, { history } from './store';
import App from './containers/app';

//jQuery
//https://jquery.com/
//import $ from 'jquery';

//Bootstrap
//https://getbootstrap.com/docs/3.3/css/
//Needed for react-bootstrap
import 'bootstrap/dist/css/bootstrap.min.css';
import './styles/bootstrap-overrides.css';

const target = document.querySelector('#root');

render(
  <Provider store={store}>
    <ConnectedRouter history={history}>
      <div>
        <App />
      </div>
    </ConnectedRouter>
  </Provider>,
  target
);
