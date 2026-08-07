import { NavLink } from "react-router-dom";
import {
  NAV_LINKS_OBJECT,
  NAV_LINKS_OBJECT_MARTIN,
  NAV_LINKS_OBJECT_VENTAS,
  Role,
} from "../../constants/const";
import useSession from "../../hooks/useSession";
import { LogOut } from "lucide-react";
import { Button } from "../ui/Button";
import { Spinner } from "../ui/Spinner";

const ROLE_LINKS = {
  [Role.ADMIN]: NAV_LINKS_OBJECT,
  [Role.VENDEDOR]: NAV_LINKS_OBJECT_VENTAS,
  [Role.MARTIN]: NAV_LINKS_OBJECT_MARTIN,
};

const Sidebar = () => {
  const { session, handleLogout, user, loading } = useSession();

  const currentLinks = user
    ? ROLE_LINKS[user.role as keyof typeof ROLE_LINKS]
    : null;

  return (
    <aside className="flex flex-col shrink-0 w-72 h-screen sticky top-0 bg-card border-r border-border">
      <div className="p-6 border-b border-border">
        <img
          src="logoChevronar.webp"
          alt="Logo Chevronar"
          className="w-full h-auto"
        />
      </div>
      <nav className="flex-1 p-4 overflow-y-auto">
        <ul className="flex flex-col gap-1">
          {session && user && currentLinks ? (
            currentLinks.map(({ label, path }) => (
              <li key={path}>
                <NavLink
                  to={path}
                  end
                  className={({ isActive }) =>
                    `flex items-center py-2.5 px-4 rounded-lg font-medium transition-all duration-200 ${
                      isActive
                        ? "bg-primary text-primary-foreground shadow-sm"
                        : "text-muted-foreground hover:bg-muted hover:text-foreground"
                    }`
                  }
                >
                  {label}
                </NavLink>
              </li>
            ))
          ) : (
            <li>
              <NavLink
                to="/"
                className="flex items-center py-2.5 px-4 rounded-lg text-sm font-medium bg-primary text-primary-foreground shadow-sm"
              >
                Inicio de sesión
              </NavLink>
            </li>
          )}
        </ul>
      </nav>

      {session && user && (
        <div className="p-4 border-t border-border">
          <Button
            variant="destructive"
            className="w-full"
            onClick={handleLogout}
            disabled={loading}
          >
            {loading ? (
              <>
                <Spinner size="sm" variant="light" />
                <span>Cerrando sesión...</span>
              </>
            ) : (
              <>
                <LogOut className="h-4 w-4" />
                <span>Cerrar sesión</span>
              </>
            )}
          </Button>
          <p className="text-center mt-3 text-sm text-muted-foreground">
            Usuario: <span className="font-medium text-foreground">{user.username}</span>
          </p>
        </div>
      )}
    </aside>
  );
};

export default Sidebar;
