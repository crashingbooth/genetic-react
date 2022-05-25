import React, { useState, useContext, useEffect } from 'react';
import NumMutationStepper from './NumMutationStepper';
import { patternContext} from "../Providers/patternContext";

function ProjectParameterSection() {
  const { resetPatterns, resetParameters } = useContext(patternContext);
  return (
    <>
      <div className="section-wrapper section-controls project-parameters">
        <NumMutationStepper target="parent"/>
        <NumMutationStepper target="child"/>
        <button className="transport-button" onClick={resetPatterns}>Reset Patterns</button>
        <button className="transport-button" onClick={resetParameters}>Reset Parameters</button>
      </div>
    </>
  )
}

export default ProjectParameterSection;
