import * as axios from 'axios';
import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import defaultAvatar from '../images/default-avatar.png';

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
  const [avatar, setAvatar] = useState(defaultAvatar);
  const [cursor, setCursor] = useState(0);
  const [queryResponses, setQueryResponses] = useState([]);
  const [responses, setResponses] = useState([]);
  const [currentResponse, setCurrentResponse] = useState({ value: '' });
  useEffect(() => {
    const getSurvey = async () => {
      try {
        const res = await axios.get(`/api/v1/surveys/${params.hash}`);
        setSurvey(res.data.result);
        const queryParams = getQuery(decodeURI(location.search));
        if (!queryParams) return;
        setQueryResponses((r) => [...r, ...queryParams]);
      } catch (err) {
        console.error(err);
        // TODO add error popup
      }
    };
    getSurvey();
  }, [params.hash, location.search]);

  useEffect(() => {
    const sendSurveys = async () => {
      if (cursor === survey.questions?.length) {
        try {
          await axios.post('/api/v1/responses/new', {
            surveyId: survey.id,
            responses: [...responses, ...queryResponses],
          });
        } catch (err) {
          console.error(err);
          // TODO add error popup
        }
      }
    };

    sendSurveys();
  }, [cursor, queryResponses, responses, survey.id, survey.questions]);

  const handleChange = (e) => {
    setCurrentResponse({
      ...currentResponse,
      id: e.target.name,
      value: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setCursor(cursor + 1);
    if (responses.find((response) => response.id === currentResponse.id)) {
      setResponses(
        responses.map((response) =>
          response.id === currentResponse.id ? currentResponse : response,
        ),
      );
    } else {
      setResponses([...responses, currentResponse]);
    }
    setCurrentResponse({ value: '' });
  };

  const handleKeypress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleBack = (e) => {
    setCurrentResponse(responses[cursor - 1]);
    setCursor(cursor - 1);
  };

  return (
    <div>
      {survey && (
        <div className="survey-chat no-gutters g-0">
          <header className="no-gutters survey-chat__header">
            <figure className="avatar mini rounded-circle border border-primary overflow-hidden bg-light">
              <img src={avatar} alt="Survey Says" loading="lazy" />
            </figure>
            <h1 className="text-center survey-chat__title">{survey.title}</h1>
          </header>

          <div className="d-flex flex-column survey-chat__feed">
            {survey.questions &&
              survey.questions.map(
                (question, i) =>
                  question.type !== 'query' &&
                  cursor >= i && (
                    <div className="survey-chat__set" key={question.id}>
                      <div className="survey-chat__question">
                        <h2 className="message">{question.prompt}</h2>
                      </div>

                      <div className="survey-chat__response">
                        <p className="message">
                          {responses.length > 0 &&
                            i < cursor &&
                            responses[i].value}
                        </p>
                      </div>
                    </div>
                  ),
              )}

            <div
              className="survey-chat__set"
              style={{
                opacity: cursor === survey.questions?.length ? 1 : 0,
                transition: 'opacity 0.7s ease-in-out 0.5s',
              }}
            >
              <div className="survey-chat__question">
                <p className="message">Thanks for answering!</p>
              </div>
            </div>
          </div>

          <footer className="survey-chat__footer">
            {cursor < survey.questions?.length && (
              <input
                type="text"
                name={cursor}
                onChange={handleChange}
                value={currentResponse.value}
                onKeyPress={handleKeypress}
                autoFocus
              />
            )}
            {cursor !== survey.questions?.length ? (
              <button name="submit" onClick={handleSubmit}>
                Submit
              </button>
            ) : (
              <button>Thanks!</button>
            )}
            {cursor > 0 && cursor < survey.questions?.length && (
              <button onClick={handleBack}>Back</button>
            )}
          </footer>
        </div>
      )}
    </div>
  );
};
