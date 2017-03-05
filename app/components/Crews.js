import { h } from 'preact';
import { connect } from 'preact-redux';

import CrewAdd from './crew/Add';
import CrewShow from './crew/Show';

const Crews = ({ crews, ajaxInProgress }) => {
  return (
    <div>
      <CrewAdd ajaxInProgress={ajaxInProgress} />
      <hr />
      <ul className="list-group">
        {crews.map((crew) =>
          <CrewShow crew={crew} />
        )}
      </ul>
    </div>
  );
};

const mapStateToProps = (state) => {
  return {
    crews: state.user.crews,
    ajaxInProgress: state.user.ajaxInProgress
  };
};

export default connect(mapStateToProps)(Crews);
