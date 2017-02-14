import { h, Component } from 'preact';
import Router from 'preact-router';

import Events from './Events'
import EditEvent from './EditEvent'

const App = () => (
  <div>
    <Router>
      <Events path="/events" />
      <EditEvent path="/events/:id" />
    </Router>
  </div>
)

export default App
