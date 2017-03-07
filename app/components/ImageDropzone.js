import { h } from 'preact';
import { connect } from 'preact-redux';
import Dropzone from 'react-dropzone';
import { FormattedMessage } from 'preact-intl';
import { Field, reduxForm } from 'redux-form';


const ActualDropzone = (onDrop) =>  (field) => {
  //const files = field.input.value;
  const style = {
    border: 'none',
    width: '100%',
    padding: '1rem',
    backgroundColor: '#eee'
  };
  const allowedTypes = [ 'image/png', 'image/jpeg', 'image/jpg' ];
  // FIXME: Restrict to these types…
        //( filesToUpload, e ) => field.input.onChange(filesToUpload)}
  //accept={allowedTypes.join(', ')}
  /*
        {files && Array.isArray(files) && (
          <ul>
          { files.map((file) => (
            <li key={i}>{file.name}</li>
            <img src="{file.preview}" alt="new image" />
            ))
          }
          </ul>
  )}
  */

  return (
    <div>
      <Dropzone
        style={style}
        name={field.name}
        multiple={false}
        onDrop={onDrop}
      >
        <div>
          <FormattedMessage id="crew.edit.form.label.imageDrop" defaultMessage="Drop image here or click to upload…" />
        </div>
      </Dropzone>
      {field.meta.touched &&
        field.meta.error &&
        <span className="alert alert-error">{field.meta.error}</span>
      }
    </div>
  );
};

const ImageDropzone = ({onDrop}) => {
  return (
    <Field
      name="image"
      component={ActualDropzone(onDrop)}
    />
  );
};

export default ImageDropzone;
