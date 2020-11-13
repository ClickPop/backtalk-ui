import React, { useContext, useEffect, useState } from 'react';
import { context } from '../context/Context';
import * as axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import NewSurvey from '../components/NewSurvey';

export const Dashboard = () => {
  const { state } = useContext(context);
  const [surveys, setSurveys] = useState(null);

  useEffect(() => {
    let cancelled = false;
    const getSurveys = async () => {
      try {
        const userSurveys = await axios.get('/api/v1/surveys', {
          headers: { Authorization: `Bearer ${state.token}` },
        });
        if (!cancelled) {
          setSurveys(userSurveys.data.results);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getSurveys();
    return () => {
      cancelled = true;
    };
  }, [state.token]);

  if (!state.auth) {
    return <Redirect to="/login" />;
  }

  if (state.loading) {
    return <p>Loading...</p>;
  }

  return (
    <div class="container">
      <div className="row p-2">
        {surveys && surveys.length < 1 && !state.loading && (
          <Redirect to="/surveys/first" />
        )}
        <div className="col-12 order-sm-2 col-sm-6 col-lg-4">
          <h2 className="mb-4">New Survey</h2>
          <NewSurvey surveys={surveys} setSurveys={setSurveys} />
        </div>
        <div className="col-12 order-sm-1 col-sm-6 col-lg-8">
          <h1 className="mb-4">Your Surveys</h1>
          {surveys &&
            !state.loading &&
            surveys.map((survey) => (
              <div key={survey.id} className="row">
                <div className="col-12">
                  <div className="card mb-4">
                    <div className="card-body">
                      <h5 className="card-title">{survey.title}</h5>
                      <p className="mb-0">
                        <Link to={`/responses/${survey.hash}`}>
                          {survey.Responses?.length} responses
                        </Link>{' '}
                        |{' '}
                        <Link
                          to={`/survey/${survey.hash}`}
                          target="_blank"
                        >{`${window.location.host}/survey/${survey.hash}`}</Link>
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            ))}
        </div>
      </div>
    </div>
  );
};
