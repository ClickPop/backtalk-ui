import React, { Fragment, useContext, useState } from 'react';
import { context } from '../context/Context';
import * as axios from 'axios';

const submitSurvey = async (data, token) => {
  const { title, questions, respondent } = data;
  const survey = await axios.post(
    '/api/v1/surveys/new',
    {
      title,
      questions,
      respondent,
    },
    {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    },
  );
  return survey;
};

const initialState = {
  question: '',
  respondent: false,
};

const NewSurvey = ({ surveys, setSurveys, toDashboard }) => {
  const { state, dispatch } = useContext(context);
  const [form, setForm] = useState(initialState);

  const handleChange = (e) => {
    e.preventDefault();
    setForm({ ...form, question: e.target.value });
  };

  const handleToggle = (e) => {
    setForm({ ...form, respondent: e.target.checked });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    const survey = {
      title: form.question,
      questions: [{ prompt: form.question, type: 'text' }],
      respondent: form.respondent,
    };
    try {
      const newSurvey = await submitSurvey(survey, state.token);
      // const hash = await axios.get(
      //   `/api/v1/surveys/getHash?num=${newSurvey.data.result.id}`,
      // );
      setForm(initialState);
      if (setSurveys) {
        setSurveys([...surveys, newSurvey.data.result]);
      }
      if (toDashboard) {
        toDashboard(true);
      }
    } catch (err) {
      if (err?.response?.status === 401) {
        const login = await axios.post('/api/v1/auth/refresh_token');
        dispatch({ type: 'LOGIN', payload: login.data.accessToken });
        const newSurvey = await submitSurvey(survey, state.token);
        // const hash = await axios.get(
        //   `/api/v1/surveys/getHash?num=${newSurvey.data.result.id}`,
        // );
        if (setSurveys) {
          setSurveys([...surveys, newSurvey.data.result]);
        }
        if (toDashboard) {
          toDashboard(true);
        }
        setForm(initialState);
      } else {
        console.error(err);
      }
    }
  };

  return (
    <Fragment>
      <form>
        <div className="row">
          <div className="col-12 mb-5">
            <label className="w-100">
              <h1 className="h5">What question do you want to ask?</h1>
              <input
                type="text"
                className="form-control mt-1"
                name="new-question"
                placeholder="Would you rather be a cat or a dog?"
                required
                onChange={handleChange}
              />
            </label>
          </div>
        </div>

        <div className="row">
          <div className="col-12 mb-4">
            <label className="d-block" htmlFor="survey__questionRespondent">
              <h1 className="h5">
                Do you want to know who left your response?
              </h1>
              <p className="mb-1">
                We're not going to do anything sneaky here, just ask them.
              </p>
            </label>
            <div className="form-check form-switch form-switch-lg">
              <input
                className="form-check-input form-check-input-lg"
                type="checkbox"
                id="survey__questionRespondent"
                onChange={handleToggle}
              />
            </div>
          </div>
        </div>

        <div className="row">
          <div className="col-12">
            <button
              type="submit"
              className="btn btn-primary btn-block"
              onClick={handleSubmit}
            >
              Publish
            </button>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default NewSurvey;
