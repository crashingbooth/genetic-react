import * as Tone from "tone";
import React, { useState, useContext, createContext, useEffect, useRef } from "react";
import { positionContext } from '../Providers/positionContext';
import { sampler, pool} from "../audioUrls";
import { writePatternToJSON } from "../persistence";
import { Pattern } from "../Pattern/pattern";
import { generationProcedure, summarize } from "../Pattern/fitness";
import { createBasicFitnessConditions, setDensity } from "../Pattern/systemRules";

export const patternContext = createContext();

const PatternProvider = (props) => {

  function factory(numberOfEach, sections) {
    let pools = {};
    sections.forEach(section => {
      let sectionArr = [];
      for (let i = 0; i < numberOfEach; i++) {
        let pat = new Pattern(section);
        pat.setPhrase('---- ---- ---- ----');
        sectionArr.push({mute: false, pattern: pat})
      }
      pools[section] = {content: sectionArr, loopCycle: 1, sampleLibrary: section};
    });
    return pools;
  }

  let sampleLines = factory(3, ["hi", "mid", "lo"]);
  // let sampleLines = factory(4, ["lo"]);

  const [lines, setLines] = useState(sampleLines);
  const [history, setHistory] = useState([sampleLines]);
  const [redoStack, setRedoStack] = useState([]);
  const [numMutations, setNumMutations] = useState({parent: 1, child:1})
  const { pos, setPosition } = useContext(positionContext);
  const playing = useRef();
  const linesRef = useRef();
  const systemRulesRef = useRef();
  const [systemRules, setSystemRules] = useState();
  const [bpm, setBpm] = useState(140);

  useEffect(() => {
    console.log("pattern context setup");
    systemRulesRef.current = createBasicFitnessConditions();
    setSystemRules(systemRulesRef.current);
    linesRef.current = sampleLines;
    changeBPM(140);
    setLines(sampleLines);
  },[])

  // Pattern Management
  const mutateSome = (loopCount) => {
     Object.keys(linesRef.current).forEach((sectionType) => {
       if (loopCount % linesRef.current[sectionType].loopCycle === 0) {
         let vals = linesRef.current[sectionType].content;
         let ps = vals.map(item => item.pattern);
         const nextGen = generationProcedure(ps, systemRulesRef.current[sectionType], numMutations.parent, numMutations.child);
         nextGen.forEach((p, i) => {
            vals[i].pattern = p
         });

         linesRef.current[sectionType].content = vals;
       }
     });
     setLines(linesRef.current);
  }

  // Sequencer
  let loopA;

  const play = () => {
    if (playing.current) { return }
    let loopCount = -1;
    Tone.start()
    let i = pos;
    loopA = new Tone.Loop((time) => {
      Object.values(linesRef.current).forEach((section) => {
        section.content.forEach((patternPair, j) => {
          let pattern = patternPair.pattern;
          let sound = section.sampleLibrary;
          if ( !patternPair.mute && (i >= 0 && pattern.phrase.flat()[i])) {
            const sampleID = pattern.samples.flat()[i];
            let note = pool[sound][sampleID % pool[sound].length];
            sampler.triggerAttackRelease(note, "16n", time);
          }
        });
      });

      i = ((i + 1) % 16);
      setPosition(i);
      if (i === 0) {
        loopCount += 1;
        mutateSome(loopCount);
      }
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

  // Rules/fitness
  const changeParameter = (section, paramName, value, weight) => {
    let sectionRules = Object.values(systemRulesRef.current);
      sectionRules.forEach(ruleList => {
        ruleList.forEach(rule => {

          if (rule.description === paramName) {
            if (rule.curryingFunction && value !== null) {
              rule.fitnessFunction = rule.curryingFunction(value);
              rule.value = value;
            }
            if (weight !== null) {
              rule.weight = weight;
            }
          }
        });
      });
      setSystemRules(systemRulesRef.current);
  }

  const getParameterValue = (section, paramName) => {
    if (!systemRulesRef.current) { return null }

    const sectionRules = systemRulesRef.current[section];
    const filteredRules = sectionRules.filter(rule => (rule.description === paramName));
    if (filteredRules.length !== 1) { return null }
    return filteredRules[0].value;
  }

  const getParameterWeight = (section, paramName) => {
    if (!systemRulesRef.current) { return null }

    const sectionRules = systemRulesRef.current[section];
    const filteredRules = sectionRules.filter(rule => (rule.description === paramName));
    if (filteredRules.length !== 1) { return null }
    return filteredRules[0].weight;
  }


  // Patterns
  const logLines = () => {
    console.log(lines);
  };


  const savePattern = () => {
    writePatternToJSON(lines, bpm);
  }

  const toggleMute = (section, lineNumber) => {
    linesRef.current[section].content[lineNumber].mute = !linesRef.current[section].content[lineNumber].mute;
    setLines({...linesRef.current});
  }

  const setLoopCycle = (section, newLoopCycle) => {
    linesRef.current[section].loopCycle = newLoopCycle;
    setLines({...linesRef.current});
  }

  const setSampleLibrary = (section, newLibrary) => {
    linesRef.current[section].sampleLibrary = newLibrary;
    setLines({...linesRef.current});
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
    playing,
    toggleMute,
    setLoopCycle,
    setSampleLibrary,
    numMutations,
    setNumMutations,
    changeParameter,
    getParameterValue,
    getParameterWeight,
    systemRules
  };

  return (
    <patternContext.Provider value={provideData}>
      {props.children}
    </patternContext.Provider>
  );
};

export default PatternProvider;
