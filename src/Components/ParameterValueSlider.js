import React, { useState, useRef, useContext, useEffect } from 'react';
import ReactSlider from "react-slider";
import '../Styles/Dot.css';
import { patternContext} from "../Providers/patternContext";

function ParameterValueSlider({movedSlider, label}) {

  return (
    <>
      <div className="parameter-value-slider">
        <p>{label}</p>
        <ReactSlider
          className="horizontal-slider"
          thumbClassName="example-thumb"
          trackClassName="example-track"
          onChange={movedSlider}
        />
      </div>
    </>
  )
}

export default ParameterValueSlider;
