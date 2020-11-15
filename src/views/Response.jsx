import * as axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
// import defaultAvatar from '../images/default-avatar.png';

const surveyEnd = (survey, cursor) => {
  return (
    (!survey?.respondent && cursor > survey?.questions?.length - 1) ||
    (survey?.respondent && cursor > survey?.questions?.length)
  );
};

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

export const Response = ({ location }) => {
  const params = useParams();
  // const [avatar, setAvatar] = useState(defaultAvatar);
  const [cursor, setCursor] = useState(0);
  const [responses, setResponses] = useState([]);
  const [queryResponses, setQueryResponses] = useState([]);
  const [name, setName] = useState('');
  const [responseId, setResponseId] = useState(null);
  const [currentResponse, setCurrentResponse] = useState({
    value: '',
    type: 'text',
  });
  const survey = useRef(null);
  const hash = useRef(params.hash);
  const search = useRef(location.search);
  useEffect(() => {
    const cur = localStorage.getItem(`cur:${hash.current}`);
    setCursor(cur || 0);
    const getSurvey = async () => {
      try {
        const surv = await axios.get(`/api/v1/surveys/${hash.current}`);
        survey.current = surv.data.result;
        const queryParams = getQuery(decodeURI(search.current));
        const resp = JSON.parse(localStorage.getItem(hash.current));
        let r = queryParams ? queryParams : [];
        setQueryResponses(queryParams || []);
        if (resp) {
          resp.data = [...resp.data, ...r];
          try {
            const res = await axios.patch('/api/v1/responses/update', {
              responseId: resp.id,
              responses: resp.data.filter(
                (r, i, a) =>
                  i ===
                  a.findIndex(
                    (obj) =>
                      obj.type === r.type &&
                      obj.key === r.key &&
                      obj.value === r.value,
                  ),
              ),
              respondent: resp.respondent,
            });
            setResponseId(res.data.result.id);
            setResponses((r) => [
              ...r,
              ...res.data.result.data.filter((r) => r.type !== 'query'),
            ]);
            setQueryResponses((r) =>
              res.data.result.data.filter((r) => r.type === 'query'),
            );
            localStorage.setItem(hash.current, JSON.stringify(res.data.result));
          } catch (err) {
            console.error(err);
            // TODO add error popup
          }
        } else if (queryParams) {
          try {
            const res = await axios.post('/api/v1/responses/new', {
              surveyId: surv.data.result.id,
              responses: r,
            });
            setResponseId(res.data.result.id);
            localStorage.setItem(hash.current, JSON.stringify(res.data.result));
          } catch (err) {
            console.error(err);
            // TODO add error popup
          }
        }
      } catch (err) {
        console.error(err);
        // TODO add error popup
      }
    };
    getSurvey();
  }, []);

  const handleChange = (e) => {
    setCurrentResponse({
      ...currentResponse,
      id: e.target.name,
      value: e.target.value,
    });
  };

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    let resp = [];
    if (responses.find((response) => response.id === currentResponse.id)) {
      resp = responses.map((response) =>
        response.id === currentResponse.id ? currentResponse : response,
      );
    } else if (currentResponse.id) {
      resp = [...responses, currentResponse];
    } else {
      resp = responses;
    }

    setResponses(resp);
    try {
      if (responseId) {
        const res = await axios.patch('/api/v1/responses/update', {
          responseId: responseId,
          responses: [...resp, ...queryResponses],
          respondent: name,
        });
        localStorage.setItem(hash.current, JSON.stringify(res.data.result));
      } else if (survey.current && cursor === 0 && !responseId) {
        const res = await axios.post('/api/v1/responses/new', {
          surveyId: survey.current.id,
          responses: [...resp, ...queryResponses],
        });
        localStorage.setItem(hash.current, JSON.stringify(res.data.result));
        setResponseId(res.data.result.id);
      }
    } catch (err) {
      console.error(err);
      // TODO add error popup
    }
    setCurrentResponse({ value: '', type: 'text' });
    if (surveyEnd(survey.current, cursor + 1)) {
      localStorage.removeItem(hash.current);
      localStorage.removeItem(`cur:${hash.current}`);
    } else {
      localStorage.setItem(`cur:${hash.current}`, cursor + 1);
    }
    setCursor(cursor + 1);
  };

  const handleKeypress = (e) => {
    if (e.key === 'Enter') {
      handleSubmit(e);
    }
  };

  const handleBack = () => {
    setCurrentResponse(responses[cursor - 1]);
    setCursor(cursor - 1);
  };

  return (
    <div className="survey d-flex py-md-4">
      {survey && (
        <div className="container p-0 d-flex flex-column survey__container">
          {/*
          <header className="no-gutters survey-chat__header">
            <figure className="avatar mini rounded-circle border border-primary overflow-hidden bg-light">
              <img src={avatar} alt="Survey Says" loading="lazy" />
            </figure>
            <h1 className="text-center survey-chat__title">{survey.title}</h1>
          </header>
          */}

          <div className="d-flex flex-column survey__feed">
            {survey?.current?.questions &&
              survey.current.questions.map(
                (question, i) =>
                  question.type !== 'query' &&
                  cursor >= i && (
                    <div className="survey__set" key={question.id}>
                      <div className="survey__question">
                        <h2 className="message">{question.prompt}</h2>
                      </div>
                      <div className="survey__response">
                        <p className="message">
                          {responses.length > 0 &&
                            i < cursor &&
                            responses[i].value}
                        </p>
                      </div>
                    </div>
                  ),
              )}
            {survey?.current?.respondent &&
              cursor >= survey.current.questions.length && (
                <div className="survey__set">
                  <div className="survey__question">
                    <h2 className="message">What can we call you?</h2>
                  </div>
                  {surveyEnd(survey.current, cursor) && (
                    <div className="survey__response">
                      <p className="message">{name}</p>
                    </div>
                  )}
                </div>
              )}
            <div
              className="survey__set"
              style={{
                opacity: surveyEnd(survey.current, cursor) ? 1 : 0,
                transition: 'opacity 0.7s ease-in-out 0.5s',
              }}
            >
              <div className="survey__question">
                <p className="message">Thanks for answering!</p>
              </div>
            </div>
          </div>

          <div className="survey__footer">
            <div className="survey__answer">
              <div className="input-group">
                {!surveyEnd(survey?.current, cursor) &&
                  survey?.current?.questions && (
                    <input
                      type="text"
                      name={
                        cursor < survey?.current.questions.length
                          ? survey?.current.questions[cursor].id
                          : 'respondent'
                      }
                      onChange={
                        survey?.current.respondent &&
                        cursor >= survey?.current.questions.length
                          ? handleName
                          : handleChange
                      }
                      value={
                        cursor < survey?.current.questions.length
                          ? currentResponse.value
                          : name
                      }
                      onKeyPress={handleKeypress}
                      className="form-control"
                      autoFocus
                    />
                  )}
                {!surveyEnd(survey.current, cursor) ? (
                  <button
                    className="btn btn-primary px-3"
                    name="submit"
                    onClick={handleSubmit}
                  >
                    &raquo;
                  </button>
                ) : (
                  <div className="text-center">
                    Make a survey of your own with <a href="#">Backtalk</a>
                  </div>
                )}
                {cursor > 0 && !surveyEnd(survey.current, cursor) && (
                  <button onClick={handleBack}>Back</button>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
