import React, { useState, useContext, useEffect } from 'react';
import NumMutationStepper from './NumMutationStepper';
import { patternContext} from "../Providers/patternContext";

function ProjectParameterSection() {
  const { reset } = useContext(patternContext);
  return (
    <>
      <div className="section-wrapper section-controls">
        <NumMutationStepper target="parent"/>
        <NumMutationStepper target="child"/>
        <button className="transport-button" onClick={reset}>Reset</button>
      </div>
    </>
  )
}

export default ProjectParameterSection;
