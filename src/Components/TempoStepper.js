import React, { useContext } from 'react';
import {patternContext} from '../Providers/patternContext';
import Stepper from './Stepper';

function TempoStepper() {
  const {bpm, changeBPM} = useContext(patternContext);

  return (
    <Stepper changeValue={changeBPM} startValue={bpm} minValue="130" maxValue="150"/>
  )
}

export default TempoStepper;
