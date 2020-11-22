import * as axios from 'axios';
import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Scrollbars } from 'react-custom-scrollbars';
import { ChevronRight, ChevronLeft, Smile} from 'react-feather';
import decodeHtml from '../helpers/decodeHtml';
// import defaultAvatar from '../images/default-avatar.png';

const surveyEnd = (survey, cursor) => {
  return (
    (!survey?.respondent && cursor > survey?.questions?.length - 1) ||
    (survey?.respondent && cursor > survey?.questions?.length)
  );
};

const getQuery = (qStr) => {
  if (!/\?([^&]+=[^&]+&?)+/g.test(qStr)) return null;
  const arr = qStr
    .slice(1, qStr.length)
    .split(/([^&;=]+)/g)
    .filter((e) => e && !'=&;'.includes(e));
  const query = [];
  for (let i = 0; i < arr.length; i += 2) {
    if (arr[i] !== 'fbclid')
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
  const textAreaRef = useRef(null);
  const [textAreaHeight, setTextAreaHeight] = useState('auto');
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

  useEffect(() => {
    setTextAreaHeight(`${textAreaRef.current?.scrollHeight}px`);
  }, [currentResponse.value]);

  const handleChange = (e) => {
    setTextAreaHeight('auto');
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
    scrollResponse();
  };

  const handleKeypress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      handleSubmit(e);
    }
  };

  const handleBack = () => {
    setCurrentResponse(responses[cursor - 1]);
    setCursor(cursor - 1);
    scrollResponse();
  };

  const scrollResponse = () => {
    /** I double commented your new code, pre-commented is still single commented */
    // const feed = document.querySelector('.survey__feed');
    // feed.scroll({ top: feed.scrollHeight, behavior: 'smooth' });
    // // const c = cursor + 1;
    let selector = document.querySelector('#scroll-to-this');
    console.log(selector);
    // // if (c < survey?.current?.questions?.length) {
    // //   selector = document.querySelector(`#response-${c}`);
    // // } else if (
    // //   c === survey?.current?.questions?.length &&
    // //   survey.current.respondent
    // // ) {
    // //   selector = document.querySelector('#respondent-question');
    // // } else if (
    // //   c === survey?.current?.questions?.length + 1 &&
    // //   survey.current.respondent
    // // ) {
    // //   selector = document.querySelector('#survey-end');
    // // }
    selector.scrollIntoView({ behavior: 'smooth' });
    // // setTimeout(() => {
    // // }, 200);
  };

  return (
    <div className="survey d-flex py-md-4">
      {survey && (
        <div className="container p-0 d-flex flex-column survey__container">
          <div className="d-flex flex-column survey__feed">
            <Scrollbars>
              <div
                className="d-flex flex-column justify-content-end justify-content-md-start mb-2 mb-0-md"
                style={{
                  overflow: 'auto',
                  overflowX: 'hidden',
                  minHeight: '100%',
                }}
              >
                {survey?.current?.questions &&
                  survey.current.questions.map(
                    (question, i) =>
                      question.type !== 'query' &&
                      cursor >= i && (
                        <div className="survey__set" key={question.id}>
                          <div className="survey__question">
                            <h2 className="message" id={`response-${i}`}>
                              {decodeHtml(question.prompt)}
                            </h2>
                          </div>
                          <div className="survey__response">
                            <pre className="message">
                              {responses.length > 0 &&
                                i < cursor &&
                                responses[i].value}
                            </pre>
                          </div>
                        </div>
                      ),
                  )}
                {survey?.current?.respondent &&
                  cursor >= survey.current.questions.length && (
                    <div className="survey__set">
                      <div className="survey__question">
                        <h2 className="message" id={`respondent-question`}>
                          Thanks! Would you please leave an email address or
                          twitter or Instagram handle so we can get in touch?
                          <br />
                          <br />
                          <em>nbd if you don't want to.</em>
                        </h2>
                      </div>
                      {surveyEnd(survey.current, cursor) && (
                        <div className="survey__response">
                          <p className="message">{name}</p>
                        </div>
                      )}
                    </div>
                  )}
                {surveyEnd(survey.current, cursor) && (
                  <div className="survey__set">
                    <div className="survey__question">
                      <h2 className="message" id={`survey-end`}>
                        Thanks for answering! You can make a survey of your own
                        in just a few seconds with <a href="/">Backtalk</a>
                      </h2>
                    </div>
                  </div>
                )}
                <div id="scroll-to-this"></div>
              </div>
            </Scrollbars>
          </div>

          <div className="survey__footer px-2 pb-4 px-md-0 pb-md-0">
            <div className="survey__answer">
              {cursor > 0 && !surveyEnd(survey.current, cursor) && (
                <button
                  type="button"
                  className="btn btn-light px-2"
                  onClick={handleBack}
                >
                  <ChevronLeft />
                </button>
              )}
              <div className="input-group">
                {!surveyEnd(survey?.current, cursor) &&
                  survey?.current?.questions && (
                    <>
                      {cursor < survey?.current.questions.length && (
                        <textarea
                          autoFocus={true}
                          autoCorrect="off"
                          name={survey?.current.questions[cursor].id}
                          onChange={handleChange}
                          value={currentResponse.value}
                          onKeyPress={handleKeypress}
                          className="form-control"
                          ref={textAreaRef}
                          rows={1}
                          style={{
                            height: textAreaHeight,
                            maxHeight: '5rem',
                            resize: 'none',
                          }}
                        />
                      )}
                      {survey?.current.respondent &&
                        cursor >= survey?.current.questions.length && (
                          <input
                            autoFocus={true}
                            autoComplete="off"
                            type="text"
                            name="respondent"
                            onChange={handleName}
                            value={name}
                            onKeyPress={handleKeypress}
                            className="form-control"
                          />
                        )}
                    </>
                  )}
                {!surveyEnd(survey.current, cursor) ? (
                  <button
                    className="btn btn-primary px-2"
                    type="button"
                    name="submit"
                    onClick={handleSubmit}
                  >
                    <ChevronRight />
                  </button>
                ) : (
                  <div
                    className="text-center display-6"
                    style={{ width: '100%' }}
                  >
                    <Smile size={24} />
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
