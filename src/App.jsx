import React, { Fragment, useContext, useEffect } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './views/Home';
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

const App = () => {
  const { state, dispatch } = useContext(context);
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
    return () => {
      canceled = true;
    };
  }, [state.auth, dispatch]);

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
            <Route path="/survey/:hash" component={Response} />
            <Route component={Error404} />
          </Switch>
        </div>
      </Router>
    </Fragment>
  );
};

export default App;
