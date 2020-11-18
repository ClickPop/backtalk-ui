import React from 'react';
import { createPortal } from 'react-dom';

export const Modal = ({ children, show, handleModal, title }) => {
  return show
    ? createPortal(
        <div
          style={{
            position: 'fixed',
            width: '100vw',
            height: '100vh',
            top: '0px',
            left: '0px',
          }}
        >
          <div
            className="position-fixed w-100 h-100"
            style={{ backgroundColor: 'lightgrey', opacity: '0.6' }}
          ></div>
          <div className="modal" role="dialog" style={{ display: 'inherit' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="card-title">{title}</h6>
                  <button
                    className="btn btn-light"
                    onClick={() => handleModal(false)}
                  >
                    <span aria-hidden="true">&times;</span>
                  </button>
                </div>
                {children}
              </div>
            </div>
          </div>
        </div>,
        document.getElementById('portal'),
      )
    : null;
};
