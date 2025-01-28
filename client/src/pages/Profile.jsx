import React, { useState, useEffect } from "react"
import Navbar from "../components/Navbar"
import IngredientPanel from "../components/IngredientPanel"
import UserProfileForm from "../components/UserProfileForm"
import { getUserIngredients } from "../services/api"

const Profile = () => {
  const [activePanel, setActivePanel] = useState("ingredients")
  const [userIngredients, setUserIngredients] = useState([])
  const [error, setError] = useState("")
  const [userId, setUserId] = useState(null)
  const [username, setUsername] = useState("")
  const [email, setEmail] = useState("")

  useEffect(() => {
    fetchUserIngredients()
    // Fetch user data here and set userId, username, and email
    // For example:
    // const userData = await getUserData()
    // setUserId(userData.id)
    // setUsername(userData.username)
    // setEmail(userData.email)
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
              <UserProfileForm userId={userId} initialUsername={username} initialEmail={email} />
            </div>
          )}
        </div>
      </div>
    </>
  )
}

export default Profile

