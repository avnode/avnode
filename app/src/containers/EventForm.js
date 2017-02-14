import { h } from 'preact';
import { connect } from 'preact-redux'
import { Field, reduxForm } from 'redux-form';

import { editEvent, getEvent } from '../reducers/actions'

let EventForm = props => {
  const { handleSubmit } = props
  return (
    <form onSubmit={handleSubmit}>
      <Field name="id" component="input" type="hidden"/>
      <div>
        <label htmlFor="title">Title</label>
        <Field name="title" component="input" type="text" value={props.title}/>
      </div>
      <button type="submit">Submit</button>
    </form>
  )
}

EventForm = reduxForm({
  form: 'event',
  onSubmit: (props, dispatch) => {
    dispatch(editEvent(props));
  }
})(EventForm);

EventForm = connect(
  state => ({
    initialValues: state.events[0]
  }),
  { load: getEvent }
)(EventForm);

export default EventForm;
