import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { FaChartLine, FaShoppingCart, FaUsers, FaBox } from "react-icons/fa";
import AdminLayout from "../components/AdminLayout";
import { Store } from "../context/StoreContext";

const AdminDashboardScreen = () => {
  const navigate = useNavigate();
  const [stats, setStats] = useState({
    ordersCount: 0,
    productsCount: 0,
    usersCount: 0,
    totalSales: 0,
  });
  const [loading, setLoading] = useState(true);

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (!userInfo || !userInfo.isAdmin) {
      navigate("/login");
      return;
    }

    const fetchStatsData = async () => {
      if (!userInfo.token) return;

      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };

        const { data: orders } = await axios.get("/api/orders", config);
        const { data: users } = await axios.get("/api/users", config);

        const totalSales = orders.reduce(
          (acc, order) => acc + (order.isPaid ? order.totalPrice : 0),
          0,
        );

        setStats({
          ordersCount: orders.length,
          usersCount: users.length,
          productsCount: 0,
          totalSales: totalSales,
        });
        setLoading(false);
      } catch (err) {
        console.error(err);
        setLoading(false);
      }
    };

    fetchStatsData();
  }, [navigate, userInfo]);

  if (!userInfo) return null;

  return (
    <AdminLayout activePage="dashboard">
      <header className="admin-header">
        <h1>Vue d'ensemble</h1>
          <div className="admin-date">
            {new Date().toLocaleDateString("fr-FR", {
              weekday: "long",
              year: "numeric",
              month: "long",
              day: "numeric",
            })}
          </div>
        </header>

        {loading ? (
          <p>Chargement des statistiques...</p>
        ) : (
          <>
            <div className="dash-stats">
              <div className="stat-card">
                <div className="stat-icon">
                  <FaChartLine />
                </div>
                <div className="stat-info">
                  <h4>Ventes Totales</h4>
                  <p>{stats.totalSales.toFixed(2)} DT</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaShoppingCart />
                </div>
                <div className="stat-info">
                  <h4>Commandes</h4>
                  <p>{stats.ordersCount}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaUsers />
                </div>
                <div className="stat-info">
                  <h4>Utilisateurs</h4>
                  <p>{stats.usersCount}</p>
                </div>
              </div>
              <div className="stat-card">
                <div className="stat-icon">
                  <FaBox />
                </div>
                <div className="stat-info">
                  <h4>Statut Système</h4>
                  <p style={{ color: "var(--success)", fontSize: "1rem" }}>
                    Opérationnel
                  </p>
                </div>
              </div>
            </div>

            <div
              className="recent-activity"
              style={{
                background: "white",
                padding: "2rem",
                boxShadow: "var(--shadow)",
              }}
            >
              <h2 style={{ marginBottom: "1.5rem" }}>Activité Récente</h2>
              <p style={{ color: "var(--text-light)" }}>
                Le système est à jour. Toutes les fonctions de synchronisation
                en temps réel sont actives.
              </p>
            </div>
          </>
        )}
    </AdminLayout>
  );
};

export default AdminDashboardScreen;
