import * as axios from 'axios';
import React, { useContext, useState } from 'react';
import { Redirect } from 'react-router-dom';
import { context } from '../context/Context';

export const PasswordResetStart = () => {
  const [email, setEmail] = useState('');
  const { state } = useContext(context);
  const [submitted, setSubmitted] = useState(false);

  if (state.auth) {
    return <Redirect to="/dashboard" />;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios({
        method: 'post',
        url: '/api/v1/auth/reset-challenge',
        data: {
          email,
        },
      });
      setSubmitted(true);
    } catch (error) {
      console.error(error);
      // TODO add error popup
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 order-sm-2 col-sm-6 col-lg-4 mt-5 mx-auto">
          {!submitted ? (
            <>
              <div className="row mb-2">
                <h4>Let's get you back in, shall we?</h4>
              </div>
              <div className="row">
                <form className="form-group" onSubmit={handleSubmit}>
                  <label htmlFor="email" className="form-label mb-2">
                    Please enter your email address
                  </label>
                  <div className="input-group py-1">
                    <input
                      className="form-control"
                      type="text"
                      name="email"
                      id="email"
                      onChange={(e) => setEmail(e.target.value)}
                    />
                    <input
                      className="input-group-text btn btn-outline-secondary"
                      type="submit"
                    />
                  </div>
                </form>
              </div>
            </>
          ) : (
            <>
              <div className="row">
                <h3>Please check your email.</h3>
              </div>
              <div className="row">
                <small onClick={handleSubmit} style={{ cursor: 'pointer' }}>
                  <u>If you didn't receive it, please click here to resend</u>
                </small>
              </div>
            </>
          )}
        </div>
      </div>
    </div>
  );
};
