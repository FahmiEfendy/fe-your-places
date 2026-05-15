import React, { useState } from "react";
import { Link, useLocation } from "react-router-dom";

import "./MainNavigation.css";
import NavLinks from "./NavLinks";
import MainHeader from "./MainHeader";
import SideDrawer from "./SideDrawer";
import Backdrop from "../UIElements/Backdrop";

const MainNavigation = () => {
  const location = useLocation();

  const [isDrawerOpen, setIsDrawerOpen] = useState(false);

  const openDrawerHandler = () => {
    setIsDrawerOpen(true);
  };

  const closeDrawerHandler = () => {
    setIsDrawerOpen(false);
  };

  const reloadPageHandler = () => {
    if (location.pathname === "/") window.location.reload(true);
  };

  return (
    <React.Fragment>
      {isDrawerOpen && <Backdrop onClick={closeDrawerHandler} />}
      <SideDrawer show={isDrawerOpen} onClick={closeDrawerHandler}>
        <nav className="main-navigation__drawer-nav">
          <NavLinks />
        </nav>
      </SideDrawer>
      <MainHeader>
        <button
          className="main-navigation__menu-btn"
          onClick={openDrawerHandler}
        >
          <span></span>
          <span></span>
          <span></span>
        </button>
        <h1 className="main-navigation__title">
          <Link to="/" onClick={reloadPageHandler} className="main-navigation__logo-link">
            <svg
              className="main-navigation__logo-icon"
              xmlns="http://www.w3.org/2000/svg"
              viewBox="0 0 24 24"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M11.54 22.351l.07.04.028.016a.76.76 0 00.723 0l.028-.015.071-.041a16.975 16.975 0 001.152-.722c1.102-.736 2.531-1.839 3.638-3.323C18.41 16.586 20 14.15 20 11a8 8 0 10-16 0c0 3.15 1.59 5.586 2.829 7.245 1.107 1.484 2.536 2.587 3.638 3.323a16.977 16.977 0 001.152.722zM12 15a3 3 0 100-6 3 3 0 000 6z"
                clipRule="evenodd"
              />
            </svg>
            YourPlaces
          </Link>
        </h1>
        <nav className="main-navigation__header-nav">
          <NavLinks />
        </nav>
      </MainHeader>
    </React.Fragment>
  );
};

export default MainNavigation;
