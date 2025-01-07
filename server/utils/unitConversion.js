const conversionRates = {
    kg: 1000, // kilogramy na gramy
    g: 1, // baza
    l: 1000, // litry na mililitry
    ml: 1, // baza
    sztuki: 1, // Jednostka sztuki nie wymaga konwersji
};

function convertUnits(quantity, fromUnit, toUnit) {
    if (!conversionRates[fromUnit] || !conversionRates[toUnit]) {
        throw new Error(`Nieznana jednostka: ${fromUnit} lub ${toUnit}`);
    }

    // Sprawdzamy, czy jednostki są takie same, wtedy zwracamy po prostu ilość
    if (fromUnit === toUnit) {
        return quantity;
    }

    return (quantity * conversionRates[fromUnit]) / conversionRates[toUnit];
}

module.exports = { convertUnits };
