import React, { useContext, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { context } from '../context/Context';
import * as axios from 'axios';

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { state, dispatch } = useContext(context);
  useEffect(() => {
    const handleRefresh = async () => {
      if (!state.auth) {
        try {
          dispatch({ type: 'LOADING' });
          const login = await axios.post('/api/v1/auth/refresh_token');
          dispatch({ type: 'LOGIN', payload: login.data.accessToken });
        } catch (err) {
          if (err.response.status === 401) {
          }
        }
      }
    };
    handleRefresh();
    return () => {};
  }, [state.auth, dispatch, state.token]);

  return (
    <Route
      {...rest}
      render={(props) =>
        state.auth ? (
          <Component {...props} />
        ) : (
          <Redirect
            to={{ pathname: '/login', state: { from: props.location } }}
          />
        )
      }
    />
  );
};
