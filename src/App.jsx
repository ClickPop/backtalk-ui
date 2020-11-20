import React, { Fragment, useContext, useEffect, useState } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './views/Home';
import Changelog from './views/Changelog';
import Login from './views/Login';
import Register from './views/Register';
import FirstSurvey from './views/FirstSurvey';
import logo from './images/bktk-logo.svg';
import { Navbar } from './components/Nav';
import { Dashboard } from './views/Dashboard';
import { ProtectedRoute } from './components/ProtectedRoute';
import { context } from './context/Context';
import * as axios from 'axios';
import { Error404 } from './views/Error404';
import { Response } from './views/Response';
import { Responses } from './views/Responses';
import packageJson from '../package.json';

if (process.env.NODE_ENV === 'production')
  axios.defaults.baseURL = process.env.REACT_APP_BASE_URL;

axios.defaults.withCredentials = true;

const insertVersionMeta = async () => {
  let metaUI = document.createElement('meta');
  metaUI.setAttribute('property', 'backtalk:ui:version');
  metaUI.content = packageJson.version || 'unknown';
  document.getElementsByTagName('head')[0].appendChild(metaUI);

  if (process.env.NODE_ENV === 'production') {
    const apiDetails = await axios.get('/');
    let metaAPI = document.createElement('meta');
    metaAPI.setAttribute('property', 'backtalk:api:version');
    metaAPI.content = apiDetails.api.version || 'unknown';
    document.getElementsByTagName('head')[0].appendChild(metaAPI);
  }
};

const App = () => {
  const { state, dispatch } = useContext(context);
  const [metaAdded, setMetaAdded] = useState(false);

  useEffect(() => {
    let canceled = false;
    const handleRefresh = async () => {
      if (!state.auth) {
        try {
          dispatch({ type: 'SET_LOADING', payload: true });
          const login = await axios.post('/api/v1/auth/refresh_token');
          if (!canceled) {
            dispatch({ type: 'LOGIN', payload: login.data.accessToken });
          }
        } catch (err) {
          if (err.response.status === 401) {
          }
        }
      }
    };

    handleRefresh();
    if (!metaAdded) {
      insertVersionMeta();
      setMetaAdded(true);
    }

    return () => {
      canceled = true;
    };
  }, [state.auth, dispatch, metaAdded]);

  return (
    <Fragment>
      <Router>
        {!window.location.pathname.match(/\/survey\/.+/) && (
          <Navbar logo={logo} />
        )}
        <div className="app-inner">
          <Switch>
            <Route exact path="/login" component={Login} />
            <Route exact path="/register" component={Register} />
            <ProtectedRoute
              exact
              path="/surveys/first"
              component={FirstSurvey}
            />
            <ProtectedRoute exact path="/dashboard" component={Dashboard} />
            <ProtectedRoute
              exact
              path="/responses/:hash"
              component={Responses}
            />
            <Route exact path="/" component={Home} />
            <Route exact path="/changelog" component={Changelog} />
            <Route path="/survey/:hash" component={Response} />
            <Route component={Error404} />
          </Switch>
        </div>
      </Router>
    </Fragment>
  );
};

export default App;
