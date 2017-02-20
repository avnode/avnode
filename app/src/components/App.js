import { h } from 'preact';
import Router from 'preact-router';

import Events from './Events'
import EventEdit from './event/Edit'

const App = () => (
  <div>
    <Router>
      <Events path="/events" />
      <EventEdit path="/events/:_id" />
    </Router>
  </div>
)

export default App
