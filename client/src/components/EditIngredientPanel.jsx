import React, { useState, useEffect } from "react"
import { addIngredientToUser } from "../services/api"

const EditIngredientPanel = ({ isOpen, ingredient, onSave, onCancel, showModal }) => {
  const [editQuantity, setEditQuantity] = useState("")
  const [editUnit, setEditUnit] = useState("")

  useEffect(() => {
    if (ingredient) {
      setEditQuantity(ingredient.quantity)
      setEditUnit(ingredient.unit)
    }
  }, [ingredient])

  const handleSave = async () => {
    try {
      await addIngredientToUser(ingredient.ingredient_id, editQuantity, editUnit)
      onSave()
      showModal("Huuuura!", "Składnik został pomyślnie zaktualizowany!")
    } catch (error) { 
      showModal("Mamy problem!", error.message || "Wystąpił błąd przy aktualizacji składnika")
    }
  }

  return (
    <div
      className={`fixed inset-y-0 right-0 w-64 flex items-center justify-center bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "translate-x-full"
      } transition-transform duration-300 ease-in-out`}
    >
      <div className="p-4">
        <h3 className="text-lg text-black font-semibold mb-4">Edytuj składnik</h3>
        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Ilość</label>
            <input
              type="number"
              value={editQuantity}
              onChange={(e) => setEditQuantity(e.target.value)}
              className="mt-1 block w-full rounded-md border-gray-300 text-black shadow-sm focus:border-[#ff6d00] focus:ring focus:ring-[#ff6d00] focus:ring-opacity-50"
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700">Jednostka</label>
            <select
              value={editUnit}
              onChange={(e) => setEditUnit(e.target.value)}
              className="mt-1 block w-full rounded-md text-black border-gray-300 shadow-sm focus:border-[#ff6d00] focus:ring focus:ring-[#ff6d00] focus:ring-opacity-50"
            >
              <option value="g">gramy (g)</option>
              <option value="kg">kilogramy (kg)</option>
              <option value="ml">mililitry (ml)</option>
              <option value="l">litry (l)</option>
              <option value="szt">sztuki (szt.)</option>
            </select>
          </div>
          <div className="flex justify-between">
            <button
              onClick={handleSave}
              className="bg-[#ff6d00] text-white py-2 px-4 rounded hover:bg-black transition duration-300 cursor-pointer"
            >
              Zapisz
            </button>
            <button
              onClick={onCancel}
              className="bg-red-500 text-white py-2 px-4 rounded hover:bg-black transition duration-300 cursor-pointer"
            >
              Anuluj
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}

export default EditIngredientPanel

