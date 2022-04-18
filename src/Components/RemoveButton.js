import React, { useState, useRef, useContext, useEffect } from 'react';
import {patternContext} from '../Providers/patternContext';
import '../Styles/styles.css';

function RemoveButton(props) {
  const {lines, deleteLine } = useContext(patternContext);

  const remove = () => {
    deleteLine(props.lineNumber);
  };

  return (
    <button className={`dot track-control`} onClick={remove}>-</button>
  )
}

export default RemoveButton;
