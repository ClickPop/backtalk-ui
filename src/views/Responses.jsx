import * as axios from 'axios';
import React, { Fragment, useState, useEffect, useContext } from 'react';
import Moment from 'react-moment';
import { Location } from '../components/Location';
import { useParams } from 'react-router-dom';
import { context } from '../context/Context';
import { Modal } from '../components/Modal';

const exportCSV = (data) => {
  const keys = [];
  const csv = [];
  data.forEach((record) => {
    Object.keys(record).forEach((key) => {
      if (!keys.includes(key)) {
        keys.push(key);
      }
    });
    csv.push(jsonToCSV(record));
  });
  return [keys.join(','), ...csv].join('\r\n');
};

const jsonToCSV = (json) => {
  return Object.keys(json)
    .map((key) => {
      let returnVal = json[key];
      if (typeof returnVal === 'object') {
        returnVal = JSON.stringify(json[key]);
      }
      return /[,\r\n]/.test(`${returnVal}`)
        ? `"${returnVal.replace(/"/g, '')}"`
        : `${returnVal}`;
    })
    .join(',');
};

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

  const handleCSV = () => {
    const csv = exportCSV(responses);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, 'exported.csv');
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'exported.csv');
        link.style.visibility = 'hidden';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
      }
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-lg-8 offset-lg-2">
          {responses && (
            <div className="d-flex justify-content-end m-3">
              <button className="btn btn-sm btn-primary" onClick={handleCSV}>
                Export to CSV{' '}
                <span role="img" aria-label="csv">
                  💻
                </span>
              </button>
            </div>
          )}
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
                <button
                  type="button"
                  className="btn btn-inline response-preview__delete"
                  onClick={() => handleModal(true, response.id)}
                >
                  <span role="img" aria-label="Delete" title="Delete">
                    🗑
                  </span>
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
