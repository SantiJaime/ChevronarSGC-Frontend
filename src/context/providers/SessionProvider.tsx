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

  const [username, setUsername] = useState<string | null>(() => {
    return sessionStorage.getItem("username");
  });

  useEffect(() => {
    if (session) {
      sessionStorage.setItem("session", "true");
    } else {
      sessionStorage.removeItem("session");
    }
  }, [session]);

  useEffect(() => {
    if (username) {
      sessionStorage.setItem("username", username);
    } else {
      sessionStorage.removeItem("username");
    }
  }, [username]);

  return (
    <SessionContext.Provider
      value={{ session, setSession, username, setUsername }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
