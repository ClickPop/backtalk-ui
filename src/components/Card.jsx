import React from 'react';

export const Card = ({ className, title, actions, children, id }) => {
  return (
    <div className={`card card--hover ${className ? className : ''}`} id={id}>
      <div className="card-body">
        {title && <h5 className="card-title">{title}</h5>}
        {children}
      </div>
      <div className="response-preview__actions">{actions}</div>
    </div>
  );
};
