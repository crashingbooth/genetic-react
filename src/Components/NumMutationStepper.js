import React, { useContext, useState, useEffect } from 'react';
import {patternContext} from '../Providers/patternContext';
import Stepper from './Stepper';

function NumMutationStepper({target}) { // target is "parent" or "child"
    const {numMutations, setNumMutations} = useContext(patternContext);
    console.log(numMutations);
    // const [value, setValue] = useState(null);

    // useEffect(() => {
    //   if (lines[sectionType]) {
    //     setValue(lines[sectionType].loopCycle);
    //   }
    // },[lines]);

    const changed = (newVal) => {
      let prev = {...numMutations};
      prev[target] = newVal
      setNumMutations({...prev});
    }


  return (
    <Stepper label={`${target} mutations:`} changeValue={changed} startValue={numMutations[target]} minValue="0" maxValue="4"/>
  )
}

export default NumMutationStepper;
