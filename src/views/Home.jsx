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
    <div class="container">
      <div class="row">
        <div class="col-12 col-md-6 offset-md-3 text-center">
          <h1>Very simple surveys.</h1>
          <p>Get answers to your questions in a ✨snap✨.</p>
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-6">
          <h2>Ask questions like a person would.</h2>
          <p>
            A conversational design asks questions in a way people are used to
            engaging with.
          </p>
        </div>
        <div class="col-12 col-md-6"></div>
      </div>

      <div class="row">
        <div class="col-12 col-md-6"></div>
        <div class="col-12 col-md-6">
          <h2>Incredible flexibility with very little effort.</h2>
          <p>Update your surveys without even having to log in.</p>
        </div>
      </div>

      <div class="row">
        <div class="col-12 col-md-6">
          <h2>Get acquainted with your audience.</h2>
          <p>
            Clear and simple reporting gives you access to answers without any
            confusing clutter.
          </p>
        </div>
        <div class="col-12 col-md-6"></div>
      </div>

      <div class="row">
        <div class="col-12 col-md-6 offset-md-3 text-center">
          <h2>It's as simple as:</h2>
        </div>
      </div>

      <div class="row">
        <div class="col-12">
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
