import React from 'react';
import { createPortal } from 'react-dom';

export const Modal = ({ children, show, handleModal, title }) => {
  return show
    ? createPortal(
        <div
          style={{
            position: 'absolute',
            width: '100vw',
            height: '100vh',
            top: '0px',
            left: '0px',
          }}
        >
          <div
            className="position-absolute w-100 h-100"
            style={{ backgroundColor: 'lightgrey', opacity: '0.4' }}
          ></div>
          <div className="card w-50 mx-auto my-5" style={{ zIndex: 15 }}>
            <div className="card-header d-flex justify-content-between align-items-center">
              <h6 className="card-title">{title}</h6>
              <button
                className="btn btn-sm btn-secondary flex-shrink"
                onClick={() => handleModal(false)}
              >
                X
              </button>
            </div>
            <div className="card-body">{children}</div>
          </div>
        </div>,
        document.getElementById('portal'),
      )
    : null;
};
