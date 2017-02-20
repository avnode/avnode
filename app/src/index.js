import { Provider, connect } from 'preact-redux';
import { h, render } from 'preact';
import { createStore, applyMiddleware, compose } from 'redux'
import thunkMiddleware from 'redux-thunk'
import createLogger from 'redux-logger'

import App from './components/App'
import reducer from './reducers'
import { fetchUser } from './reducers/actions'

const loggerMiddleware = createLogger()

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  )
)
store.dispatch(fetchUser())
render(
  <Provider store={store}>
    <App />
  </Provider>,
  document.getElementById('app')
)
