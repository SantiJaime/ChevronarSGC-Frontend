import { type ReactNode, useEffect, useState, useMemo } from "react";
import { SessionContext } from "../SessionContext";
import { fetchCurrentUser } from "../../helpers/authQueries";
import { toast } from "sonner";

interface Props {
  children: ReactNode;
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
      } catch (error) {
        if (cancelled) return;
        const err = error as ErrorMessage
        console.error("Error al validar sesión:", error);
        toast.error(err.error || "Error al validar sesión");
        setUser(null);
        setSession(false);
      } finally {
        if (!cancelled) setSessionReady(true);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, []);

  const value = useMemo(() => ({
    session, sessionReady, setSession, user, setUser
  }), [session, sessionReady, user]);

  return (
    <SessionContext.Provider value={value}>
      {children}
    </SessionContext.Provider>
  );
};

export default SessionProvider;
