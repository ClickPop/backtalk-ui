import React from 'react';
import { Link } from 'react-router-dom';
import { Copy, Check } from 'react-feather';
import { useCopy } from '../hooks/useCopy';

export const CopyLink = ({ children, to, target, className, heapName }) => {
  const [ref, copy, copied] = useCopy();
  return (
    <span
      className={`d-flex justify-content-between align-items-center ${heapName}`}
    >
      <Link to={to} target={target} className={className} ref={ref}>
        {children}
      </Link>
      <span title="Copy Button" style={{ cursor: 'pointer' }} onClick={copy}>
        {/* TODO, add error state */}
        {copied ? <Check size={18} /> : <Copy size={18} />}
      </span>
    </span>
  );
};
