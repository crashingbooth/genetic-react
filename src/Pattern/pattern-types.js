import { Pattern } from './pattern.js';

export class LoPat extends Pattern {
  constructor(numBeats = 4) {
    super(numBeats);
    this.type = "lo";
  }
}

export class HiPat extends Pattern {
  constructor(numBeats = 4) {
    super(numBeats);
    this.type = "hi";
  }
}

export class MidPat extends Pattern {
  constructor(numBeats = 4) {
    super(numBeats);
    this.type = "mid";
  }
}
