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
          <div className="modal" role="dialog" style={{ display: 'inherit' }}>
            <div className="modal-dialog" role="document">
              <div className="modal-content">
                <div className="modal-header">
                  <h6 className="card-title">{title}</h6>
                  <button
                    className="btn btn-sm btn-secondary flex-shrink"
                    onClick={() => handleModal(false)}
                  >
                    X
                  </button>
                </div>
                <div className="modal-body">{children}</div>
              </div>
            </div>
          </div>
        </div>,
        document.getElementById('portal'),
      )
    : null;
};
