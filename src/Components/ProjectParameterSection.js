import React, { useState, useContext, useEffect } from 'react';
import NumMutationStepper from './NumMutationStepper';

function ProjectParameterSection() {
  return (
    <>
      <div className="section-wrapper section-controls">
        <NumMutationStepper target="parent"/>
        <NumMutationStepper target="child"/>
        <button className="transport-button">Reset</button>
      </div>
    </>
  )
}

export default ProjectParameterSection;
