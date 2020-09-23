import React, { Fragment } from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import PageHome from './PageHome';
import PageLogin from './PageLogin';
import PageRegister from './PageRegister';
import PageSurveyFirst from './PageSurveyFirst';
import logo from './images/logo-mouth.png';
import { Navbar } from './Navbar';

function App() {
  return (
    <Fragment>
      <Router>
        <Navbar logo={logo} />
        <div className='app-inner py-4 container-fluid'>
          <Switch>
            <Route path='/login' component={PageLogin} />
            <Route path='/register' component={PageRegister} />
            <Route path='/survey/first' component={PageSurveyFirst} />
            <Route path='/' component={PageHome} />
          </Switch>
        </div>
      </Router>
    </Fragment>
  );
}

export default App;
