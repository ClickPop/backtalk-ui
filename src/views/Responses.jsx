import * as axios from 'axios';
import React, { Fragment, useState, useEffect, useContext } from 'react';
import Moment from 'react-moment';
import { Location } from '../components/Location';
import { useParams } from 'react-router-dom';
import { context } from '../context/Context';

export const Responses = () => {
  const params = useParams();
  const [responses, setResponses] = useState([]);
  const [questions, setQuestions] = useState([]);
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

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-lg-8 offset-lg-2">
          <div>
            {responses.map((response) => (
              <div className="card mb-4 response-preview" key={response.id}>
                <div className="card-body mx-3 my-2">
                  <p className="text-secondary">
                    <strong>
                      <Moment format="MMM D, YYYY">{response.createdAt}</Moment>{' '}
                      <Moment format="h:mm a">{response.createdAt}</Moment>
                    </strong>
                  </p>
                  {response.data &&
                    response.data.map(
                      (r) =>
                        r && (
                          <div key={`${response.id + r.id}`}>
                            <Fragment>
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
                    &ndash; {response.respondent || 'Anonymous'} from{' '}
                    <Location data={response.geo} />
                  </p>
                </div>
                <button type="button" class="btn btn-inline response-preview__delete"><span role="img" aria-label="Delete" title="Delete">🗑</span></button>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};
