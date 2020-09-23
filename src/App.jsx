import React, { Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import Home from './views/Home';
import Login from './views/Login';
import Register from './views/Register';
import FirstSurvey from './views/FirstSurvey';
import logo from './images/logo-mouth.png';
import { Navbar } from './components/Nav';

const App = () => {
  return (
    <Fragment>
      <Router>
        <Navbar logo={logo} />
        <div className="app-inner py-4 container-fluid">
          <Switch>
            <Route path="/login" component={Login} />
            <Route path="/register" component={Register} />
            <Route path="/surveys/first" component={FirstSurvey} />
            <Route path="/" component={Home} />
          </Switch>
        </div>
      </Router>
    </Fragment>
  );
};

export default App;
