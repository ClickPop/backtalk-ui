import * as axios from 'axios';
import React, { Fragment, useState, useEffect, useContext } from 'react';
import Moment from 'react-moment';
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
    <div className="container">
      <div className="row">
        <div className="col-12 col-lg-8 offset-lg-2">
          <div>
            {responses.map((response) => (
              <div className="card mb-4 px-3 py-2" key={response.id}>
                <div className="card-body">
                  {response.data &&
                    response.data.map(
                      (r) =>
                        r && (
                          <div key={r.id || r.key}>
                            <Fragment>
                              <p className="text-secondary font-weight-bold">
                                <Moment format="hh:mma on ddd MMM D, YYYY">
                                  {response.createdAt}
                                </Moment>
                                <br />
                              </p>
                              <p className="mb-1">
                                {questions.find((q) => q.id === r.id)?.prompt ||
                                  r.key}
                              </p>
                              <h5 className="card-title mb-3">{r.value}</h5>
                            </Fragment>{' '}
                          </div>
                        ),
                    )}
                  <p className="mb-0">
                    &ndash; {response.respondent || 'Anonymous'}
                    <br />
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
