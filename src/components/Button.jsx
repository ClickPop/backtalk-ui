import React from 'react';
import { Link } from 'react-router-dom';

const Button = ({ pathname, text, className, onClick }) => {
  return (
    <Link to={{ pathname }} className={className} onClick={onClick}>
      {text}
    </Link>
  );
};

export { Button };
