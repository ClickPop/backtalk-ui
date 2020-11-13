import React, { useState } from 'react';
import { Redirect } from 'react-router-dom';
import NewSurvey from '../components/NewSurvey';

const FirstSurvey = () => {
  const [toDashboard, setToDashboard] = useState(false);

  if (toDashboard) {
    return <Redirect to="/dashboard" />;
  }

  return (
    <div className="container">
      <div className="row justify-content-center">
        <section className="col-xl-6 col-md-8 col-sm-10 col-12 py-5">
          <header>
            <h2 className="mb-5">Welcome! Let's create your first survey.</h2>
          </header>

          <NewSurvey toDashboard={setToDashboard} />
        </section>
      </div>
    </div>
  );
};

export default FirstSurvey;
