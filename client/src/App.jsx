import { useEffect, useState } from 'react'
import './App.css'
import axios from "axios";
import { use } from 'react';

function App() {
  const [recipes, setRecipes] = useState([]);
  const [loading, setLoading] = useState(true); // Dodajemy stan loading

  useEffect(() => {
    axios.get("http://localhost:5000/recipes")
      .then((response) => {
        setRecipes(response.data);
        setLoading(false); // Po załadowaniu danych ustawiamy loading na false
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Wyświetlenie komunikatu o ładowaniu
  }

  return (
    <ul>
      {recipes.map(recipe => (
        <li key={recipe.id}>{recipe.name}</li> // Tutaj korzystasz z mapowania
      ))}
    </ul>
  );
}

export default App
