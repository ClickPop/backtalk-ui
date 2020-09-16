import React from "react";

const PageRegister = () => {
  return (
    <React.Fragment>
      <div className="row justify-content-center">
        <section className="col-xl-6 col-md-8 col-sm-10 col-12 py-5">
          <header>
            <h2 className="h5 mb-1">Hi, we're so glad you're here!</h2>
            <p className="mb-4">
              Let's get you all signed up so you can make your first survey.
            </p>
          </header>

          <form className="needs-validation" novalidate>
            <div className="row">
              <div className="col-sm-6 mb-2">
                <label className="w-100">
                  First Name
                  <input
                    type="text"
                    className="form-control mt-1"
                    name="firstName"
                    placeholder="George"
                    required
                  />
                </label>
              </div>
              <div className="col-sm-6 mb-2">
                <label className="w-100">
                  Last Name
                  <input
                    type="text"
                    className="form-control mt-1"
                    name="lastName"
                    placeholder="Washington"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="row">
              <div className="col-12 mb-2">
                <label className="w-100">
                  Email Address
                  <input
                    type="email"
                    className="form-control w-100 mt-1"
                    name="email"
                    placeholder="george.washington@backtalk.io"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="row">
              <div className="col-sm-6 mb-2">
                <label className="w-100">
                  Password
                  <input
                    type="password"
                    className="form-control mt-1"
                    name="password"
                    placeholder="********"
                    required
                  />
                </label>
              </div>
              <div className="col-sm-6 mb-2">
                <label className="w-100">
                  Confirm Password
                  <input
                    type="password"
                    className="form-control mt-1"
                    name="passwordConfirm"
                    placeholder="********"
                    required
                  />
                </label>
              </div>
            </div>

            <div className="row">
              <div className="col-12">
                <p className="my-2 text-center">
                  <button type="submit" className="btn btn-primary btn-lg w-50">
                    Sign Me Up!
                  </button>
                </p>
              </div>
            </div>
          </form>
        </section>
      </div>
    </React.Fragment>
  );
};

export default PageRegister;
