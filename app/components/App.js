import { h } from 'preact';
import Router from 'preact-router';

import Nav from './Nav';
import Profile from './GeneralContainer';
import Events from './Events';
import EventEdit from './event/Edit';
import Crews from './Crews';
import CrewEdit from './crew/Edit';
import Preferences from './PreferencesContainer';

const App = () => {
  return (
    <div>
      <Nav />
      <hr />
      <Router>
        <Profile path="/account/profile" />
        <Events path="/account/events" />
        <EventEdit path="/account/events/:_id" />
        <Crews path="/account/crews" />
        <CrewEdit path="/account/crews/:_id" />
        <Preferences path="/account/preferences" />
      </Router>
    </div>
  );
};

export default App;
