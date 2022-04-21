import * as Tone from "tone";

const resourceBaseUrl = "https://raw.githubusercontent.com/crashingbooth/simple-percussion/main/"
const resources = {
  lo: [{note: "C3", name: "lo/001.wav"},{ note: "D3", name: "lo/002.wav"}, {note: "E3", name: "lo/003.wav"},{note: "F3", name: "lo/004.wav"},{note: "G3", name: "lo/005.wav"},{note: "A3", name: "lo/006.wav"}],
  mid: [{note: "C4", name: "mid/001.wav"}, {note: "D4", name: "mid/002.wav"}, {note: "E4", name: "mid/003.wav"},{note: "F3", name: "mid/004.wav"}],
  hi: [{note: "C5", name: "hi/001.wav"}, {note: "D4", name: "hi/002.wav"}, {note: "E5", name: "hi/003.wav"},{note: "F3", name: "hi/004.wav"},{note: "G5", name: "hi/005.wav"}, {note: "A5", name: "hi/006.wav"}]
}

const createSamplerWithResources = () => {
  let result = {};
  Object.values(resources).forEach(section => {
    section.forEach((sample) => {
      result[sample.note] = sample.name;
    });
  });

  const vol = new Tone.Volume(-12).toDestination();

  const samp =  new Tone.Sampler({
    urls: result,
    baseUrl: resourceBaseUrl
  });
  samp.connect(vol);
  return samp;
}

const createNotePools = () => {
  let result = {};
  Object.keys(resources).forEach(sectionName => {
    result[sectionName] = resources[sectionName].map(i => i.note);
  });
  return result;
}

const sampler = createSamplerWithResources();
const pool = createNotePools();



export { sampler, pool};
