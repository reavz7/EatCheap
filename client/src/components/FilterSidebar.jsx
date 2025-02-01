import { useState } from 'react'

const FilterSidebar = () => {
  const [preparationTime, setPreparationTime] = useState(60)

  return (
    <div className="w-64 bg-white p-4 rounded-lg shadow-md">
      <h2 className="text-lg font-semibold mb-4 text-gray-800">Filtry</h2>
      
      <div className="space-y-4">
        <div className="border-b pb-4">
          <h3 className="text-sm font-medium mb-3 text-gray-700">Preferencje dietetyczne</h3>
          <div className="space-y-2">
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="wegetarianskie"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Wegetariańskie</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="weganskie"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Wegańskie</span>
            </label>
            <label className="flex items-center space-x-2">
              <input
                type="checkbox"
                name="bezGlutenu"
                className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-600">Bez glutenu</span>
            </label>
          </div>
        </div>

        <div className="border-b pb-4">
          <h3 className="text-sm font-medium mb-3 text-gray-700">Czas przygotowania</h3>
          <div className="px-2">
            <input
              type="range"
              min="0"
              max="180"
              value={preparationTime}
              onChange={(e) => setPreparationTime(e.target.value)}
              className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
            />
            <div className="mt-2 text-sm text-gray-600">
              Do {preparationTime} minut
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

export default FilterSidebar
