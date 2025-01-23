import { useContext } from "react";
import { CitiesContext } from "../context/CitiesContext";

const useCities = () => {
  const context = useContext(CitiesContext);
  if (!context) {
    throw new Error("El contexto de ciudades no está definido");
  }
  return context;
};

export default useCities;
