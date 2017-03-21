import { h } from 'preact';

import TitleForm from '../TitleForm';
import { addPerformance } from '../../reducers/actions';

const PerformanceAdd = ({ajaxInProgress}) => {
  return (
    <TitleForm label="Add Performance" ajaxInProgress={ajaxInProgress} action={addPerformance} />
  );
};

export default PerformanceAdd;
