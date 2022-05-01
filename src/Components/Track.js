import React, { useState, useContext, useEffect } from 'react';
import MuteButton from './MuteButton';
import RandomButton from './RandomButton';
import RemoveButton from './RemoveButton';
import TrackEventSection from './TrackEventSection';
import VolumeControl from './VolumeControl';
import { patternContext } from "../Providers/patternContext";
import '../Styles/Track.css';
import { resourceNames, resourceFromName } from "../audioUrls";

export default function Track({lineNumber, sectionType}) {
  const { lines } = useContext(patternContext);
        // <p>{`${lines[sectionType][lineNumber].pattern.id} ${lines[sectionType][lineNumber].pattern.ancestors[0]}-${lines[sectionType][lineNumber].pattern.ancestors[1]} ${sectionType}`}</p>
  return (
    <div className='single-track-wrapper'>
      <MuteButton section={sectionType} lineNumber={lineNumber}/>
      <div className="spacer"/>
      <div className="v-line"/>
      <div className="spacer"/>
      <div className="label-area">
        <p>{sectionType}</p>
      </div>
      <TrackEventSection lineNumber={lineNumber} sectionType={sectionType}/>
    </div>
  )
}
