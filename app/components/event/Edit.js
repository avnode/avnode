import { h } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';

import Venue from '../VenueContainer';

import {
  editEvent,
  addEventImage,
  addEventTeaserImage,

  suggestEventPerformance,
  addEventPerformance,
  removeEventPerformance,

  suggestEventOrganizer,
  addEventOrganizer,
  removeEventOrganizer,

  suggestEventOrganizingCrew,
  addEventOrganizingCrew,
  removeEventOrganizingCrew

} from '../../reducers/actions';
import ImageDropzone from '../ImageDropzone';

const OrganizingCrew = injectIntl(({crew, onDelete, intl}) => {
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

const Performance = injectIntl(({performance, onDelete, intl}) => {
  return (
    <li className="list-group-item justify-content-between">
      <span>
        {performance.title}
      </span>
      { performance.deletionInProgress ?
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

const Organizer = injectIntl(({organizer, me, onDelete, intl}) => {
  const meLabel = intl.formatMessage({
    id: 'event.edit.form.organizer.met',
    defaultMessage: 'Me'
  });
  return (
    <li className="list-group-item justify-content-between">
      <span>
        {`${organizer.stagename} `}
        { (organizer._id === me) ?
          <i className="badge badge-default badge-pill">{meLabel}</i>
          : null
        }
      </span>
      { organizer.deletionInProgress ?
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

  const performanceSuggestions = props.user._performanceSuggestions || [];

  const findPerformance = (e) => {
    e.preventDefault();
    if (e.target.value.length > 2) {
      return dispatch(suggestEventPerformance(event._id, e.target.value));
    } // FIXME: handle reset
  };

  const addPerformance = (performanceId) => (e) => {
    e.preventDefault();
    return dispatch(addEventPerformance(event._id, performanceId));
  };

  const removePerformance = (performanceId) => (e) => {
    e.preventDefault();
    return dispatch(removeEventPerformance(event._id, performanceId));
  };

  const organizerSuggestions = props.user._organizerSuggestions || [];

  const findOrganizer = (e) => {
    e.preventDefault();
    if (e.target.value.length > 2) {
      return dispatch(suggestEventOrganizer(event._id, e.target.value));
    } // FIXME: handle reset
  };

  const addOrganizer = (organizerId) => (e) => {
    e.preventDefault();
    return dispatch(addEventOrganizer(event._id, organizerId));
  };

  const removeOrganizer = (organizerId) => (e) => {
    e.preventDefault();
    return dispatch(removeEventOrganizer(event._id, organizerId));
  };

  const organizingCrewSuggestions = props.user._organizingCrewSuggestions || [];

  const findOrganizingCrew = (e) => {
    e.preventDefault();
    if (e.target.value.length > 2) {
      return dispatch(suggestEventOrganizingCrew(event._id, e.target.value));
    } // FIXME: handle reset
  };

  const addOrganizingCrew = (organizingCrewId) => (e) => {
    e.preventDefault();
    return dispatch(addEventOrganizingCrew(event._id, organizingCrewId));
  };

  const removeOrganizingCrew = (organizingCrewId) => (e) => {
    e.preventDefault();
    return dispatch(removeEventOrganizingCrew(event._id, organizingCrewId));
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

        <div className="form-check">
          <label className="form-check-label">
            <Field
              className="form-check-input form-control-lg"
              name="is_public"
              component="input"
              type="checkbox"
              value={props.is_public}
            />
            <FormattedMessage
              id="event.edit.form.label.is_public"
              defaultMessage="Event is public"
            />
          </label>
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
          <label htmlFor="performances">
            <FormattedMessage
              id="event.edit.form.label.performances"
              defaultMessage="Performances"
            />
          </label>
          <ul className="list-group">
            { event && event.performances && event.performances.map((performance) => (
              <Performance
                performance={performance}
                onDelete={removePerformance(performance.id)}
              />
              ))
            }
          </ul>
        </div>

        <div className="form-group">
          <label htmlFor="performance">
            <FormattedMessage
              id="event.edit.form.label.suggestPerformances"
              defaultMessage="Assign performances"
            />
          </label>
          <input
            className="form-control"
            type="text"
            autoComplete="off"
            placeholder={props.intl.formatMessage({
              id: 'event.edit.form.label.suggestPerformances',
              defaultMessage: 'Type to find performances…'
            })}
            onKeyUp={ findPerformance }
          />
          <div className="mt-1 list-group">
            { event && event._performanceSuggestionInProgress ?
              <div className="list-group-item">
                <i className="fa fa-fw fa-spinner fa-pulse"></i>
                {' '}
                <FormattedMessage
                  id="event.edit.form.label.suggestPerformancesLoading"
                  defaultMessage="Finding performances…"
                />
              </div> :
              null
            }
            { performanceSuggestions.map((c) => (
              <button
                type="button"
                className="list-group-item list-group-item-action"
                onClick={ addPerformance(c.id) }
              >
                  {c.title}
                </button>
              ))
            }
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="organizers">
            <FormattedMessage
              id="event.edit.form.label.organizers"
              defaultMessage="Organizers"
            />
          </label>
          <ul className="list-group">
            { event && event.organizers && event.organizers.map((organizer) => (
              <Organizer
                organizer={organizer}
                me={props.user._id}
                onDelete={removeOrganizer(organizer.id)}
              />
              ))
            }
          </ul>
        </div>

        <div className="form-group">
          <label htmlFor="organizer">
            <FormattedMessage
              id="event.edit.form.label.suggestOrganizers"
              defaultMessage="Assign organizers"
            />
          </label>
          <input
            className="form-control"
            type="text"
            autoComplete="off"
            placeholder={props.intl.formatMessage({
              id: 'event.edit.form.label.suggestOrganizers',
              defaultMessage: 'Type to find organizers…'
            })}
            onKeyUp={ findOrganizer }
          />
          <div className="mt-1 list-group">
            { event && event._organizerSuggestionInProgress ?
              <div className="list-group-item">
                <i className="fa fa-fw fa-spinner fa-pulse"></i>
                {' '}
                <FormattedMessage
                  id="event.edit.form.label.suggestOrganizersLoading"
                  defaultMessage="Finding organizers…"
                />
              </div> :
              null
            }
            { organizerSuggestions.map((c) => (
              <button
                type="button"
                className="list-group-item list-group-item-action"
                onClick={ addOrganizer(c.id) }
              >
                  {c.stagename} ({c.name})
                </button>
              ))
            }
          </div>
        </div>

        <div className="form-group">
          <label htmlFor="organizingCrews">
            <FormattedMessage
              id="event.edit.form.label.organizingCrews"
              defaultMessage="OrganizingCrews"
            />
          </label>
          <ul className="list-group">
            { event && event.organizing_crews && event.organizing_crews.map((crew) => (
              <OrganizingCrew
                crew={crew}
                onDelete={removeOrganizingCrew(crew.id)}
              />
              ))
            }
          </ul>
        </div>

        <div className="form-group">
          <label htmlFor="organizingCrew">
            <FormattedMessage
              id="event.edit.form.label.suggestOrganizingCrews"
              defaultMessage="Assign an organizing crew"
            />
          </label>
          <input
            className="form-control"
            type="text"
            autoComplete="off"
            placeholder={props.intl.formatMessage({
              id: 'event.edit.form.label.suggestOrganizingCrews',
              defaultMessage: 'Type to find crews…'
            })}
            onKeyUp={ findOrganizingCrew }
          />
          <div className="mt-1 list-group">
            { event && event._organizingCrewSuggestionInProgress ?
              <div className="list-group-item">
                <i className="fa fa-fw fa-spinner fa-pulse"></i>
                {' '}
                <FormattedMessage
                  id="event.edit.form.label.suggestOrganizingCrewsLoading"
                  defaultMessage="Finding organizingCrews…"
                />
              </div> :
              null
            }
            { organizingCrewSuggestions.map((c) => (
              <button
                type="button"
                className="list-group-item list-group-item-action"
                onClick={ addOrganizingCrew(c.id) }
              >
                  {c.stagename} ({c.name})
                </button>
              ))
            }
          </div>
        </div>

        <Venue event={props.event} />

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
