import { useEffect, useState } from "react";
import { SessionContext } from "../SessionContext";
import { fetchCurrentUser } from "../../helpers/authQueries";

interface Props {
  children: JSX.Element;
}
const SessionProvider: React.FC<Props> = ({ children }) => {
  const [sessionReady, setSessionReady] = useState(false);
  const [session, setSession] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);

  useEffect(() => {
    let cancelled = false;
    (async () => {
      try {
        const current = await fetchCurrentUser();
        if (cancelled) return;
        if (current) {
          setUser(current);
          setSession(true);
        } else {
          setUser(null);
          setSession(false);
        }
      } finally {
        if (!cancelled) setSessionReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  return (
    <SessionContext.Provider
      value={{ session, sessionReady, setSession, user, setUser }}
    >
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
