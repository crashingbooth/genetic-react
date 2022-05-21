import React, { useState, useRef, useContext, useEffect } from 'react';
import { patternContext} from "../Providers/patternContext";

function ParameterOutputDisplay({sectionType, paramName}) {
  const { lines, loopCount } = useContext(patternContext);
  const [scores, setScores] = useState(["-","-","-","-"]);

  useEffect(() => {
    if (lines[sectionType].content[0].evaluation[0]) {
      let evals =  lines[sectionType].content
        .map(l => l.evaluation)
      evals.forEach((item, i) => {
          evals[i] = item.filter(i => i.description === paramName);
      })
      evals = evals.map(l => l[0].finalScore.toFixed(3));
      setScores(evals);
    };
  }, [loopCount])

  return (
    <>
      <div className="param-output-wrapper">
      {scores.map((s,i) => <p className="param-output-value" key={i}>{s}</p>)}
      </div>
    </>
  )
}

export default ParameterOutputDisplay;
