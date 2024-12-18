import logo from './logo.svg';
import './App.css';
import axios from "axios";
import {useEffect} from "react"
function App() {
        
  useEffect(() => {
    axios.get("http://localhost:5000/users").then((response) => {
      console.log(response); // tylko raz po załadowaniu komponentu
    });
  }, []);
  
   
}

export default App;
