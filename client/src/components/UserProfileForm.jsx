import React, { useState, useEffect } from "react";
import Modal from "./Modal";
import { updateUser, getUserInfo } from "../services/api";

const UserProfileForm = () => {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [modalContent, setModalContent] = useState({ title: "", message: "" });
  const [activeField, setActiveField] = useState("");
  const [formData, setFormData] = useState({
    email: "",
    hasło: "",
    pseudonim: "",
  });
  const [userInfo, setUserInfo] = useState({
    email: "",
    username: "",
  });

  // Pobranie danych użytkownika po załadowaniu komponentu
  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const data = await getUserInfo();
        setUserInfo({
          email: data.user.email,
          username: data.user.username,
        });
      } catch (error) {
        console.error(error.message);
      }
    };

    fetchUserInfo();
  }, []);

  const openModal = (field) => {
    setActiveField(field);
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
    setFormData({ email: "", hasło: "", pseudonim: "" });
  };

  const handleInputChange = (e) => {
    setFormData({ ...formData, [activeField]: e.target.value });
  };

  const handleSubmit = async () => {
    try {
      const dataToUpdate = { [activeField]: formData[activeField] };
      await updateUser(
        null,
        dataToUpdate.pseudonim,
        dataToUpdate.email,
        dataToUpdate.hasło
      );
      setModalContent({
        title: "Sukces!",
        message: `${
          activeField.charAt(0).toUpperCase() + activeField.slice(1)
        } został(a) pomyślnie zaktualizowany(a).`,
      });
      setIsModalOpen(true);
      setTimeout(() => {
        window.location.reload();
      }, 1000);
    } catch (error) {
      setModalContent({
        title: "Mamy problem!",
        message: error.message,
      });
      setIsModalOpen(true);
    } finally {
      setFormData({ email: "", hasło: "", pseudonim: "" });
    }
  };

  const renderModalContent = () => {
    if (activeField === "") return null;

    return (
      <div className="space-y-4">
        <h2 className="text-xl font-bold">Aktualizuj {activeField}</h2>
        <input
          type={activeField === "hasło" ? "hasło" : "text"}
          value={formData[activeField]}
          onChange={handleInputChange}
          className="w-full p-2 border rounded"
          placeholder={`Nowy/e ${activeField}`}
        />
        <button
          onClick={handleSubmit}
          className="w-full bg-green-500 text-white p-2 rounded hover:bg-black cursor-pointer ease-in-out duration-200"
        >
          Zapisz
        </button>
      </div>
    );
  };

  return (
    <div className="grid grid-cols-2 p-3 gap-[12rem]">
      <div>
        <h2 className="text-2xl font-bold mb-6 text-center">Twoje dane</h2>
        <div className="space-y-2 text-center">
          <p><strong>Email:</strong> {userInfo.email}</p>
          <p><strong>Pseudonim:</strong> {userInfo.username}</p>
        </div>
      </div>
      <div className="space-y-4">
        <h2 className="text-2xl font-bold mb-6 text-center">Zmiana danych</h2>
        <button
          onClick={() => openModal("email")}
          className="w-full bg-[#ff6d00] p-2 rounded hover:bg-black ease-in-out duration-200 cursor-pointer"
        >
          Zmień email
        </button>
        <button
          onClick={() => openModal("hasło")}
          className="w-full bg-[#ff6d00] p-2 rounded hover:bg-black ease-in-out duration-200 cursor-pointer"
        >
          Zmień hasło
        </button>
        <button
          onClick={() => openModal("pseudonim")}
          className="w-full bg-[#ff6d00] p-2 rounded hover:bg-black ease-in-out duration-200 cursor-pointer"
        >
          Zmień pseudonim
        </button>

        <Modal
          isOpen={isModalOpen}
          onClose={closeModal}
          title={modalContent.title || "Aktualizacja danych"}
          message={modalContent.message || renderModalContent()}
        />
      </div>
    </div>
  );
};

export default UserProfileForm;
