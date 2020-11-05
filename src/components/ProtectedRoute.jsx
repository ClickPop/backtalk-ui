import React, { useContext, useEffect } from 'react';
import { Redirect, Route } from 'react-router-dom';
import { context } from '../context/Context';
import * as axios from 'axios';

export const ProtectedRoute = ({ component: Component, ...rest }) => {
  const { state, dispatch } = useContext(context);
  useEffect(() => {
    let canceled = false;
    const handleRefresh = async () => {
      if (!state.auth) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const login = await axios.post('/api/v1/auth/refresh_token');
          if (!canceled) {
            dispatch({ type: 'LOGIN', payload: login.data.accessToken });
          }
        } catch (err) {
          dispatch({ type: 'SET_LOADING', payload: false });
          if (err.response.status === 401) {
          }
        }
      }
    };
    handleRefresh();
    return () => {
      canceled = true;
    };
  }, [state.auth, dispatch]);

  return (
    <Route
      {...rest}
      render={(props) =>
        state.loading ? (
          <div>Loading...</div>
        ) : state.auth ? (
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
