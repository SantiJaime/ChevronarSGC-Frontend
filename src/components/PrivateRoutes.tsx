import { Navigate } from "react-router-dom";
import useSession from '../hooks/useSession';

interface Props {
  children: JSX.Element;
}
export const PrivateRoutes: React.FC<Props> = ({ children }) => {
  const { session } = useSession();

  if (!session) {
    return <Navigate to="/" />;
  }

  return children;
};

export const PublicRoutes: React.FC<Props> = ({ children }) => {
  const session = sessionStorage.getItem("session");

  if (session) {
    return <Navigate to="/facturas" />;
  }

  return children;
};
