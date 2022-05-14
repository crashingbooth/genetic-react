import React, { useState, useRef, useContext, useEffect } from 'react';
import {patternContext} from '../Providers/patternContext';
import TempoStepper from './TempoStepper';
import '../Styles/styles.css';
import '../Styles/transport.css';

function Transport() {
  const inputFile = useRef(null)
  const {savePattern,loadPatterns, addTrack, undo, redo, canUndo, canRedo, play, stop, playing} = useContext(patternContext);

  const selectFile = () => {
     inputFile.current.click();
  };

  const inputFileChanged = () => {
    const file = inputFile.current.files[0];
    loadPatterns(file);
  }

  return (
    <div className="transport-wrapper section-wrapper">
      <button className={`transport-button ${playing.current ? "playing" : ""}`} onClick={play}>Play</button>
      <button className="transport-button" onClick={stop}>Stop</button>
      <button className="transport-button" onClick={savePattern}>Save Lines</button>
      <input type='file' id='file' ref={inputFile} onChange={inputFileChanged} style={{display: 'none'}}/>
      <button className="transport-button" onClick={selectFile}>Load Lines</button>
      <button className="transport-button" onClick={inputFileChanged}>Log File</button>
      <TempoStepper/>
    </div>
  )
}

export default Transport;
