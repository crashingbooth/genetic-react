import * as Tone from "tone";
import React, { useState, useContext, createContext, useEffect, useRef } from "react";
import { positionContext } from '../Providers/positionContext';
import { sampler, pool} from "../audioUrls";
import { writePatternToJSON } from "../persistence";
import { Pattern } from "../Pattern/pattern";
import { generationProcedure, getEvaluations} from "../Pattern/fitness";
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
        sectionArr.push({mute: false, pattern: pat, score: 0, evaluation: []})
      }
      pools[section] = {content: sectionArr, loopCycle: 1, sampleLibrary: section};
    });
    return pools;
  }

  const [linesPerSection, setLinesPerSection] = useState(5);
  let sampleLines = factory(linesPerSection, ["hi", "mid", "lo"]);
  // let sampleLines = factory(4, ["lo"]);

  const [lines, setLines] = useState(sampleLines);
  const [history, setHistory] = useState([sampleLines]);
  const [redoStack, setRedoStack] = useState([]);
  const numMutations = useRef();
  const { pos, setPosition } = useContext(positionContext);
  const playing = useRef();
  const linesRef = useRef();
  const systemRulesRef = useRef();
  const [systemRules, setSystemRules] = useState();
  const [bpm, setBpm] = useState(140);
  const [loopCount, setLoopCount] = useState(-1);
  const loopCountRef = useRef();
  const nextId = useRef();

  useEffect(() => {
    console.log("pattern context setup");
    nextId.current = 0;
    handleSystemRules();
    numMutations.current = {parent: 0, child:1};
    console.log("context", sampleLines);
    linesRef.current = sampleLines;
    assignIds(linesRef.current)
    console.log("start", linesRef.current);
    handleOtherLocalStorage();
    setLines(linesRef.current);
    loopCountRef.current = -1;
  },[])

  useEffect(() => {
    localStorage.setItem("tempo", JSON.stringify(bpm));
  },[bpm]);

  useEffect(() => {
    writeSystemRulesToLocalStorage();
  },[systemRules])

  const writeSystemRulesToLocalStorage = () => {
    localStorage.setItem("systemRules", JSON.stringify(systemRules));
  }

  const handleSystemRules = () => {
    const sysRule = localStorage.getItem('systemRules');
    if (sysRule && sysRule !== 'undefined') {
      systemRulesRef.current = JSON.parse(sysRule)
    } else {
      systemRulesRef.current = createBasicFitnessConditions();
    }
    setSystemRules(systemRulesRef.current);
  }

  const handleOtherLocalStorage = () => {
    const tempo = localStorage.getItem("tempo") ;
    changeBPM(Number(tempo) || 140);
  }

  const assignIds = (lines) => {
    const sections = Object.values(lines);
    sections.forEach((section, i) => {
      section.content.forEach((line, i) => {
        if (!line.pattern.id) {
          line.pattern.id = nextId.current;
          nextId.current += 1;
        }
      });
    });
  }

  // Pattern Management
  const mutateSome = (loopCount) => {
    if (loopCount === 0) { return }
     Object.keys(linesRef.current).forEach((sectionType) => {
       if (loopCount % linesRef.current[sectionType].loopCycle === 0) {
         let content = linesRef.current[sectionType].content;
         const nextGen = generationProcedure(content,
           numMutations.current.parent,
           numMutations.current.child);

         const evals = getEvaluations(nextGen, systemRulesRef.current[sectionType]);
         content = appendEvaluations(content,evals);
         nextGen.forEach((p, i) => {
            content[i].pattern = p
         });
         linesRef.current[sectionType].content = content;
       }
     });
     assignIds(linesRef.current);
     setLines(linesRef.current);
  }

  const appendEvaluations = (content, evaluations) => {
    content.forEach((item, i) => {
      item.evaluation = evaluations[i];
      item.score = evaluations[i].reduce((acc, curr) => acc + curr.finalScore,0);
    });
    return content;
  }

  const showIdAndScore = (content) => {
    return content.map(e => ({id: e.pattern.id ,score: e.score.toFixed(3),
       pat: e.pattern.showPhrase(), dens: e.evaluation[0].finalScore, role: e.evaluation[1].finalScore}))
  }

  // Sequencer
  let loopA;

  const play = () => {
    if (playing.current) { return }
    mutateSome(loopCountRef.current);
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
        loopCountRef.current += 1;
        setLoopCount(loopCountRef.current);
        mutateSome(loopCountRef.current);
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
    let relevantSectionRules = systemRulesRef.current[section];
    relevantSectionRules.forEach(rule => {
      if (rule.description === paramName) {
        if (value !== null) {
          rule.value = value;
          console.log("rule",section, rule.description, rule.value );
        }
        if (weight !== null) {
          rule.weight = weight;
        }
      }
    });
    console.log("changePar",value,weight);
    setSystemRules(systemRulesRef.current);
    writeSystemRulesToLocalStorage();
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

  const resetPatterns = () => {
    linesRef.current = factory(linesPerSection, ["hi", "mid", "lo"]);
    nextId.current = 0;
    assignIds(linesRef.current);
    setLines({...linesRef.current});
  }

  const resetParameters = () => {
    systemRulesRef.current = createBasicFitnessConditions();
    setSystemRules(systemRulesRef.current);
    writeSystemRulesToLocalStorage();
    changeBPM(140);
  }

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
    loopCount,
    setSampleLibrary,
    numMutations,
    // setNumMutations,
    changeParameter,
    getParameterValue,
    getParameterWeight,
    systemRules,
    resetPatterns,
    resetParameters
  };

  return (
    <patternContext.Provider value={provideData}>
      {props.children}
    </patternContext.Provider>
  );
};

export default PatternProvider;
