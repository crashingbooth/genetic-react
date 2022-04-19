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
  const { lines } = useContext(patternContext);

  return (
    <div className='single-track-wrapper'>
      <div className="spacer"/>
      <div className="v-line"/>
      <div className="spacer"/>
      <TrackEventSection lineNumber={lineNumber}/>
    </div>
  )
}
