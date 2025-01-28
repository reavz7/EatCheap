import React, { useState } from "react"
import { addIngredientToUser } from "../services/api"

const AddIngredientForm = ({ ingredientsList, fetchUserIngredients, showModal }) => {
  const [ingredientId, setIngredientId] = useState("")
  const [quantity, setQuantity] = useState("")
  const [unit, setUnit] = useState("")

  const handleSubmit = async (e) => {
    e.preventDefault()
    try {
      await addIngredientToUser(ingredientId, quantity, unit)
      showModal("Huuuura!", "Składnik został pomyślnie dodany/zaktualizowany!")
      setIngredientId("")
      setQuantity("")
      setUnit("")
      await fetchUserIngredients()
    } catch (err) {
      showModal("Mamy problem!", err.message || "Jesteś pewny, że podałeś dobrą jednostkę?")
    }
  }

  return (
    <div>
      <h2 className="text-2xl font-bold mb-6">Dodaj składnik</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="ingredientId" className="block text-sm font-medium text-gray-700">
            Wybierz składnik(sól pieprz i olej dodane są domyślnie)
          </label>
          <select
            id="ingredientId"
            value={ingredientId}
            onChange={(e) => setIngredientId(e.target.value)}
            className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-[#ff6d00] focus:ring focus:ring-[#ff6d00] focus:ring-opacity-50"
            required
          >
            <option value="">Wybierz składnik</option>
            {ingredientsList.map((ingredient) => (
              <option key={ingredient.id} value={ingredient.id}>
                {ingredient.name}
              </option>
            ))}
          </select>
        </div>
        <div>
          <label className="block text-sm font-medium text-gray-700">Ilość</label>
          <input
            type="number"
            id="quantity"
            value={quantity}
            onChange={(e) => setQuantity(e.target.value)}
            className="mt-1 block w-full text-black rounded-md border-gray-300 shadow-sm focus:border-[#ff6d00] focus:ring focus:ring-[#ff6d00] focus:ring-opacity-50"
            placeholder="Wpisz ilość"
            required
          />
        </div>
        <div>
          <label htmlFor="unit" className="block text-sm font-medium text-gray-700">
            Jednostka
          </label>
          <select
            id="unit"
            value={unit}
            onChange={(e) => setUnit(e.target.value)}
            required
            className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-[#ff6d00] focus:ring focus:ring-[#ff6d00] focus:ring-opacity-50"
          >
            <option value="">Wybierz jednostkę</option>
            <option value="g">gramy (g)</option>
            <option value="kg">kilogramy (kg)</option>
            <option value="ml">mililitry (ml)</option>
            <option value="l">litry (l)</option>
            <option value="szt">sztuki (szt.)</option>
          </select>
        </div>
        <button
          type="submit"
          className="w-full bg-[#ff6d00] text-white py-2 px-4 rounded-md hover:bg-black transition duration-300 cursor-pointer"
        >
          Dodaj składnik
        </button>
      </form>
    </div>
  )
}

export default AddIngredientForm

