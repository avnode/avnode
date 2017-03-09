import { h } from 'preact';
import { connect } from 'preact-redux';

import Card from './Card';
import CrewAdd from './crew/Add';
import CrewShow from './crew/Show';
import { injectIntl } from 'preact-intl';

const Crews = ({ crews, ajaxInProgress, intl }) => {
  return (
    <Card
      title={intl.formatMessage({
        id: 'crews.edit.form.title',
        defaultMessage: 'Your Crews'
      })}
    >
      <CrewAdd ajaxInProgress={ajaxInProgress} />
      <hr />
      <ul className="list-group">
        {crews.map((crew) =>
          <CrewShow crew={crew} />
        )}
      </ul>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    crews: state.user.crews,
    ajaxInProgress: state.user.ajaxInProgress
  };
};

export default connect(mapStateToProps)(injectIntl(Crews));
