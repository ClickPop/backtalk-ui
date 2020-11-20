import * as axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from './Button';
import { context } from '../context/Context';

const NavItem = ({ pathname, text, className, onClick }) => {
  return (
    <Button
      pathname={pathname}
      className={className}
      text={text}
      onClick={onClick}
    />
  );
};

const Navbar = ({ logo }) => {
  const { state, dispatch } = useContext(context);
  const [path, setPath] = useState('/');

  useEffect(() => {
    if (state.auth) {
      setPath('/dashboard');
    }
  }, [state.auth]);

  const handleLogout = async () => {
    if (state.auth) {
      const res = await axios.post('/api/v1/auth/logout');
      if (res.data.logout) {
        dispatch({ type: 'LOGOUT', payload: null });
        setPath('/');
      }
    }
  };

  return (
    <div className="container">
      <nav className="navbar navbar-expand-sm navbar-light">
        <Link className="navbar-brand d-flex" to={{ pathname: path }}>
          <span className="h4 pt-3 pr-1">Backtalk</span>
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
              pathname={'/changelog'}
              text={"What's New"}
              className="btn btn-white"
            />
            {!state.auth ? (
              <>
                <NavItem
                  pathname={'/login'}
                  text={'Login'}
                  className={'btn btn-white'}
                />
                <NavItem
                  pathname={'/register'}
                  text={'Sign Up'}
                  className={'btn btn-primary'}
                />
              </>
            ) : (
              <NavItem onClick={handleLogout} text={'Logout'} className="btn" />
            )}
          </ul>
        </div>
      </nav>
    </div>
  );
};

export { Navbar, NavItem };
