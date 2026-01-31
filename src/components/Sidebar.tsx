import { NavLink } from "react-router-dom";
import { Button, Nav, Image, Spinner } from "react-bootstrap";
import {
  NAV_LINKS_OBJECT,
  NAV_LINKS_OBJECT_VENTAS,
  Role,
} from "../constants/const";
import useSession from "../hooks/useSession";
import { DoorOpen } from "react-bootstrap-icons";

const ROLE_LINKS = {
  [Role.ADMIN]: NAV_LINKS_OBJECT,
  [Role.VENDEDOR]: NAV_LINKS_OBJECT_VENTAS,
};

const Sidebar = () => {
  const { session, handleLogout, user, loading } = useSession();

  const currentLinks = user
    ? ROLE_LINKS[user.role as keyof typeof ROLE_LINKS]
    : null;
  return (
    <div
      className="d-flex flex-column flex-shrink-0 p-3 bg-light text-dark"
      style={{ width: "280px", height: "100vh", position: "sticky", top: 0 }}
    >
      <div className="d-flex align-items-center mb-3 mb-md-0 me-md-auto link-dark text-decoration-none">
        <Image
          src="logoChevronar.webp"
          fluid
          className="me-2"
          alt="Logo Chevronar"
        />
      </div>

      <hr />
      <Nav className="flex-column gap-2 px-2">
        {session && user && currentLinks ? (
          currentLinks.map(({ label, path }) => (
            <Nav.Item key={path}>
              <NavLink
                to={path}
                end
                className={({ isActive }) =>
                  `d-flex align-items-center py-2 px-3 text-decoration-none rounded-3 ${
                    isActive
                      ? "bg-dark text-white shadow-sm fw-semibold"
                      : "text-secondary"
                  }`
                }
              >
                <i className={`${label} me-3 fs-5`}></i>
                <span className="fs-6">{label}</span>
              </NavLink>
            </Nav.Item>
          ))
        ) : (
          <NavLink
            to="/"
            className="d-flex align-items-center py-2 px-3 text-decoration-none rounded-3 bg-dark text-white shadow-sm fw-semibold"
          >
            Inicio de sesión
          </NavLink>
        )}
      </Nav>

      <hr />
      {session && user && (
        <div className="mt-auto">
          <div className="d-grid gap-2">
            <Button
              className="d-flex justify-content-center align-items-center gap-1"
              variant="danger"
              onClick={handleLogout}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Spinner size="sm" />
                  <span>Cerrando sesión...</span>
                </>
              ) : (
                <>
                  <DoorOpen />
                  <span>Cerrar sesión</span>
                </>
              )}
            </Button>
          </div>
          <div className="text-center mt-2 text-muted small">
            Usuario: {user.username}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
