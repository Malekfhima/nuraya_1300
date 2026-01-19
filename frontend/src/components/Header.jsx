import React, {
  useState,
  useContext,
  useEffect,
  useCallback,
  useMemo,
} from "react";
import { Link, useLocation } from "react-router-dom";
import {
  FaShoppingCart,
  FaUser,
  FaBars,
  FaTimes,
  FaHeart,
  FaSearch,
} from "react-icons/fa";
import { Store } from "../context/StoreContext";
import SearchBox from "./SearchBox";
import "./Header.css";

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const location = useLocation();
  const { state } = useContext(Store);
  const { cart, userInfo } = state;

  // Optimized scroll handler with useCallback
  const handleScroll = useCallback(() => {
    setIsScrolled(window.scrollY > 50);
  }, []);

  // Memoized cart item count for performance
  const cartItemCount = useMemo(() => cart.cartItems.length, [cart.cartItems]);

  // Memoized user status
  const isAdmin = useMemo(() => userInfo?.isAdmin, [userInfo]);

  useEffect(() => {
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [handleScroll]);

  const toggleMenu = useCallback(() => {
    setIsMenuOpen((prev) => !prev);
  }, []);

  // Close menu when clicking a link
  const closeMenu = useCallback(() => {
    setIsMenuOpen(false);
  }, []);

  // Memoized navigation items
  const navItems = useMemo(
    () => [
      { to: "/", label: "Accueil" },
      { to: "/shop", label: "Boutique" },
      { to: "/about", label: "À Propos" },
    ],
    [],
  );

  return (
    <header className={`header ${isScrolled ? "scrolled" : ""}`} role="banner">
      <div className="container header-container">
        <Link to="/" className="logo" aria-label="Nuraya - Accueil">
          Nuraya
        </Link>

        <nav
          className={`nav ${isMenuOpen ? "active" : ""}`}
          role="navigation"
          aria-label="Navigation principale"
        >
          <ul className="nav-list">
            {navItems.map((item) => (
              <li key={item.to} className="nav-item">
                <Link
                  to={item.to}
                  onClick={closeMenu}
                  aria-current={
                    location.pathname === item.to ? "page" : undefined
                  }
                >
                  {item.label}
                </Link>
              </li>
            ))}
            {isAdmin && (
              <li className="nav-item">
                <Link
                  to="/admin/dashboard"
                  onClick={closeMenu}
                  aria-label="Administration"
                >
                  Administration
                </Link>
              </li>
            )}
          </ul>
        </nav>

        <div className="header-icons">
          {/* Desktop Search - Hidden on mobile */}
          <div className="desktop-search" style={{ marginRight: "1rem" }}>
            <SearchBox />
          </div>

          <Link
            to="/wishlist"
            className="icon-link"
            title="Ma liste de souhaits"
            aria-label="Voir la liste de souhaits"
          >
            <FaHeart />
          </Link>

          <Link
            to="/cart"
            className="icon-link"
            style={{ position: "relative" }}
            aria-label={`Panier avec ${cartItemCount} articles`}
          >
            <FaShoppingCart />
            {cartItemCount > 0 && (
              <span
                className="badge"
                aria-label={`${cartItemCount} articles dans le panier`}
              >
                {cartItemCount}
              </span>
            )}
          </Link>

          <Link
            to={userInfo ? "/profile" : "/login"}
            className="icon-link"
            aria-label={userInfo ? "Mon profil" : "Se connecter"}
            title={userInfo ? "Mon profil" : "Se connecter"}
          >
            <FaUser />
          </Link>

          <button
            className="mobile-menu-icon"
            onClick={toggleMenu}
            aria-label={isMenuOpen ? "Fermer le menu" : "Ouvrir le menu"}
            aria-expanded={isMenuOpen}
            style={{ marginLeft: "1rem" }}
          >
            {isMenuOpen ? <FaTimes /> : <FaBars />}
          </button>
        </div>
      </div>

      {/* Mobile Search - Only visible when menu is open */}
      {isMenuOpen && (
        <div className="mobile-search-container">
          <div className="mobile-search-padding">
            <SearchBox />
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;
