import { NavLink } from "react-router-dom";
import { Button, Nav, Image, Spinner } from "react-bootstrap";
import { NAV_LINKS_OBJECT } from "../constants/const";
import useSession from "../hooks/useSession";
import { DoorOpen } from "react-bootstrap-icons";

const Sidebar = () => {
  const { session, handleLogout, username, loading } = useSession();
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
        {session ? (
          NAV_LINKS_OBJECT.map(({ label, path }) => (
            <Nav.Item key={path}>
              <NavLink
                to={path}
                end
                style={{ transition: "all 0.2s ease-in-out" }}
                className={({ isActive }) =>
                  `d-flex align-items-center py-2 px-3 text-decoration-none rounded-3 ${
                    isActive
                      ? "bg-dark text-white shadow-sm fw-semibold"
                      : "text-secondary hover-bg-light"
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
            to={"/"}
            end
            style={{ transition: "all 0.2s ease-in-out" }}
            className={"d-flex align-items-center py-2 px-3 text-decoration-none rounded-3 bg-dark text-white shadow-sm fw-semibold"}
          >
            Inicio de sesión
          </NavLink>
        )}
      </Nav>

      <hr />
      {session && (
        <div className="mt-auto">
          <div className="d-grid gap-2">
            <Button
              className="d-flex justify-content-center align-items-center gap-1"
              variant="danger"
              onClick={handleLogout}
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
            Usuario: {username}
          </div>
        </div>
      )}
    </div>
  );
};

export default Sidebar;
