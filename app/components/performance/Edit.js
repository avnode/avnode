import { h } from 'preact';
import { connect } from 'preact-redux';
import { route } from 'preact-router';
import { Field, reduxForm } from 'redux-form';
import { injectIntl, FormattedMessage } from 'preact-intl';

import Layout from '../Layout';
import Video from '../Video';

import {
  editPerformance,
  addPerformanceImage,
  addPerformanceTeaserImage,
  addPerformanceVideo,
  suggestPerformanceCrew,
  addPerformanceCrew,
  removePerformanceCrew
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

let PerformanceForm = props => {
  const { handleSubmit, dispatch, performance, user, intl } = props;
  const crewSuggestions = props.user._crewSuggestions || [];

  const findCrew = (e) => {
    e.preventDefault();
    if (e.target.value.length > 2) {
      return dispatch(suggestPerformanceCrew(performance._id, e.target.value));
    } // FIXME: handle reset
  };

  const addCrew = (crewId) => (e) => {
    e.preventDefault();
    return dispatch(addPerformanceCrew(performance._id, crewId));
  };

  const removeCrew = (crewId) => (e) => {
    e.preventDefault();
    return dispatch(removePerformanceCrew(performance._id, crewId));
  };

  const onImageDrop = (performanceId) => (files, _something, _ev) => {
    const file = files[0];
    return dispatch(addPerformanceImage(performanceId, file));
  };

  const onTeaserImageDrop = (performanceId) => (files, _something, _ev) => {
    const file = files[0];
    return dispatch(addPerformanceTeaserImage(performanceId, file));
  };

  let videoLink; // FIXME

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
              id="performance.edit.form.label.title"
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
          <label htmlFor="teaserImage">
            <FormattedMessage
              id="performance.edit.form.label.teaserimage"
              defaultMessage="Teaser Image"
            />
          </label>
          { performance && performance.teaserImage ?
            <img
              className="img-thumbnail mb-3"
              src={performance.teaserImage.publicUrl}
              alt={`image of ${performance.title}`}
              /> :
            null
          }
          <ImageDropzone
            imageUploadInProgress={(performance && performance.imageUploadInProgress)}
            onDrop={onTeaserImageDrop(props._id)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="image">
            <FormattedMessage
              id="performance.edit.form.label.image"
              defaultMessage="Image"
            />
          </label>
          { performance && performance.image ?
            <img
              className="img-thumbnail mb-3"
              src={performance.image.publicUrl}
              alt={`image of ${performance.title}`}
              /> :
            null
          }
          <ImageDropzone
            imageUploadInProgress={(performance && performance.imageUploadInProgress)}
            onDrop={onImageDrop(props._id)}
          />
        </div>

        <div className="form-group">
          <label htmlFor="about">
            <FormattedMessage
              id="performance.edit.form.label.about"
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

        { performance && performance.video ?
          <Video {...performance.video.video} /> :
          <div className="form-group">
            <div className="input-group">
              <Field
                className="form-control"
                name="video"
                component="input"
                ref={ node => { videoLink = node; }}
                placeholder={intl.formatMessage({
                  id: 'performance.edit.form.label.videoLink.placeholder',
                  defaultMessage: 'https://vimeo.com/xyzxyzxyzxyz'
                })}
              />
              <span className="input-group-btn">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={ e => {
                    e.preventDefault();
                    return dispatch(addPerformanceVideo({
                      _id: performance._id,
                      video: videoLink.value
                    }));
                  }}
                >
                  <FormattedMessage
                    id="performance.edit.form.label.videoLink.action"
                    defaultMessage="Add video"
                  />
                </button>
              </span>
            </div>
          </div>
        }

        <div className="form-group">
          <label htmlFor="crews">
            <FormattedMessage
              id="performance.edit.form.label.performances"
              defaultMessage="Crews"
            />
          </label>
          <ul className="list-group">
            { performance && performance.crews && performance.crews.map((crew) => (
              <Crew
                crew={crew}
                onDelete={removeCrew(crew.id)}
              />
              ))
            }
          </ul>
        </div>

        <div className="form-group">
          <label htmlFor="crew">
            <FormattedMessage
              id="performance.edit.form.label.suggestCrews"
              defaultMessage="Assign crews"
            />
          </label>
          <input
            className="form-control"
            type="text"
            autoComplete="off"
            placeholder={props.intl.formatMessage({
              id: 'performance.edit.form.label.suggestCrews',
              defaultMessage: 'Type to find crews…'
            })}
            onKeyUp={ findCrew }
          />
          <div className="mt-1 list-group">
            { performance && performance._crewSuggestionInProgress ?
              <div className="list-group-item">
                <i className="fa fa-fw fa-spinner fa-pulse"></i>
                {' '}
                <FormattedMessage
                  id="crew.edit.form.label.suggestCrewsLoading"
                  defaultMessage="Finding crews…"
                />
              </div> :
              null
            }
            { crewSuggestions.map((c) => (
              <button
                type="button"
                className="list-group-item list-group-item-action"
                onClick={ addCrew(c.id) }
              >
                  {c.name}
                </button>
              ))
            }
          </div>
        </div>

        <div className="form-group">
          <button
            className="btn btn-primary"
            type="submit"
          >
            <FormattedMessage
              id="general.form.save"
              defaultMessage="Save"
            />
          </button>
        </div>
      </form>
    </Layout>
  );
};

PerformanceForm = injectIntl(reduxForm({ form: 'performance' })(PerformanceForm));

const EditPerformance = props => {
  const onSubmit = (props, dispatch) => {
    dispatch(editPerformance(props));
  };
  const onSubmitSuccess = () => {
    route('/account/performances');
  };
  return (
    <PerformanceForm
      initialValues={props.performance}
      onSubmit={onSubmit}
      onSubmitSuccess={onSubmitSuccess}
      {...props}
    />
  );
};

const mapStateToProps = (state, props) => {
  return {
    performance: (state.user.performances.find(c => { return c._id === props._id; })),
    user: state.user,
  };
};

export default connect(mapStateToProps)(EditPerformance);
