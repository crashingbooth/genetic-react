import * as Tone from "tone";

const resourceBaseUrl = "https://raw.githubusercontent.com/crashingbooth/simple-percussion/main/"
const resources = {
  kick1: {
    filename: "lo/001.wav",
    displayName: "kick 1",
    note: "C3"
  },
  kick2: {
    filename: "lo/002.wav",
    displayName: "kick 2",
    note: "D3"
  },
  hh1: {
    filename: "lo/003.wav",
    displayName: "hh 1",
    note: "E3"
  },
  rim1: {
    filename: "lo/004.wav",
    displayName: "rim 1",
    note: "F3"
  },
  tom1: {
    filename: "lo/005.wav",
    displayName: "tom 1",
    note: "G3"
  },
  snare1: {
    filename: "lo/006.wav",
    displayName:  "snare 1",
    note: "A3"
  }
}

// for single sampler inst, with different samples on each note
const createSamplerWithResources = () => {
  const myUrls = Object.values(resources).reduce((result, curr) => {
    result[curr.note] = curr.filename;
    return result;
  },{});

  return new Tone.Sampler({
    urls: myUrls,
    baseUrl: resourceBaseUrl
  }).toDestination();
}

const audioResources = Object.values(resources).map((res) => {
  return {
    displayName: res.displayName,
    note: res.note
  };
});

const sampler = createSamplerWithResources();
const resourceNames = Object.values(resources).map((res) => {
  return res.displayName;
});

const resourceFromName = name => {
   return audioResources.filter(e => name === e.displayName)[0];
}

const resourceFromID = id => {
  return audioResources[id % audioResources.length];
}

export {audioResources, resourceNames, resourceFromName, resourceFromID, sampler};
