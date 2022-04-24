import React, { useState, useContext, useEffect } from 'react';
import Track from './Track';
import { patternContext } from "../Providers/patternContext";
import "../Styles/Track.css";

function Section({sectionType}) {
    const { lines } = useContext(patternContext);
    const sectionLines = lines[sectionType].map(i => i.pattern);
  return (
    <>
      <div className="section-wrapper-single">
      { sectionLines.map((line, i) => <Track lineNumber={i} sectionType={sectionType}  key={i}/>) }
      </div>
    </>
  )
};

export default Section;
