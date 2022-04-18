import React, { useState, useContext, useEffect } from 'react';
import {patternContext} from '../Providers/patternContext';

function TempoStepper() {
  const {bpm, changeBPM} = useContext(patternContext);
  const [localBPM, setLocalBPM] = useState(bpm)

  useEffect(() => {
    setLocalBPM(bpm);
  },[bpm]);

  const changeTempo = value => {
    changeBPM(bpm + value);
  }

  return (
    <div className='tempo-wrapper'>
      <button className='stepper stepper-left' onClick={() => changeTempo(-1)}>▼</button>
      <p>{localBPM}</p>
      <button className='stepper stepper-right' onClick={() => changeTempo(1)}>▲</button>
    </div>
  )
}

export default TempoStepper;
