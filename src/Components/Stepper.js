import React, { useState, useContext, useEffect } from 'react';
import {patternContext} from '../Providers/patternContext';

function Stepper({startValue, changeValue}) {
  const {bpm, changeBPM} = useContext(patternContext);
  const [localValue, setLocalValue] = useState(startValue);

  useEffect(() => {
    setLocalValue(startValue);
  },[bpm]);

  const changeLocalValue = delta => {
    changeValue(localValue + delta);
  }

  return (
    <div className='tempo-wrapper'>
      <button className='stepper stepper-left' onClick={() => changeLocalValue(-1)}>▼</button>
      <p>{localValue}</p>
      <button className='stepper stepper-right' onClick={() => changeLocalValue(1)}>▲</button>
    </div>
  )
}

export default Stepper;
