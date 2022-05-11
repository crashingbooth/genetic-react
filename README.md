# Pattern Evolution

This project applies simple genetic algorithms to evolve percussion patterns. It is built with React using Tone.js, and is inspired by the [GenJam](https://ccl.northwestern.edu/netlogo/models/GenJam-Duple) model included with the [NetLogo](http://ccl.northwestern.edu/netlogo/index.shtml) application

## Try the model

* Clone this project, and navigate to the root
* npm install
* npm run start

## What is needed for evolution

Roughly speaking, Genetic algorithms require a few basic components:
* A population of candidates, in this case each pattern in time consisting of four 'chromosomes', each made up of four on/off events, in musical terms, a one bar rhythmic phrase made of 4 beats with 4 16th notes in each
* A 'fitness function'. Fitness here is used in the sense of 'survival of the fittest'. The fitness function scores each candidate on how well it meets criteria defined by the parameters
* A way of combining successful candidates. In this case, when two candidates are combined, each chromosome (1-beat phrase) for the offspring is taken at random from one of its parents
* A way of mutating candidates. In this case, the mutations simply involve toggling a random event within a random chromosome either from off to on, or on to off

## The algorithm

In each generation:
* Candidates are scored by the fitness function and ranked accordingly
* The unsuccessful candidates (here, the bottom half) are removed from the population
* The surviving candidates recombine to produce offspring which are added to the population
* Offspring (and here survivors, too, to ensure churn) are subject to random mutations
And this process repeats indefinitely

## The parameters
all the parameters have a 'weight' multiplier associated with them. When the weight is 0, the parameter has no impact on the fitness score. Some parameters have both a value and a weight. All parameters produces a score between 0 and 1, and are then subject to the weight multiplier, then summed together to generate a single score.

### density  
Density refers to the ratio of 'active' events. If all events are active the density will be 1, and 0 with no events. If the `value` is set to 0.25, then a candidate with precisely 4 of 16 events active will score 1, while a candidate with either 0 or 8 events will score 0.75, and a candidate with 16 events will score 0.25 etc.

### reward originality
This parameter will compare a candidate to others in its population and score it favourably when it is different. For example if there are 6 candidates in a population and five of them have active events on the first beat, the one candidate without the active event will score 1.0 because 5/5 of the others are different, while the other 5 will each score 0.2 since 4/5 in their cohort are the same. The score for each candidate will be average score across all 16 events.

### role positive
This parameter comes from the GenJam model above, where each candidate belongs to one of three groups: lo, mid, and high. 'lo' candidates, associated with low drums, prefer for each chromosome to have the pattern `x---`.  'mid' candidates prefer `--x-` and 'hi' prefer `-xxx`.  The `role positive` parameter rewards patterns that match the active part of the preferred pattern (but are indifferent to the inactive part). So a `lo` patterns would score equally high for `x---` and `xxxx` since that first event was covered in both. If that first event were missing, it would score lower.

### role negative
This is the counterpart to `role positive`. It will punish candidates that have events where events should not be. For `lo` candidates `----` and `x---` would score equally well, since neither have events over the last 3 events slots
