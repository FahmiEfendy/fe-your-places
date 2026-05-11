import { useContext } from "react";
import { NavLink } from "react-router-dom";

import "./NavLinks.css";
import Button from "../FormElements/Button";
import { AuthContext } from "../../context/auth-context";

const NavLinks = () => {
  const auth = useContext(AuthContext);

  return (
    <ul className="nav-links">
      <li>
        <NavLink to="/">ALL USERS</NavLink>
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
          <NavLink to="/auth">AUTHENTICATE</NavLink>
        </li>
      )}
      {auth.isLogin && (
        <li>
          <Button onClick={auth.logout}>LOGOUT</Button>
        </li>
      )}
    </ul>
  );
};

export default NavLinks;
