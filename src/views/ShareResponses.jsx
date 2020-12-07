import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import * as axios from 'axios';
import { ResponseCard } from '../components/ResponseCard';
import anonymousNickname from '../helpers/anonymousNickname';

export const ShareResponses = () => {
  const [survey, setSurvey] = useState({});
  const [questions, setQuestions] = useState([]);
  const [nicknames, setNicknames] = useState({});
  const [friendlyNames, setFriendlyNames] = useState({});
  const params = useParams();
  const hash = useRef(params.hash);

  useEffect(() => {
    const fetchData = async () => {
      const res = await axios.get(`/api/v1/surveys/share/${hash.current}`);

      setSurvey(res.data.survey);
      setQuestions(res.data.survey.Questions);
      res.data.survey.Responses.forEach((response) => {
        if (!response.respondent) {
          setNicknames((n) => ({ ...n, [response.id]: anonymousNickname() }));
        }
        const fnames = res.data.survey.friendlyNames;
        if (fnames) {
          setFriendlyNames(fnames);
        } else {
          res.data.survey.Responses.forEach((response) => {
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
      });
    };

    fetchData();
  }, []);

  return (
    <div className="container">
      <div className="col-12 col-sm-10 col-lg-8 col-xl-6 mx-auto">
        <div className="row mb-3">
          <h2>{survey?.title}</h2>
        </div>
        <div className="row">
          {survey?.Responses?.map((response) => (
            <ResponseCard
              key={response.id}
              response={response}
              questions={questions}
              nicknames={nicknames}
              friendlyNames={friendlyNames}
              isShared={true}
            />
          ))}
        </div>
      </div>
    </div>
  );
};
