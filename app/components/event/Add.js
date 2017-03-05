import { h } from 'preact';
import { connect } from 'preact-redux';

import { addEvent } from '../../reducers/actions';

const EventAdd = ({ ajaxInProgress, dispatch }) => {
  let input;
  return (
    <div>
      <form onSubmit={e => {
        e.preventDefault();
        //if (!input.value.trim()) {
        //  return
        //}
        dispatch(addEvent(input.value));
        input.value = '';
      }}>
        <div className="input-group">
          <input className="form-control" ref={node => {
            input = node;
          }} />
        { ajaxInProgress ?
          <button type="button" className="input-group-addon disabled">
            Wait for it…
          </button> :
          <button type="submit" className="input-group-addon">
            Add Event
          </button>
        }
        </div>
      </form>
    </div>
  );
};

export default connect()(EventAdd);
