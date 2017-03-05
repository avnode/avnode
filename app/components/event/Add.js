import { h } from 'preact';

import TitleForm from '../TitleForm';
import { addEvent } from '../../reducers/actions';

const EventAdd = ({ajaxInProgress}) => {
  return (
    <TitleForm label="Add Event" ajaxInProgress={ajaxInProgress} action={addEvent} />
  );
};

export default EventAdd;
