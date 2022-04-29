import React, { useState, useRef, useContext, useEffect } from 'react';
import ReactSlider from "react-slider";
import { patternContext} from "../Providers/patternContext";

function Parameter({sectionType}) {
  const { lines,  changeDensity  } = useContext(patternContext);
  const movedSlider = (newVal) => {
    changeDensity(newVal/100, sectionType);
  }


  return (
    <>
      <h1>density</h1>
      <ReactSlider
        className="horizontal-slider"
        thumbClassName="example-thumb"
        trackClassName="example-track"
        onChange={movedSlider}
      />
    </>
  )
}

export default Parameter;
