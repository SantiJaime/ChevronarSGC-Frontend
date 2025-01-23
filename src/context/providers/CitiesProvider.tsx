import { useEffect, useState } from "react";
import { getCities } from "../../helpers/citiesQueries";
import { CitiesContext } from '../CitiesContext';

interface Props {
  children: JSX.Element;
}
const CitiesProvider: React.FC<Props> = ({ children }) => {
  const [cities, setCities] = useState<City[]>([]);

  useEffect(() => {
    getCities()
      .then((res) => setCities(res.cities))
      .catch((err) => console.error("Error al obtener las ciudades", err));
  }, []);

  return (
    <CitiesContext.Provider value={{ cities, setCities }}>
      {children}
    </CitiesContext.Provider>
  );
};

export default CitiesProvider;
