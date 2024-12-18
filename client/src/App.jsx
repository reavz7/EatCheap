import { useEffect, useState } from 'react'
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css'
import axios from "axios";
import { use } from 'react';

function App() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true); // Dodajemy stan loading

  useEffect(() => {
    axios.get("http://localhost:5000/users")
      .then((response) => {
        setUsers(response.data);
        setLoading(false); // Po załadowaniu danych ustawiamy loading na false
      });
  }, []);

  if (loading) {
    return <div>Loading...</div>; // Wyświetlenie komunikatu o ładowaniu
  }

  return (
    <ul>
      {users.map(user => (
        <li key={user.id}>{user.username}</li> // Tutaj korzystasz z mapowania
      ))}
    </ul>
  );
}

export default App
