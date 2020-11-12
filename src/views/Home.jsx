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
      <div className="row mb-5">
        <div className="col-12 col-md-8 offset-md-2 text-center">
          <h1 className="display-1">Get answers, fast.</h1>
          <p className="lead">Get answers to your questions in a ✨snap✨.</p>
          <Button
            className="btn btn-primary btn-lg"
            pathname="/register"
            text="Creat a survey for free"
          ></Button>
        </div>
      </div>

      <div className="row">
        <div className="col-12 col-md-6">
          <h2>Ask questions like a person would.</h2>
          <p>
            A conversational design asks questions in a way people are used to
            engaging with.
          </p>
        </div>
        <div className="col-12 col-md-6"></div>
      </div>

      <div className="row">
        <div className="col-12 col-md-6"></div>
        <div className="col-12 col-md-6">
          <h2>Incredible flexibility with very little effort.</h2>
          <p>Update your surveys without even having to log in.</p>
        </div>
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
