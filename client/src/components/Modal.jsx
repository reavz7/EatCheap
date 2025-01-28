import React, { useEffect } from "react";

const Modal = ({ isOpen, onClose, message, title }) => {
  useEffect(() => {
    const handleEscapeKey = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    if (isOpen) {
      document.addEventListener("keydown", handleEscapeKey);
    }

    // Cleanup function to remove the event listener
    return () => {
      document.removeEventListener("keydown", handleEscapeKey);
    };
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-opacity-75 backdrop-blur-xs ease-in-out duration-300 flex items-center justify-center z-50">
      <div className="bg-white text-black rounded-lg p-8 max-w-sm w-full">
        <h3
          className={
            title === "Mamy problem!"
              ? "font-bold text-lg mb-4 text-red-500"
              : "font-bold text-lg mb-4 text-green-500"
          }
        >
          {title}
        </h3>
        <p className="py-4">{message}</p>
        <div className="modal-action">
          <button className="btn" onClick={onClose}>
            Zamknij
          </button>
        </div>
      </div>
    </div>
  );
};

export default Modal;
