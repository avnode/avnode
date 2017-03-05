import { h } from 'preact';
import Router from 'preact-router';

import Nav from './Nav';
import General from './General';
import Events from './Events';
import EventEdit from './event/Edit';
import Crews from './Crews';
import CrewEdit from './crew/Edit';

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
        <CrewEdit path="/account/crews/:_id" />
      </Router>
    </div>
  );
};

export default App;
