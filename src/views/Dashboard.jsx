import React, { useContext, useEffect, useState } from 'react';
import { context } from '../context/Context';
import * as axios from 'axios';
import { Redirect } from 'react-router-dom';
import NewSurvey from '../components/NewSurvey';

export const Dashboard = () => {
  const { state, dispatch } = useContext(context);
  const [surveys, setSurveys] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const getSurveys = async () => {
      try {
        dispatch({ type: 'SET_LOADING', payload: true });
        const userSurveys = await axios.get('/api/v1/surveys', {
          headers: { Authorization: `Bearer ${state.token}` },
        });
        if (!cancelled) {
          setSurveys(userSurveys.data.results);
          dispatch({ type: 'SET_LOADING', payload: false });
        }
      } catch (err) {
        console.error(err);
      }
    };
    getSurveys();
    return () => {
      cancelled = true;
    };
  }, [state.token, dispatch]);

  if (!state.auth) {
    return <Redirect to="/login" />;
  }

  if (state.loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="row p-2">
      {surveys && surveys.length < 1 && !state.loading && (
        <Redirect to="/surveys/first" />
      )}
      <div className="col-7">
        {surveys &&
          !state.loading &&
          surveys.map((survey) => (
            <div key={survey.id} className="row">
              <div className="col-8 mx-auto mt-2 mb-4">
                <div className="card">
                  <div className="card-header">
                    <h3 className="card-title">{survey.title}</h3>
                  </div>
                  <div className="card-body">
                    <p className="card-text">
                      Questions: {survey.questions?.length}
                    </p>
                    <p className="card-text">
                      Responses: {survey.Sessions?.length}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          ))}
      </div>
      <div className="col-5">
        <NewSurvey surveys={surveys} setSurveys={setSurveys} />
      </div>
    </div>
  );
};
