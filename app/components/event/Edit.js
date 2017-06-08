import { h } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';
import {
  editEvent,
  addEventImage,
  addEventTeaserImage,

  suggestEventOrganiser,
  addEventOrganiser,
  removeEventOrganiser

} from '../../reducers/actions';
import ImageDropzone from '../ImageDropzone';

const Crew = injectIntl(({crew, onDelete, intl}) => {
  return (
    <li className="list-group-item justify-content-between">
      <span>
      {crew.name}
      </span>
      { crew.deletionInProgress ?
        <button
          type="button"
          className="btn btn-danger disabled"
        >
          <i className="fa fa-fw fa-spinner fa-pulse"></i>
        </button>
        :
        <button
          type="button"
          className="btn btn-danger"
          onClick={onDelete}
        >
          <i className="fa fa-trash"></i>
        </button>
      }
    </li>
  );
});

const Organiser = injectIntl(({organiser, me, onDelete, intl}) => {
  const meLabel = intl.formatMessage({
    id: 'event.edit.form.organiser.met',
    defaultMessage: 'Me'
  });
  return (
    <li className="list-group-item justify-content-between">
      <span>
        {`${organiser.stagename} `}
        { (organiser._id === me) ?
          <i className="badge badge-default badge-pill">{meLabel}</i>
          : null
        }
      </span>
      { organiser.deletionInProgress ?
        <button
          type="button"
          className="btn btn-danger disabled"
        >
          <i className="fa fa-fw fa-spinner fa-pulse"></i>
        </button>
        :
        <button
          type="button"
          className="btn btn-danger"
          onClick={onDelete}
        >
          <i className="fa fa-trash"></i>
        </button>
      }
    </li>
  );
});

let EventForm = props => {
  const { handleSubmit, dispatch, event, user } = props;

  const organiserSuggestions = props.user._organiserSuggestions || [];

  const findOrganiser = (e) => {
    e.preventDefault();
    if (e.target.value.length > 2) {
      return dispatch(suggestEventOrganiser(event._id, e.target.value));
    } // FIXME: handle reset
  };

  const addOrganiser = (organiserId) => (e) => {
    e.preventDefault();
    return dispatch(addEventOrganiser(event._id, organiserId));
  };

  const removeOrganiser = (organiserId) => (e) => {
    e.preventDefault();
    return dispatch(removeEventOrganiser(event._id, organiserId));
  };

  const onImageDrop = (eventId) => (files, _something, _ev) => {
    const file = files[0];
    return dispatch(addEventImage(eventId, file));
  };

  const onTeaserImageDrop = (eventId) => (files, _something, _ev) => {
    const file = files[0];
    return dispatch(addEventTeaserImage(eventId, file));
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
          <label htmlFor="teaserimage">
            <FormattedMessage
              id="event.edit.form.label.teaserimage"
              defaultMessage="TeaserImage"
            />
          </label>
          <ImageDropzone
            imageUploadInProgress={(event && event.imageUploadInProgress)}
            onDrop={onTeaserImageDrop(props._id)}
          />
          { event && event.teaserImage ?
            <div><img
              className="img-thumbnail mt-2"
              src={event.teaserImage.publicUrl}
              alt={`image of ${event.title}`}
              /></div> :
            null
          }
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
          <label htmlFor="organisers">
            <FormattedMessage
              id="event.edit.form.label.organisers"
              defaultMessage="Organisers"
            />
          </label>
          <ul className="list-group">
            { event && event.organisers && event.organisers.map((organiser) => (
              <Organiser
                organiser={organiser}
                me={props.user._id}
                onDelete={removeOrganiser(organiser.id)}
              />
              ))
            }
          </ul>
        </div>

        <div className="form-group">
          <label htmlFor="organiser">
            <FormattedMessage
              id="event.edit.form.label.suggestOrganisers"
              defaultMessage="Assign organisers"
            />
          </label>
          <input
            className="form-control"
            type="text"
            autoComplete="off"
            placeholder={props.intl.formatMessage({
              id: 'event.edit.form.label.suggestOrganisers',
              defaultMessage: 'Type to find organisers…'
            })}
            onKeyUp={ findOrganiser }
          />
          <div className="mt-1 list-group">
            { event && event._organiserSuggestionInProgress ?
              <div className="list-group-item">
                <i className="fa fa-fw fa-spinner fa-pulse"></i>
                {' '}
                <FormattedMessage
                  id="organiser.edit.form.label.suggestOrganisersLoading"
                  defaultMessage="Finding organisers…"
                />
              </div> :
              null
            }
            { organiserSuggestions.map((c) => (
              <button
                type="button"
                className="list-group-item list-group-item-action"
                onClick={ addOrganiser(c.id) }
              >
                  {c.stagename} ({c.name})
                </button>
              ))
            }
          </div>
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
