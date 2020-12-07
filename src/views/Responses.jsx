import * as axios from 'axios';
import React, { useState, useEffect, useContext } from 'react';
import { useParams } from 'react-router-dom';
import { FeedbackFloat } from '../components/FeedbackFloat';
import { FileText } from 'react-feather';
import { context } from '../context/Context';
import { Modal } from '../components/Modal';
import anonymousNickname from '../helpers/anonymousNickname';
import { EditInPlaceInput } from '../components/EditInPlaceInput';
import { ResponseCard } from '../components/ResponseCard';

export const Responses = () => {
  const params = useParams();
  const [survey, setSurvey] = useState({});
  const [surveyTitle, setSurveyTitle] = useState(null);
  const [responses, setResponses] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [show, setShow] = useState(false);
  const [deleteResponse, setDeleteResponse] = useState(null);
  const [deleted, setDeleted] = useState(false);
  const [friendlyNames, setFriendlyNames] = useState({});
  const [nicknames, setNicknames] = useState({});
  const { state } = useContext(context);
  const [queryResponses, setQueryResponses] = useState({});
  const [isPublic, setIsPublic] = useState(null);

  useEffect(() => {
    const getResponses = async () => {
      try {
        const res = await axios.get(`/api/v1/responses/${params.hash}`, {
          headers: { Authorization: `Bearer ${state.token}` },
        });
        setSurvey(res.data.survey);
        setIsPublic(res.data.survey.isPublic);
        setSurveyTitle(res.data.survey.title);
        setResponses(
          res.data.results
            .sort(
              (a, b) =>
                new Date(b.updatedAt).getTime() -
                new Date(a.updatedAt).getTime(),
            )
            .map((res) => ({
              ...res,
              data: res.data.sort((a, b) => {
                if (a.type === 'query') {
                  return -1;
                } else {
                  return 1;
                }
              }),
            })),
        );
        const qResponses = {};
        res.data.results.forEach((resp) => {
          resp.data.forEach((d) => {
            if (d.type === 'query') {
              if (!qResponses[d.key]) {
                qResponses[d.key] = {};
              }
              if (!qResponses[d.key][d.value]) {
                qResponses[d.key][d.value] = {
                  count: 1,
                };
              } else {
                qResponses[d.key][d.value].count++;
              }
            }
          });
        });
        setQueryResponses(qResponses);
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
        const fnames = localStorage.getItem(`friendly_${params.hash}`);
        if (fnames) {
          setFriendlyNames(JSON.parse(fnames));
        } else {
          res.data.results.forEach((response) => {
            response.data.forEach((r) => {
              if (r.key) {
                setFriendlyNames((f) => ({
                  ...f,
                  [r.key]: {
                    value: r.key,
                    savedValue: r.key,
                  },
                }));
              }
            });
          });
        }
      } catch (error) {
        console.error(error);
        //TODO add error popup
      }
    };
    getResponses();
    if (deleted) setDeleted(false);
  }, [params.hash, state.token, deleted]);

  useEffect(() => {
    responses.forEach((response) => {
      if (!response.respondent) {
        setNicknames((n) => ({ ...n, [response.id]: anonymousNickname() }));
      }
    });
  }, [responses]);

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

  const handleSave = (e, key) => {
    e.preventDefault();
    setFriendlyNames({
      ...friendlyNames,
      [key]: { ...friendlyNames[key], savedValue: friendlyNames[key].value },
    });
    document.getElementById(`${key}_input`).blur();
    localStorage.setItem(
      `friendly_${params.hash}`,
      JSON.stringify({
        ...friendlyNames,
        [key]: { ...friendlyNames[key], savedValue: friendlyNames[key].value },
      }),
    );
  };

  const handleFriendlyName = (value, name) => {
    setFriendlyNames({
      ...friendlyNames,
      [name]: {
        ...friendlyNames[name],
        value: value,
      },
    });
  };

  const exportCSV = (data) => {
    const keys = new Set(['respondent']);
    data.forEach((record) => {
      record.data.forEach((res) => {
        if (res.id) {
          keys.add(questions.find((q) => q.id === res.id).prompt);
        } else if (res.key) {
          keys.add(friendlyNames[res.key].value);
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

  const handleTitleSave = async (e) => {
    e.preventDefault();
    if (survey?.title !== surveyTitle) {
      try {
        const res = await axios({
          method: 'patch',
          url: '/api/v1/surveys/update',
          headers: { Authorization: `Bearer ${state.token}` },
          data: {
            surveyId: survey.id,
            title: surveyTitle,
          },
        });
        setSurvey(res.data.result);
        setSurveyTitle(res.data.result.title);
        document.activeElement.blur();
      } catch (err) {
        console.error(err);
        // TODO error popup
      }
    }
  };

  const handlePublic = async (e) => {
    e.preventDefault();
    setIsPublic(e.target.checked);
    try {
      const res = await axios({
        method: 'patch',
        url: '/api/v1/surveys/update',
        headers: { Authorization: `Bearer ${state.token}` },
        data: {
          surveyId: survey.id,
          isPublic: e.target.checked,
        },
      });
      setSurvey(res.data.result);
      setSurveyTitle(res.data.result.title);
      document.activeElement.blur();
    } catch (err) {
      console.error(err);
      // TODO error popup
    }
  };

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 order-sm-2 col-sm-6 col-lg-4">
          <h2 className="h3 mb-3">Settings</h2>

          {isPublic !== null && (
            <>
              <h3 className="h5">
                Would you like the survey responses to be public?
              </h3>
              <div className="form-check form-switch form-switch-lg mb-3">
                <input
                  className="form-check-input form-check-input-lg"
                  type="checkbox"
                  name="is-public"
                  onChange={handlePublic}
                  checked={isPublic}
                />
              </div>
            </>
          )}

          <h3 className="h5">URL Questions</h3>
          <p>
            You can dynamically add new questions and answers to links you share
            by adding <span className="text-monospace">?question=answer</span>{' '}
            paramaters to your survey share URLs.
          </p>

          {friendlyNames &&
            Object.keys(friendlyNames).map((name) => (
              <div key={name}>
                <EditInPlaceInput
                  key={name}
                  name={name}
                  id={`${name}_input`}
                  value={friendlyNames[name]?.value}
                  initialValue={friendlyNames[name]?.savedValue}
                  setValue={(v) => handleFriendlyName(v, name)}
                  onSubmit={(e) => {
                    handleSave(e, name);
                  }}
                  label={friendlyNames[name]?.savedValue}
                  showLabel={true}
                />

                <div className="card">
                  {queryResponses[name] && (
                    <ul className="list-group list-group-flush">
                      {Object.keys(queryResponses[name])
                        .sort(
                          (a, b) =>
                            queryResponses[name][b].count -
                            queryResponses[name][a].count,
                        )
                        .map((r) => (
                          <li
                            key={r}
                            className="list-group-item d-flex justify-content-between"
                          >
                            <span>{r}</span>
                            <span>{queryResponses[name][r].count}</span>
                          </li>
                        ))}
                    </ul>
                  )}
                </div>
              </div>
            ))}
        </div>
        <div className="col-12 order-sm-1 col-sm-6 col-lg-8 pr-sm-4">
          <div className="d-flex justify-content-between align-items-center">
            <div className="mb-3 mr-0 mr-md-3 flex-fill">
              {surveyTitle !== null && (
                <EditInPlaceInput
                  name="titleEdit"
                  id="surveyTitle"
                  value={surveyTitle}
                  initialValue={survey?.title}
                  setValue={setSurveyTitle}
                  onSubmit={handleTitleSave}
                />
              )}
            </div>
            {responses && (
              <div className="mb-3 text-right d-none d-md-block">
                <button
                  type="button"
                  className="btn btn-sm btn-secondary d-flex"
                  onClick={handleCSV}
                >
                  Export to CSV{' '}
                  <FileText size={18} className="text-white ml-2" />
                </button>
              </div>
            )}
          </div>
          <div>
            {responses.map((response) => (
              <ResponseCard
                key={response.id}
                response={response}
                questions={questions}
                friendlyNames={friendlyNames}
                nicknames={nicknames}
                handleModal={handleModal}
              />
            ))}
          </div>
        </div>
      </div>
      <Modal show={show} handleModal={handleModal} title="Delete Response">
        <div className="modal-body">
          Are you sure you want to delete this response? Once it's gone, it's
          gone.
        </div>
        <div className="modal-footer">
          <button
            type="button"
            className="btn btn-white"
            onClick={() => handleModal(false)}
          >
            Cancel
          </button>
          <button
            type="button"
            className="btn btn-danger"
            onClick={() => handleDelete(deleteResponse)}
          >
            Delete
          </button>
        </div>
      </Modal>
      <FeedbackFloat />
    </div>
  );
};
