import React, { Fragment } from 'react';
import { MapPin } from 'react-feather';

const Location = ({ data, className }) => {
  let locationString;
  switch (data?.type) {
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
      locationString = 'Somewhere';
      break;
  }

  console.log(data);

  return (
    <Fragment>
      {locationString && (
        <span className={className}>
          <MapPin size={16} className="text-success" /> {locationString}
        </span>
      )}
    </Fragment>
  );
};

export { Location };
