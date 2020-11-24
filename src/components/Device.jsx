import React, { Fragment } from 'react';
import { Smartphone, Monitor, Tablet } from 'react-feather';

const Device = ({ data, className }) => {
  let deviceString;
  let DeviceIcon;
  switch (data?.device?.type) {
    case 'smartphone':
      DeviceIcon = Smartphone;
      deviceString = `${data?.os?.name || 'their phone'}`
      break;
    case 'tablet':
      DeviceIcon = Tablet;
      deviceString = `${data?.os?.name || 'their tablet'}`
      break;
    case 'desktop':
      DeviceIcon = Monitor;
      deviceString = `${data?.os?.name || 'their computer'}`
      break;
    default:
      DeviceIcon = null;
      break;
  }

  return (
    <Fragment>
      {deviceString && (
        <span className={className}>
          <DeviceIcon size={16} className="text-success" /> {deviceString}
        </span>
      )}
    </Fragment>
    
  );
};

export { Device };
