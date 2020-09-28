import React, { useContext } from 'react';
import { Redirect } from 'react-router-dom';
import { context } from '../context/Context';

const Home = () => {
  const { state } = useContext(context);

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
