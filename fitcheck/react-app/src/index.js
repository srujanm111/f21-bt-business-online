/* FITCHECK
* WEB FRONTEND
* CVGT F21-BT-BUSINESS-ONLINE
*/

// index page root

import './common';

import React from 'react';
import ReactDOM from 'react-dom';

import './index.css';

import App from './App';

const reportWebVitals = onPerfEntry => {
  if (onPerfEntry && onPerfEntry instanceof Function) {
    import('web-vitals').then(({ getCLS, getFID, getFCP, getLCP, getTTFB }) => {
      getCLS(onPerfEntry);
      getFID(onPerfEntry);
      getFCP(onPerfEntry);
      getLCP(onPerfEntry);
      getTTFB(onPerfEntry);
    });
  }
};

ReactDOM.render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
  document.getElementById('root')
);

// report web vitals to console
if (global.config.report_web_vitals)
  reportWebVitals(console.log);
