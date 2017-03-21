import { h } from 'preact';
import { connect } from 'preact-redux';

import Card from './Card';
import PerformanceAdd from './performance/Add';
import PerformanceShow from './performance/Show';
import { injectIntl } from 'preact-intl';

const Performances = ({ performances, ajaxInProgress, intl }) => {
  return (
    <Card
      title={intl.formatMessage({
        id: 'performances.edit.form.title',
        defaultMessage: 'Your Performances'
      })}
    >
      <PerformanceAdd ajaxInProgress={ajaxInProgress} />
      <hr />
      <ul className="list-group">
        {performances.map((performance) =>
          <PerformanceShow performance={performance} />
        )}
      </ul>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    performances: state.user.performances,
    ajaxInProgress: state.user.ajaxInProgress
  };
};

export default connect(mapStateToProps)(injectIntl(Performances));
