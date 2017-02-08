import { Provider, connect } from 'preact-redux';
import { h, render } from 'preact';

import { createStore } from 'redux'
import App from './components/App'
import accountApp from './reducers'

let store = createStore(accountApp)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
