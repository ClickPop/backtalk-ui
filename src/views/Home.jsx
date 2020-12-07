import React, { useContext, useEffect } from 'react';
import { Redirect } from 'react-router-dom';
import { Button } from '../components/Button';
import { context } from '../context/Context';
import screenshot from '../images/survey-screenshot.jpg';
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
            Get answers, in a
            <small>
              <span role="img" aria-label="twinkle">
                ✨
              </span>
            </small>
            snap
            <small>
              <span role="img" aria-label="twinkle">
                ✨
              </span>
            </small>
            .
          </h1>
          <p className="display-6">
            People connect through conversations. Backtalk lets you create
            conversational surveys.
          </p>
          <Button
            className="btn btn-primary btn-lg"
            pathname="/register"
            text="Create a survey!"
          ></Button>
          <img
            src={screenshot}
            className="img-fluid my-2"
            alt="Example survey asking how can we make your experience better?"
            loading="lazy"
          />
        </div>
      </div>
    </div>
  );
};

export default Home;
