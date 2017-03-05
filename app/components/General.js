import { h } from 'preact';
import { connect } from 'preact-redux';

const General = _props => {
  //const { events } = props
  return (
    <div>
    general
    </div>
  );
};

const mapStateToProps = (_state) => {
  return { };
};

export default connect(mapStateToProps)(General);
