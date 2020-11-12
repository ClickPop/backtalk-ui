import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { context } from '../context/Context';

const NavItem = ({ pathname, text, className }) => {
  return <Button to={{ pathname }} className={className} text={text}></Button>;
};

const Navbar = ({ logo }) => {
  const { state } = useContext(context);
  const [path, setPath] = useState('/');

  useEffect(() => {
    if (state.auth) {
      setPath('/dashboard');
    }
  }, [state.auth]);

  return (
    <nav className="navbar navbar-expand-sm navbar-light">
      <div
        className={state.navbar == 'public' ? 'container' : 'container-fluid'}
      >
        <Link
          className="navbar-brand"
          to={{ pathname: path }}
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
            {!state.auth && (
              <>
                {state.navbar == 'light' && (
                  <NavItem
                    pathname={'/login'}
                    text={'Login'}
                    className={'nav-link'}
                  />
                )}
                <NavItem
                  pathname={'/login'}
                  text={'Login'}
                  className={'nav-link'}
                />
                <NavItem
                  pathname={'/register'}
                  text={'Sign Up'}
                  className={'btn'}
                />
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export { Navbar, NavItem };
