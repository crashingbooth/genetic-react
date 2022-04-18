import React, { useState, useRef, useContext, useEffect } from 'react';
import ReactSlider from "react-slider";
import {patternContext} from '../Providers/patternContext';
import '../Styles/Track.css';

export default function VolumeControl({lineNumber}) {
    const { changeVolume } = useContext(patternContext);

  const movedSlider = (newVal) => {
    const newLevel =  (-50) + (newVal/2);
    changeVolume(lineNumber, newLevel);
  }
  return (
    <>
      <ReactSlider
        className="horizontal-slider"
        thumbClassName="example-thumb"
        trackClassName="example-track"
        onChange={movedSlider}
      />
    </>
  )
}
