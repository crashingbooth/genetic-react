import React, { useState, useContext, useEffect } from 'react';
import Track from './Track';
import Parameter from './Parameter';
import LoopCycleStepper from './LoopCycleStepper';
import SampleLibraryStepper from './SampleLibraryStepper';
import { patternContext} from "../Providers/patternContext";
import "../Styles/Track.css";

function Section({sectionType}) {
    const { lines } = useContext(patternContext);
    const sectionLines = lines[sectionType].content.map(i => i.pattern);

  return (
    <>
      <div className="section-wrapper-outer">
        <div className="section-header">
          <h1>{sectionType}</h1>
          <LoopCycleStepper sectionType={sectionType}/>
          <SampleLibraryStepper sectionType={sectionType}/>
        </div>
        <div className="section-wrapper-single">
          <div className="track-section">
            { sectionLines.map((line, i) => <Track lineNumber={i} sectionType={sectionType}  key={i}/>) }
          </div>
          <div className="spacer"></div>
          <div className="section-controls">
            <Parameter parameterName="density" className="parameter" sectionType={sectionType} hasValue/>
            <Parameter parameterName="role" className="parameter" sectionType={sectionType}/>
            <Parameter parameterName="reward originality" className="parameter" sectionType={sectionType}/>
          </div>
        </div>
      </div>
    </>
  )
};

export default Section;
