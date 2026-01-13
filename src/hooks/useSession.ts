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
  const { session, setSession, username, setUsername } = context;
  const [loading, setLoading] = useState(false);

  const handleLogin = async (data: UserLogin) => {
    try {
      setLoading(true);
      const res = await loginUser(data);
      sessionStorage.setItem("session", JSON.stringify(true));
      sessionStorage.setItem("username", data.username);
      setSession(true);
      setUsername(data.username);
      return res;
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = async () => {
    try {
      setLoading(true);
      await logoutUser();
      setSession(false);
      sessionStorage.removeItem("session");
      sessionStorage.removeItem("username");
      setUsername(null);
      navigate("/");
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return { session, setSession, handleLogout, loading, handleLogin, username };
};

export default useSession;
