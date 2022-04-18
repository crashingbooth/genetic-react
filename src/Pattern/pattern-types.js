const {Pattern} = require('./pattern.js');

class LoPat extends Pattern {
  constructor(numBeats = 4) {
    super(numBeats);
    this.type = "lo";
  }
}

class HiPat extends Pattern {
  constructor(numBeats = 4) {
    super(numBeats);
    this.type = "hi";
  }
}

class MidPat extends Pattern {
  constructor(numBeats = 4) {
    super(numBeats);
    this.type = "mid";
  }
}

module.exports = {LoPat, MidPat, HiPat};
