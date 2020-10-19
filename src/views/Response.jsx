import * as axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const getQuery = (qStr) => {
  if (!/\?(\S+=\S+)+/g.test(qStr)) return null;
  const arr = qStr.slice(1, qStr.length).split('=');
  const query = {};
  for (let i = 0; i < arr.length; i += 2) {
    query[arr[i]] = arr[i + 1];
  }
  return query;
};

export const Response = ({ history, location }) => {
  const params = useParams();
  const [survey, setSurvey] = useState({});
  const [response, setResponse] = useState({});
  useEffect(() => {
    const getSurvey = async () => {
      try {
        const res = await axios.get(`/api/v1/surveys/${params.hash}`);
        setSurvey(res.data.result);
        const queryParams = getQuery(decodeURI(location.search));
        if (!queryParams) return;
        const questions = await axios.post('/api/v1/question', {
          questions: Object.keys(queryParams).map((query) => ({
            surveyId: res.data.result.id,
            question: {
              prompt: query,
              type: 'query',
            },
          })),
        });
        questions.data.results.forEach((result, i) => {
          setResponse((r) => ({
            ...r,
            [result.question.id]: queryParams[result.question.prompt],
          }));
        });
      } catch (err) {
        console.error(err);
        // TODO add error popup
      }
    };
    getSurvey();
  }, [params.hash, location.search]);

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
            survey.questions.map((question) =>
              question.type !== 'query' ? (
                <div key={question.id}>
                  <h2>{question.prompt}</h2>
                  <input
                    type="text"
                    name={question.id}
                    value={response[question.id] ? response[question.id] : ''}
                    onChange={handleChange}
                  />
                </div>
              ) : null,
            )}
          <button name="submit" onClick={handleSubmit}>
            Submit
          </button>
        </div>
      )}
    </div>
  );
};
