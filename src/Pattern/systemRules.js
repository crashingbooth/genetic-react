/* todo: create a structure {lo: evaluators, mid: evaluators, hi: evaluators}
such that it can be used in the mutate function, and so that it can be modified by the sliders in section
*/

const {roleBasedEvaluation, evaluateDensity} = require('./fitness.js');

const createBasicFitnessConditions = () => {
  let conditions = {
    lo: roleBasedEvaluation,
    mid: roleBasedEvaluation,
    hi: roleBasedEvaluation
  }

  Object.values(conditions).forEach(conditionList => {
    conditionList.push({
      description: "density",
      fitnessFunction: curryDensity(0.25),
      weight: 1
    })
  });
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
}

const curryDensity = ratio => {
  return (seq => {
    evaluateDensity(ratio, seq)
  })
 }

module.exports = {createBasicFitnessConditions}
