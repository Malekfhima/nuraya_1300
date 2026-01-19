import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import AdminSidebar from "../components/AdminSidebar";
import { Store } from "../context/StoreContext";

const OrderListScreen = () => {
  const navigate = useNavigate();
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      const fetchOrders = async () => {
        try {
          const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          };
          const { data } = await axios.get("/api/orders", config);
          setOrders(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      fetchOrders();
    } else {
      navigate("/login");
    }
  }, [navigate, userInfo]);

  return (
    <div className="admin-layout">
      <AdminSidebar activePage="orders" />

      <main className="admin-content">
        <header className="admin-header">
          <h1>Commandes</h1>
        </header>

        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>CLIENT</th>
                  <th>DATE</th>
                  <th>TOTAL</th>
                  <th>PAYÉ</th>
                  <th>LIVRÉ</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {orders.map((order) => (
                  <tr key={order._id}>
                    <td>{order._id.substring(0, 10)}...</td>
                    <td>{order.user && order.user.name}</td>
                    <td>
                      {new Date(order.createdAt).toLocaleDateString("fr-FR")}
                    </td>
                    <td>{order.totalPrice.toFixed(2)} DT</td>
                    <td>
                      {order.isPaid ? (
                        <span style={{ color: "var(--success)" }}>
                          Oui (
                          {new Date(order.paidAt).toLocaleDateString("fr-FR")})
                        </span>
                      ) : (
                        <span style={{ color: "var(--danger)" }}>Non</span>
                      )}
                    </td>
                    <td>
                      {order.isDelivered ? (
                        <span style={{ color: "var(--success)" }}>
                          Oui (
                          {new Date(order.deliveredAt).toLocaleDateString(
                            "fr-FR",
                          )}
                          )
                        </span>
                      ) : (
                        <span style={{ color: "var(--danger)" }}>Non</span>
                      )}
                    </td>
                    <td>
                      <div style={{ display: "flex", gap: "10px" }}>
                        <button
                          className="btn btn-primary"
                          style={{ padding: "8px 15px", fontSize: "0.8rem" }}
                          onClick={() => navigate(`/order/${order._id}`)}
                        >
                          Détails
                        </button>
                        <button
                          className="btn btn-outline"
                          style={{ padding: "8px 15px", fontSize: "0.8rem" }}
                          onClick={() =>
                            navigate(`/admin/order/${order._id}/packing-slip`)
                          }
                        >
                          Bon de Livraison
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </main>
    </div>
  );
};

export default OrderListScreen;
