import React, { useContext, useState, useEffect } from 'react';
import {patternContext} from '../Providers/patternContext';
import Stepper from './Stepper';

function LoopCycleStepper({sectionType}) {
    const {lines, setLoopCycle} = useContext(patternContext);
    const [value, setValue] = useState(null);

    useEffect(() => {
      if (lines[sectionType]) {
        console.log("here", lines[sectionType].loopCycle);
        setValue(lines[sectionType].loopCycle);
      }
    },[lines]);

    const changedLoopCycle = (newVal) => {
      setLoopCycle(sectionType, newVal);
    }


  return (
    <Stepper label="Loop cycle:" changeValue={changedLoopCycle} startValue={value} minValue="1" maxValue="4"/>
  )
}

export default LoopCycleStepper;
