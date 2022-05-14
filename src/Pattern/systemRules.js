import { evaluateDensity, evaluateRoleGeneral, rewardOriginality} from './fitness.js';

export const createBasicFitnessConditions = () => {
  let conditions = {
    lo: [],
    mid: [],
    hi: []
  }

  Object.values(conditions).forEach(conditionList => {
    conditionList.push({
      description: "density",
      value: 0.25,
      fitnessFunction: curryDensity(0.25), // the applied function
      curryingFunction: curryDensity,
      weight: 1
    });
    conditionList.push({
      description: "role",
      fitnessFunction: evaluateRoleGeneral,
      weight: 1
    });
    conditionList.push({
      description: "reward originality",
      fitnessFunction: rewardOriginality,
      weight: 1
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
