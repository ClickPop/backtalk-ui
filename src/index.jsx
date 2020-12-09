import React from 'react';
import ReactDOM from 'react-dom';
import './scss/index.scss';
import App from './App';
import 'tailwindcss/tailwind.css';
// import 'bootstrap/dist/css/bootstrap.css';
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
