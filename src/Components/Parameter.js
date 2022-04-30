import React, { useState, useRef, useContext, useEffect } from 'react';
import ParameterValueSlider from "./ParameterValueSlider"
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
        {hasValue && <ParameterValueSlider label="value" movedSlider={movedValueSlider}/>}
        <ParameterValueSlider label="weight" movedSlider={movedWeightSlider}/>
      </div>
    </>
  )
}

export default Parameter;
