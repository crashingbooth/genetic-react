import React, { useState, useContext, useEffect } from 'react';
import MuteButton from './MuteButton';
import RandomButton from './RandomButton';
import RemoveButton from './RemoveButton';
import TrackEventSection from './TrackEventSection';
import VolumeControl from './VolumeControl';
import { patternContext } from "../Providers/patternContext";
import '../Styles/Track.css';
import { resourceNames, resourceFromName } from "../audioUrls";

export default function Track({lineNumber}) {
  const { lines, setSample } = useContext(patternContext);

  const selectSample = e => {
    let resource = resourceFromName(e.target.value);
    setSample(lineNumber, resource);
  }

  return (
    <div className='single-track-wrapper'>
      <span className='label-holder'>
        <select id="sample-select" onChange={selectSample} defaultValue={lines[lineNumber].displayName}>
          {resourceNames.map(e => <option key={e} value={e}>{e}</option>)}
        </select>
      </span>
      <MuteButton lineNumber={lineNumber} />
      <RandomButton lineNumber={lineNumber} />
      <RemoveButton lineNumber={lineNumber} />
      <div className="spacer"/>
      <div className="v-line"/>
      <div className="spacer"/>
      <TrackEventSection lineNumber={lineNumber}/>
      <VolumeControl lineNumber={lineNumber}/>
    </div>
  )
}
