/* todo: create a structure {lo: evaluators, mid: evaluators, hi: evaluators}
such that it can be used in the mutate function, and so that it can be modified by the sliders in section
*/

const {roleBasedEvaluation} = require('./fitness.js');

const createBasicFitnessConditions = () => {
  return {
    lo: roleBasedEvaluation,
    mid: roleBasedEvaluation,
    hi: roleBasedEvaluation
  }
}

module.exports = {createBasicFitnessConditions}
