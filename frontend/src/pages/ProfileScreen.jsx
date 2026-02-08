import React, { useContext, useEffect, useState } from "react";
import api from "../utils/axios";
import { toast } from "react-toastify";
import { Store } from "../context/StoreContext";
import { useNavigate, Link } from "react-router-dom";
import "./ProfileScreen.css";

const ProfileScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const [name, setName] = useState(userInfo ? userInfo.name : "");
  const [email, setEmail] = useState(userInfo ? userInfo.email : "");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
    } else {
      const fetchOrders = async () => {
        try {
          const { data } = await api.get("/orders/myorders");
          setOrders(data);
          setLoading(false);
        } catch (err) {
          console.error(err);
          setLoading(false);
        }
      };
      fetchOrders();
    }
  }, [userInfo, navigate]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error("Les mots de passe ne correspondent pas");
      return;
    }
    try {
      const { data } = await api.put("/users/profile", {
        name,
        email,
        password,
      });
      ctxDispatch({ type: "USER_LOGIN", payload: data });
      toast.success("Profil mis à jour avec succès");
    } catch (err) {
      toast.error(err.message);
    }
  };

  const signoutHandler = () => {
    ctxDispatch({ type: "USER_LOGOUT" });
    localStorage.removeItem("userInfo");
    localStorage.removeItem("shippingAddress");
    localStorage.removeItem("paymentMethod");
    window.location.href = "/login";
  };

  if (!userInfo) return null;

  return (
    <div className="container profile-screen">
      <div className="profile-grid">
        <aside className="profile-sidebar">
          <div className="user-info">
            <div className="avatar">{userInfo.name.charAt(0)}</div>
            <h3>{userInfo.name}</h3>
            <p>{userInfo.email}</p>
          </div>

          <nav className="profile-nav">
            <ul>
              <li className="active">
                <Link to="/profile">Tableau de bord</Link>
              </li>
              <li>
                <Link to="/myorders">Commandes</Link>
              </li>
              <li className="logout" onClick={signoutHandler}>
                Déconnexion
              </li>
            </ul>
          </nav>
        </aside>

        <main className="profile-content">
          <h2>Mon Tableau de bord</h2>
          <p>
            Bonjour, {userInfo.name} (pas {userInfo.name}?{" "}
            <span
              onClick={signoutHandler}
              style={{ cursor: "pointer", textDecoration: "underline" }}
            >
              Se déconnecter
            </span>
            )
          </p>

          <div className="dashboard-widgets">
            <div className="widget" style={{ width: "100%" }}>
              <h3>Commandes Récentes</h3>
              {loading ? (
                <p>Chargement des commandes...</p>
              ) : orders.length === 0 ? (
                <p>Aucune commande trouvée.</p>
              ) : (
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
                        <td>
                          <button
                            className="btn-text"
                            onClick={() => navigate(`/order/${order._id}`)}
                          >
                            Voir
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>

            <div
              className="widget"
              style={{ width: "100%", marginTop: "2rem" }}
            >
              <h3>Profil Utilisateur</h3>
              <form onSubmit={submitHandler} style={{ marginTop: "1rem" }}>
                <div className="form-group">
                  <label>Nom</label>
                  <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Email</label>
                  <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    required
                  />
                </div>
                <div className="form-group">
                  <label>Mot de passe</label>
                  <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                </div>
                <div className="form-group">
                  <label>Confirmer le mot de passe</label>
                  <input
                    type="password"
                    value={confirmPassword}
                    onChange={(e) => setConfirmPassword(e.target.value)}
                  />
                </div>
                <button type="submit" className="btn btn-primary">
                  Mettre à jour le profil
                </button>
              </form>
            </div>
          </div>
        </main>
      </div>
    </div>
  );
};

export default ProfileScreen;
