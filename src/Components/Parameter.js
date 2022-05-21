import React, { useState, useRef, useContext, useEffect } from 'react';
import ParameterValueSlider from "./ParameterValueSlider"
import ParameterOutputDisplay from "./ParameterOutputDisplay"
import '../Styles/Dot.css';
import { patternContext} from "../Providers/patternContext";

function Parameter({parameterName, sectionType, hasValue}) {
  const { lines,  changeParameter, getParameterValue, getParameterWeight, systemRules } = useContext(patternContext);
  const [value, setValue ] = useState(null);
  const [weight, setWeight ] = useState(null);

  useEffect(() => {
    if (hasValue) {
      const val = getParameterValue(sectionType, parameterName);
      setValue(val);
    }
    const w = getParameterWeight(sectionType, parameterName);
    setWeight(w);
  },[systemRules])

  const movedValueSlider = (newVal) => {
    changeParameter(sectionType, parameterName, newVal/100, null);
    setValue(newVal/100);
  }

  const movedWeightSlider = (newVal) => {
    changeParameter(sectionType, parameterName, null, newVal/100);
    setWeight(newVal/100);
  }


  return (
    <>
      <div className="parameter-section-horizontal">
        <div className="parameter-section-vertical">
          <div className="parameter-section-header">
            <h1>{parameterName}</h1>
          </div>
          {hasValue && <ParameterValueSlider label="value" movedSlider={movedValueSlider} value={value}/>}
          <ParameterValueSlider label="weight" movedSlider={movedWeightSlider} value={weight}/>
        </div>
        <ParameterOutputDisplay paramName={parameterName} sectionType={sectionType}/>
      </div>
    </>
  )
}

export default Parameter;
