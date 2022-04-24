import React, { useState, useContext, useEffect } from 'react';
import Track from './Track';
import ReactSlider from "react-slider";
import { patternContext } from "../Providers/patternContext";
import "../Styles/Track.css";

function Section({sectionType}) {
    const { lines } = useContext(patternContext);
    const sectionLines = lines[sectionType].map(i => i.pattern);


    const movedSlider = (newVal) => {
      const newLevel =  (-50) + (newVal/2);
      // changeVolume(lineNumber, newLevel);
    }

  return (
    <>
      <div className="section-wrapper-single">
        <div className="track-section">
          { sectionLines.map((line, i) => <Track lineNumber={i} sectionType={sectionType}  key={i}/>) }
          {sectionType!=="lo" && <hr/>}
        </div>
        <div className="section-controls">
          <h1>density</h1>
          <ReactSlider
            className="horizontal-slider"
            thumbClassName="example-thumb"
            trackClassName="example-track"
            onChange={movedSlider}
          />
        </div>
      </div>
    </>
  )
};

export default Section;
