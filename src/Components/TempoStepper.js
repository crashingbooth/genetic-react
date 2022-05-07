import React, { useContext } from 'react';
import {patternContext} from '../Providers/patternContext';
import Stepper from './Stepper';

function TempoStepper() {
  const {bpm, changeBPM} = useContext(patternContext);

  return (
    <Stepper label="tempo" changeValue={changeBPM} startValue={bpm} minValue="60" maxValue="240"/>
  )
}

export default TempoStepper;
