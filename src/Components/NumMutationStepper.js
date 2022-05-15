import React, { useContext, useState, useEffect } from 'react';
import {patternContext} from '../Providers/patternContext';
import Stepper from './Stepper';

function NumMutationStepper({target}) { // target is "parent" or "child"
    const {numMutations } = useContext(patternContext);
    const [value, setValue] = useState();

    useEffect(() => {
      console.log(numMutations);
      if (numMutations.current) {
        setValue(numMutations.current[target]);
        console.log(target, numMutations.current[target]);
      }
    }, [numMutations.current]);

    const changed = (newVal) => {
      let prev = {...numMutations.current};
      prev[target] = newVal
      numMutations.current = {...prev};
      setValue(newVal);
      // setNumMutations({...prev});
    }


  return (
    <Stepper label={`${target} mutations:`} changeValue={changed} startValue={value} minValue="0" maxValue="4"/>
  )
}

export default NumMutationStepper;
