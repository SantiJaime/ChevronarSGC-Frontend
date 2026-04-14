import { Navigate } from "react-router-dom";
import { Spinner } from "react-bootstrap";
import useSession from "../hooks/useSession";
import { Role } from "../constants/const";

interface Props {
  children: JSX.Element;
  role?: Role[];
}
export const PrivateRoutes: React.FC<Props> = ({ children, role }) => {
  const { session, sessionReady, user } = useSession();
  if (!role) return;

  if (!sessionReady) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="grow" />
      </div>
    );
  }

  if (!session) {
    return <Navigate to="/" />;
  }

  if (user && !role.includes(user.role as Role)) {
    return <Navigate to="/ventas" />;
  }
  return children;
};

export const PublicRoutes: React.FC<Props> = ({ children }) => {
  const { session, sessionReady, user } = useSession();

  if (!sessionReady) {
    return (
      <div className="d-flex justify-content-center align-items-center min-vh-100">
        <Spinner animation="grow" />
      </div>
    );
  }

  if (session && user?.role === Role.ADMIN) {
    return <Navigate to="/facturas" />;
  }

  if (session && (user?.role === Role.VENDEDOR || user?.role === Role.MARTIN)) {
    return <Navigate to="/ventas" />;
  }

  return children;
};
