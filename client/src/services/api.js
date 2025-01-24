import axios from "axios";

const API_URL = "http://localhost:5000"; // Podstawowy URL backendu

export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/users/login`, { email, password });
  return response.data;
};

export const registerUser = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/users/`, { username, email, password });
  return response.data;
};

export const addIngredientToUser = async (ingredientId, quantity, unit) => {
  try {
    const response = await axios.post(
      `${API_URL}/useringredients`,
      { ingredientId, quantity, unit },
      { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
    );
    return response.data;
  } catch (error) {
    console.error(error);
    const errorMessage = error.response?.data?.error || error.message || 'Błąd podczas dodawania składnika';
    throw new Error(errorMessage);
  }
};


export const getIngredients = async () => {
  try {
    const response = await axios.get(`${API_URL}/ingredients`);
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Błąd podczas pobierania składników');
  }
};


export const getUserIngredients = async () => {
  try {
    const response = await axios.get(`${API_URL}/useringredients`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,  
      },
    });
    console.log("Odpowiedź z API:", response.data);
    return response.data;
  } catch (error) {
    throw new Error("Błąd podczas pobierania składników użytkownika");
  }
};