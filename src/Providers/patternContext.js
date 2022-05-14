import * as Tone from "tone";
import React, { useState, useContext, createContext, useEffect, useRef } from "react";
import { positionContext } from '../Providers/positionContext';
import { sampler, pool} from "../audioUrls";
import { writePatternToJSON } from "../persistence";
// import { Pattern } from "../Pattern/pattern";
// import { generationProcedure, summarize } from "../Pattern/fitness";
import { createBasicFitnessConditions, setDensity } from "../Pattern/systemRules";

export const patternContext = createContext();

const PatternProvider = (props) => {

  function evaluateSequenceAgainstModel(seq, model) {
    let pattern = seq.phrase.flat()
    let total = 0;
    pattern.forEach((item, i) => {
      total += item === model[i] ? 1 : 0;
    });
    return total/pattern.length;
  }

  function evaluateRoleGeneral(seq) {
    if (seq.type === 'lo') {
      return evaluateSequenceAgainstModel(seq,[true, false, false, false, true, false, false, false, true, false, false, false, true, false, false, false]);
    } else if (seq.type === 'mid') {
      return evaluateSequenceAgainstModel(seq,[false, false, true, false, false, false, true, false, false, false, true, false, false, false, true, false]);
    } else if (seq.type === 'hi') {
      return evaluateSequenceAgainstModel(seq,[false, true, true, true, false, true, true, true, false, true, true, true, false, true, true, true]);
    } else {
      return 0;
    }
  }

  function evaluateDensity(idealRatio, seq) {
    const ticks = seq.phrase.flat();
    const activeTicks = ticks.filter(t => t);
    const realRatio = activeTicks.length/ticks.length;
    // const expectedTicks = Math.round(ticks.length * idealRatio);
    // const maxDistance = Math.max(expectedTicks, ticks.length - expectedTicks);
    // const realTickCount = ticks.reduce((prev,cur) => {
    //   return prev + (cur ? 1 : 0);
    // },0);
    const result = (1 - Math.abs(idealRatio - realRatio));
    return result;
  }

  function evaluate(evaluators, seq, summary) {
    // evaluators:
    // [{
    //    fitnessFunction: <function taking seq as arg>,
    //    weight: multiplier, only meaningful relative to other values
    // }]
    // const res = evaluators.reduce((prev, e) => {
    //   return prev + (e.fitnessFunction(seq) * e.weight);
    // }, 0);

    let res = 0;
    for (let i = 0; i < evaluators.length; i++) {
      const evalScore = evaluators[i].fitnessFunction(seq, summary) * evaluators[i].weight;
      // console.log(evaluators[i].description, evalScore, "w:", evaluators[i].weight);
      res += evalScore;
    }
    return res;
  }

  function summarize(seqs) {
    let result = seqs.reduce((tally, seq) => {
      seq.forEach((val, i) => {
        if (val) {tally[i] += 1;}
      });
      return tally;
    }, Array(16).fill(0));
    return {numSeqs: seqs.length, tally: result };
  }

  function rewardOriginality(seq, summary) {
    const ticks = seq.phrase.flat();
    const otherPopulation = (summary.numSeqs - 1);
    const scoreByTick = ticks.map((tick, i) => {
      const posTally = summary.tally[i];
      const modifiedPosTally = tick ? posTally - 1 : posTally;
      const posScore = tick ? (otherPopulation - modifiedPosTally)/otherPopulation :  modifiedPosTally/otherPopulation
      return posScore
    })
    const total = scoreByTick.reduce((prev, curr) => prev + curr, 0);
    return total/ticks.length;
  }

  function sortByEvaluation(candidates, evaluators, summary) {
    // candidates: [Pattern]
    // evaluators: [{fitnessFunction, weight}]
    // summary: e.g.,[3,0,1,0...] the number of candidates with events at each position
    // returns [Pattern] sorted by evaluation score

    const scores = candidates.map(c => [c, evaluate(evaluators, c, summary)]);
    const sortedScores = scores.sort(([candA , scoreA], [candB, scoreB] ) => scoreB - scoreA);
    const sortedCandidates = sortedScores.map(([cand, score]) => cand);
    return sortedCandidates;
  }

  function takeHalf(sortedCandidates) {
    return sortedCandidates.slice(0,sortedCandidates.length / 2)
  }

  function breed(sortedCandidates, numParentMutations, numChildMutations) {
    let kids = [];
    sortedCandidates.forEach((candidate, i) => {
      let mateIndex = Math.floor(Math.random() * (sortedCandidates.length - 1));
      if (mateIndex >= i) { mateIndex += 1}
      let kid = candidate.breed(sortedCandidates[mateIndex]);
      candidate.multiMutate(numParentMutations, ["phrase", "sample"]);
      kid.multiMutate(numChildMutations,["phrase", "sample"]);
      kids.push(kid);
    });
    let res = sortedCandidates.concat(kids);
    return res;
  }

  function generationProcedure(candidates, evaluators, numParentMutations, numChildMutations) {
    const seqs = candidates.map(c => c.phrase.flat());
    const summary = summarize(seqs);
    const sorted = sortByEvaluation(candidates, evaluators, summary);
    const survivors = takeHalf(sorted);
    const nextGen = breed(survivors, numParentMutations, numChildMutations);
    return nextGen;
  }

  class Pattern {
    constructor(type = "lo", numBeats = 4) {
      this.phrase = this.generateBasic(numBeats);
      this.samples = this.chooseSamples(numBeats);
      this.id = Math.floor(Math.random() * 1000);
      this.ancestors = [0,0];
      this.type = type;
    }

    generateBasic(beats) {
      let res = [];
      const simple = [true, false, false, false]
      for (let i = 0; i < beats; i++) {
        res.push([...simple]);
      }
      return res;
    }

    chooseSamples(beats) {
      let samples = [];
      for (let i = 0; i < beats; i++) {
        let beat = [];
        for (let j = 0; j < 4; j++) {
          beat.push(Math.floor(Math.random() * 100));
        }
        samples.push(beat);
      }
      return samples;
    }

    setPhrase(phraseString) {
      let seq = phraseString.split('').filter(char => char === 'x' || char === '-');
      let phrase = [];
      let numChromo = (seq.length/4);
      for (let i = 0; i < numChromo; i++) {
        let chunk = seq.slice(i*4,(i+1)*4);
        phrase.push(chunk.map(ch => ch === 'x'));
      }
      this.phrase = [...phrase];
    }

    showPhrase() {
      const showBeat = (oneBeat) => {
        let oneBeatsChars = oneBeat.map(tick =>  tick ? "x" : "-");
        return oneBeatsChars.join("");
      }

      const stringArr = this.phrase.map(beat => showBeat(beat));
      return stringArr.join(",");
    }

    logPhrase() {
      console.log(this.showPhrase());
    }

    mutate(type) {
      const beat = Math.floor(Math.random() * this.phrase.length);
      const tick = Math.floor(Math.random() * 4);
      if (type.includes("phrase")) {
        this.phrase[beat][tick] = !this.phrase[beat][tick];
      }
      if (type.includes("sample")) {
        this.samples[beat][tick] = (Math.floor(Math.random() * 100));
      }
    }

    multiMutate(reps, type) {
      for (let i = 0; i < reps; i++) {
        this.mutate(type);
      }
    }

    breed(other) {
      let child = new Pattern();
      child.type = this.type;
      child.ancestors = [this.id, other.id];
      let childPhrase = [];
      let childSamples = [];
      for (let i = 0; i < this.phrase.length; i++) {
        const choice = coin();
        childPhrase.push(choice ? [...this.phrase[i]] : [...other.phrase[i]])
        childSamples.push(choice ? [...this.samples[i]] : [...other.samples[i]])
      }
      child.phrase = childPhrase;
      child.samples = childSamples;
      return child;
    }
  }

  function coin() {
    return Math.random() > 0.5;
  }

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

  let sampleLines = factory(4, ["hi", "mid", "lo"]);
  // let sampleLines = factory(4, ["lo"]);

  const [lines, setLines] = useState(sampleLines);
  const [history, setHistory] = useState([sampleLines]);
  const [redoStack, setRedoStack] = useState([]);
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
    console.log(sampleLines);
    linesRef.current = sampleLines;
    changeBPM(140);
    setLines(sampleLines);
  },[])

  // Sound Mapping

  // Pattern Management
  const mutateAll = () => {
     Object.keys(linesRef.current).forEach((sectionType) => {
       let vals = linesRef.current[sectionType].content; // sample generate expects array of patterns
       let ps = vals.map(item => item.pattern);
       const nextGen = generationProcedure(ps, systemRulesRef.current[sectionType], 1,1);// last two: numParentMutations, numChildMutations
       nextGen.forEach((p, i) => {
          vals[i].pattern = p
       });

       linesRef.current[sectionType].content = vals;
     });
     setLines(linesRef.current);
  }
  const mutateSome = (loopCount) => {
    console.log(linesRef.current);
     Object.keys(linesRef.current).forEach((sectionType) => {
       // console.log(linesRef.current[sectionType]);
       if (loopCount % linesRef.current[sectionType].loopCycle === 0) {
         let vals = linesRef.current[sectionType].content; // sample generate expects array of patterns
         let ps = vals.map(item => item.pattern);
         const nextGen = generationProcedure(ps, systemRulesRef.current[sectionType], 1,1);// last two: numParentMutations, numChildMutations
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
