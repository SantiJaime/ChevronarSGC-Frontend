import { useEffect, useState } from "react";
import { toast } from "sonner";
import { Spinner } from "react-bootstrap";
import { Navigate, Outlet } from "react-router-dom";
import { checkAuth } from "../helpers/usersQueries";

interface Props {
  children: JSX.Element;
}
const PrivateRoutes: React.FC<Props> = ({ children }) => {
  const [isAuth, setIsAuth] = useState<boolean | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const checkAuthentication = async () => {
      const token = sessionStorage.getItem("token");
      if (!token) {
        setIsAuth(false);
        setIsLoading(false);
        toast.error("Debes iniciar sesión para acceder");
        return;
      }

      try {
        const res = await checkAuth(token);
        if (res.isTokenVerified) setIsAuth(true);
      } catch (error) {
        if (error instanceof Error) {
          toast.error(error.message);
        }
        setIsAuth(false);
        toast.error("Error desconocido");
      } finally {
        setIsLoading(false);
      }
    };
    checkAuthentication();
  }, []);

  if (isLoading) {
    return (
      <div className="d-flex flex-column align-items-center justify-content-center mt-5">
        <Spinner className="text-center" variant="primary" />
        <h4 className="mt-3">Verificando autenticación...</h4>
      </div>
    );
  }
  return isAuth ? children || <Outlet /> : <Navigate to="/" />;
};

export default PrivateRoutes;
