import { useEffect, useState } from "react";
import { SessionContext } from "../SessionContext";
interface Props {
  children: JSX.Element;
}
const SessionProvider: React.FC<Props> = ({ children }) => {
  const [session, setSession] = useState<boolean>(() => {
    const storedSession = sessionStorage.getItem("session");
    return storedSession ? JSON.parse(storedSession) === true : false;
  });

  const [user, setUser] = useState<UserInfo | null>(() => {
    const user = sessionStorage.getItem("user");
    return user ? JSON.parse(user) : null;
  });

  useEffect(() => {
    if (session) {
      sessionStorage.setItem("session", "true");
    } else {
      sessionStorage.removeItem("session");
    }
  }, [session]);

  useEffect(() => {
    if (user) {
      sessionStorage.setItem("user", JSON.stringify(user));
    } else {
      sessionStorage.removeItem("user");
    }
  }, [user]);

  return (
    <SessionContext.Provider
      value={{ session, setSession, user, setUser }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
