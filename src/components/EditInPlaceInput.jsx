import React, { useState } from 'react';

import { CheckCircle, XCircle } from 'react-feather';

export const EditInPlaceInput = ({
  value,
  setValue,
  initialValue,
  name,
  id,
  label,
  onSubmit,
  showLabel,
  labelAsDescription,
}) => {
  const [clickToEdit, setClickToEdit] = useState(false);

  const onBlur = () => {
    if (value === initialValue) {
      setClickToEdit(false);
    }
  };

  const clear = () => {
    if (initialValue && value !== initialValue) {
      setValue(initialValue);
      setClickToEdit(false);
    }
  };

  const onKeyDown = (e) => {
    if (e.key === 'Escape') {
      clear();
      e.target.blur();
    }
  };

  return (
    <form onSubmit={onSubmit} className="form-group flex-fill">
      {!labelAsDescription && (
        <label htmlFor={id} className={`form-label ${!showLabel && 'visually-hidden'}`}>
          {label}
        </label>
      )}
        <div className={`input-group ${!clickToEdit ? 'click-to-edit' : 'click-to-edit__active'}`}>
          <input
            autoComplete="off"
            type="text"
            name={name}
            className="form-control fw-bold"
            id={id}
            value={value}
            onChange={(e) => setValue(e.target.value)}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            onFocus={() => setClickToEdit(true)}
          />
          {value !== initialValue && (
            <>
              <button
                type="button"
                className="btn btn-outline-natural"
                disabled={value === initialValue}
                onClick={clear}
              >
                <XCircle size={18} />
              </button>
              <button
                className="btn btn-outline-natural"
                type="submit"
                disabled={value === initialValue}
                onClick={() => setClickToEdit(false)}
              >
                <CheckCircle size={18} className="text-success" />
              </button>
            </>
          )}
        </div>
      {(labelAsDescription) && (
        <label htmlFor={id} className={`form-text ${(!showLabel || !clickToEdit) && 'visually-hidden'}`}>
          {label}
        </label>
      )}
    </form>
  );
};
