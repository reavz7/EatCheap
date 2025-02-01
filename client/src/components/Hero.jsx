import { useNavigate } from "react-router-dom"
import { ReactTyped } from "react-typed"

const Hero = () => {
  const navigate = useNavigate()
  return (
    <div className="text-black">
      <div className="max-w-[800px] mt-[-96px] w-full h-screen mx-auto text-center flex flex-col justify-center">
        <h1 className="md:text-7xl sm:text-6xl text-4xl font-bold md:py-6 mb-2">Witaj.</h1>
        <div className="flex justify-center items-center mb-8">
          <p className="md:text-5xl sm:text-4xl text-xl font-bold pr-2">Z nami zjesz</p>
          <ReactTyped
            className="md:text-5xl sm:text-4xl text-xl font-bold"
            strings={["taniej", "szybciej", "lepiej"]}
            typeSpeed={34}
            backSpeed={96}
            loop
          />
        </div>
        <p className="md:text-2xl text-xl font-bold text-gray-500">Zacznijmy od dodania twoich składników! :)</p>

        <button
          onClick={() => navigate("/profile")}
          className="bg-[#ff6d00] w-[200px] rounded-md font-medium my-6 mx-auto py-3 text-black hover:bg-[black] hover:text-white ease-in-out duration-150 cursor-pointer"
        >
          Dodaj składniki
        </button>
      </div>
    </div>
  )
}

export default Hero

