import React from 'react';
import { Link } from 'react-router-dom';

export const NavItem = ({ pathname, text, className }) => {
  return (
    <li className='nav-item'>
      <Link to={{ pathname }} className={className}>
        {text}
      </Link>
    </li>
  );
};
