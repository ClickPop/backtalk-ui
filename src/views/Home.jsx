import React, { useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from '../components/Button';
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
    <div className="container">
      <div className="row my-5 pb-5">
        <div className="col-12 col-lg-8 col-xl-6 offset-lg-2 offset-xl-3 text-center">
          <h1 className="display-1 mb-4">
            Get answers, in a <small>✨</small>snap<small>✨</small>.
          </h1>
          <p className="display-6">
            People connect through conversations. Backtalk lets you create
            conversational surveys.
          </p>
          <Button
            className="btn btn-primary btn-lg"
            pathname="/register"
            text="Creat a survey!"
          ></Button>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-md-6">
          <h2>Ask questions like a human.</h2>
          <p class="lead">
            Designed to be conversational, so your audience can talk to you like
            you're both people (which you are).
          </p>
        </div>
        <div className="col-12 col-md-6"></div>
      </div>

      <div className="row">
        <div className="col-12 col-md-6">
          <h2>Evolve your surveys as you learn.</h2>
          <p>Update your surveys without even having to log in.</p>
        </div>
        <div className="col-12 col-md-6"></div>
      </div>

      <div className="row">
        <div className="col-12 col-md-6">
          <h2>Get acquainted with your audience.</h2>
          <p>
            Clear and simple reporting gives you access to answers without any
            confusing clutter.
          </p>
        </div>
        <div className="col-12 col-md-6"></div>
      </div>

      <div className="row">
        <div className="col-12 col-md-6 offset-md-3 text-center">
          <h2>It's as simple as:</h2>
        </div>
      </div>

      <div className="row">
        <div className="col-12">
          <h3>Create</h3>
          <h3>Share</h3>
          <h3>Learn</h3>
          <h3>Adapt</h3>
        </div>
      </div>
    </div>
  );
};

export default Home;
