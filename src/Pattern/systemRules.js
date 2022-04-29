/* todo: create a structure {lo: evaluators, mid: evaluators, hi: evaluators}
such that it can be used in the mutate function, and so that it can be modified by the sliders in section
*/

const {roleBasedEvaluation, evaluateDensity ,evaluateRolePositive} = require('./fitness.js');

const createBasicFitnessConditions = () => {
  let conditions = {
    lo: roleBasedEvaluation,
    mid: roleBasedEvaluation,
    hi: roleBasedEvaluation
  }

  // let conditions = {
  //   lo: [],
  //   mid: [],
  //   hi: []
  // }

  // Object.values(conditions).forEach(conditionList => {
  //   conditionList.push({
  //     description: "density",
  //     // fitnessFunction: seq => evaluateDensity(1,seq),
  //     fitnessFunction: seq => curryDensity(1, seq),
  //     // fitnessFunction:  seq =>  evaluateRolePositive(seq),
  //     weight: 1
  //   })
  // });
  return conditions
}

const setDensity = (section, value, conditions) => {
  let rules = conditions[section];
  for (let rule of rules) {
    if (rule.description === "density") {
      rule.fitnessFunction = curryDensity(value);
    }
  }
  conditions[section] = rules;
  return conditions;
}

const curryDensity = (ratio, seq) => {
  return (seq => {
    evaluateDensity(ratio, seq)
  })
 }

module.exports = {createBasicFitnessConditions,
                  setDensity}
