const conversionRates = {
  kg: 1000, // kilogramy na gramy
  g: 1, // gramy
  l: 1000, // litry na mililitry
  ml: 1, // mililitry
  szt: 1, // Jednostka sztuka (porównujemy w tej samej jednostce)
};

// Funkcja konwertująca jednostki
function convertUnits(quantity, fromUnit, toUnit) {
  if (!conversionRates[fromUnit] || !conversionRates[toUnit]) {
    throw new Error(`Nieznana jednostka: ${fromUnit} lub ${toUnit}`);
  }

  if (fromUnit === toUnit) {
    return quantity;
  }

  return (quantity * conversionRates[fromUnit]) / conversionRates[toUnit];
}

// Funkcja odejmująca składnik (konwertuje do jednostki bazowej, odejmuje, potem konwertuje z powrotem)
function subtractIngredient(userQuantity, userUnit, requiredQuantity, requiredUnit) {
  // Zamieniamy obie wartości na gramy/ml (nasza baza)
  const userQuantityInBase = convertUnits(userQuantity, userUnit, "g");
  const requiredQuantityInBase = convertUnits(requiredQuantity, requiredUnit, "g");

  // Odejmujemy wartości w tej samej jednostce (bazowej)
  const remainingQuantityInBase = userQuantityInBase - requiredQuantityInBase;
  if (remainingQuantityInBase < 0) {
    throw new Error("Nie masz wystarczającej ilości składnika!");
  }

  // Konwertujemy wynik z powrotem do jednostki użytkownika
  return convertUnits(remainingQuantityInBase, "g", userUnit);
}

module.exports = { convertUnits, subtractIngredient };