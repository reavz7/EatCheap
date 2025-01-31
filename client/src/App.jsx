import './App.css';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import AuthForm from './pages/AuthForm';
import Home from './pages/Home';
import Profile from './pages/Profile';
import Suggestions from './pages/Suggestions';

function App() {
  return (  
    <Router>    
      <Routes>
        <Route path="/" element={<AuthForm />} />
        <Route path="/home" element={<Home />} />
        <Route path='/profile' element={<Profile />} />
        <Route path='/suggestions' element={<Suggestions/>} />
      </Routes>
    </Router>
    
  );
}

export default App;
