import React, { useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { context } from '../context/Context';

const Home = () => {
  const { state, dispatch } = useContext(context);

  useEffect(() => {
    dispatch({ type: 'SET_NAVBAR', payload: 'public' });
  }, [dispatch]);

  if (state.auth) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div>
      <p>Home page...</p>
    </div>
  );
};

export default Home;
