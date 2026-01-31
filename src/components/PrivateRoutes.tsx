import { Navigate } from "react-router-dom";
import useSession from "../hooks/useSession";
import { Role } from "../constants/const";

interface Props {
  children: JSX.Element;
  role?: Role[];
}
export const PrivateRoutes: React.FC<Props> = ({ children, role }) => {
  const { session, user } = useSession();
  if (!role) return;
  
  if (!session) {
    return <Navigate to="/" />;
  }

  if (user && !role.includes(user.role as Role)) {
    return <Navigate to="/ventas" />;
  }
  return children;
};

export const PublicRoutes: React.FC<Props> = ({ children }) => {
  const { session, user } = useSession();

  if (session && user?.role === Role.ADMIN) {
    return <Navigate to="/facturas" />;
  }

  if (session && user?.role === Role.VENDEDOR) {
    return <Navigate to="/ventas" />;
  }

  return children;
};
