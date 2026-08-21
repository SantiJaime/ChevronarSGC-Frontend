import { type ReactNode, useEffect, useState, useMemo } from "react";
import { getCities } from "../../helpers/citiesQueries";
import { CitiesContext } from "../CitiesContext";
import useSession from "../../hooks/useSession";

interface Props {
  children: ReactNode;
}
const CitiesProvider: React.FC<Props> = ({ children }) => {
  const [cities, setCities] = useState<City[]>([]);
  const { session } = useSession();

  useEffect(() => {
    if (!session) return;
    getCities()
      .then((res) => setCities(res.cities))
      .catch((err) => console.error("Error al obtener las ciudades", err));
  }, [session]);

  const value = useMemo(() => ({ cities, setCities }), [cities]);

  return (
    <CitiesContext.Provider value={value}>
      {children}
    </CitiesContext.Provider>
  );
};

export default CitiesProvider;
