import { RiMenuLine } from "react-icons/ri";
import { IoMdClose } from "react-icons/io";
import { useState } from "react";
import { useNavigate } from "react-router-dom"; // Jeśli używasz React Router

const Navbar = () => {
    const [nav, setNav] = useState(true);
    const navigate = useNavigate();
  
    const handleNav = () => setNav(!nav);
  
    const scrollToSection = (id) => {
      const section = document.getElementById(id);
      if (section) {
        section.scrollIntoView({ behavior: "smooth" });
      }
      setNav(true); // Zamknięcie menu po kliknięciu (dla mobilnej wersji)
    };
  
    const handleLogout = () => {
      localStorage.removeItem("authToken");
      sessionStorage.removeItem("userSession");
      navigate("/");
    };
  
    return (
      <div className="flex justify-between items-center h-32 px-16 text-white bg-black z-50 sticky w-full">
        <h1 className="w-full text-3xl font-bold text-[#ff6d00] cursor-pointer" onClick={()=>navigate('/home')}>EATCHEAP</h1>
        <ul className="hidden md:flex">
          <li
            className="p-4 cursor-pointer hover:text-[#ff6d00] ease-in-out duration-150"
            onClick={() => scrollToSection("home")}
          >
            Sugestie
          </li>
          <li
            className="p-4 cursor-pointer hover:text-[#ff6d00] ease-in-out duration-150"
            onClick={() => scrollToSection("projects")}
          >
            Przepisy
          </li>
          <li
            className="p-4 cursor-pointer hover:text-[#ff6d00] ease-in-out duration-150"
            onClick={() => navigate('/profile')}
          >
            Profil
          </li>
          <button
            onClick={handleLogout}
            className="p-4 cursor-pointer ease-in-out duration-150 bg-white rounded-md font-medium my-auto mx-auto py-3 text-black hover:bg-[#ff6d00]"
          >
            Wyloguj
          </button>
        </ul>
        <div onClick={handleNav} className="block md:hidden">
          {!nav ? (
            <IoMdClose className="text-4xl cursor-pointer" />
          ) : (
            <RiMenuLine className="text-4xl cursor-pointer" />
          )}
        </div>
        <div
          className={
            !nav
              ? "fixed left-0 top-0 z-10 w-[60%] h-full border-r border-r-gray-900 bg-[#000300] ease-in-out duration-300"
              : "fixed left-[-100%]"
          }
        >
          <h1 className="w-full text-3xl font-bold text-[#ff6d00] m-8">EATCHEAP</h1>
          <ul className="p-4 uppercase">
            <li
              className="p-4 border-b hover:text-[#ff6d00] ease-in-out duration-150 border-gray-700 cursor-pointer"
              onClick={() => scrollToSection("home")}
            >
              Sugestie
            </li>
            <li
              className="p-4 border-b hover:text-[#ff6d00] ease-in-out duration-150 border-gray-700 cursor-pointer"
              onClick={() => scrollToSection("projects")}
            >
              Przepisy
            </li>
            <li
              className="p-4 border-b hover:text-[#ff6d00] ease-in-out duration-150 border-gray-700 cursor-pointer"
              onClick={() => scrollToSection("about")}
            >
              Profil  
            </li>
            <li className="p-4 border-b pl-0 border-gray-700 cursor-pointer">
              <button
                onClick={handleLogout}
                className="p-4 cursor-pointer ease-in-out duration-150 bg-white rounded-md font-medium my-auto mx-auto py-3 text-black hover:bg-[#ff6d00]"
              >
                Wyloguj
              </button>
            </li>
          </ul>
        </div>
      </div>
    );
  };
  
  export default Navbar;
  
