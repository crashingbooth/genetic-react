const {LoPat, MidPat, HiPat} = require('./pattern-types.js');
const {coin} = require('./pattern.js');

function matchSingleChromosome(target, subject) {
  let score = 0;
  for (let i = 0; i < target.length; i++) {
    score += target[i] == subject[i] ? 0.25 : 0;
  }
  return score;
}

function rewardSingleCorrectChomosome(target, subject) {
  let score = 0;
  let numHits = target.reduce((prev, cur) => prev += cur ? 1 : 0,0);
  for (let i = 0; i < target.length; i++) {
    if (target[i] && target[i] == subject[i]) {
      score += 1/numHits;
    }
  }
  return score;
}

function punishSingleWrongChromosome(target, subject) {
  let score = 0;
  let numHits = target.reduce((prev, cur) => prev += !cur ? 1 : 0,0);
  for (let i = 0; i < target.length; i++) {
    if (!target[i] && target[i] != subject[i]) {
      score -= (1/numHits);
    }
  }
  return score;
}

// positive score based on how well it matches present elements. ignores rests
// if target is x--- and seq is xxxx xxxx xxxx xxxx, it will get full score
function evaluateSequencePositive(target, sequence) {
  let score = 0;
  for (let i = 0; i < sequence.phrase.length; i++) {
    score += (rewardSingleCorrectChomosome(target, sequence.phrase[i])/sequence.phrase.length)
  }
  return score;
}

// negative score based on how much it fails to match rests
// if target is x--- and seq is xxxx xxxx xxxx xxxx, it will get maximum (negative) score
function evaluateSequenceNegative(target, sequence) {
  let score = 0;
  for (let i = 0; i < sequence.phrase.length; i++) {
    score += punishSingleWrongChromosome(target, sequence.phrase[i])/sequence.phrase.length
  }
  return score;
}

function evaluateRolePositive(seq) {
  if (seq.type === 'lo') {
    return evaluateSequencePositive([true, false, false, false], seq);
  } else if (seq.type === 'mid') {
    return evaluateSequencePositive([false, false, true, false], seq);
  } else if (seq.type === 'hi') {
    return evaluateSequencePositive([false, true, true, true], seq);
  } else {
    return 0;
  }
}

function evaluateRoleNegative(seq) {
  if (seq.type === 'lo') {
    return evaluateSequenceNegative([true, false, false, false], seq);
  } else if (seq.type === 'mid') {
    return evaluateSequenceNegative([false, false, true, false], seq);
  } else if (seq.type === 'hi') {
    return evaluateSequenceNegative([false, true, true, true], seq);
  } else {
    return 0;
  }
}

// function evaluateDensity(idealRatio, seq) {
//   const ticks = seq.phrase.flat();
//   const expectedTicks = Math.round(ticks.length * idealRatio);
//   const maxDistance = Math.max(expectedTicks, ticks.length - expectedTicks);
//   const realTickCount = ticks.reduce((prev,cur) => {
//     return prev + (cur ? 1 : 0);
//   },0);
//   return (1 - Math.abs(expectedTicks - realTickCount)/maxDistance);
// }

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

const roleBasedEvaluation = [
  {
    description: "role-positive",
    fitnessFunction: seq =>  evaluateRolePositive(seq),
    weight: 1
  },
  {
    description: "role-negative",
    fitnessFunction: seq => evaluateRoleNegative(seq),
    weight: 1
  }
]

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

function sampleGenerate(candidates) {
  return generationProcedure(candidates, roleBasedEvaluation, 2);
}

module.exports  = { matchSingleChromosome,
                    rewardSingleCorrectChomosome,
                    punishSingleWrongChromosome,
                    evaluateSequencePositive,
                    evaluateSequenceNegative,
                    evaluateRolePositive,  // public
                    evaluateRoleNegative,  // public
                    evaluateDensity,
                    evaluate, // public
                    roleBasedEvaluation, // public
                    sortByEvaluation,
                    generationProcedure,
                    rewardOriginality, //public
                    sampleGenerate, // public
                    summarize, // public
                    rewardOriginality,
                  };
