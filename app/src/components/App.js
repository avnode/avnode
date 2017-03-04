import { h } from 'preact';
import Router from 'preact-router';

import Events from './Events'
import EventEdit from './event/Edit'

const App = () => {
  return (
    <div>
      <Router>
        <Events path="/account/events" />
        <EventEdit path="/account/events/:_id" />
      </Router>
    </div>
  )
}

export default App
