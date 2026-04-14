import { useContext, useState } from "react";
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

  const handleLogin = async (data: UserLogin) => {
    try {
      setLoading(true);
      const res = await loginUser(data);
      setSession(true);
      setUser(res.user);
      return res;
    } catch (error) {
      console.log(error)
      throw error;
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setSession(false);
      setUser(null);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

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
