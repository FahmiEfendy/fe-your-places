import { useContext } from "react";
import { NavLink } from "react-router-dom";

import "./NavLinks.css";
import Button from "../FormElements/Button";
import { useTheme } from "../../hooks/theme-hook";
import { AuthContext } from "../../context/auth-context";


const NavLinks = () => {
  const auth = useContext(AuthContext);
  const { theme, toggleTheme } = useTheme();

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/" end>
          ALL PLACES
        </NavLink>
      </li>
      <li>
        <NavLink to="/users">ALL USERS</NavLink>
      </li>
      {auth.isLogin && (
        <li>
          <NavLink to={`/${auth.userId}/places`}>MY PLACES</NavLink>
        </li>
      )}

      {auth.isLogin && (
        <li>
          <NavLink to="/place/new">ADD PLACE</NavLink>
        </li>
      )}
      {!auth.isLogin && (
        <li>
          <NavLink to="/auth">LOGIN</NavLink>
        </li>
      )}
      <li className="theme-toggle">
        <button onClick={toggleTheme} title="Toggle Dark/Light Mode">
          {theme === "dark" ? (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M12 3v1m0 16v1m9-9h-1M4 9H3m15.364-6.364l-.707.707M6.343 17.657l-.707.707m12.728 0l-.707-.707M6.343 6.343l-.707-.707M15 12a3 3 0 11-6 0 3 3 0 016 0z"
              />
            </svg>
          ) : (
            <svg
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth={2}
                d="M20.354 15.354A9 9 0 018.646 3.646 9.003 9.003 0 0012 21a9.003 9.003 0 008.354-5.646z"
              />
            </svg>
          )}
        </button>
      </li>
      {auth.isLogin && (
        <li>
          <Button onClick={auth.logout}>LOGOUT</Button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
