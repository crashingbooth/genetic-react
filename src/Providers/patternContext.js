import * as Tone from "tone";
import React, { useState, useContext, createContext, useEffect, useRef } from "react";
import { positionContext } from '../Providers/positionContext';
import { sampler, pool} from "../audioUrls";
import { writePatternToJSON } from "../persistence";
import { Pattern, factory } from "../Pattern/pattern";
import { sampleGenerate } from "../Pattern/fitness";
import { LoPat, MidPat, HiPat } from "../Pattern/pattern-types";

export const patternContext = createContext();

const PatternProvider = (props) => {

  let sampleLines = factory(4);
  const [lines, setLines] = useState(sampleLines);
  const [history, setHistory] = useState([sampleLines]);
  const [redoStack, setRedoStack] = useState([]);
  const {pos, setPosition} = useContext(positionContext);
  const playing = useRef();
  const linesRef = useRef();
  const [bpm, setBpm] = useState(140);

  useEffect(() => {
    linesRef.current = sampleLines;
    setLines(sampleLines);
  },[])

  // Pattern Management
  const mutateAll = () => {
     Object.keys(linesRef.current).forEach((sectionType) => {
       let vals = linesRef.current[sectionType]; // sample generate expects array of patterns
       let ps = vals.map(item => item.pattern);
       const nextGen = sampleGenerate(ps);
       nextGen.forEach((p, i) => {
          vals[i].pattern = p
       });

       linesRef.current[sectionType] = vals;
     });
     setLines(linesRef.current);
  }

  // Sequencer
  let loopA;

  const play = () => {
    if (playing.current) { return }

    Tone.start()
    let i = pos;
    loopA = new Tone.Loop((time) => {
      Object.values(linesRef.current).forEach((section) => {
        section.forEach((patternPair, j) => {
          let pattern = patternPair.pattern;
          if ( (i >= 0 && pattern.phrase.flat()[i])) {
            const sampleID = pattern.samples.flat()[i];
            let note = pool[pattern.type][sampleID % pool[pattern.type].length];
            sampler.triggerAttackRelease(note, "16n", time);
          }
        });
      });

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
