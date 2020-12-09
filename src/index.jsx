import React from 'react';
import ReactDOM from 'react-dom';
import './scss/index.scss';
import 'mapbox-gl/dist/mapbox-gl.css';
import App from './App';
import 'bootstrap';
import 'popper.js';
import { Context } from './context/Context';

ReactDOM.render(
  <React.StrictMode>
    <Context>
      <App />
    </Context>
  </React.StrictMode>,
  document.getElementById('root'),
);
