const conversionRates = {
    kg: 1000, // kilogramy na gramy
    g: 1, // baza
    l: 1000, // litry na mililitry
    ml: 1, // baza
};

function convertUnits(quantity, fromUnit, toUnit) {
    if (!conversionRates[fromUnit] || !conversionRates[toUnit]) {
        throw new Error(`Nieznana jednostka: ${fromUnit} lub ${toUnit}`);
    }

    return (quantity * conversionRates[fromUnit]) / conversionRates[toUnit];
}

module.exports = { convertUnits };
