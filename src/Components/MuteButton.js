import React, { useState, useRef, useContext, useEffect } from 'react';
import {patternContext} from '../Providers/patternContext';
import '../Styles/styles.css';

function MuteButton(props) {
  const {lines, toggleMuteForLine } = useContext(patternContext);
  const [isMute, setIsMute] = useState(lines[props.lineNumber].muteStatus);

  useEffect(() => {
    setIsMute(lines[props.lineNumber].muteStatus);
    console.log("set is mute called")
  }, [lines])

  const muteTrack = () => {
    console.log('tapped mute');
    toggleMuteForLine(props.lineNumber);
  };



  return (
    <button className={`dot track-control ${isMute ? 'selected-button' : 'unselected-button'}`} onClick={muteTrack}>M</button>
  )
}

export default MuteButton;
