import * as axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
export const Response = ({ history }) => {
  const params = useParams();
  const [survey, setSurvey] = useState({});
  const [response, setResponse] = useState({});
  useEffect(() => {
    const getSurvey = async () => {
      try {
        const res = await axios.get(`/api/v1/surveys/${params.hash}`);
        setSurvey(res.data.result);
      } catch (err) {
        console.error(err);
        // TODO add error popup
      }
    };
    getSurvey();
  }, [params.hash]);

  const handleChange = (e) => {
    setResponse({ ...response, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const responses = Object.keys(response).map((key) => ({
        questionId: key,
        value: response[key],
      }));
      await axios.post('/api/v1/responses/new', {
        responses,
      });
      setResponse({});
      history.push('/');
    } catch (err) {
      console.error(err);
      // TODO add error popup
    }
  };

  return (
    <div>
      {survey && (
        <div>
          <h1>{survey.title}</h1>
          {survey.questions &&
            survey.questions.map((question) => (
              <div key={question.id}>
                <h2>{question.prompt}</h2>
                <input
                  type="text"
                  name={question.id}
                  value={response[question.id] ? response[question.id] : ''}
                  onChange={handleChange}
                />
              </div>
            ))}
          <button name="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
};
