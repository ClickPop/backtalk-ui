import React from 'react';

const ChangelogEntry = ({ title, date, description }) => {
  return (
    <div className="card mb-4 response-preview">
      <div className="card-body mx-3 my-2">
        <p className="text-muted">
          <strong>{date}</strong>
        </p>
        <h2 className="h5">{title}</h2>
        <div className="mb-1">{description}</div>
      </div>
    </div>
  );
};

export { ChangelogEntry };
