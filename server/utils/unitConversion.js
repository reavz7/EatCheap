const conversionRates = {
  kg: 1000, // kilogramy na gramy
  g: 1, // baza - gramy
  l: 1000, // litry na mililitry - tylko jeżeli musisz pracować z objętością
  ml: 1, // mililitry - baza
  sztuki: 1, // Jednostka sztuki nie wymaga konwersji na masę
};

function convertUnits(quantity, fromUnit, toUnit) {
  if (!conversionRates[fromUnit] || !conversionRates[toUnit]) {
    throw new Error(`Nieznana jednostka: ${fromUnit} lub ${toUnit}`);
  }

  // Jeśli jednostki są takie same, po prostu zwróć ilość
  if (fromUnit === toUnit) {
    return quantity;
  }

  // Konwertowanie jednostek, ale tylko wtedy, kiedy ma to sens
  if (fromUnit === "sztuki" || toUnit === "sztuki") {
    return quantity; // Sztuki nie wymagają konwersji
  }

  // Sprawdzamy jednostki masy
  return (quantity * conversionRates[fromUnit]) / conversionRates[toUnit];
}

module.exports = { convertUnits };
