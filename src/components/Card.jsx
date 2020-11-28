import React from 'react';

export const Card = () => {
  return (
    <div className="card card--hover">
      {/* Allow extra classes to be added to the .card div, in the case of the dashboard p-3 mb-4 */}
      <div className="card-body">
        {/* Only show this div and card-title if there's a card title set. This should be able to be more than just a string. On the dashboard it's an actual component. */}
        <h5 className="card-title"></h5>
        {/* Should be able to put whatever we want in here. */}
      </div>
      {/* Should be able to put whatever icon buttons in this we want. */}
      <div className="response-preview__actions"></div>
    </div>
  );
};
