import * as axios from 'axios';
import React, { Fragment, useState, useEffect, useContext } from 'react';
import Moment from 'react-moment';
import { Location } from '../components/Location';
import { useParams } from 'react-router-dom';
import { Trash2, Download, FileText } from 'react-feather';
import { context } from '../context/Context';
import { Modal } from '../components/Modal';
import decodeHtml from '../helpers/decodeHtml';
import anonymousNickname from '../helpers/anonymousNickname';
import html2canvas from 'html2canvas';

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
        setResponses(
          res.data.results.sort(
            (a, b) =>
              new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
          ),
        );
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

  const share = async (id, name) => {
    const canvas = await html2canvas(
      document.getElementById(id).getElementsByClassName('card-body')[0],
      {
        scrollX: 0,
        scrollY: -window.scrollY,
      },
    );
    canvas.style.display = 'none';
    document.body.appendChild(canvas);
    const image = canvas
      .toDataURL('image/png')
      .replace('image/png', 'image/octet-stream');
    const a = document.createElement('a');
    a.setAttribute('download', `${id}_${name || 'Anonymous'}.png`);
    a.setAttribute('href', image);
    a.click();
  };

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

  const exportCSV = (data) => {
    const keys = new Set(['respondent']);
    data.forEach((record) => {
      record.data.forEach((res) => {
        if (res.id) {
          keys.add(questions.find((q) => q.id === res.id).prompt);
        } else if (res.key) {
          keys.add(res.key);
        }
      });
    });
    keys.add('updatedAt');
    const csv = data.map((record) => {
      const returnVal = {
        respondent: record.respondent,
        updatedAt: new Date(record.updatedAt).toString(),
      };
      record.data.forEach((res) => {
        if (res.id) {
          returnVal[questions.find((q) => q.id === res.id).prompt] = res.value;
        } else if (res.key) {
          returnVal[res.key] = res.value;
        }
      });
      return jsonToCSV(returnVal, Array.from(keys));
    });

    return [Array.from(keys).join(','), ...csv].join('\r\n');
  };

  const jsonToCSV = (json, keys) => {
    return keys
      .map((key) => {
        let returnVal = json[key];
        if (!returnVal) return '';
        if (typeof returnVal === 'object') {
          returnVal = JSON.stringify(json[key]);
        }
        return /[,\r\n]/.test(`${returnVal}`)
          ? `"${returnVal.replace(/"/g, '')}"`
          : `${returnVal}`;
      })
      .join(',');
  };

  const handleCSV = () => {
    const csv = exportCSV(responses);
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
    if (navigator.msSaveBlob) {
      // IE 10+
      navigator.msSaveBlob(blob, 'backtalk_results.csv');
    } else {
      const link = document.createElement('a');
      if (link.download !== undefined) {
        // feature detection
        // Browsers that support HTML5 download attribute
        const url = URL.createObjectURL(blob);
        link.setAttribute('href', url);
        link.setAttribute('download', 'backtalk_results.csv');
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
            <div className="d-flex justify-content-end mb-3">
              <button
                className="btn btn-sm btn-secondary d-flex"
                onClick={handleCSV}
              >
                Export to CSV <FileText size={18} className="text-white ml-2" />
              </button>
            </div>
          )}
          <div>
            {responses.map((response) => (
              <div
                className="card mb-4 response-preview"
                key={response.id}
                id={response.id}
              >
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
                <div className="response-preview__actions">
                  <button
                    type="button"
                    className="btn p-1"
                    onClick={() => share(response.id, response.respondent)}
                  >
                    <Download size={18} />
                  </button>
                  <button
                    type="button"
                    className="btn p-1"
                    onClick={() => handleModal(true, response.id)}
                  >
                    <Trash2 size={18} />
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Modal show={show} handleModal={handleModal} title="Delete Response">
        <div className="modal-body">
          Are you sure you want to delete this response? Once it's gone, it's
          gone.
        </div>
        <div class="modal-footer">
          <button className="btn btn-white" onClick={() => handleModal(false)}>
            Cancel
          </button>
          <button
            className="btn btn-danger"
            onClick={() => handleDelete(deleteResponse)}
          >
            Delete
          </button>
        </div>
      </Modal>
    </div>
  );
};
