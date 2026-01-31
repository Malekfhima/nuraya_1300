import React from "react";
import { Link } from "react-router-dom";
import {
  FaBox,
  FaUsers,
  FaShoppingCart,
  FaChartLine,
  FaThLarge,
  FaChartBar,
  FaBars,
  FaTimes,
  FaArrowLeft,
} from "react-icons/fa";
import "../pages/AdminDashboard.css";

const AdminSidebar = ({ activePage }) => {
  const [isOpen, setIsOpen] = React.useState(false);
  const userInfo = JSON.parse(localStorage.getItem("userInfo"));
  if (!userInfo) return null;

  return (
    <>
      <button className="admin-hamburger" onClick={() => setIsOpen(!isOpen)}>
        {isOpen ? <FaTimes /> : <FaBars />}
      </button>

      <aside className={`admin-sidebar ${isOpen ? "open" : ""}`}>
        <button className="admin-close-btn" onClick={() => setIsOpen(false)}>
          <FaTimes />
        </button>

        <div className="admin-profile">
          <Link
            to="/"
            onClick={() => setIsOpen(false)}
            className="luxury-logo"
            style={{
              color: "white",
              display: "block",
              marginBottom: "1.5rem",
              fontSize: "1.5rem",
              letterSpacing: "0.2em",
              fontFamily: "var(--font-heading)",
            }}
          >
            NURAYA
          </Link>
          <div
            style={{
              width: "60px",
              height: "60px",
              borderRadius: "50%",
              background: "var(--primary)",
              margin: "0 auto 1rem",
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              fontSize: "1.5rem",
              fontWeight: "bold",
              color: "white",
            }}
          >
            {userInfo.name.charAt(0)}
          </div>
          <h3>{userInfo.name}</h3>
          <p>Administrateur</p>
        </div>
        <nav className="admin-nav">
          <ul>
            <li>
              <Link
                to="/admin/dashboard"
                onClick={() => setIsOpen(false)}
                className={activePage === "dashboard" ? "active" : ""}
              >
                <FaChartLine /> Tableau de bord
              </Link>
            </li>
            <li>
              <Link
                to="/admin/stats"
                onClick={() => setIsOpen(false)}
                className={activePage === "stats" ? "active" : ""}
              >
                <FaChartBar /> Statistiques
              </Link>
            </li>
            <li>
              <Link
                to="/admin/products"
                onClick={() => setIsOpen(false)}
                className={activePage === "products" ? "active" : ""}
              >
                <FaBox /> Produits
              </Link>
            </li>
            <li>
              <Link
                to="/admin/categories"
                onClick={() => setIsOpen(false)}
                className={activePage === "categories" ? "active" : ""}
              >
                <FaThLarge /> Catégories
              </Link>
            </li>
            <li>
              <Link
                to="/admin/orders"
                onClick={() => setIsOpen(false)}
                className={activePage === "orders" ? "active" : ""}
              >
                <FaShoppingCart /> Commandes
              </Link>
            </li>
            <li>
              <Link
                to="/admin/users"
                onClick={() => setIsOpen(false)}
                className={activePage === "users" ? "active" : ""}
              >
                <FaUsers /> Utilisateurs
              </Link>
            </li>
            <li className="admin-nav-divider" style={{ margin: '1rem 0', borderTop: '1px solid rgba(255,255,255,0.1)' }}></li>
            <li>
              <Link
                to="/"
                onClick={() => setIsOpen(false)}
                style={{ color: 'var(--primary)' }}
              >
                <FaArrowLeft /> Retour au site
              </Link>
            </li>
          </ul>
        </nav>
      </aside>

      {isOpen && (
        <div
          className="admin-sidebar-overlay"
          onClick={() => setIsOpen(false)}
        ></div>
      )}
    </>
  );
};

export default AdminSidebar;
