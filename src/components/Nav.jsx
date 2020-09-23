import React from 'react';
import { Link } from 'react-router-dom';

const NavItem = ({ pathname, text, className }) => {
  return (
    <li className="nav-item">
      <Link to={{ pathname }} className={className}>
        {text}
      </Link>
    </li>
  );
};

const Navbar = ({ logo }) => {
  return (
    <nav className="navbar navbar-expand-sm navbar-dark bg-primary">
      <div className="container-fluid">
        <Link
          className="navbar-brand"
          to={{ pathname: '/' }}
          title="Survey Says"
        >
          <img
            src={logo}
            className="navbar-logo"
            alt="Survey Says"
            loading="lazy"
          />
        </Link>
        <button
          className="navbar-toggler"
          type="button"
          data-toggle="collapse"
          data-target="#navbarNav"
          aria-controls="navbarNav"
          aria-expanded="false"
          aria-label="Toggle navigation"
        >
          <span className="navbar-toggler-icon"> </span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav justify-content-end ml-auto">
            <NavItem
              pathname={'/login'}
              text={'Login'}
              className={'nav-link text-light'}
            />
            <NavItem
              pathname={'/register'}
              text={'Sign Up'}
              className={'btn btn-outline-light'}
            />
          </ul>
        </div>
      </div>
    </nav>
  );
};

export { Navbar, NavItem };
