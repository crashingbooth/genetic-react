import React, { useState, useRef, useContext, useEffect } from 'react';
import '../Styles/Dot.css';
import Track from './Track';
import Transport from './Transport';
import {patternContext} from '../Providers/patternContext';

function App() {
  const { lines } = useContext(patternContext);
  return (
    <>
      <div className="body-wrapper">
        <Transport/>
        <div className="track-section section-wrapper">
          { lines["hi"].map((line, i) => <Track lineNumber={i} sectionType="hi"  key={i}/>) }
          <br/>
          { lines["mid"].map((line, i) => <Track lineNumber={i} sectionType="mid"  key={i}/>) }
          <br/>
          { lines["lo"].map((line, i) => <Track lineNumber={i} sectionType="lo"  key={i}/>) }
        </div>
      </div>
    </>
  );
}

export default App;
