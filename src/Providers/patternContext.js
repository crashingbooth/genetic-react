import * as Tone from "tone";
import React, { useState, useContext, createContext, useEffect, useRef } from "react";
import { positionContext } from '../Providers/positionContext';
import { audioResources, sampler, resourceFromID } from "../audioUrls";
import { writePatternToJSON } from "../persistence";
import { Pattern } from "../Pattern/pattern";
import { sampleGenerate } from "../Pattern/fitness";
import { LoPat, MidPat, HiPat } from "../Pattern/pattern-types";

export const patternContext = createContext();

const PatternProvider = (props) => {
  const sampleLines = [new LoPat(), new LoPat(), new LoPat(), new LoPat(), new LoPat() ,new LoPat()];
  sampleLines.forEach((item, i) => {
    item.setPhrase('x--- ---- ---- ----');
  });


  const [lines, setLines] = useState(sampleLines);
  const [history, setHistory] = useState([sampleLines]);
  const [redoStack, setRedoStack] = useState([]);
  const {pos, setPosition} = useContext(positionContext);
  const playing = useRef();
  const linesRef = useRef();
  const [bpm, setBpm] = useState(120);

  useEffect(() => {
    linesRef.current = sampleLines;
    setLines(sampleLines);
  },[])

  // Pattern Management
  const mutateAll = () => {
    let ps = linesRef.current;
    const nextGen = sampleGenerate(ps);
    linesRef.current = nextGen;
    setLines(nextGen);
  }

  // Sequencer
  let loopA;

  const play = () => {
    if (playing.current) { return }

    Tone.start()
    let i = pos;
    loopA = new Tone.Loop((time) => {
      for (let pattern of linesRef.current) {
        if (i >= 0 && pattern.phrase.flat()[i]) {
          const sampleID = pattern.samples.flat()[i];
          let sample = resourceFromID(sampleID);
          sampler.triggerAttackRelease(sample.note, "16n", time);
          console.log("play");
        }
      }
      i = ((i + 1) % 16);
      setPosition(i);
      if (i === 0) { mutateAll() }
    }, "8n").start(0);

    Tone.Transport.start();
    playing.current = true;
  };

  const stop = () => {
    Tone.Transport.stop();
    Tone.Transport.cancel();
    playing.current = false;
    setPosition(-1);
  }

  const changeBPM = (newTempo) => {
    Tone.Transport.bpm.value = newTempo;
    setBpm(newTempo)
  }


  // Patterns
  const logLines = () => {
    console.log(lines);
  };


  const savePattern = () => {
    writePatternToJSON(lines, bpm);
  }

  // const loadPatterns = file => {
  //   const fileReader = new FileReader();
  //   fileReader.readAsText(file, "UTF-8");
  //   fileReader.onload = e => {
  //     const { tempo, patterns } = JSON.parse(e.target.result);
  //     changeBPM(tempo);
  //     changeLines(deepCopyTrackSet(patterns))
  //     addToHistory(deepCopyTrackSet(patterns));
  //   };
  // }



  const provideData = {
    lines,
    setLines,
    logLines,
    play,
    stop,
    bpm,
    changeBPM,
    playing
  };

  return (
    <patternContext.Provider value={provideData}>
      {props.children}
    </patternContext.Provider>
  );
};

export default PatternProvider;
