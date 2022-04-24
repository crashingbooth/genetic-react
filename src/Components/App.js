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
          <Section sectionType="hi"/>
          <br/>
          <Section sectionType="mid"/>
          <br/>
          <Section sectionType="lo"/>
        </div>
      </div>
    </>
  );
}

export default App;
