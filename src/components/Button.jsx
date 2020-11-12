import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ pathname, text, className }) => {
  return (
    <Link to={{ pathname }} className={className}>
      {text}
    </Link>
  );
};

export { Button };
