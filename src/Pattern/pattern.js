class Pattern {
  constructor(numBeats = 4) {
    this.phrase = this.generateBasic(numBeats);
    this.samples = this.chooseSamples(numBeats);
    this.id = Math.floor(Math.random() * 1000);
    this.ancestors = [0,0];
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

module.exports = {Pattern, coin};
