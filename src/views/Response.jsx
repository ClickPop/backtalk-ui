import * as axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';

const getQuery = (qStr) => {
  if (!/\?(\S+=\S+)+/g.test(qStr)) return null;
  const arr = qStr.slice(1, qStr.length).split('=');
  const query = [];
  for (let i = 0; i < arr.length; i += 2) {
    query.push({
      key: arr[i],
      value: arr[i + 1],
      type: 'query',
    });
  }
  return query;
};

export const Response = ({ history, location }) => {
  const params = useParams();
  const [survey, setSurvey] = useState({});
  const [response, setResponse] = useState({ responses: [] });
  useEffect(() => {
    const getSurvey = async () => {
      try {
        const res = await axios.get(`/api/v1/surveys/${params.hash}`);
        setSurvey(res.data.result);
        const queryParams = getQuery(decodeURI(location.search));
        if (!queryParams) return;
        setResponse((r) => ({
          ...r,
          surveyId: res.data.result.id,
          responses: [...r.responses, ...queryParams],
        }));
      } catch (err) {
        console.error(err);
        // TODO add error popup
      }
    };
    getSurvey();
  }, [params.hash, location.search]);

  const handleChange = (e) => {
    setResponse({
      ...response,
      responses: response.responses.some((res) => res.id === e.target.name)
        ? response.responses.map((res) =>
            res.id === e.target.name ? { ...res, value: e.target.value } : res,
          )
        : [
            ...response.responses,
            { id: e.target.name, value: e.target.value, type: e.target.type },
          ],
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      await axios.post('/api/v1/responses/new', {
        ...response,
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
