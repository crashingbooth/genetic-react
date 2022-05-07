import React, { useState, useContext, useEffect } from 'react';
import {patternContext} from '../Providers/patternContext';

function Stepper({startValue, changeValue, minValue, maxValue}) {
  const [localValue, setLocalValue] = useState(startValue);

  useEffect(() => {
    setLocalValue(startValue);
  },[startValue]);

  const changeLocalValue = delta => {
    let newVal = localValue + delta;
    if (newVal < minValue) { newVal = Number(minValue) };
    if (newVal > maxValue) { newVal = Number(maxValue) };
    setLocalValue(newVal);
    changeValue(newVal);
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
