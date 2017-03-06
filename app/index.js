import { Provider } from 'preact-redux';
import { h, render } from 'preact';
import { createStore, applyMiddleware, compose } from 'redux';
import thunkMiddleware from 'redux-thunk';
import createLogger from 'redux-logger';
import { IntlProvider, addLocaleData } from 'preact-intl';

import reducer from './reducers';
import { fetchUser } from './reducers/actions';

import messagesEN from './locales/en.json';
import messagesDE from './locales/de.json';
// FIXME: Import locale date for every supported locale…
import en from 'react-intl/locale-data/en';
import de from 'react-intl/locale-data/de';
addLocaleData([...en, ...de]);

const loggerMiddleware = createLogger();

const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;
let store = createStore(
  reducer,
  composeEnhancers(
    applyMiddleware(
      thunkMiddleware,
      loggerMiddleware
    )
  )
);

let root;

const getLocale = () => {
  // FIXME: Read `navigator.language` and `navigator.languages?
  if (navigator.language !== null) {
    return navigator.language.replace(/\-.*$/, '');
  } else {
    return 'en';
  }
};

const init = () => {
  const App = require('./components/App').default;
  root = render(
    <IntlProvider
      defaultLocale="en"
      locale={getLocale()}
      messages={messagesEN}
    >
      <Provider store={store}>
        <App />
      </Provider>
    </IntlProvider>
    ,
    document.getElementById('app'),
    root
  );
};

if (module.hot) {
  module.hot.accept('./components/App', () => {
    return requestAnimationFrame(init);
  });
}

init();
store.dispatch(fetchUser());
