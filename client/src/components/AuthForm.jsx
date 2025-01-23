import axios from "axios";
import { useState } from "react";

export default function AuthForm() {
  const [isLogin, setIsLogin] = useState(true);
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [error, setError] = useState(null);
  const [message, setMessage] = useState(null);

  const toggleForm = () => {
    setIsLogin(!isLogin);
    setError(null); // Czyścimy błędy przy zmianie formularza
    setMessage(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
  
    const endpoint = isLogin
      ? "http://localhost:5000/users/login"
      : "http://localhost:5000/users/";
    const payload = isLogin
      ? { email, password }
      : { username, email, password };
  
    try {
      const { data } = await axios.post(endpoint, payload);
      setMessage(data.message || "Operacja zakończona sukcesem");
      setError(null);
  
      if (isLogin) {
        // Obsługa tokena
        console.log("Token:", data.token);
        // Możesz go zapisać w lokalnym storage:
        localStorage.setItem("authToken", data.token);
      }
    } catch (err) {
      setError(err.response?.data?.error || "Coś poszło nie tak");
      setMessage(null);
    }
  };
  

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-[#ff6d00] to-white p-4">
      <div className="w-full max-w-md">
        <div className="bg-white bg-opacity-20 backdrop-filter backdrop-blur-lg rounded-xl shadow-lg overflow-hidden">
          <div className="p-8">
            <h2 className="text-3xl font-bold text-center text-black mb-6">
              {isLogin ? "Witaj ponownie!" : "Rejestracja"}
            </h2>
            {error && <p className="text-red-500 text-center">{error}</p>}
            {message && <p className="text-green-500 text-center">{message}</p>}
            <form className="space-y-6" onSubmit={handleSubmit}>
              {!isLogin && (
                <div>
                  <label
                    htmlFor="username"
                    className="block text-sm font-medium text-black"
                  >
                    Login
                  </label>
                  <input
                    id="username"
                    name="username"
                    type="text"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                    required={!isLogin}
                    className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-20 border border-transparent rounded-md text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                    placeholder="Twój pseudonim"
                  />
                </div>
              )}
              <div>
                <label
                  htmlFor="email"
                  className="block text-sm font-medium text-black"
                >
                  E-mail
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-20 border border-transparent rounded-md text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="Twój e-mail"
                />
              </div>
              <div>
                <label
                  htmlFor="password"
                  className="block text-sm font-medium text-black"
                >
                  Hasło
                </label>
                <input
                  id="password"
                  name="password"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  className="mt-1 block w-full px-3 py-2 bg-white bg-opacity-20 border border-transparent rounded-md text-black placeholder-gray-300 focus:outline-none focus:ring-2 focus:ring-white focus:border-transparent"
                  placeholder="••••••••"
                />
              </div>
              <div>
                <button
                  type="submit"
                  className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-[#ff6d00] hover:bg-[#ff7900] focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 cursor-pointer"
                >
                  {isLogin ? "Zaloguj się" : "Zarejestruj się"}
                </button>
              </div>
            </form>
            <div className="mt-6 text-center">
              <button
                onClick={toggleForm}
                className="text-sm text-black hover:text-indigo-200 focus:outline-none cursor-pointer"
              >
                {isLogin
                  ? "Nie masz jeszcze konta!? Zarejestruj się"
                  : "Nie pierwszy raz? Zaloguj się"}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
