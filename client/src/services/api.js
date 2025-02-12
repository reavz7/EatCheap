import axios from "axios";

const API_URL = "http://localhost:5000"; // Podstawowy URL backendu

// ENDPOINTY  UŻYTKOWNIKA

// Logowanie użytkownika
export const loginUser = async (email, password) => {
  const response = await axios.post(`${API_URL}/users/login`, { email, password });
  return response.data;
};

// Rejestracja użytkownika
export const registerUser = async (username, email, password) => {
  const response = await axios.post(`${API_URL}/users/`, { username, email, password });
  return response.data;
};


export const updateUser = async (userId, username, email, password) => {
  try {
    const response = await axios.put(
      `${API_URL}/users/`,
      { username, email, password },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Błąd podczas aktualizacji danych użytkownika';
    throw new Error(errorMessage);
  }
};

// Pobieranie danych użytkownika
export const getUserInfo = async () => {
  try {
    const response = await axios.get(`${API_URL}/users/info`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Błąd podczas pobierania danych użytkownika');
  }
};


// ENDPOINTY DO INGREDIENTS- SKŁADNIKI 




// Pobieranie wszystkich składników
export const getIngredients = async () => {
  try {
    const response = await axios.get(`${API_URL}/ingredients`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Błąd podczas pobierania składników');
  }
};


// Wyszukiwanie składników po nazwie
export const searchIngredients = async (name) => {
  try {
    const response = await axios.get(`${API_URL}/ingredients/search`, {
      params: { name },
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Błąd podczas wyszukiwania składników';
    throw new Error(errorMessage);
  }
};

// Pobieranie składnika po ID
export const getIngredientById = async (id) => {
  try {
    const response = await axios.get(`${API_URL}/ingredients/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Błąd podczas pobierania składnika';
    throw new Error(errorMessage);
  }
};


// Dodanie nowego składnika
export const addIngredient = async (name, group) => {
  try {
    const response = await axios.post(
      `${API_URL}/ingredients`,
      { name, group },
      { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Błąd podczas dodawania składnika';
    throw new Error(errorMessage);
  }
};

// Aktualizacja składnika
export const updateIngredient = async (id, name, group) => {
  try {
    const response = await axios.put(
      `${API_URL}/ingredients/${id}`,
      { name, group },
      { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Błąd podczas aktualizowania składnika';
    throw new Error(errorMessage);
  }
};

// Usuwanie składnika
export const deleteIngredient = async (id) => {
  try {
    const response = await axios.delete(`${API_URL}/ingredients/${id}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Błąd podczas usuwania składnika';
    throw new Error(errorMessage);
  }
};



// USERINGREDIENT API- CZYLI SKŁADNIKI UŻYTKOWNIKA, NIE MYLIĆ Z OGÓLNYMI SKŁADNIKAMI

// Pobieranie składników użytkownika
export const getUserIngredients = async () => {
  try {
    const response = await axios.get(`${API_URL}/useringredients`, {
      headers: {
        Authorization: `Bearer ${localStorage.getItem('authToken')}`,
      },
    });
    return response.data;
  } catch (error) {
    throw new Error("Błąd podczas pobierania składników użytkownika");
  }
};

// Dodanie składnika do użytkownika
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
// Usuwanie składnika użytkownika
export const deleteUserIngredient = async (ingredientId) => {
  try {
    const response = await axios.delete(`${API_URL}/useringredients/${ingredientId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    return response.data;
  } catch (error) {
    console.error(error);
    const errorMessage = error.response?.data?.error || error.message || 'Błąd podczas usuwania składnika';
    throw new Error(errorMessage);
  }
};

// Aktualizacja składnika użytkownika- Raczej nigdy nie zostanie użyta ale lepiej zostawię
export const updateUserIngredient = async (ingredientId, quantity, unit) => {
  try {
    const response = await axios.put(
      `${API_URL}/useringredients/${ingredientId}`,
      {
        quantity,
        unit,
      },
      {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('authToken')}`,
        },
      }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || error.message || 'Błąd podczas aktualizacji składnika';
    throw new Error(errorMessage);
  }
};


// Pobieranie przepisów z filtrami
export const getRecipes = async (filters) => {
  try {
    const mappedFilters = {
      searchTerm: filters.searchTerm, 
      maxPrepTime: filters.maxPrepTime,
      isVegan: filters.isVegan ? "1" : undefined,
      isVegetarian: filters.isVegetarian ? "1" : undefined,
      isGlutenFree: filters.isGlutenFree ? "1" : undefined,
    };

    const response = await axios.get(`${API_URL}/suggestions`, {
      params: mappedFilters,
      headers: { Authorization: `Bearer ${localStorage.getItem("authToken")}` },
    });
    console.log("Odpowiedź z backendu:", response.data);
    return response.data;
  } catch (error) {
    const errorMessage =
      error.response?.data?.error || "Błąd podczas pobierania przepisów";
    throw new Error(errorMessage);
  }
};


// Wykonanie przepisu
export const makeRecipe = async (recipeId) => {
  try {
    const response = await axios.post(
      `${API_URL}/suggestions/make-recipe`,
      { recipeId },
      { headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` } }
    );
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Błąd podczas wykonywania przepisu';
    throw new Error(errorMessage);
  }
};

// Fetch ingredients for a specific recipe
export const getRecipeIngredients = async (recipeId) => {
  try {
    const response = await axios.get(`${API_URL}/recipeingredients/${recipeId}`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    return response.data;
  } catch (error) {
    const errorMessage = error.response?.data?.error || 'Błąd podczas pobierania składników przepisu';
    throw new Error(errorMessage);
  }
};

// PRZEPISY
// Pobieranie wszystkich przepisów- bez filtrow, po prsotu CALOSC
export const getAllRecipes = async () => {
  try {
    const response = await axios.get(`${API_URL}/recipes`, {
      headers: { Authorization: `Bearer ${localStorage.getItem('authToken')}` },
    });
    return response.data;
  } catch (error) {
    throw new Error(error.response?.data?.error || 'Błąd podczas pobierania wszystkich przepisów');
  }
};
