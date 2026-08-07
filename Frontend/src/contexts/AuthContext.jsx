import {
  createContext,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";
import api, {
  clearStoredAuth,
  getStoredAccessToken,
  getStoredUser,
  setStoredAuth,
} from "../api/axios";

const AuthContext = createContext(null);

const getDefaultRouteForRole = (role) => {
  switch (role) {
    case "ADMIN":
    case "SUPER_ADMIN":
      return "/admin";
    case "TEACHER":
      return "/teacher";
    case "STUDENT":
      return "/student";
    default:
      return "/";
  }
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(() => getStoredUser());
  const [accessToken, setAccessToken] = useState(() => getStoredAccessToken());
  const [authLoading, setAuthLoading] = useState(true);

  useEffect(() => {
    const restoreSession = async () => {
      try {
        if (accessToken) {
          const response = await api.get("/api/auth/me", {
            hideGlobalToast: true,
            hideAuthRedirect: true,
          });
          const nextUser = response.data?.user;
          setUser(nextUser);
          setStoredAuth({ token: accessToken, user: nextUser });
          return;
        }

        const refreshResponse = await api.post(
          "/api/auth/refresh",
          {},
          {
            hideGlobalToast: true,
            hideAuthRedirect: true,
            skipAuthRefresh: true,
          },
        );

        const nextToken = refreshResponse.data?.accessToken;
        const nextUser = refreshResponse.data?.user;
        setAccessToken(nextToken || null);
        setUser(nextUser || null);
        setStoredAuth({ token: nextToken, user: nextUser });
      } catch (_error) {
        clearStoredAuth();
        setAccessToken(null);
        setUser(null);
      } finally {
        setAuthLoading(false);
      }
    };

    restoreSession();
  }, []);

  const login = async (credentials) => {
    const response = await api.post("/api/auth/login", credentials, {
      hideAuthRedirect: true,
      skipAuthRefresh: true,
    });

    const nextToken = response.data?.accessToken || null;
    const nextUser = response.data?.user || null;

    setAccessToken(nextToken);
    setUser(nextUser);
    setStoredAuth({ token: nextToken, user: nextUser });

    return nextUser;
  };

  const logout = async () => {
    try {
      await api.post(
        "/api/auth/logout",
        {},
        {
          hideGlobalToast: true,
          hideAuthRedirect: true,
          skipAuthRefresh: true,
        },
      );
    } catch (_error) {
      // Best-effort logout.
    } finally {
      clearStoredAuth();
      setAccessToken(null);
      setUser(null);
    }
  };

  const refreshCurrentUser = async () => {
    const response = await api.get("/api/auth/me", {
      hideGlobalToast: true,
      hideAuthRedirect: true,
    });
    const nextUser = response.data?.user || null;
    setUser(nextUser);
    setStoredAuth({ token: getStoredAccessToken(), user: nextUser });
    return nextUser;
  };

  const value = useMemo(
    () => ({
      user,
      accessToken,
      authLoading,
      isAuthenticated: Boolean(user && accessToken),
      login,
      logout,
      refreshCurrentUser,
      getDefaultRouteForRole,
    }),
    [user, accessToken, authLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);

  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider.");
  }

  return context;
};

export { getDefaultRouteForRole };
