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
                    <th>Produits</th>
                    <th>Total</th>
                    <th>Statut Payé</th>
                    <th>Statut Livré</th>
                    <th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {orders.map((order) => (
                    <tr key={order._id}>
                      <td>{order._id.substring(0, 10)}...</td>
                      <td>{new Date(order.createdAt).toLocaleDateString()}</td>
                      <td>
                        <div className="order-items-summary">
                          {order.orderItems.map((item, index) => (
                            <div key={index} className="mini-item-info">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="mini-item-img"
                              />
                              <span className="mini-item-name">
                                {item.qty}x {item.name}
                              </span>
                            </div>
                          ))}
                        </div>
                      </td>
                      <td>
                        <strong>{order.totalPrice.toFixed(2)} DT</strong>
                      </td>
                      <td>
                        {order.isPaid ? (
                          <span className="status delivered">
                            Payé le {new Date(order.paidAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="status processing">Non Payé</span>
                        )}
                      </td>
                      <td>
                        {order.isDelivered ? (
                          <span className="status delivered">
                            Livré le{" "}
                            {new Date(order.deliveredAt).toLocaleDateString()}
                          </span>
                        ) : (
                          <span className="status processing">En cours</span>
                        )}
                      </td>
                      <td style={{ display: "flex", gap: "1rem" }}>
                        <Link to={`/order/${order._id}`} className="btn-text">
                          Détails
                        </Link>
                        {!order.isDelivered && (
                          <button
                            className="btn-text"
                            style={{ color: "var(--danger)" }}
                            onClick={() => deleteHandler(order._id)}
                          >
                            Annuler
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
