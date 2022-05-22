import { LoPat, MidPat, HiPat } from './pattern-types.js';
import { coin } from './pattern.js';

export function evaluateSequenceAgainstModel(seq, model) {
  let pattern = seq.phrase.flat()
  let total = 0;
  pattern.forEach((item, i) => {
    total += item === model[i] ? 1 : 0;
  });
  return total/pattern.length;
}

export function evaluateRoleGeneral(seq) {
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

export function evaluateDensity(idealRatio, seq) {
  const ticks = seq.phrase.flat();
  const activeTicks = ticks.filter(t => t);
  const realRatio = activeTicks.length/ticks.length;
  const result = (1 - Math.abs(idealRatio - realRatio));
  return result;
}

export function evaluate(evaluators, seq, summary) {
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

export function generateEvaluationArray(seqs, evaluators, summary) {
  let result = [];

  seqs.forEach((seq, i) => {
    const singleSeqScoreArray = evaluators.map(e => {
      const score = e.fitnessFunction(seq, summary);
      return {
        description: e.description,
        rawScore: score,
        weight: e.weight,
        finalScore: score * e.weight
      };
    });
    result.push(singleSeqScoreArray);
  });
  return result;
}

export function summarize(seqs) {
  let result = seqs.reduce((tally, seq) => {
    seq.forEach((val, i) => {
      if (val) {tally[i] += 1;}
    });
    return tally;
  }, Array(16).fill(0));
  return {numSeqs: seqs.length, tally: result };
}

export function rewardOriginality(seq, summary) {
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

export function sortByEvaluation(candidates, evaluators, summary) {
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

export function breed(populationSize, sortedCandidates, numParentMutations, numChildMutations) {
  let kids = [];
  sortedCandidates.forEach((candidate, i) => {
    let mateIndex = Math.floor(Math.random() * (sortedCandidates.length - 1));
    if (mateIndex >= i) { mateIndex += 1}
    let kid = sortedCandidates.length < 2 ? candidate.replicate() : candidate.breed(sortedCandidates[mateIndex]);
    kid.age = 0;
    candidate.multiMutate(numParentMutations, ["phrase", "sample"]);
    kid.multiMutate(numChildMutations,["phrase", "sample"]);
    kids.push(kid);
  });
  let res = sortedCandidates.concat(kids);
  // handle e.g., population of 3 with 1 survivor
  if (res.length < populationSize) {
    let extra = sortedCandidates[0].replicate()
    extra.multiMutate(numChildMutations,["phrase", "sample"]);
    res.push(extra);
  }
  return res;
}

export function generationProcedure(content, numParentMutations, numChildMutations) {
  const sorted = content.sort((a,b) => b.score - a.score);
  const survivors = takeHalf(sorted);
  survivors.forEach(i => i.pattern.age += 1);
  const survivorPatterns = survivors.map(e => e.pattern);
  console.log("genprod", numParentMutations, numChildMutations);
  const nextGen = breed(content.length, survivorPatterns, numParentMutations, numChildMutations);
  return nextGen;
}



// takes [Pattern]
export function getEvaluations(candidates, evaluators) {
  const seqs = candidates.map(c => c.phrase.flat());
  const populationSize = candidates.length;
  const summary = summarize(seqs);
  const evalArrays = generateEvaluationArray(candidates, evaluators, summary);
  return evalArrays;
}
