import React, { useState, useRef, useContext, useEffect } from 'react';
import '../Styles/Dot.css';
import Section from './Section';
import Transport from './Transport';
import {patternContext} from '../Providers/patternContext';

function App() {
  const { lines } = useContext(patternContext);
  return (
    <>
      <div className="body-wrapper">
        <Transport/>
        <div className="track-section section-wrapper">
          {Object.keys(lines).map(section => <Section sectionType={section} key={section}/>) }
        </div>
      </div>
    </>
  );
}

export default App;
