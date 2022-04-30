/* todo: create a structure {lo: evaluators, mid: evaluators, hi: evaluators}
such that it can be used in the mutate function, and so that it can be modified by the sliders in section
*/

const {roleBasedEvaluation, evaluateDensity, evaluateRolePositive, evaluateRoleNegative} = require('./fitness.js');

const createBasicFitnessConditions = () => {
  // let conditions = {
  //   lo: roleBasedEvaluation,
  //   mid: roleBasedEvaluation,
  //   hi: roleBasedEvaluation
  // }

  let conditions = {
    lo: [],
    mid: [],
    hi: []
  }

  Object.values(conditions).forEach(conditionList => {
    conditionList.push({
      description: "density",
      fitnessFunction: curryDensity(0.25), // the applied function
      curryingFunction: curryDensity,
      weight: 1
    });
    conditionList.push({
      description: "role positive",
      fitnessFunction: evaluateRolePositive,
      weight: 1
    });
    conditionList.push({
      description: "role negative",
      fitnessFunction: evaluateRoleNegative,
      weight: 1
    });
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
  return conditions;
}

const curryDensity = ratio => {
  return (seq =>
    evaluateDensity(ratio, seq)
  )
 }

module.exports = {createBasicFitnessConditions,
                  setDensity}
