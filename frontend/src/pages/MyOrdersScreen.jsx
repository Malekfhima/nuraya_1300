import React, { useContext, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { toast } from "react-toastify";
import { Store } from "../context/StoreContext";
import "./ProfileScreen.css";

const MyOrdersScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrders = async () => {
    try {
      const { data } = await api.get("/orders/myorders");
      setOrders(data);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    fetchOrders();
  }, [userInfo, navigate]);

  const deleteHandler = async (orderId) => {
    if (window.confirm("Êtes-vous sûr de vouloir annuler cette commande ?")) {
      try {
        await api.delete(`/orders/${orderId}`);
        toast.success("Commande annulée avec succès");
        fetchOrders();
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  return (
    <div className="container profile-screen">
      <div className="profile-grid">
        <aside className="profile-sidebar">
          <div className="user-info">
            <div className="avatar">
              {userInfo ? userInfo.name.charAt(0) : "U"}
            </div>
            <h3>{userInfo ? userInfo.name : "User"}</h3>
            <p>{userInfo ? userInfo.email : ""}</p>
          </div>

          <nav className="profile-nav">
            <ul>
              <li>
                <Link to="/profile">Tableau de bord</Link>
              </li>
              <li className="active">
                <Link to="/myorders">Commandes</Link>
              </li>
              <li
                className="logout"
                onClick={() => {
                  ctxDispatch({ type: "USER_SIGNOUT" });
                  navigate("/login");
                }}
              >
                Déconnexion
              </li>
            </ul>
          </nav>
        </aside>

        <main className="profile-content">
          <h2>Historique des Commandes</h2>
          {loading ? (
            <div className="loader">Chargement...</div>
          ) : error ? (
            <div className="error">{error}</div>
          ) : orders.length === 0 ? (
            <p>Vous n'avez passé aucune commande.</p>
          ) : (
            <div className="table-responsive">
              <table className="orders-table">
                <thead>
                  <tr>
                    <th>ID</th>
                    <th>Date</th>
                    <th>Total</th>
                    <th>Payé</th>
                    <th>Livré</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id.substring(0, 10)}...</td>
                      <td>{order.createdAt.substring(0, 10)}</td>
                      <td>{order.totalPrice.toFixed(2)} DT</td>
                      <td>
                        {order.isPaid ? (
                          order.paidAt.substring(0, 10)
                        ) : (
                          <span style={{ color: "red" }}>Non</span>
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          order.deliveredAt.substring(0, 10)
                        ) : (
                          <span style={{ color: "red" }}>Non</span>
                        )}
                      </td>
                      <td style={{ display: "flex", gap: "0.5rem" }}>
                        <Link to={`/order/${order._id}`} className="btn-text">
                          Détails
                        </Link>
                        {order.isDelivered ? (
                          <button
                            className="btn-text"
                            style={{ color: "grey", cursor: "not-allowed" }}
                            onClick={() =>
                              toast.info(
                                "Commande confirmée. Veuillez contacter le propriétaire pour toute modification ou suppression.",
                              )
                            }
                          >
                            Supprimer
                          </button>
                        ) : (
                          <button
                            className="btn-text"
                            style={{ color: "red" }}
                            onClick={() => deleteHandler(order._id)}
                          >
                            Supprimer
                          </button>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </main>
      </div>
    </div>
  );
};

export default MyOrdersScreen;
