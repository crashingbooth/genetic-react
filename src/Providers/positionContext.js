import * as Tone from "tone";
import React, { useState, useContext, createContext } from 'react';

export const positionContext = createContext();

const PositionProvider = props => {

  const [pos, setPos] = useState(-1);
  const setPosition = (newPos) => {
    setPos(newPos);
  }

  const provideData = { pos, setPosition };

  return (
    <positionContext.Provider value={provideData}>
      {props.children}
    </positionContext.Provider>
  );

};

export default PositionProvider;
