import React, { useState, useContext, useEffect } from 'react';
import Dot from './Dot';
import { patternContext } from "../Providers/patternContext";
import "../Styles/Track.css";

function Section({sectionType}) {
    const { lines } = useContext(patternContext);
    const sectionLines = lines.filter(p => p.type === sectionType)
  return (
    <>
      {sectionLines.map(p => {})}
    </>
  )
};

export default Section;
