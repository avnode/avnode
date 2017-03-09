import { h } from 'preact';

const Card = ({title, children}) => {
  return (
    <div className="card">
      <div className="card-header">
        {title}
      </div>
      <div className="card-block">
        {children}
      </div>
    </div>
  );
};

export default Card;
