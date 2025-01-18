const conversionRates = {
  kg: 1000, // kilogramy na gramy
  g: 1, // baza - gramy
  l: 1000, // litry na mililitry
  ml: 1, // mililitry - baza
  szt: 1, // Jednostka sztuka (nie konwertujemy sztuk, tylko porównujemy)
};

function convertUnits(quantity, fromUnit, toUnit) {
  if (!conversionRates[fromUnit] || !conversionRates[toUnit]) {
    throw new Error(`Nieznana jednostka: ${fromUnit} lub ${toUnit}`);
  }

  if (fromUnit === toUnit) {
    return quantity;
  }

  return (quantity * conversionRates[fromUnit]) / conversionRates[toUnit];
}

module.exports = { convertUnits };
