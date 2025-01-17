const allowedUnits = ["kg", "g", "l", "ml", "sztuki"];

function isValidUnit(unit) {
  return allowedUnits.includes(unit);
}

module.exports = { isValidUnit };
