import React, { Fragment, useContext, useState } from 'react';
import classNames from 'classnames';
import * as axios from 'axios';
import { Redirect } from 'react-router-dom';
import { context } from '../context/Context';
import * as uuid from 'uuid';

const Login = () => {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  const { state, dispatch } = useContext(context);

  if (state.auth) {
    return <Redirect to="/dashboard" />;
  }

  const { errors } = state;
  let buttonState = {
    classes: classNames({
      btn: true,
      'btn-secondary': !email || !password,
      'btn-primary': email && password,
    }),
    disabled: !email || !password,
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const login = await axios.post('/api/v1/auth/login', {
        email,
        password,
      });
      dispatch({ type: 'LOGIN', payload: login.data.accessToken });
    } catch (err) {
      console.error(err);
      if (err.response.status === 422 || err.response.status === 401) {
        const id = uuid.v4();
        dispatch({
          type: 'SET_ALERT',
          payload: { id, msg: 'Invalid email or password.' },
        });
        setTimeout(() => {
          dispatch({ type: 'REMOVE_ALERT', payload: { id } });
        }, 5000);
      }
    }
  };

  return (
    <Fragment>
      {errors &&
        errors.map((error) => (
          <div key={error.msg} className="alert alert-danger">
            {error.msg}
          </div>
        ))}
      <div className="row justify-content-center">
        <section className="col-xl-4 col-md-6 col-sm-8 col-12 py-5">
          <header>
            <h2 className="h5 mb-4">Welcome back, let's get you logged in!</h2>
          </header>

          <form>
            <div className="mb-2">
              <label className="w-100">
                Email address
                <input
                  type="email"
                  className="form-control w-100 mt-1"
                  name="email"
                  placeholder="george.washington@backtalk.io"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>

            <div className="mb-2">
              <label className="w-100">
                Password
                <input
                  type="password"
                  className="form-control w-100 mt-1"
                  name="password"
                  placeholder="********"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>

            <div>
              <button
                type="submit"
                className={buttonState.classes}
                disabled={buttonState.disabled}
                onClick={handleSubmit}
              >
                Login
              </button>
            </div>
          </form>
        </section>
      </div>
    </Fragment>
  );
};

export default Login;
