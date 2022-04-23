import React, { useState, useContext, useEffect } from 'react';
import Dot from './Dot';
import {positionContext} from '../Providers/positionContext';
import { patternContext } from "../Providers/patternContext";
import "../Styles/Track.css";

function TrackEventSection({lineNumber, sectionType}) {
  const { lines } = useContext(patternContext);
  const { pos } = useContext(positionContext);
  const [pattern, setPattern] = useState([]);

  useEffect(() => {
    const line = lines[sectionType][lineNumber].pattern;
    setPattern(line);
  },[lines, pos]);

  return (
    <>
      <div className="event-section-wrapper">
        {pattern.phrase && pattern.phrase.flat().map((beat, index) => (
          <Dot
            active={beat}
            key={index}
            id={index}
            lineNumber={lineNumber}
            sectionType={sectionType}
          />
        ))}
      </div>
    </>
  );
}

export default TrackEventSection;
