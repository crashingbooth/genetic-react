const {Pattern} = require('./pattern.js');
const {LoPat, MidPat, HiPat} = require('./pattern-types.js');

test('default pattern has 4 downbeats', () => {
    const p = new Pattern();
    expect(p.showPhrase()).toBe('x---,x---,x---,x---');
  });

test('mutate phrase returns a different pattern', () => {
    const p = new Pattern();
    const initialPhrase = p.showPhrase();
    p.mutate()
    expect(p.showPhrase()).not.toBe(p.initialPhrase);
  });

test('setPhrase converts correctly', () => {
  const p = new Pattern();
  let phr = '--x-,--x-,x---,x---';
  p.setPhrase(phr);
  expect(p.showPhrase()).toBe(phr);
});

test('LoPat is type lo', () => {
  const lo = new LoPat();
  expect(lo.type).toBe('lo');
});

test('MidPat is type mid', () => {
  const mid = new MidPat();
  expect(mid.type).toBe('mid');
});

test('HiPat is type hi', () => {
  const hi = new HiPat();
  expect(hi.type).toBe('hi');
});
