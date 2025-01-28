import React, { useState, useEffect } from "react";
import Navbar from "./Navbar";
import Modal from "./Modal";
import {
  addIngredientToUser,
  getIngredients,
  getUserIngredients,
  deleteUserIngredient,
} from "../services/api";

const Profile = () => {
  const [panel, setPanel] = useState(true);
  const [ingredientId, setIngredientId] = useState("");
  const [quantity, setQuantity] = useState("");
  const [unit, setUnit] = useState("");
  const [userIngredients, setUserIngredients] = useState([]);
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [ingredientsList, setIngredientsList] = useState([]);
  const [searchQuery, setSearchQuery] = useState("");

  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");

  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [editIngredient, setEditIngredient] = useState(null);
  const [editQuantity, setEditQuantity] = useState("");
  const [editUnit, setEditUnit] = useState("");

  const fetchUserIngredients = async () => {
    try {
      const ingredients = await getUserIngredients();
      if (Array.isArray(ingredients)) {
        setUserIngredients(ingredients);
      } else {
        setError("Otrzymano dane w niewłaściwym formacie.");
      }
    } catch (err) {
      setError("Nie udało się pobrać Twoich składników.");
    }
  };

  // Pobieramy składniki przy renderowaniu komponentu
  const fetchIngredients = async () => {
    try {
      const ingredients = await getIngredients();
      setIngredientsList(ingredients);
    } catch (err) {
      setError("Nie udało się pobrać składników.");
    }
  };

  useEffect(() => {
    fetchUserIngredients();
  }, []);

  // Zainicjowanie fetchIngredients po załadowaniu komponentu
  useEffect(() => {
    fetchIngredients();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccessMessage("");

    try {
      const response = await addIngredientToUser(ingredientId, quantity, unit);
      setModalTitle("Huuuura!");
      setModalMessage("Składnik został pomyślnie dodany/zaktualizowany!");
      setIsModalOpen(true);
      setIngredientId("");
      setQuantity("");
      setUnit("");
      await fetchUserIngredients();
    } catch (err) {
      setModalTitle("Mamy problem!");
      setModalMessage(err.message || "Wystąpił błąd przy dodawaniu składnika.");
      setIsModalOpen(true);
    }
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModify = (ingredient) => {
    setEditIngredient(ingredient);
    setEditQuantity(ingredient.quantity);
    setEditUnit(ingredient.unit);
    setIsEditPanelOpen(true);
  };

  const handleSave = async () => {
    // Implement logic to update the ingredient
    try {
      // Make API call to update ingredient
      const response = await addIngredientToUser(
        editIngredient.ingredient_id,
        editQuantity,
        editUnit
      );
      await fetchUserIngredients();
      setIsEditPanelOpen(false);
      setModalTitle("Sukces!");
      setModalMessage("Składnik został zaktualizowany!");
      setIsModalOpen(true);
    } catch (error) {
      setModalTitle("Mamy problem!");
      setModalMessage(
        "Wystąpił błąd podczas aktualizacji składnika. Upewnij się, że dobrze podajesz jednostkę"
      );
      setIsModalOpen(true);
    }
  };

  const handleDelete = async (ingredientId) => {
    try {
      await deleteUserIngredient(ingredientId);
      setModalTitle("Sukces!");
      setModalMessage("Składnik został usunięty!");
      setIsModalOpen(true);
      await fetchUserIngredients();
    } catch (error) {
      setModalTitle("Błąd!");
      setModalMessage("Wystąpił błąd podczas usuwania składnika.");
      setIsModalOpen(true);
    }
  };

  const handleCancel = () => {
    setIsEditPanelOpen(false);
    setEditIngredient(null);
    setEditQuantity("");
    setEditUnit("");
  };

  const filteredUserIngredients = Array.isArray(userIngredients)
    ? userIngredients.filter((ingredient) => {
        const ingredientName = ingredientsList.find(
          (item) => item.id === ingredient.ingredient_id
        )?.name;
        return (
          ingredientName &&
          ingredientName.toLowerCase().includes(searchQuery.toLowerCase())
        );
      })
    : [];

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-black text-center font-bold mt-6 mb-2 lg:text-7xl md:text-5xl sm:text-[3rem]">
          Twój profil
        </h1>
        <p className="text-center lg:text-2xl sm:text-[14px] text-gray-600 mb-8">
          Tutaj dodasz swoje składniki i zmienisz dane
        </p>

        <div
          role="tablist"
          className="tabs tabs-boxed flex justify-center gap-10 mb-8"
        >
          <a
            role="tab"
            onClick={() => setPanel(true)}
            className={
              panel
                ? "tab cursor-default bg-[#ff6d00] p-3 rounded-3xl h-12 w-42 ease-in-out duration-150"
                : "tab cursor-pointer bg-gray-700 text-white rounded-3xl h-12 w-42"
            }
          >
            Twoje składniki
          </a>

          <a
            role="tab"
            onClick={() => setPanel(false)}
            className={
              !panel
                ? "tab cursor-default bg-[#ff6d00] p-3 rounded-3xl h-12 w-42 ease-in-out duration-150"
                : "tab cursor-pointer bg-gray-700 text-white rounded-3xl h-12 w-42"
            }
          >
            Twój profil
          </a>
        </div>

        <div className="mt-8">
          {/* Sekcja składników */}
          <div className={panel ? "grid md:grid-cols-2 gap-8" : "hidden"}>
            <div>
              <h2 className="text-2xl font-bold mb-6 ">Dodaj składnik</h2>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label
                    htmlFor="ingredientId"
                    className="block text-sm font-medium text-gray-700"
                  >
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
                  <label className="block text-sm font-medium text-gray-700">
                    Ilość
                  </label>
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
                  <label
                    htmlFor="unit"
                    className="block text-sm font-medium text-gray-700"
                  >
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
              <Modal
                isOpen={isModalOpen}
                onClose={closeModal}
                message={modalMessage}
                title={modalTitle}
              />
            </div>
            <div>
              <h2 className="text-2xl font-bold mb-6">
                Lista twoich składników
              </h2>
              <input
                type="text"
                placeholder="Szukaj składników"
                className="w-full mb-4 rounded-md border-gray-300 shadow-sm focus:border-[#ff6d00] focus:ring focus:ring-[#ff6d00] focus:ring-opacity-50"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)} // Zmieniaj zapytanie przy wpisywaniu
              />
              <div className="h-80 overflow-y-auto">
                <ul className="space-y-2 text-black pr-2">
                  {filteredUserIngredients.map((ingredient) => {
                    const ingredientName = ingredientsList.find(
                      (item) => item.id === ingredient.ingredient_id
                    )?.name;
                    return (
                      <li
                        key={ingredient.id}
                        className="flex justify-between items-center mb-2 p-2 border border-gray-300 rounded hover:bg-gray-100 transition duration-300"
                      >
                        <span className="text-sm">
                          {ingredientName
                            ? ingredientName
                            : "Nieznany składnik"}{" "}
                          - {ingredient.quantity} {ingredient.unit}
                        </span>
                        <div className="flex space-x-2">
                          <button
                            onClick={() => handleModify(ingredient)}
                            className="bg-[#ff6d00] text-white py-1 px-2 rounded text-sm hover:bg-black transition duration-300 cursor-pointer"
                          >
                            Modyfikuj
                          </button>
                          <button
                            onClick={() => handleDelete(ingredient.id)}
                            className="bg-red-500 text-white py-1 px-2 rounded text-sm hover:bg-black transition duration-300 cursor-pointer"
                          >
                            Usuń
                          </button>
                        </div>
                      </li>
                    );
                  })}
                </ul>
              </div>
            </div>
          </div>

          {/* Sekcja profilu */}
          <div className={!panel ? "flex flex-col items-center" : "hidden"}>
            <h2 className="text-2xl font-bold mb-6">Edytuj profil</h2>
            <form className="w-full max-w-md space-y-4">
              <h1>kiedys</h1>
            </form>
          </div>
        </div>
        <div
          className={`fixed inset-y-0 right-0 w-64 flex items-center justify-center bg-white shadow-lg transform ${
            isEditPanelOpen ? "translate-x-0" : "translate-x-full"
          } transition-transform duration-300 ease-in-out`}
        >
          <div className="p-4">
            <h3 className="text-lg font-semibold mb-4">Edytuj składnik</h3>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Ilość
                </label>
                <input
                  type="number"
                  value={editQuantity}
                  onChange={(e) => setEditQuantity(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff6d00] focus:ring focus:ring-[#ff6d00] focus:ring-opacity-50"
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700">
                  Jednostka
                </label>
                <select
                  value={editUnit}
                  onChange={(e) => setEditUnit(e.target.value)}
                  className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-[#ff6d00] focus:ring focus:ring-[#ff6d00] focus:ring-opacity-50"
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
                  className="bg-[#ff6d00] text-white py-2 px-4 rounded hover:bg-black transition duration-300"
                >
                  Zapisz
                </button>
                <button
                  onClick={handleCancel}
                  className="bg-gray-300 text-gray-700 py-2 px-4 rounded hover:bg-gray-400 transition duration-300"
                >
                  Anuluj
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default Profile;
