import { h } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';
import { editEvent, addEventImage } from '../../reducers/actions';
import ImageDropzone from '../ImageDropzone';

let EventForm = props => {
  const { handleSubmit, dispatch, event, user } = props;

  const onImageDrop = (eventId) => (files, _something, _ev) => {
    const file = files[0];
    return dispatch(addEventImage(eventId, file));
  };

  return (
    <Layout>
      <form onSubmit={handleSubmit}>
        <Field
          name="_id"
          component="input"
          type="hidden"
        />
        <div className="form-group">
          <label htmlFor="title">
            <FormattedMessage
              id="event.edit.form.label.title"
              defaultMessage="Name"
            />
          </label>
          <Field
            className="form-control form-control-lg"
            name="title"
            component="input"
            type="text"
            value={props.title}
          />
        </div>

        <div className="form-check">
          <label className="form-check-label">
            <Field
              className="form-check-input form-control-lg"
              name="is_open"
              component="input"
              type="checkbox"
              value={props.is_open}
            />
            <FormattedMessage
              id="event.edit.form.label.is_open"
              defaultMessage="Call is open"
            />
          </label>
        </div>

        <div className="form-group">
          <label htmlFor="image">
            <FormattedMessage
              id="event.edit.form.label.image"
              defaultMessage="Image"
            />
          </label>
          <ImageDropzone
            imageUploadInProgress={(event && event.imageUploadInProgress)}
            onDrop={onImageDrop(props._id)}
          />
          { event && event.image ?
            <div><img
              className="img-thumbnail mt-2"
              src={event.image.publicUrl}
              alt={`image of ${event.title}`}
              /></div> :
            null
          }
        </div>

        <div className="form-group">
          <label htmlFor="about">
            <FormattedMessage
              id="event.edit.form.label.about"
              defaultMessage="About"
            />
          </label>
          <Field
            className="form-control"
            name="about"
            component="textarea"
            value={props.about}
          />
        </div>
        <hr />
        <div class="row">
          <div class="col-6">
            <button
              className="btn btn-success"
              type="submit"
            >
              <FormattedMessage
                id="general.form.save"
                defaultMessage="Save"
              />
            </button>
          </div>
          <div class="col-6 text-right">
            <a href="/account/events" class="btn btn-warning">
              <FormattedMessage
                id="general.cancel"
                defaultMessage="Cancel"
              />
            </a>
          </div>
        </div>
      </form>
    </Layout>
  );
};

EventForm = injectIntl(reduxForm({ form: 'event' })(EventForm));

const EditEvent = props => {
  const onSubmit = (props, dispatch) => {
    dispatch(editEvent(props));
  };
  const onSubmitSuccess = () => {
    route('/account/events');
  };
  return (
    <EventForm
      initialValues={props.event}
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
      {...props}
    />
  );
};

const mapStateToProps = (state, props) => {
  return {
    event: (state.user.events.find(event => { return event._id === props._id; })),
    user: state.user
  };
};

export default connect(mapStateToProps)(EditEvent);
