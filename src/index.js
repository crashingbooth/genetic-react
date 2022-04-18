import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './Components/App';
import PositionProvider from './Providers/positionContext';
import PatternProvider from './Providers/patternContext';
import reportWebVitals from './reportWebVitals';

ReactDOM.render(
  <React.StrictMode>
    <PositionProvider>
      <PatternProvider>
        <App />
      </PatternProvider>
    </PositionProvider>
  </React.StrictMode>,
  document.getElementById('root')
);

reportWebVitals();
