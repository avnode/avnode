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
} from '../../reducers/actions';
import ImageDropzone from '../ImageDropzone';

let PerformanceForm = props => {
  const { handleSubmit, dispatch, performance, user, intl } = props;

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
