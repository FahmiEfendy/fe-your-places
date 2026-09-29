import { useCallback, useEffect, useState } from "react";

import { onUnauthorized } from "../utils/authEvents";

let logoutTimer;

// Read localStorage synchronously so the first render already knows whether
// the user is logged in — doing this in an effect instead causes a
// logged-out flash on refresh, which bounces protected routes to /auth.
const getStoredAuth = () => {
  try {
    const raw = localStorage.getItem("userData");
    if (!raw) return null;

    const { id, token, expirationDate } = JSON.parse(raw);
    if (!id || !token || !expirationDate) return null;

    const parsedExpirationDate = new Date(expirationDate);
    if (Number.isNaN(parsedExpirationDate.getTime()) || parsedExpirationDate <= new Date()) {
      return null;
    }

    return { id, token, expirationDate: parsedExpirationDate };
  } catch (err) {
    return null;
  }
};

const AuthHook = () => {
  const [userId, setUserId] = useState(() => getStoredAuth()?.id ?? null);
  const [userToken, setUserToken] = useState(() => getStoredAuth()?.token ?? null);
  const [tokenExpirationDateState, setTokenExpirationDateState] = useState(
    () => getStoredAuth()?.expirationDate
  );
  const [sessionExpired, setSessionExpired] = useState(false);

  const login = useCallback((id, token, expirationDate) => {
    // Token will expired in 60 minutes and will auto logout
    const tokenExpirationDate =
      expirationDate || new Date(new Date().getTime() + 1000 * 60 * 60);

    setUserId(id);
    setUserToken(token);
    setTokenExpirationDateState(tokenExpirationDate);
    setSessionExpired(false);

    localStorage.setItem(
      "userData",
      JSON.stringify({
        id,
        token,
        expirationDate: tokenExpirationDate.toISOString(),
      })
    );
  }, []);

  const logout = useCallback(() => {
    setUserId(null);
    setUserToken(null);
    setTokenExpirationDateState(null);

    localStorage.removeItem("userData");
  }, []);

  const clearSessionExpired = useCallback(() => {
    setSessionExpired(false);
  }, []);

  // Force logout + show a message when any API call comes back 401
  useEffect(() => {
    return onUnauthorized(() => {
      setSessionExpired(true);
      logout();
    });
  }, [logout]);

  // Logout when token expired
  useEffect(() => {
    if (userToken && tokenExpirationDateState) {
      // Convert to milisecond
      const remainingTime =
        tokenExpirationDateState.getTime() - new Date().getTime();
      logoutTimer = setTimeout(logout, remainingTime);
    } else {
      clearTimeout(logoutTimer);
    }
  }, [logout, tokenExpirationDateState, userToken]);

  return { userId, userToken, login, logout, sessionExpired, clearSessionExpired };
};

export default AuthHook;
