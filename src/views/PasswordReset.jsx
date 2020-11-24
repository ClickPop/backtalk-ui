import React, { useContext, useEffect, useState } from 'react';
import { Redirect, useParams } from 'react-router-dom';
import { context } from '../context/Context';
import * as uuid from 'uuid';
import * as axios from 'axios';

export const PasswordReset = () => {
  const [token, setToken] = useState('');
  const [password, setPassword] = useState('');
  const [passwordConfirm, setPasswordConfirm] = useState('');
  const [expired, setExpired] = useState(false);
  const [reset, setReset] = useState(false);
  const params = useParams();
  const { state, dispatch } = useContext(context);

  useEffect(() => {
    const checkToken = async () => {
      try {
        if (token) {
          const res = await axios({
            method: 'post',
            url: '/api/v1/auth/validate-reset-token',
            data: {
              token,
            },
          });
          if (res?.data?.resetTokenValid === false) {
            setExpired(true);
          }
        }
      } catch (error) {
        if (error?.response?.status === 422) {
          if (
            error.response?.data?.errors.find((e) => /Expired/g.test(e.msg))
          ) {
            const id = uuid.v4();
            dispatch({
              type: 'SET_ALERT',
              payload: { id, msg: 'Expired Token' },
            });
            setTimeout(() => {
              dispatch({ type: 'REMOVE_ALERT', payload: { id } });
              setExpired(true);
            }, 3000);
            setPassword('');
            setPasswordConfirm('');
          } else if (
            error.response?.data?.errors.find((e) => /same/g.test(e.msg))
          ) {
            const id = uuid.v4();
            dispatch({
              type: 'SET_ALERT',
              payload: {
                id,
                msg: 'New password is the same as your old password.',
              },
            });
            setTimeout(() => {
              dispatch({ type: 'REMOVE_ALERT', payload: { id } });
            }, 3000);
            setPassword('');
            setPasswordConfirm('');
          } else {
            const id = uuid.v4();
            dispatch({
              type: 'SET_ALERT',
              payload: { id, msg: 'Invalid Password' },
            });
            setTimeout(() => {
              dispatch({ type: 'REMOVE_ALERT', payload: { id } });
            }, 3000);
            setPassword('');
            setPasswordConfirm('');
          }
        } else if (error?.response?.status === 404) {
          const id = uuid.v4();
          dispatch({
            type: 'SET_ALERT',
            payload: { id, msg: 'Expired Token' },
          });
          setTimeout(() => {
            dispatch({ type: 'REMOVE_ALERT', payload: { id } });
            setExpired(true);
          }, 3000);
          setPassword('');
          setPasswordConfirm('');
        }
        console.error(error);
      }
    };

    checkToken();
  }, [dispatch, token]);

  useEffect(() => {
    setToken(params.token);
  }, [params.token]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (password !== passwordConfirm) {
      const id = uuid.v4();
      dispatch({
        type: 'SET_ALERT',
        payload: { id, msg: 'Passwords do not match.' },
      });
      setTimeout(() => {
        dispatch({ type: 'REMOVE_ALERT', payload: { id } });
      }, 3000);
      return;
    }
    try {
      const res = await axios({
        method: 'post',
        url: '/api/v1/auth/reset-password',
        data: {
          password,
          token,
        },
      });
      if (res?.data?.passwordReset) {
        setReset(true);
      }
    } catch (error) {
      if (error?.response?.status === 422) {
        if (error.response?.data?.errors.find((e) => /Expired/g.test(e.msg))) {
          const id = uuid.v4();
          dispatch({
            type: 'SET_ALERT',
            payload: { id, msg: 'Expired Token' },
          });
          setTimeout(() => {
            dispatch({ type: 'REMOVE_ALERT', payload: { id } });
            setExpired(true);
          }, 3000);
          setPassword('');
          setPasswordConfirm('');
        } else if (
          error.response?.data?.errors.find((e) => /same/g.test(e.msg))
        ) {
          const id = uuid.v4();
          dispatch({
            type: 'SET_ALERT',
            payload: {
              id,
              msg: 'New password is the same as your old password.',
            },
          });
          setTimeout(() => {
            dispatch({ type: 'REMOVE_ALERT', payload: { id } });
          }, 3000);
          setPassword('');
          setPasswordConfirm('');
        } else {
          const id = uuid.v4();
          dispatch({
            type: 'SET_ALERT',
            payload: { id, msg: 'Invalid Password' },
          });
          setTimeout(() => {
            dispatch({ type: 'REMOVE_ALERT', payload: { id } });
          }, 3000);
          setPassword('');
          setPasswordConfirm('');
        }
      } else if (error?.response?.status === 404) {
        const id = uuid.v4();
        dispatch({ type: 'SET_ALERT', payload: { id, msg: 'Expired Token' } });
        setTimeout(() => {
          dispatch({ type: 'REMOVE_ALERT', payload: { id } });
          setExpired(true);
        }, 3000);
        setPassword('');
        setPasswordConfirm('');
      }
      console.error(error);
      // TODO add error popup
    }
  };

  if (expired) {
    return <Redirect to="/password-reset" />;
  }

  if (reset) {
    return <Redirect to="/login" />;
  }

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 order-sm-2 col-sm-6 col-lg-4 mt-5 mx-auto">
          <div className="row mb-2">
            <h4>Please enter your new password!</h4>
          </div>
          <div className="row mb-2">
            {state?.errors?.length > 0 &&
              state.errors.map((error) => (
                <div key={error.id} className="alert alert-danger">
                  {error.msg}
                </div>
              ))}
            <form className="form-group" onSubmit={handleSubmit}>
              <label htmlFor="password" className="form-label mb-2">
                Password
              </label>
              <input
                type="password"
                name="password"
                id="password"
                className="form-control mb-2"
                onChange={(e) => setPassword(e.target.value)}
              />
              <label htmlFor="passwordConfirm" className="form-label mb-2">
                Re-Enter Password
              </label>
              <input
                type="password"
                name="passwordConfirm"
                id="passwordConfirm"
                className="form-control mb-2"
                onChange={(e) => setPasswordConfirm(e.target.value)}
              />
              <div className="input-group">
                <input
                  type="submit"
                  value="Submit"
                  className="btn btn-primary"
                />
              </div>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};
