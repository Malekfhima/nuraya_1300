import React, { useState, useEffect, useContext } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash, FaCheck, FaTimes, FaShoppingBag } from "react-icons/fa";
import AdminSidebar from "../components/AdminSidebar";
import { Store } from "../context/StoreContext";

const UserListScreen = () => {
  const navigate = useNavigate();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const [modalVisible, setModalVisible] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [userOrders, setUserOrders] = useState([]);
  const [ordersLoading, setOrdersLoading] = useState(false);

  const { state } = useContext(Store);
  const { userInfo } = state;

  useEffect(() => {
    if (userInfo && userInfo.isAdmin) {
      const fetchUsersData = async () => {
        try {
          const config = {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          };
          const { data } = await axios.get("/api/users", config);
          setUsers(data);
          setLoading(false);
        } catch (err) {
          setError(err.message);
          setLoading(false);
        }
      };
      fetchUsersData();
    } else {
      navigate("/login");
    }
  }, [navigate, userInfo]);

  const deleteHandler = async (id) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cet utilisateur ?")
    ) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        await axios.delete(`/api/users/${id}`, config);
        setUsers(users.filter((user) => user._id !== id));
        toast.success("Utilisateur supprimé");
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  const openOrdersModal = async (user) => {
    setSelectedUser(user);
    setModalVisible(true);
    setOrdersLoading(true);
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get(`/api/orders/user/${user._id}`, config);
      setUserOrders(data);
      setOrdersLoading(false);
    } catch (err) {
      toast.error("Impossible de charger les commandes");
      setOrdersLoading(false);
    }
  };

  return (
    <div className="admin-layout">
      <AdminSidebar activePage="users" />

      <main className="admin-content">
        <header className="admin-header">
          <h1>Utilisateurs</h1>
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
                  <th>NOM</th>
                  <th>EMAIL</th>
                  <th>ADMIN</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {users.map((user) => (
                  <tr key={user._id}>
                    <td>{user._id.substring(0, 10)}...</td>
                    <td>{user.name}</td>
                    <td>
                      <a href={`mailto:${user.email}`}>{user.email}</a>
                    </td>
                    <td>
                      {user.isAdmin ? (
                        <FaCheck style={{ color: "var(--success)" }} />
                      ) : (
                        <FaTimes style={{ color: "var(--danger)" }} />
                      )}
                    </td>
                    <td>
                      <button
                        className="action-btn"
                        style={{ marginRight: "10px", backgroundColor: "#8b7355", color: "white" }}
                        onClick={() => openOrdersModal(user)}
                        title="Voir les produits commandés"
                      >
                        <FaShoppingBag />
                      </button>
                      <button
                        className="action-btn btn-delete"
                        onClick={() => deleteHandler(user._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}

        {/* Modal for User Orders */}
        {modalVisible && (
          <div className="modal-overlay" onClick={() => setModalVisible(false)}>
            <div className="modal-content" onClick={(e) => e.stopPropagation()}>
              <div className="modal-header">
                <h2>Panier / Commandes de {selectedUser?.name}</h2>
                <button
                  className="close-btn"
                  onClick={() => setModalVisible(false)}
                >
                  &times;
                </button>
              </div>
              <div className="modal-body">
                {ordersLoading ? (
                  <p>Chargement des commandes...</p>
                ) : userOrders.length === 0 ? (
                  <p>Aucune commande passée par cet utilisateur.</p>
                ) : (
                  <div className="user-orders-list">
                    {userOrders.map((order) => (
                      <div key={order._id} className="order-item-card">
                        <div className="order-header-mini">
                          <span>
                            <strong>Commande:</strong> {order._id.substring(0, 8)}
                          </span>
                          <span>
                            {new Date(order.createdAt).toLocaleDateString()}
                          </span>
                          <span
                            className={
                              order.isPaid ? "status-success" : "status-danger"
                            }
                          >
                            {order.isPaid ? "Payé" : "Non Payé"}
                          </span>
                        </div>
                        <div className="order-products-mini">
                          {order.orderItems.map((item, idx) => (
                            <div key={idx} className="mini-product-row">
                              <img
                                src={item.image}
                                alt={item.name}
                                className="tiny-img"
                              />
                              <div className="mini-product-info">
                                <span>{item.name}</span>
                                <span className="text-muted">
                                  Qté: {item.qty} x {item.price} DT
                                </span>
                              </div>
                            </div>
                          ))}
                        </div>
                        <div className="order-footer-mini">
                          <strong>Total: {order.totalPrice.toFixed(2)} DT</strong>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

      </main>

      <style>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }
        .modal-content {
          background: white;
          padding: 2rem;
          border-radius: 8px;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow-y: auto;
          box-shadow: 0 4px 6px rgba(0,0,0,0.1);
        }
        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid #eee;
          padding-bottom: 1rem;
        }
        .close-btn {
          background: none;
          border: none;
          font-size: 1.5rem;
          cursor: pointer;
        }
        .order-item-card {
          border: 1px solid #eee;
          border-radius: 4px;
          padding: 1rem;
          margin-bottom: 1rem;
          background: #f9f9f9;
        }
        .order-header-mini {
          display: flex;
          justify-content: space-between;
          font-size: 0.9rem;
          margin-bottom: 0.8rem;
          padding-bottom: 0.5rem;
          border-bottom: 1px solid #eee;
        }
        .mini-product-row {
          display: flex;
          gap: 10px;
          align-items: center;
          margin-bottom: 5px;
        }
        .tiny-img {
          width: 40px;
          height: 40px;
          object-fit: cover;
          border-radius: 4px;
        }
        .mini-product-info {
          display: flex;
          flex-direction: column;
          font-size: 0.85rem;
        }
        .text-muted {
          color: #666;
          font-size: 0.8rem;
        }
        .order-footer-mini {
          margin-top: 0.8rem;
          text-align: right;
          font-size: 0.95rem;
        }
        .status-success { color: green; font-weight: bold; }
        .status-danger { color: red; font-weight: bold; }
      `}</style>
    </div>
  );
};

export default UserListScreen;
