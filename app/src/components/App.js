import { h, Component } from 'preact';

import AddEvent from '../containers/AddEvent'
import Events from '../components/Events'

const App = () => (
  <div>
    <h1>Wuff</h1>
    <AddEvent />
    <Events />
  </div>
)

export default App
