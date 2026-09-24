import { type ReactNode, useEffect, useState, useMemo, useRef } from "react";
import { SessionContext } from "../SessionContext";
import { fetchCurrentUser, onSessionExpired } from "../../helpers/authQueries";
import { toast } from "sonner";

interface Props {
  children: ReactNode;
}
const SessionProvider: React.FC<Props> = ({ children }) => {
  const [sessionReady, setSessionReady] = useState(false);
  const [session, setSession] = useState(false);
  const [user, setUser] = useState<UserInfo | null>(null);
  const sessionRef = useRef(session);
  sessionRef.current = session;

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
        const err = error as ErrorMessage;
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

  // Si la sesión vence y no se puede renovar, se cierra localmente: PrivateRoutes
  // redirige al login en lugar de dejar al usuario en una pantalla que ya no funciona
  useEffect(
    () =>
      onSessionExpired(() => {
        if (!sessionRef.current) return;
        toast.error("Tu sesión expiró. Por favor, iniciá sesión nuevamente");
        setUser(null);
        setSession(false);
      }),
    [],
  );

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
