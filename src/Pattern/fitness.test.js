const { matchSingleChromosome,
                    rewardSingleCorrectChomosome,
                    punishSingleWrongChromosome, evaluateSequencePositive, evaluateSequenceNegative, evaluateRolePositive,
                    evaluateRoleNegative, evaluate, evaluateDensity,
                    roleBasedEvaluation, sortByEvaluation} = require('./fitness.js');
const {LoPat, MidPat, HiPat} = require('./pattern-types.js');

test('all match returns 1', () => {
  const score = matchSingleChromosome([true, true, true, true],[true, true, true, true] );
  expect(score).toBe(1);
})

test('no match returns 0', () => {
  const score = matchSingleChromosome([false, false, false, false],[true, true, true, true] );
  expect(score).toBe(0);
})

test('reward single has rewards correct', () => {
  const score = rewardSingleCorrectChomosome([1,0,0,0], [1,0,0,0])
  expect(score).toBe(1);
})

test('reward single has rewards correct for multiple targets', () => {
  const score = rewardSingleCorrectChomosome([1,1,0,0], [1,1,0,0])
  expect(score).toBe(1);
})

test('reward single has rewards correct for multiple targets', () => {
  const score = rewardSingleCorrectChomosome([1,1,0,0], [1,0,0,0])
  expect(score).toBe(0.5);
})

test('reward single has rewards correct:2', () => {
  const score = rewardSingleCorrectChomosome([1,0,0,0], [0,0,0,0])
  expect(score).toBe(0);
})

test('reward single doesnt punish errors', () => {
  const score = rewardSingleCorrectChomosome([1,0,0,0], [1,1,1,1])
  expect(score).toBe(1);
})

test('punish single has punishment correct', () => {
  const score = punishSingleWrongChromosome([0,0,0,0], [1,0,0,0])
  expect(score).toBe(-0.25);
})

test('punish single ignores correct', () => {
  const score = punishSingleWrongChromosome([1,1,0,0], [0,0,0,0])
  expect(score).toBe(0);
})

test('punish single score correct partial', () => {
  const score = punishSingleWrongChromosome([0,1,0,1], [1,1,0,1])
  expect(score).toBe(-0.5);
})

test('lo match positive', () => {
  const score = rewardSingleCorrectChomosome([1,0,0,0], [1,0,0,0])
  expect(score).toBe(1);
})

test('lo match negative', () => {
  const score = punishSingleWrongChromosome([1,0,0,0], [1,0,0,0])
  expect(score).toBe(0);
})

test('hi match positive', () => {
  const score = rewardSingleCorrectChomosome([0,1,1,1], [0,1,1,1])
  expect(score).toBe(1);
})

test('hi match negative', () => {
  const score = punishSingleWrongChromosome([0,1,1,1], [0,1,1,1])
  expect(score).toBe(0);
})

test('evaluate sequence: positive', () => {
  const p = new LoPat();
  p.setPhrase('xxxx,xxxx,xxxx,xxxx');
  const score = evaluateSequencePositive([true,false,false,false], p)
  expect(score).toBe(1);
})

test('evaluate sequence: negative', () => {
  const p = new LoPat();
  p.setPhrase('---- ---- ---- ----');
  const score = evaluateSequenceNegative([0,1,1,1], p)
  expect(score).toBe(0);
})

// evaluate role: positive
test('evaluate role positive, lo from start', () => {
  const p = new LoPat();
  p.setPhrase('x--- x--- x--- x---');
  const score = evaluateRolePositive(p)
  expect(score).toBe(1);
});

test('evaluate role positive, mid from start', () => {
  const p = new MidPat();
  p.setPhrase('x--- x--- x--- x---');
  const score = evaluateRolePositive(p)
  expect(score).toBe(0);
})

test('evaluate role positive, mid ideal', () => {
  const p = new MidPat();
  p.setPhrase('--x- --x- --x- --x-');
  const score = evaluateRolePositive(p)
  expect(score).toBe(1);
})

