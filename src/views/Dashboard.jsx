import React, { useContext, useEffect, useState } from 'react';
import { context } from '../context/Context';
import * as axios from 'axios';
import { Redirect } from 'react-router-dom';

export const Dashboard = () => {
  const { state } = useContext(context);
  const [surveys, setSurveys] = useState([]);

  useEffect(() => {
    const getSurveys = async () => {
      try {
        const userSurveys = await axios.get('/api/v1/surveys', {
          headers: { Authorization: `Bearer ${state.token}` },
        });
        console.log(userSurveys.data.results);
        setSurveys(userSurveys.data.results);
      } catch (err) {
        console.error(err);
      }
    };
    getSurveys();
  }, [state.token]);

  if (!state.auth) {
    return <Redirect to="/login" />;
  }

  return (
    <div>
      {surveys &&
        !state.loading &&
        surveys.map((survey) => (
          <div key={survey.id}>
            <div className="card w-50 mx-auto mt-2 mb-4">
              <div className="card-header">
                <h3 className="card-title">{survey.title}</h3>
              </div>
              <div className="card-body">
                <p className="card-text">
                  Questions: {survey.questions.length}
                </p>
                <p className="card-text">Responses: {survey.Sessions.length}</p>
              </div>
            </div>
          </div>
        ))}
      {!surveys && !state.loading && <Redirect to="/surveys/first" />}
    </div>
  );
};
