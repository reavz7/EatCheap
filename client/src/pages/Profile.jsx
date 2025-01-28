import React, { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import IngredientPanel from "../components/IngredientPanel"
import { getUserIngredients } from "../services/api"

const Profile = () => {
  const [activePanel, setActivePanel] = useState("ingredients")
  const [userIngredients, setUserIngredients] = useState([])
  const [error, setError] = useState("")
    
  useEffect(() => {
    fetchUserIngredients()
  }, [])

  const fetchUserIngredients = async () => {
    try {
      const ingredients = await getUserIngredients()
      if (Array.isArray(ingredients)) {
        setUserIngredients(ingredients)
      } else {
        setError("Otrzymano dane w niewłaściwym formacie.")
      }
    } catch (err) {
      setError("Nie udało się pobrać Twoich składników.")
    }
  }

  return (
    <>
      <Navbar />
      <div className="container mx-auto px-4">
        <h1 className="text-black text-center font-bold mt-6 mb-2 lg:text-7xl md:text-5xl sm:text-[3rem]">
          Twój profil
        </h1>
        <p className="text-center lg:text-2xl sm:text-[14px] text-gray-600 mb-8">
          Tutaj dodasz swoje składniki i zmienisz dane
        </p>

        <div role="tablist" className="tabs tabs-boxed flex justify-center gap-10 mb-8">
          <a
            role="tab"
            onClick={() => setActivePanel("ingredients")}
            className={
              activePanel === "ingredients"
                ? "tab cursor-default bg-[#ff6d00] p-3 rounded-3xl h-12 w-42 ease-in-out duration-150"
                : "tab cursor-pointer bg-gray-700 text-white rounded-3xl h-12 w-42"
            }
          >
            Twoje składniki
          </a>
          <a
            role="tab"
            onClick={() => setActivePanel("profile")}
            className={
              activePanel === "profile"
                ? "tab cursor-default bg-[#ff6d00] p-3 rounded-3xl h-12 w-42 ease-in-out duration-150"
                : "tab cursor-pointer bg-gray-700 text-white rounded-3xl h-12 w-42"
            }
          >
            Twój profil
          </a>
        </div>

        <div className="mt-8">
          {activePanel === "ingredients" && (
            <IngredientPanel userIngredients={userIngredients} fetchUserIngredients={fetchUserIngredients} />
          )}
          {activePanel === "profile" && (
            <div className="flex flex-col items-center">
              <h2 className="text-2xl font-bold mb-6">Edytuj profil</h2>
              <form className="w-full max-w-md space-y-4">
                <h1>kiedys</h1>
              </form>
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Profile

