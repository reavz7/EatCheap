const unitGroups = {
  weight: ["kg", "g"],
  volume: ["l", "ml"],
  count: ["szt"],
};

function isValidUnit(unit, group) {
  return unitGroups[group]?.includes(unit) || false;
}

module.exports = { unitGroups, isValidUnit };
