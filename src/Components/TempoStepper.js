import React, { useContext } from 'react';
import {patternContext} from '../Providers/patternContext';
import Stepper from './Stepper';

function TempoStepper() {
  const {bpm, changeBPM} = useContext(patternContext);

  return (
    <Stepper changeValue={changeBPM} startValue={bpm} />
  )
}

export default TempoStepper;
