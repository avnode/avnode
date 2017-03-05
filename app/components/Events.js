import { h } from 'preact';
import { connect } from 'preact-redux';

import EventAdd from './event/Add';
import EventShow from './event/Show';

const Events = ({ events, ajaxInProgress })  => {
  return (
    <div>
      <EventAdd ajaxInProgress={ajaxInProgress} />
      <hr />
      <ul className="list-group">
        {events.map((event) =>
          <EventShow event={event} />
        )}
      </ul>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    events: state.user.events,
    ajaxInProgress: state.user.ajaxInProgress
  };
};

export default connect(mapStateToProps)(Events);
