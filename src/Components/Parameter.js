import React, { useState, useRef, useContext, useEffect } from 'react';
import ReactSlider from "react-slider";
import '../Styles/Dot.css';
import { patternContext} from "../Providers/patternContext";

function Parameter({parameterName, sectionType, hasValue}) {
  const { lines,  changeParameter } = useContext(patternContext);

  const movedValueSlider = (newVal) => {
    changeParameter(sectionType, parameterName, newVal/100, null);
    // changeDensity(newVal/100, sectionType);
  }

  const movedWeightSlider = (newVal) => {
    changeParameter(sectionType, parameterName, null, newVal/100);
    // changeDensity(newVal/100, sectionType);
  }


  return (
    <>
      <div className="parameter-section">
        <h1>{parameterName}</h1>
        {hasValue && <p>value</p>}
        {hasValue && <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          onChange={movedValueSlider}
        />}
        <p>weight</p>
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          onChange={movedWeightSlider}
        />
      </div>
    </>
  )
}

export default Parameter;
