import React, { useContext, useState, useEffect } from 'react';
import {patternContext} from '../Providers/patternContext';
import Stepper from './Stepper';
import { libraryNames } from '../audioUrls'

function SampleLibraryStepper({sectionType}) {
  const {bpm, changeBPM} = useContext(patternContext);
  const {lines, setSampleLibrary} = useContext(patternContext);
  const [index, setIndex] = useState(0);
  const [displayName, setDisplayName] = useState("");

  useEffect(() => {
    if (lines[sectionType]) {
      const lib = lines[sectionType].sampleLibrary;
      setDisplayName(lib);
      const i = getIndexFromName(lib);
      setIndex(i);
    }
  },[lines]);

  const getIndexFromName = (name) => {
    return libraryNames.findIndex(e => e === name);
  }

  const getNameFromIndex = (i) => {
    return libraryNames[i];
  }

  const changedLibraryNumber = (newVal) => {
    setIndex(newVal);
    const newName = getNameFromIndex(newVal);
    setDisplayName(newName);
    setSampleLibrary(sectionType, newName);
  }

  return (
    <>
      <Stepper label="sounds: " changeValue={changedLibraryNumber} startValue={index} minValue="0" maxValue={libraryNames.length -1}/>
      <p>{displayName}</p>
    </>
  )
}

export default SampleLibraryStepper;