test('evaluate role positive, hi from start', () => {
  const p = new HiPat();
  p.setPhrase('x--- x--- x--- x---');
  const score = evaluateRolePositive(p)
  expect(score).toBe(0);
})

test('evaluate role positive, hi ideal', () => {
  const p = new HiPat();
  p.setPhrase('-xxx -xxx -xxx -xxx');
  const score = evaluateRolePositive(p)
  expect(score).toBe(1);
})

// evaluate role: negative
test('evaluate role Negative, lo from start', () => {
  const p = new LoPat();
  p.setPhrase('x--- x--- x--- x---');
  const score = evaluateRoleNegative(p)
  expect(score).toBe(0);
});

test('evaluate role Negative, mid from start', () => {
  const p = new MidPat();
  p.setPhrase('x--- x--- x--- x---');
  const score = evaluateRoleNegative(p)
  expect(score).toBe(-1/3);
})

test('evaluate role Negative, mid ideal', () => {
  const p = new MidPat();
  p.setPhrase('--x- --x- --x- --x-');
  const score = evaluateRoleNegative(p)
  expect(score).toBe(0);
})

test('evaluate role Negative, hi from start', () => {
  const p = new HiPat();
  p.setPhrase('x--- x--- x--- x---');
  const score = evaluateRoleNegative(p)
  expect(score).toBe(-1);
})

test('evaluate role Negative, hi ideal', () => {
  const p = new HiPat();
  p.setPhrase('-xxx -xxx -xxx -xxx');
  const score = evaluateRoleNegative(p)
  expect(score).toBe(0);
})

// density
test('density, match', () => {
  const p = new LoPat();
  p.setPhrase('x--- x--- x--- x---');
  const score = evaluateDensity(0.25, p);
  expect(score).toBe(1);
})

test('density, match', () => {
  const p = new LoPat();
  p.setPhrase('---- ---- ---- x---');
  const score = evaluateDensity(0.25, p);
  expect(score).toBe(9/12);
})

test('density, match', () => {
  const p = new LoPat();
  p.setPhrase('xxxx xxxx xxxx xxxx');
  const score = evaluateDensity(0.25, p);
  expect(score).toBe(0);
})

// score
test('score evaluates correctly: lo from start', () => {
  const p = new LoPat();
  p.setPhrase('x--- x--- x--- x---');
  const score = evaluate(roleBasedEvaluation, p);
  expect(score).toBe(1);
});

test('score evaluates correctly: lo modified', () => {
  const p = new LoPat();
  p.setPhrase('xxxx x--- x--- x---');
  const score = evaluate(roleBasedEvaluation, p);
  expect(score).toBe(0.75);
});

test('score evaluates correctly: hi at start', () => {
  const p = new HiPat();
  p.setPhrase('x--- x--- x--- x---');
  const score = evaluate(roleBasedEvaluation, p);
  expect(score).toBe(-1);
});

test('score evaluates correctly: high modified', () => {
  const p = new HiPat();
  p.setPhrase('-xxx x--- x--- x---');
  const score = evaluate(roleBasedEvaluation, p);
  expect(score).toBe(-0.5);
});

test('sorts by evaluated scores', () => {
  const p1 = new LoPat();
  p1.setPhrase('---- ---- ---- x---');
  const p2 = new LoPat();
  p2.setPhrase('x--- x--- ---- x---');
  const p3 = new LoPat();
  p3.setPhrase('---- x--- ---- x---');
  const p4 = new LoPat();
  p4.setPhrase('x--- x--- x--- x---');
  const arr = [p1,p2,p3,p4];

  const sorted = sortByEvaluation(arr, roleBasedEvaluation);
  expect(sorted[0].showPhrase()).toBe(p4.showPhrase());
  expect(sorted[1].showPhrase()).toBe(p2.showPhrase());
  expect(sorted[3].showPhrase()).toBe(p1.showPhrase());
});
