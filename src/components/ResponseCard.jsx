import React from 'react';
import Moment from 'react-moment';
import { Location } from '../components/Location';
import { Device } from '../components/Device';
import { Trash2, Download } from 'react-feather';
import decodeHtml from '../helpers/decodeHtml';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { Card } from './Card';

const CardActions = ({ share, handleModal, isShared }) => {
  return (
    <>
      <button
        type="button"
        className="btn p-1 d-none d-md-inline-block"
        onClick={share}
      >
        <Download size={18} className="text-muted" />
      </button>
      {!isShared && (
        <button type="button" className="btn p-1" onClick={handleModal}>
          <Trash2 size={18} className="text-muted" />
        </button>
      )}
    </>
  );
};

export const ResponseCard = ({
  response,
  questions,
  friendlyNames,
  nicknames,
  handleModal,
  isShared,
}) => {
  const share = async (id, name) => {
    let hiddenWrapper = document.createElement('div');
    let shareDiv = document.createElement('div');

    hiddenWrapper.style.visibility = 'visible';
    hiddenWrapper.style.position = 'fixed';
    hiddenWrapper.style.top = '0';
    hiddenWrapper.style.left = '0';
    hiddenWrapper.style.clip = 'rect(0 0 0 0)';

    shareDiv.innerHTML = document
      .getElementById(id)
      .getElementsByClassName('card-body')[0].innerHTML;
    shareDiv.style.display = 'block';
    shareDiv.style.width = '500px';
    shareDiv.classList = 'shared-response p-3 text-dark bg-white';

    document.body.appendChild(hiddenWrapper);
    hiddenWrapper.appendChild(shareDiv);

    let blob = await htmlToImage.toBlob(shareDiv);
    saveAs(blob, `Response_${id}_${name || 'Anonymous'}.png`);

    hiddenWrapper.removeChild(shareDiv);
    document.body.removeChild(hiddenWrapper);
  };

  return (
    <Card
      className="mb-4 p-3 response-preview"
      actions={
        <CardActions
          share={() => share(response.id, response.respondent)}
          handleModal={() => handleModal(true, response.id)}
          isShared={isShared}
        />
      }
      id={response.id}
    >
      <div className="share-content">
        <p className="text-muted">
          <strong>
            <Moment format="MMM D, YYYY">{response.createdAt}</Moment>{' '}
            <Moment format="h:mm a">{response.createdAt}</Moment>
          </strong>
        </p>
        {response.data &&
          response.data.map(
            (r, i) =>
              r && (
                <div key={`${r.id || r.key}_${response.id}_${i}`}>
                  <>
                    <p className="mt-4 mb-1 response__question">
                      {decodeHtml(
                        questions.find((q) => q.id === r.id)?.prompt ||
                          friendlyNames[r.key]?.savedValue,
                      )}
                    </p>
                    <div className="mb-4 pb-2 response__answer">{r.value}</div>
                  </>{' '}
                </div>
              ),
          )}
        <p className="mb-0 response__footer">
          &ndash; {response.respondent || nicknames[response.id]}{' '}
          {!isShared && (
            <>
              {' '}
              <span>
                from <Location data={response.geo} />
              </span>{' '}
              <span>
                on <Device data={response.device} />
              </span>
            </>
          )}
        </p>
      </div>
    </Card>
  );
};
