import React from 'react';
import { Link } from 'react-router-dom';
import { Copy } from 'react-feather';

export const CopyLink = ({
  children,
  to,
  target,
  className,
  onClick,
  copyFrom,
  heapName,
}) => {
  return (
    <span
      className={`d-flex justify-content-between align-items-center ${heapName}`}
    >
      <Link to={to} target={target} className={className} ref={copyFrom}>
        {children}
      </Link>
      <span title="Copy Button" style={{ cursor: 'pointer' }} onClick={onClick}>
        <Copy size={18} />
      </span>
    </span>
  );
};
