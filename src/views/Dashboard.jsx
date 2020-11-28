import React, { useContext, useEffect, useState } from 'react';
import { context } from '../context/Context';
import * as axios from 'axios';
import { Link, Redirect } from 'react-router-dom';
import { Trash2, ExternalLink, MessageCircle } from 'react-feather';
import NewSurvey from '../components/NewSurvey';
import { Modal } from '../components/Modal';
import decodeHtml from '../helpers/decodeHtml';
import { Card } from '../components/Card';

const CardTitle = ({ survey }) => {
  return (
    <Link to={`/responses/${survey.hash}`} className="text-decoration-none">
      {decodeHtml(survey.title)}
    </Link>
  );
};

const CardActions = ({ onClick }) => {
  return (
    <button
      type="button"
      className="btn btn-inline response-preview__delete"
      onClick={onClick}
    >
      <Trash2 size={18} className="text-muted" />
    </button>
  );
};

export const Dashboard = () => {
  const { state } = useContext(context);
  const [surveys, setSurveys] = useState(null);
  const [show, setShow] = useState(false);
  const [deleteResponse, setDeleteResponse] = useState(null);
  const [deleted, setDeleted] = useState(false);

  const handleDelete = async (id) => {
    try {
      const res = await axios({
        method: 'delete',
        url: '/api/v1/surveys/delete',
        headers: { Authorization: `Bearer ${state.token}` },
        data: {
          surveyId: id,
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

  useEffect(() => {
    let cancelled = false;
    const getSurveys = async () => {
      try {
        const userSurveys = await axios.get('/api/v1/surveys', {
          headers: { Authorization: `Bearer ${state.token}` },
        });
        if (!cancelled) {
          setSurveys(userSurveys.data.results);
        }
      } catch (err) {
        console.error(err);
      }
    };
    getSurveys();
    if (deleted) setDeleted(false);
    return () => {
      cancelled = true;
    };
  }, [state.token, deleted]);

  if (!state.auth) {
    return <Redirect to="/login" />;
  }

  if (state.loading) {
    return <p>Loading...</p>;
  }

  return (
    <div className="container">
      <div className="row">
        {surveys && surveys.length < 1 && !state.loading && (
          <Redirect to="/surveys/first" />
        )}
        <Modal show={show} handleModal={handleModal} title="Delete Response">
          <div className="modal-body">
            Are you sure you want to delete this response? Once it's gone, it's
            gone.
          </div>
          <div className="modal-footer">
            <button
              className="btn btn-white"
              onClick={() => handleModal(false)}
            >
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
        <div className="col-12 order-md-2 col-md-6 col-lg-4">
          <h2 className="mb-4">New Survey</h2>
          <NewSurvey surveys={surveys} setSurveys={setSurveys} />
          <hr className="d-block d-md-none my-4" />
        </div>
        <div className="col-12 order-md-1 col-md-6 col-lg-8 pr-sm-4">
          <h1 className="mb-4">Your Surveys</h1>
          <div className="row no-gutters">
            {surveys &&
              !state.loading &&
              surveys.map((survey) => (
                <div key={survey.id} className="col-12 pr-0 pr-xl-2">
                  <Card
                    className="p-3 mb-4"
                    title={<CardTitle survey={survey} />}
                    actions={
                      <CardActions
                        onClick={() => handleModal(true, survey.id)}
                      />
                    }
                  >
                    <div className="mb-2 d-flex align-items-center">
                      <MessageCircle size={18} className="mr-2 text-muted" />
                      {survey?.Responses?.length ? (
                        <Link
                          to={`/responses/${survey.hash}`}
                          className="text-decoration-none"
                        >
                          {survey.Responses.length} responses
                        </Link>
                      ) : (
                        'No responses yet'
                      )}
                    </div>
                    <div className="d-flex align-items-center">
                      <ExternalLink size={18} className="mr-2 text-muted" />
                      <Link
                        to={`/survey/${survey.hash}`}
                        className="text-decoration-none"
                        target="_blank"
                      >{`${window.location.host}/survey/${survey.hash}`}</Link>
                    </div>
                  </Card>
                </div>
              ))}
          </div>
        </div>
      </div>
    </div>
  );
};
