

function writePatternToJSON(patterns, bpm) {
  const saveObj = { tempo: bpm, patterns}
  const data = JSON.stringify(saveObj);
    console.log(data);
  const date = new Date();
  const filename = `pattern-${date.getYear()}-${date.getMonth() + 1}-${date.getDate()}.json`;
  const element = document.createElement("a");
  const textFile = new Blob([data], {type: 'text/plain'}); //pass data from localStorage API to blob
  element.href = URL.createObjectURL(textFile);
  element.download = filename;
  document.body.appendChild(element);
  element.click();
}

export {writePatternToJSON};
