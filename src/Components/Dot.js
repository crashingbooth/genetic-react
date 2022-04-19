import React, { useState, useEffect, useContext } from 'react';
import {positionContext} from '../Providers/positionContext';
import {patternContext} from '../Providers/patternContext';
import '../Styles/Dot.css';
import '../Styles/styles.css';

export default function Dot(props) {
  const [highlighted, setHighlighted] = useState(false);
  const { pos } = useContext(positionContext);
  const { pattern, playing } = useContext(patternContext);

  useEffect(() => {
    // console.log("playing?", playing.current);
    if (playing.current && props.active && props.id === pos) {
        flash(200,150)
    }
  },[playing.current, pos]);

  const flash = (delay,dur) => {
    setTimeout(() => {
      setHighlighted(true);
      setTimeout(() => {
        if (playing) {
          setHighlighted(false);
        }
      },dur);
    },delay)
  };


  return (
    <span className={(props.id % 8) >= 4  ? "dark-background-chunk" : "light-background-chunk"}>
      <button className={`dot
        ${highlighted ? "highlighted-dot" : ""}
        ${props.active ? "on-dot" : "off-dot"}
        `}>
       </button>
     </span>
  )
}
