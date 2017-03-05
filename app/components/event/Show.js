import { h } from 'preact';
import { connect } from 'preact-redux';

import { deleteEvent } from '../../reducers/actions';

const EventShow = ({event, dispatch}) => {
  return (
    <li className="list-group-item justify-content-between">
      {event.title}
      <span>
        <a className="btn btn-secondary" href="#" onClick={() => { dispatch(deleteEvent(event._id)); }}><i className="fa fa-trash"></i></a>
        <a className="btn btn-secondary" href={'/account/events/' + event._id}><i className="fa fa-edit"></i></a>
      </span>
    </li>
  );
};

export default connect()(EventShow);
