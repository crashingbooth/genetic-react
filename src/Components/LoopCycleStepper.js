import React, { useContext } from 'react';
import {patternContext} from '../Providers/patternContext';
import Stepper from './Stepper';

function LoopCycleStepper({sectionType}) {

  return (
    <Stepper label="Loop cycle:" changeValue={console.log("hi")} startValue={2} minValue="1" maxValue="4"/>
  )
}

export default LoopCycleStepper;
