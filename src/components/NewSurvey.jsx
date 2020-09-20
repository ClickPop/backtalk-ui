import React, { Fragment } from 'react';
let questionCount = 0;

const NewSurvey = () => {
  return (
    <Fragment>
      <form>
        <div className='row'>
          <div className='col-12 mb-4'>
            <label className='w-100'>
              <h4>What question do you want to ask?</h4>
              <input
                type='text'
                className='form-control mt-1'
                name={`question[${questionCount}]`}
                placeholder='Would you rather be a cat or a dog?'
                required
              />
            </label>
          </div>
        </div>

        <div className='row'>
          <div className='col-12 mb-4'>
            <label className='d-block' for='survey__questionRespondent'>
              <h4>Do you want to know who left your response?</h4>
              <p class='mb-1'>
                We're not going to do anything sneaky here, just ask them.
              </p>
            </label>
            <div class='form-check form-switch form-switch-lg'>
              <input
                class='form-check-input form-check-input-lg'
                type='checkbox'
                id='survey__questionRespondent'
              />
            </div>
          </div>
        </div>

        <div className='row'>
          <div class='col-12'>
            <button type='submit' className='btn btn-primary btn-block'>
              Publish
            </button>
          </div>
        </div>
      </form>
    </Fragment>
  );
};

export default NewSurvey;
