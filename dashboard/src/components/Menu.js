import React, { useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";

const Menu = ({ userId, username }) => {
  const location = useLocation();
  const selectedMenu =
    {
      "/": 0,
      "/orders": 1,
      "/holdings": 2,
      "/positions": 3,
      "/funds": 4,
      "/apps": 6,
    }[location.pathname] ?? -1;
  const [isProfileDropdownOpen, setIsProfileDropdownOpen] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const [logoutError, setLogoutError] = useState("");

  const handleProfileClick = () => {
    setIsProfileDropdownOpen((isOpen) => !isOpen);
  };

  const handleLogout = async () => {
    setIsLoggingOut(true);
    setLogoutError("");

    try {
      const { data } = await axios.post(
        "https://zerodha-backend-2ozm.onrender.com/logout",
        {},
        { withCredentials: true }
      );

      if (!data.status) {
        throw new Error(data.message || "Logout failed.");
      }

      window.location.assign("https://zerodha-frontend-snowy.vercel.app/");
    } catch (error) {
      console.error("Could not log out:", error);
      setLogoutError(error.response?.data?.message || error.message || "Logout failed.");
      setIsLoggingOut(false);
    }
  };

  const menuClass = "menu";
  const activeMenuClass = "menu selected";

  return (
    <div className="menu-container">
      <a
        className="dashboard-brand-link"
        href="https://zerodha-frontend-snowy.vercel.app/"
        aria-label="Go to main website home"
        title="Main website home"
      >
        <img src="/logo.png" alt="" />
      </a>
      <div className="menus">
        <ul>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/"
            >
              <p className={selectedMenu === 0 ? activeMenuClass : menuClass}>
                Dashboard
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/orders"
            >
              <p className={selectedMenu === 1 ? activeMenuClass : menuClass}>
                Orders
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/holdings"
            >
              <p className={selectedMenu === 2 ? activeMenuClass : menuClass}>
                Holdings
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/positions"
            >
              <p className={selectedMenu === 3 ? activeMenuClass : menuClass}>
                Positions
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/funds"
            >
              <p className={selectedMenu === 4 ? activeMenuClass : menuClass}>
                Funds
              </p>
            </Link>
          </li>
          <li>
            <Link
              style={{ textDecoration: "none" }}
              to="/apps"
            >
              <p className={selectedMenu === 6 ? activeMenuClass : menuClass}>
                Apps
              </p>
            </Link>
          </li>
        </ul>
        <hr />
        <div className="profile-wrapper">
          <div
            className="profile"
            role="button"
            tabIndex={0}
            aria-expanded={isProfileDropdownOpen}
            aria-haspopup="menu"
            onClick={handleProfileClick}
            onKeyDown={(event) => {
              if (event.key === "Enter" || event.key === " ") {
                event.preventDefault();
                handleProfileClick();
              }
            }}
          >
            <div className="avatar">
              {username ? username.slice(0, 2).toUpperCase() : "…"}
            </div>
            <p className="username" title={userId ? `User ID: ${userId}` : ""}>
              {username || "Loading…"}
            </p>
          </div>
          {isProfileDropdownOpen && (
            <div className="profile-dropdown" role="menu">
              <a
                href="http://localhost:3000/"
                role="menuitem"
                target="_blank"
                rel="noreferrer"
              >
                Visit main website
              </a>
              <button
                type="button"
                role="menuitem"
                onClick={handleLogout}
                disabled={isLoggingOut}
              >
                {isLoggingOut ? "Logging out…" : "Log out"}
              </button>
              {logoutError && <p role="alert">{logoutError}</p>}
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Menu;