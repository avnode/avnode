import { h } from 'preact';
import Router from 'preact-router';

import Nav from './Nav';
import General from './General';
import Events from './Events';
import EventEdit from './event/Edit';
import Crews from './Crews';

const App = () => {
  return (
    <div>
      <Nav />
      <hr />
      <Router>
        <General path="/account/general" />
        <Events path="/account/events" />
        <EventEdit path="/account/events/:_id" />
        <Crews path="/account/crews" />
      </Router>
    </div>
  );
};

export default App;
