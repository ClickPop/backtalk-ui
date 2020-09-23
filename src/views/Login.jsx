import React, { Fragment, useState } from 'react';
import classNames from 'classnames';

const Login = () => {
  let [email, setEmail] = useState('');
  let [password, setPassword] = useState('');
  let buttonState = {
    classes: classNames({
      btn: true,
      'btn-secondary': !email || !password,
      'btn-primary': email && password,
    }),
    disabled: !email || !password,
  };

  return (
    <Fragment>
      <div className="row justify-content-center">
        <section className="col-xl-4 col-md-6 col-sm-8 col-12 py-5">
          <header>
            <h2 className="h5 mb-4">Welcome back, let's get you logged in!</h2>
          </header>

          <form>
            <div className="mb-2">
              <label className="w-100">
                Email address
                <input
                  type="email"
                  className="form-control w-100 mt-1"
                  name="email"
                  placeholder="george.washington@backtalk.io"
                  onChange={(e) => setEmail(e.target.value)}
                />
              </label>
            </div>

            <div className="mb-2">
              <label className="w-100">
                Password
                <input
                  type="password"
                  className="form-control w-100 mt-1"
                  name="password"
                  placeholder="********"
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>

            <div>
              <button
                type="submit"
                className={buttonState.classes}
                disabled={buttonState.disabled}
              >
                Login
              </button>
            </div>
          </form>
        </section>
      </div>
    </Fragment>
  );
};

export default Login;
