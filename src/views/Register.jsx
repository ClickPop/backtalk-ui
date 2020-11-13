import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { context } from '../context/Context';
import * as axios from 'axios';
import * as uuid from 'uuid';

const initialState = {
  email: null,
  firstName: null,
  lastName: null,
  password: null,
  passwordConfirm: null,
};

const Register = () => {
  const { state, dispatch } = useContext(context);
  const { errors } = state;
  const [form, setForm] = useState(initialState);
  const [registered, setRegistered] = useState(false);

  if (state.auth) {
    return <Redirect to="/dashboard" />;
  }

  if (registered) {
    return <Redirect to="/login" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    const { email, firstName, lastName, password, passwordConfirm } = form;
    if (password !== passwordConfirm) {
      const id = uuid.v4();
      dispatch({
        type: 'SET_ALERT',
        payload: { id, msg: 'Passwords do not match.' },
      });
      setTimeout(() => {
        dispatch({ type: 'REMOVE_ALERT', payload: { id } });
      }, 5000);
      return;
    }
    try {
      await axios.post('/api/v1/users/register', {
        email,
        name: `${firstName} ${lastName}`,
        password,
      });
      setRegistered(true);
    } catch (err) {
      console.error(err);
      if (err.response.status === 422 || err.response.status === 409) {
        err.response.data.errors.forEach((error) => {
          const id = uuid.v4();
          dispatch({
            type: 'SET_ALERT',
            payload: { id, msg: error.msg },
          });
          setTimeout(() => {
            dispatch({ type: 'REMOVE_ALERT', payload: { id } });
          }, 5000);
        });
      }
    }
  };

  const handleChange = (e) => {
    e.preventDefault();
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  return (
    <div className="container">
      {errors &&
        errors.map((error) => (
          <div key={error.msg} className="alert alert-danger">
            {error.msg}
          </div>
        ))}
      <div className="row justify-content-center">
        <section className="col-xl-6 col-md-8 col-sm-10 col-12 py-5">
          <header>
            <h2 className="h5 mb-1">Hi, we're so glad you're here!</h2>
            <p className="mb-4">
              Let's get you all signed up so you can make your first survey.
            </p>
          </header>

          <form className="needs-validation" noValidate>
            <div className="row">
              <div className="col-sm-6 mb-2">
                <label className="w-100">
                  First Name
                  <input
                    type="text"
                    className="form-control mt-1"
                    name="firstName"
                    placeholder="George"
                    required
                    onChange={handleChange}
                  />
                </label>
              </div>
              <div className="col-sm-6 mb-2">
                <label className="w-100">
                  Last Name
                  <input
                    type="text"
                    className="form-control mt-1"
                    name="lastName"
                    placeholder="Washington"
                    required
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>

            <div className="row">
              <div className="col-12 mb-2">
                <label className="w-100">
                  Email Address
                  <input
                    type="email"
                    className="form-control w-100 mt-1"
                    name="email"
                    placeholder="george.washington@backtalk.io"
                    required
                    onChange={handleChange}
                  />
                </label>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6 mb-2">
                <label className="w-100">
                  Password
                  <input
                    type="password"
                    className="form-control mt-1"
                    name="password"
                    placeholder="********"
                    onChange={handleChange}
                    required
                  />
                </label>
              </div>
              <div className="col-sm-6 mb-2">
                <label className="w-100">
                  Confirm Password
                  <input
                    type="password"
                    className="form-control mt-1"
                    name="passwordConfirm"
                    onChange={handleChange}
                    placeholder="********"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <p className="my-2 text-center">
                  <button
                    type="submit"
                    className="btn btn-primary btn-lg w-50"
                    onClick={handleSubmit}
                  >
                    Sign Me Up!
                  </button>
                </p>
              </div>
            </div>
          </form>
        </section>
      </div>
    </div>
  );
};

export default Register;
