import { h } from 'preact';
import { connect } from 'preact-redux';

import Card from './Card';
import EventAdd from './event/Add';
import EventShow from './event/Show';
import { injectIntl } from 'preact-intl';

const Events = ({ events, ajaxInProgress, intl })  => {
  return (
    <Card
      title={ intl.formatMessage({
        id: 'events.edit.form.title',
        defaultMessage: 'Your Events'
      })}
    >
      <EventAdd ajaxInProgress={ajaxInProgress} />
      <hr />
      <ul className="list-group">
        {events.map((event) =>
          <EventShow event={event} />
        )}
      </ul>
    </Card>
  );
};

const mapStateToProps = (state) => {
  return {
    events: state.user.events,
    ajaxInProgress: state.user.ajaxInProgress
  };
};

export default connect(mapStateToProps)(injectIntl(Events));
