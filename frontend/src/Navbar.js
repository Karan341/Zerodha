import React, { useState } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { api, DASHBOARD_URL } from "./api";
import "./Navbar.css";

const navItems = [
  { label: "Signup", to: "/signup" },
  { label: "About", to: "/about" },
  { label: "Product", to: "/products" },
  { label: "Pricing", to: "/pricing" },
  { label: "Support", to: "/support" },
];

function Navbar() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [dashboardError, setDashboardError] = useState("");
  const navigate = useNavigate();

  const closeMenu = () => setMenuOpen(false);

  const handleDashboardClick = async (event) => {
    event.preventDefault();
    setDashboardError("");

    try {
      const { data } = await api.get("/profile");

      closeMenu();
      if (data.status) {
        window.location.assign(DASHBOARD_URL);
      } else {
        navigate("/login");
      }
    } catch (error) {
      console.error("Could not verify dashboard login:", error);
      setDashboardError(
        "Login status could not be checked. Please make sure the backend is running."
      );
    }
  };

  return (
    <header className="site-header">
      <nav className="site-navbar" aria-label="Main navigation">
        <div className="site-navbar__inner">
          <Link className="site-navbar__brand" to="/" onClick={closeMenu}>
            <img src="/media/images/logo.svg" alt="Zerodha home" />
          </Link>

          <button
            className={`site-navbar__toggle${menuOpen ? " is-open" : ""}`}
            type="button"
            aria-label={menuOpen ? "Close navigation menu" : "Open navigation menu"}
            aria-expanded={menuOpen}
            aria-controls="primary-navigation"
            onClick={() => setMenuOpen((open) => !open)}
          >
            <span />
            <span />
            <span />
          </button>

          <div
            className={`site-navbar__menu${menuOpen ? " is-open" : ""}`}
            id="primary-navigation"
          >
            <a
              className="site-navbar__link"
              href={DASHBOARD_URL}
              onClick={handleDashboardClick}
            >
              Dashboard
            </a>
            {navItems.map(({ label, to, external }) =>
              external ? (
                <a
                  key={to}
                  className="site-navbar__link"
                  href={to}
                  onClick={closeMenu}
                >
                  {label}
                </a>
              ) : (
                <NavLink
                  key={to}
                  className={({ isActive }) =>
                    `site-navbar__link${isActive ? " is-active" : ""}`
                  }
                  to={to}
                  onClick={closeMenu}
                >
                  {label}
                </NavLink>
              )
            )}
            {dashboardError && (
              <p className="site-navbar__error" role="alert">
                {dashboardError}
              </p>
            )}
          </div>
        </div>
      </nav>
    </header>
  );
}

export default Navbar;
