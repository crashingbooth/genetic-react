import * as Tone from "tone";

const resourceBaseUrl = "https://raw.githubusercontent.com/crashingbooth/static-step-sequencer/main/"
const resources = {
  kick1: {
    filename: "audio/kick.mp3",
    displayName: "kick 1",
    note: "C3"
  },
  kick2: {
    filename: "audio/kick1.wav",
    displayName: "kick 2",
    note: "D3"
  },
  hh1: {
    filename: "audio/hh.wav",
    displayName: "hh 1",
    note: "E3"
  },
  rim1: {
    filename: "audio/rim2.wav",
    displayName: "rim 1",
    note: "F3"
  },
  tom1: {
    filename: "audio/tom.wav",
    displayName: "tom 1",
    note: "G3"
  },
  snare1: {
    filename: "audio/snare3.wav",
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
