import * as Tone from "tone";

const resourceBaseUrl = "https://raw.githubusercontent.com/crashingbooth/simple-percussion/main/"
const resources = {
  // kick1: {
  //   filename: "lo/001.wav",
  //   note: "C3"
  // },
  // kick2: {
  //   filename: "lo/002.wav",
  //   note: "D3"
  // },
  // hh1: {
  //   filename: "lo/003.wav",
  //   note: "E3"
  // },
  // rim1: {
  //   filename: "lo/004.wav",
  //   note: "F3"
  // },
  // tom1: {
  //   filename: "lo/005.wav",
  //   note: "G3"
  // },
  // snare1: {
  //   filename: "lo/006.wav",
  //   note: "A3"
  // }

  lo: [{note: "C3", name: "lo/001.wav"},{ note: "D3", name: "lo/002.wav"}, {note: "E3", name: "lo/003.wav"},{note: "F3", name: "lo/004.wav"},{note: "G3", name: "lo/005.wav"},{note: "A3", name: "lo/006.wav"}],
  mid: [{note: "C4", name: "mid/001.wav"}, {note: "D4", name: "mid/002.wav"}, {note: "E4", name: "mid/003.wav"},{note: "F3", name: "mid/004.wav"}],
  hi: [{note: "C5", name: "hi/001.wav"}, {note: "D4", name: "hi/002.wav"}, {note: "E5", name: "hi/003.wav"},{note: "F3", name: "hi/004.wav"},{note: "G5", name: "hi/005.wav"}, {note: "A5", name: "hi/006.wav"}]
}

// for single sampler inst, with different samples on each note
// const createSamplerWithResources = () => {
//   const myUrls = Object.values(resources).reduce((result, curr) => {
//     result[curr.note] = curr.filename;
//     return result;
//   },{});
//
//   return new Tone.Sampler({
//     urls: myUrls,
//     baseUrl: resourceBaseUrl
//   }).toDestination();
// }
//
// const audioResources = Object.values(resources).map((res) => {
//   return {
//     displayName: res.displayName,
//     note: res.note
//   };
// });

const createSamplerWithResources = () => {
  let result = {};
  Object.values(resources).forEach(section => {
    section.forEach((sample) => {
      result[sample.note] = sample.name;
    });
  });

  return new Tone.Sampler({
    urls: result,
    baseUrl: resourceBaseUrl
  }).toDestination();
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


// const sampler = createSamplerWithResources();
// const resourceNames = Object.values(resources).map((res) => {
//   return res.displayName;
// });
//
// const resourceFromName = name => {
//    return audioResources.filter(e => name === e.displayName)[0];
// }
//
// const resourceFromID = id => {
//   return audioResources[id % audioResources.length];
// }

export { sampler, pool};
