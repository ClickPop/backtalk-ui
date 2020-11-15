import React, { Fragment } from 'react';

const Location = ({ data, className }) => {
  let locationString;
  if (typeof data === 'object' && data !== null && 'type' in data) {
    switch (data.type) {
      case 'location':
        locationString =
          'pretty' in data && data.pretty ? data.pretty : 'Unknown';
        break;
      case 'private':
        locationString = 'LAN / Private';
        break;
      case 'localhost':
        locationString = 'Localhost';
        break;
      default:
        locationString = 'Unknown';
        break;
    }
  }

  return (
    <Fragment>
      {locationString && (
        <p className={className}>
          <span role="img" aria-label="Location: ">
            📍
          </span>{' '}
          {locationString}
        </p>
      )}
    </Fragment>
  );
};

export { Location };
