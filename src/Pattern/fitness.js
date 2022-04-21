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

function evaluateDensity(idealRatio, seq) {
  const ticks = seq.phrase.flat();
  const expectedTicks = Math.round(ticks.length * idealRatio);
  const maxDistance = Math.max(expectedTicks, ticks.length - expectedTicks);
  const realTickCount = ticks.reduce((prev,cur) => {
    return prev + (cur ? 1 : 0);
  },0);
  return (1 - Math.abs(expectedTicks - realTickCount)/maxDistance);
}

function evaluate(evaluators, seq) {
  // evaluators:
  // [{
  //    fitnessFunction: <function taking seq as arg>,
  //    weight: multiplier, only meaningful relative to other values
  // }]
  return evaluators.reduce((prev, e) => {
    return prev + (e.fitnessFunction(seq) * e.weight);
  }, 0);
}

const roleBasedEvaluation = [
  {
    fitnessFunction: evaluateRolePositive,
    weight: 1
  },
  {
    fitnessFunction: evaluateRoleNegative,
    weight: 1
  }
]

function sortByEvaluation(candidates, evaluators) {
  // candidates: [Pattern]
  // evaluators: [{fitnessFunction, weight}]
  // returns [Pattern] sorted by evaluation score

  const scores = candidates.map(c => [c, evaluate(evaluators, c)]);
  const sortedScores = scores.sort(([candA , scoreA], [candB, scoreB] ) => scoreB - scoreA);
  const sortedCandidates = sortedScores.map(([cand, score]) => cand);
  return sortedCandidates;
}

function takeHalf(sortedCandidates) {
  return sortedCandidates.slice(0,sortedCandidates.length / 2)
}

function breed(sortedCandidates, numberOfMutations) {
  let kids = [];
  sortedCandidates.forEach((candidate, i) => {
    let mateIndex = Math.floor(Math.random() * (sortedCandidates.length - 1));
    if (mateIndex >= i) { mateIndex += 1}
    let kid = candidate.breed(sortedCandidates[mateIndex]);
    candidate.multiMutate(numberOfMutations, ["phrase", "sample"]);
    kid.multiMutate(numberOfMutations,["phrase", "sample"]);
    kids.push(kid);
  });
  let res = sortedCandidates.concat(kids);
  return res;
}

function generationProcedure(candidates, evaluators, numberOfMutations) {
  const sorted = sortByEvaluation(candidates, evaluators);
  const survivors = takeHalf(sorted);
  const nextGen = breed(survivors, numberOfMutations);
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
                    sampleGenerate, // public
                  };
