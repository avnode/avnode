import { Provider, connect } from 'preact-redux';
import { h, render } from 'preact';
import { createStore } from 'redux'

import App from './components/App'
import reducer from './reducers'

let store = createStore(reducer)

render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
