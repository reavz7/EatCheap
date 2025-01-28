import React, { useState, useEffect } from "react";
import AddIngredientForm from "./AddIngredientForm";
import IngredientList from "./IngredientList";
import EditIngredientPanel from "./EditIngredientPanel";
import Modal from "./Modal";
import { getIngredients } from "../services/api";

const IngredientPanel = ({ userIngredients, fetchUserIngredients }) => {
  const [ingredientsList, setIngredientsList] = useState([]);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalMessage, setModalMessage] = useState("");
  const [modalTitle, setModalTitle] = useState("");
  const [isEditPanelOpen, setIsEditPanelOpen] = useState(false);
  const [editIngredient, setEditIngredient] = useState(null);

  useEffect(() => {
    fetchIngredients();
  }, []);

  const fetchIngredients = async () => {
    try {
      const ingredients = await getIngredients();
      setIngredientsList(ingredients);
    } catch (err) {
      showModal("Błąd", "Nie udało się pobrać składników.");
    }
  };

  const showModal = (title, message) => {
    setModalTitle(title);
    setModalMessage(message);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const handleModify = (ingredient) => {
    setEditIngredient(ingredient);
    setIsEditPanelOpen(true);
  };

  const handleEditSave = async () => {
    await fetchUserIngredients();
    setIsEditPanelOpen(false);
    showModal("Sukces!", "Składnik został zaktualizowany!");
  };

  const handleEditCancel = () => {
    setIsEditPanelOpen(false);
    setEditIngredient(null);
  };

  return (
    <div className="grid md:grid-cols-2 gap-8">
      <AddIngredientForm 
        ingredientsList={ingredientsList} 
        fetchUserIngredients={fetchUserIngredients}
        showModal={showModal}
      />
      <IngredientList 
        userIngredients={userIngredients}
        ingredientsList={ingredientsList}
        onModify={handleModify}
        fetchUserIngredients={fetchUserIngredients}
        showModal={showModal}
      />
      <EditIngredientPanel 
        isOpen={isEditPanelOpen}
        ingredient={editIngredient}
        onSave={handleEditSave}
        onCancel={handleEditCancel}
        showModal={showModal}
      />
      <Modal
        isOpen={isModalOpen}
        onClose={closeModal}
        message={modalMessage}
        title={modalTitle}
      />
    </div>
  );
};

export default IngredientPanel;
