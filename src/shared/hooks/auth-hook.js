import { useCallback, useEffect, useState } from "react";

import { onUnauthorized } from "../utils/authEvents";

let logoutTimer;

const AuthHook = () => {
  const [userId, setUserId] = useState(null);
  const [userToken, setUserToken] = useState(null);
  const [tokenExpirationDateState, setTokenExpirationDateState] = useState();
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

  // GET LocalStorage value to re-login when page refresh
  useEffect(() => {
    // Return if localStorage is empty
    if (!localStorage.getItem("userData")) return;

    const { id, token, expirationDate } = JSON.parse(
      localStorage.getItem("userData")
    );

    // Check if id and token exist and expirationDate > currentDate, if no then return
    if (!id || !token || !new Date(expirationDate) > new Date()) return;

    login(id, token, new Date(expirationDate));
  }, [login]);

  return { userId, userToken, login, logout, sessionExpired, clearSessionExpired };
};

export default AuthHook;
