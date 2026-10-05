import { useContext, useState, useCallback } from "react";
import { SessionContext } from "../context/SessionContext";
import { logoutUser } from "../helpers/authQueries";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../helpers/usersQueries";

const useSession = () => {
  const context = useContext(SessionContext);
  if (!context) {
    throw new Error("El contexto de sesión no está definido");
  }

  const navigate = useNavigate();
  const { session, sessionReady, setSession, user, setUser } = context;
  const [loading, setLoading] = useState(false);

  const handleLogin = useCallback(async (data: UserLogin) => {
    try {
      setLoading(true);
      const res = await loginUser(data);
      setSession(true);
      setUser(res.user);
      return res;
    } finally {
      setLoading(false);
    }
  }, [setSession, setUser]);

  const handleLogout = useCallback(async () => {
    setLoading(true);
    try {
      await logoutUser();
    } catch {
      // Aunque el servidor no responda (sesión ya vencida, sin conexión), la sesión
      // local se cierra igual: el usuario siempre tiene que poder salir
    } finally {
      setSession(false);
      setUser(null);
      setLoading(false);
      navigate("/");
    }
  }, [navigate, setSession, setUser]);

  return {
    session,
    sessionReady,
    setSession,
    handleLogout,
    loading,
    handleLogin,
    user,
  };
};

export default useSession;
