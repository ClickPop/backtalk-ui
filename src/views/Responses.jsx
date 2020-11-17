import * as axios from 'axios';
import React, { Fragment, useState, useEffect, useContext } from 'react';
import Moment from 'react-moment';
import { Location } from '../components/Location';
import { useParams } from 'react-router-dom';
import { Trash2 } from 'react-feather';
import { context } from '../context/Context';
import { Modal } from '../components/Modal';
import decodeHtml from '../helpers/decodeHtml';
import anonymousNickname from '../helpers/anonymousNickname';

export const Responses = () => {
  const params = useParams();
  const [responses, setResponses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [show, setShow] = useState(false);
  const [deleteResponse, setDeleteResponse] = useState(null);
  const [deleted, setDeleted] = useState(false);
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
        console.log(res.data.results[0]);
      } catch (error) {
        console.error(error);
        //TODO add error popup
      }
    };
    getResponses();
    if (deleted) setDeleted(false);
  }, [params.hash, state.token, deleted]);

  const handleDelete = async (id) => {
    try {
      const res = await axios({
        method: 'delete',
        url: '/api/v1/responses/delete',
        headers: { Authorization: `Bearer ${state.token}` },
        data: {
          responseId: id,
        },
      });
      setDeleted(res.data.deleted);
      handleModal(false);
    } catch (err) {
      console.error(err);
      //TODO add error popup
    }
  };

  const handleModal = (display, id) => {
    setDeleteResponse(display ? id : null);
    setShow(display);
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-lg-8 offset-lg-2">
          <div>
            {responses.map((response) => (
              <div className="card mb-4 response-preview" key={response.id}>
                <div className="card-body mx-3 my-2">
                  <p className="text-muted">
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
                              <p className="mt-4 mb-1 response__question">
                                {decodeHtml(
                                  questions.find((q) => q.id === r.id)
                                    ?.prompt || r.key,
                                )}
                              </p>
                              <div className="mb-4 pb-2 response__answer">
                                {r.value}
                              </div>
                            </Fragment>{' '}
                          </div>
                        ),
                    )}
                  <p className="mb-0">
                    &ndash; {response.respondent || anonymousNickname()} from{' '}
                    <Location data={response.geo} />
                  </p>
                </div>
                <button
                  type="button"
                  className="btn btn-inline response-preview__delete"
                  onClick={() => handleModal(true, response.id)}
                >
                  <Trash2 size={18} className="text-muted" />
                </button>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal
        show={show}
        handleModal={handleModal}
        title="Are you sure you want to delete this response?"
      >
        <div className="d-flex justify-content-around">
          <button
            className="btn btn-lg btn-success"
            onClick={() => handleDelete(deleteResponse)}
          >
            Yes
          </button>
          <button
            className="btn btn-lg btn-danger"
            onClick={() => handleModal(false)}
          >
            No
          </button>
        </div>
      </Modal>
    </div>
  );
};
