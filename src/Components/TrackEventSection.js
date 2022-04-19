import React, { useState, useContext, useEffect } from 'react';
import Dot from './Dot';
import { patternContext } from "../Providers/patternContext";
import "../Styles/Track.css";

function TrackEventSection(props) {
  const { lines } = useContext(patternContext);
  const [pattern, setPattern] = useState([]);

  useEffect(() => {
    const line = lines[props.lineNumber];
    setPattern(line);
  },[lines]);

  return (
    <>
      <div className="event-section-wrapper">
        {pattern.phrase && pattern.phrase.flat().map((beat, index) => (
          <Dot
            active={beat}
            key={index}
            id={index}
            lineNumber={props.lineNumber}
          />
        ))}
      </div>
    </>
  );
}

export default TrackEventSection;
