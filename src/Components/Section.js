import React, { useState, useContext, useEffect } from 'react';
import Track from './Track';
import Parameter from './Parameter';
import { patternContext} from "../Providers/patternContext";
import "../Styles/Track.css";

function Section({sectionType}) {
    const { lines } = useContext(patternContext);
    const sectionLines = lines[sectionType].map(i => i.pattern);

  return (
    <>
      <div className="section-wrapper-single">
        <div className="track-section">
          { sectionLines.map((line, i) => <Track lineNumber={i} sectionType={sectionType}  key={i}/>) }
          {sectionType!=="lo" && <hr/>}
        </div>
        <div className="section-controls">
          <Parameter sectionType={sectionType}/>
        </div>
      </div>
    </>
  )
};

export default Section;
