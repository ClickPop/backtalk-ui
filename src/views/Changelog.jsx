import React, { useContext, useEffect } from 'react';
import { ChangelogEntry } from '../components/ChangelogEntry';
import { context } from '../context/Context';

const Changelog = () => {
  const { state, dispatch } = useContext(context);

  useEffect(() => {
    if (!state.auth) {
      dispatch({ type: 'SET_NAVBAR', payload: 'public' });
    }
  }, [dispatch, state.auth]);

  return (
    <div className="container">
      <div className="row">
        <div className="col-12 col-sm-6 offset-sm-3">
          <h1>Changelog</h1>
          <p className="lead mb-4">
            A list of all the ways Backtalk is making it easier to get the
            answers you need, quickly.
          </p>
          <ChangelogEntry
            title="Device Details for Responses"
            date="November 20, 2020"
            description="It's the little details that matter most, so we added just a little flag at the bottom of each response to let you know what devices are being used by your audience. Additionally, we made some other small visual changes and minor bug fixes... but we doubt most people will even notice."
          />

          <ChangelogEntry
            title="Friendly Names for URL Questions"
            date="November 19, 2020"
            description="One of the most helpful time-saving features is how you can add questions on the fly using URL parameters. We've made it easier to understand what those parameters mean by giving them friendly names when viewing your responses."
          />

          <ChangelogEntry
            title="Download and Share Your Responses"
            date="November 18, 2020"
            description="Engage and educate your audience by downloading and sharing images of responses from your surveys."
          />
        </div>
      </div>
    </div>
  );
};

export default Changelog;
