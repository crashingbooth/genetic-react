import React, { useState, useRef, useContext, useEffect } from 'react';
import { patternContext} from "../Providers/patternContext";

function TotalScoreOutputDisplay({ sectionType }) {
  const { lines, loopCount } = useContext(patternContext);
  const [scores, setScores] = useState(["-","-","-","-"]);

  useEffect(() => {
    if (lines[sectionType]) {
      const totalScores = lines[sectionType].content.map(e => e.score.toFixed(3));
      setScores(totalScores);
    }
  }, [loopCount])

  return (
    <>
      <div className="param-output-wrapper parameter-output-section">
      {scores.map((s,i) => <p className="param-output-value" key={i}>{s}</p>)}
      </div>
    </>
  )
}

export default TotalScoreOutputDisplay;
