class Pattern {
  constructor(numBeats = 4) {
    this.phrase = this.generateBasic(numBeats);
  }

  generateBasic(beats) {
    let res = [];
    const simple = [true, false, false, false]
    for (let i = 0; i < beats; i++) {
      res.push([...simple]);
    }
    return res;
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

  mutate() {
    const beat = Math.floor(Math.random() * this.phrase.length);
    const tick = Math.floor(Math.random() * 4);
    this.phrase[beat][tick] = !this.phrase[beat][tick];
  }

  multiMutate(reps) {
    for (let i = 0; i < reps; i++) {
      this.mutate();
    }
  }

  breed(other) {
    let child = new Pattern();
    let childArr = [];
    for (let i = 0; i < this.phrase.length; i++) {
      childArr.push(coin() ? [...this.phrase[i]] : [...other.phrase[i]])
    }
    child.phrase = childArr;
    return child;
  }
}

function coin() {
  return Math.random() > 0.5;
}

module.exports = {Pattern, coin};
