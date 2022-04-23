import React, { useState, useRef, useContext, useEffect } from 'react';
import {patternContext} from '../Providers/patternContext';
import '../Styles/styles.css';

function MuteButton({section, lineNumber}) {
  const {lines, toggleMute } = useContext(patternContext);
  const [isMute, setIsMute] = useState(lines[section][lineNumber].mute);

  useEffect(() => {
    setIsMute(lines[section][lineNumber].mute);
  }, [lines])

  const muteTrack = () => {
    toggleMute(section, lineNumber);
  };



  return (
    <button className={`dot track-control ${isMute ? 'selected-button' : 'unselected-button'}`} onClick={muteTrack}>M</button>
  )
}

export default MuteButton;
