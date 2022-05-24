import { evaluateDensity, evaluateRoleGeneral, rewardOriginality, evaluateDensityFromArgBundle, rewardOriginalityFromArgBundle } from './fitness.js';

export const createBasicFitnessConditions = () => {
  let conditions = {
    lo: [],
    mid: [],
    hi: []
  }

  Object.values(conditions).forEach(conditionList => {
    conditionList.push({
      description: "density",
      value: (6/16),
      // fitnessFunction: curryDensity(6/16), // the applied function
      // curryingFunction: curryDensity,
      weight: 1
    });
    conditionList.push({
      description: "role",
      // fitnessFunction: evaluateRoleGeneral,
      weight: 1
    });
    conditionList.push({
      description: "rewardOriginality",
      // fitnessFunction: rewardOriginality,
      weight: 0
    });

  });
  return conditions
}

export const setDensity = (section, value, conditions) => {
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
