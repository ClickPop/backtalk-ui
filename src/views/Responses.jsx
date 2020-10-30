import * as axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { context } from '../context/Context';

export const Responses = () => {
  const params = useParams();
  const [responses, setResponses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [expanded, setExpanded] = useState({});
  const { state } = useContext(context);
  useEffect(() => {
    const getResponses = async () => {
      try {
        const res = await axios.get(`/api/v1/responses/${params.hash}`, {
          headers: { Authorization: `Bearer ${state.token}` },
        });
        setResponses(res.data.results);
        setQuestions(res.data.questions);
        setQuestions([
          ...res.data.questions,
          ...res.data.results
            .map((result) => result.data)
            .reduce((newResps, resp) => {
              const keys = resp.filter((r) => r.key).map((r) => r.key);
              return keys;
            }, []),
        ]);
      } catch (error) {
        console.error(error);
        //TODO add error popup
      }
    };
    getResponses();
  }, [params.hash, state.token]);

  const handleExpand = (id) => {
    setExpanded({ ...expanded, [id]: !expanded[id] });
  };

  return (
    <div className="row justify-content-center">
      <div className="col-6">
        <div>
          {responses.map((response) => (
            <div className="card m-3 p-3" key={response.id}>
              <div className="d-flex justify-content-between">
                <h2 className="card-title">
                  {response.respondent || 'Anonymous'}
                </h2>
                <button
                  className="btn btn-primary"
                  onClick={(e) => handleExpand(response.id)}
                >
                  {expanded[response.id] ? '^' : 'v'}
                </button>
              </div>
              {expanded[response.id] && (
                <div className="card-text">
                  {response.data &&
                    response.data.map(
                      (r) =>
                        r && (
                          <div key={r.id || r.key}>
                            <b>
                              {questions.find((q) => q.id === r.id)?.prompt ||
                                r.key}
                              :
                            </b>{' '}
                            {r.value}
                          </div>
                        ),
                    )}
                  timestamp: {response.createdAt}
                </div>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};
