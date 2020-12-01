import * as axios from 'axios';
import React, { useContext, useEffect, useState } from 'react';
import Moment from 'react-moment';
import { Card } from '../components/Card';
import { context } from '../context/Context';

export const Admin = () => {
  const [view, setView] = useState(null);
  const [users, setUsers] = useState([]);
  const [surveys, setSurveys] = useState([]);
  const [userCount, setUserCount] = useState(0);
  const [surveyCount, setSurveyCount] = useState(0);
  const [responseCount, setResponseCount] = useState(0);
  const { state } = useContext(context);
  useEffect(() => {
    const fetchData = async () => {
      const totalUsers = await axios.get('/api/v1/admin/users', {
        headers: { Authorization: `Bearer ${state.token}` },
      });

      const totalSurveys = await axios.get('/api/v1/admin/surveys', {
        headers: { Authorization: `Bearer ${state.token}` },
      });

      setUserCount(totalUsers.data.results.length);
      setSurveyCount(totalSurveys.data.results.length);
      setResponseCount(
        totalSurveys.data.results.reduce(
          (sum, survey) => survey.Responses.length + sum,
          0,
        ),
      );
      setUsers(totalUsers.data.results);
      setSurveys(totalSurveys.data.results);
    };

    fetchData();
  }, [state.token]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 order-md-1 col-md-4 col-lg-6">
          {users.length > 0 && (
            <Card title="Overall Usage">
              <p
                className="card-text"
                onClick={() => setView('users')}
                style={{ cursor: 'pointer' }}
              >
                Users: {userCount}
              </p>
              <p
                className="card-text"
                onClick={() => setView('surveys')}
                style={{ cursor: 'pointer' }}
              >
                Surveys: {surveyCount}
              </p>
              <p className="card-text">Responses: {responseCount}</p>
            </Card>
          )}
        </div>
        <div className="col-12 order-md-2 col-md-8 col-lg-6">
          {view === 'users' &&
            users &&
            users.map((user) => (
              <Card key={user.id} title={user.name} className="mb-2">
                <p className="card-text">Email: {user.email}</p>
                <p className="text-muted">
                  <strong>
                    Sign-up Date:{' '}
                    <Moment format="MMM D, YYYY">{user.createdAt}</Moment>{' '}
                    <Moment format="h:mm a">{user.createdAt}</Moment>
                  </strong>
                </p>
              </Card>
            ))}
          {view === 'surveys' &&
            surveys &&
            surveys.map((survey) => (
              <Card key={survey.id} title={survey.title} className="mb-2">
                <p className="card-text">
                  Questions: {survey.Questions.length}
                </p>
                <p className="card-text">
                  Responses: {survey.Responses.length}
                </p>
                <p className="text-muted">
                  <strong>
                    Created At:{' '}
                    <Moment format="MMM D, YYYY">{survey.createdAt}</Moment>{' '}
                    <Moment format="h:mm a">{survey.createdAt}</Moment>
                  </strong>
                </p>
              </Card>
            ))}
        </div>
      </div>
    </div>
  );
};
