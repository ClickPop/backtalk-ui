import React from "react";
import { BrowserRouter as Router, Switch, Route, Link } from "react-router-dom";
import PageHome from "./PageHome";
import PageLogin from "./PageLogin";
import PageRegister from "./PageRegister";
import PageSurveyFirst from "./PageSurveyFirst";
import logo from "./images/logo-mouth.png";

function App() {
  return (
    <React.Fragment>
      <Router>
        <nav className="navbar navbar-expand-sm d-none-md bg-primary">
          <div className="container-fluid">
            <a className="navbar-brand" href="/" title="Survey Says">
              <img
                src={logo}
                className="navbar-logo"
                alt="Survey Says"
                loading="lazy"
              />
            </a>{" "}
            <button
              className="navbar-toggler"
              type="button"
              data-toggle="collapse"
              data-target="#navbarNav"
              aria-controls="navbarNav"
              aria-expanded="false"
              aria-label="Toggle navigation"
            >
              <span className="navbar-toggler-icon"> </span>{" "}
            </button>{" "}
            <div className="collapse navbar-collapse" id="navbarNav">
              <ul className="navbar-nav justify-content-end ml-auto">
                <li className="nav-item">
                  <Link
                    to={{ pathname: "/login" }}
                    className="nav-link text-light"
                  >
                    Login{" "}
                  </Link>{" "}
                </li>{" "}
                <li className="nav-item">
                  <Link
                    to={{ pathname: "/register" }}
                    className="btn btn-outline-light"
                  >
                    Sign Up{" "}
                  </Link>{" "}
                </li>{" "}
              </ul>{" "}
            </div>{" "}
          </div>{" "}
        </nav>
        <div className="app-inner py-4 container-fluid">
          <Switch>
            <Route path="/login" component={PageLogin} />{" "}
            <Route path="/register" component={PageRegister} />{" "}
            <Route path="/survey/first" component={PageSurveyFirst} />{" "}
            <Route path="/" component={PageHome} />{" "}
          </Switch>{" "}
        </div>{" "}
      </Router>{" "}
    </React.Fragment>
  );
}

export default App;
