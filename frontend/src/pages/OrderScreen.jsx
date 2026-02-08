import React, { useEffect, useState, useContext } from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { Store } from "../context/StoreContext";
import "./OrderScreen.css";
import { toast } from "react-toastify";

const OrderScreen = () => {
  const { id: orderId } = useParams();
  const navigate = useNavigate();
  const { state } = useContext(Store);
  const { userInfo } = state;

  const [order, setOrder] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const fetchOrder = async () => {
    try {
      const { data } = await api.get(`/orders/${orderId}`);
      setOrder(data);
      setLoading(false);
    } catch (err) {
      setError(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }

    let isMounted = true;

    const loadOrder = async () => {
      try {
        const { data } = await api.get(`/orders/${orderId}`);
        if (isMounted) {
          setOrder(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          setError(err.response?.data?.message || err.message);
          setLoading(false);
        }
      }
    };

    loadOrder();

    return () => {
      isMounted = false;
    };
  }, [orderId, userInfo, navigate]);

  const deliverHandler = async () => {
    try {
      await api.put(`/orders/${order._id}/deliver`);
      fetchOrder();
      toast.success("Commande marquée comme livrée");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const confirmPaymentHandler = async () => {
    try {
      const isAdvance = order.paymentMethod === "Avance";
      const paymentResult = {
        id: (isAdvance ? "ADV_" : "COD_") + order._id,
        status: "COMPLETED",
        update_time: new Date().toISOString(),
        email_address: userInfo.email,
      };
      await api.put(`/orders/${order._id}/pay`, paymentResult);
      fetchOrder();
      toast.success(
        isAdvance ? "Avance confirmée" : "Paiement à la livraison confirmé"
      );
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  if (loading)
    return (
      <div
        className="container"
        style={{ padding: "5rem", textAlign: "center" }}
      >
        Chargement de la commande...
      </div>
    );
  if (error)
    return (
      <div
        className="container"
        style={{ padding: "5rem", textAlign: "center", color: "var(--danger)" }}
      >
        {error}
      </div>
    );
  if (!order)
    return (
      <div
        className="container"
        style={{ padding: "5rem", textAlign: "center" }}
      >
        Commande introuvable
      </div>
    );

  const isAdvancePayment = order.paymentMethod === "Avance";

  return (
    <div className="container order-screen">
      <h1 className="page-title text-center uppercase tracking-wide">
        Détails de la Commande
        <span className="order-id-label">ID: {order._id}</span>
      </h1>

      <div className="order-layout">
        <div className="order-details-column">
          <div className="checkout-card">
            <h2>Expédition</h2>
            <p>
              <strong>Client:</strong>{" "}
              {order.shippingAddress.fullName ||
                (order.user ? order.user.name : "Client Inconnu")}{" "}
              <br />
              <strong>Email:</strong>{" "}
              {order.user ? order.user.email : "Email Inconnu"} <br />
              <strong>Tél:</strong> {order.shippingAddress.phone} <br />
              <strong>Adresse:</strong> {order.shippingAddress.address},{" "}
              {order.shippingAddress.city},{order.shippingAddress.postalCode},{" "}
              {order.shippingAddress.country}
            </p>
            {order.isDelivered ? (
              <div className="status-badge status-success">
                <span>
                  Livrée le {new Date(order.deliveredAt).toLocaleDateString()}
                </span>
              </div>
            ) : (
              <div className="status-badge status-danger">
                <span>Non livrée</span>
              </div>
            )}
          </div>

          <div className="checkout-card">
            <h2>Avance</h2>
            <p>
              <strong>Méthode de paiement :</strong> {order.paymentMethod}
            </p>
            {order.isPaid ? (
              <div className="status-badge status-success">
                <span>
                  {isAdvancePayment ? "Avance Reçue" : "Payée à la livraison"} le{" "}
                  {new Date(order.paidAt).toLocaleDateString()}
                </span>
              </div>
            ) : (
              <div className="status-badge status-danger">
                <span>
                  {isAdvancePayment
                    ? "En attente de réception de l'avance"
                    : "En attente de confirmation de l'avance"}
                </span>
              </div>
            )}
          </div>

          <div className="checkout-card">
            <h2>Articles</h2>
            <div className="items-list">
              {order.orderItems.map((item, index) => (
                <div key={index} className="order-item-mini">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <Link to={`/product/${item.product}`}>{item.name}</Link>
                    <span>
                      Quantité: {item.qty} &times;{" "}
                      {(item.price || 0).toFixed(2)} DT
                    </span>
                  </div>
                  <div className="item-total-price">
                    {(item.qty * (item.price || 0)).toFixed(2)} DT
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="order-summary-box">
          <h2 className="uppercase tracking-wide">Résumé</h2>

          <div className="summary-line">
            <span>Articles</span>
            <span>{(order.itemsPrice || 0).toFixed(2)} DT</span>
          </div>

          <div className="summary-line">
            <span>Livraison</span>
            <span>
              {order.shippingPrice === 0
                ? "Gratuite"
                : `${(order.shippingPrice || 0).toFixed(2)} DT`}
            </span>
          </div>

          <div className="summary-line grand-total">
            <span>Total</span>
            <span>{(order.totalPrice || 0).toFixed(2)} DT</span>
          </div>

          {/* Admin Payment Confirmation Button */}
          {userInfo && userInfo.isAdmin && !order.isPaid && (
            <button
              className="btn btn-outline uppercase tracking-wide"
              style={{
                width: "100%",
                marginTop: "1rem",
                background: "transparent",
                color: "white",
                borderColor: "white",
              }}
              onClick={confirmPaymentHandler}
            >
              {isAdvancePayment
                ? "Confirmer réception de l'avance"
                : "Confirmer l'avance reçue"}
            </button>
          )}

          {/* User Instructions for Advance Payment */}
          {!userInfo?.isAdmin && !order.isPaid && isAdvancePayment && (
            <div
              style={{
                background: "rgba(255,255,255,0.1)",
                padding: "1rem",
                marginTop: "2rem",
                fontSize: "0.9rem",
                border: "1px dashed white",
              }}
            >
              Veuillez nous envoyer votre preuve de virement pour que l'admin
              puisse marquer votre avance comme reçue.
            </div>
          )}

          {userInfo &&
            userInfo.isAdmin &&
            order.isPaid &&
            !order.isDelivered && (
              <button
                className="btn btn-deliver uppercase tracking-wide"
                onClick={deliverHandler}
              >
                Marquer comme livrée
              </button>
            )}

          {userInfo && userInfo.isAdmin && (
            <button
              className="btn btn-outline uppercase tracking-wide"
              style={{
                width: "100%",
                marginTop: "1rem",
                background: "transparent",
                color: "white",
                borderColor: "white",
              }}
              onClick={() => navigate(`/admin/order/${order._id}/packing-slip`)}
            >
              Générer Bon de Livraison
            </button>
          )}

          {order.isPaid && (
            <p
              style={{
                marginTop: "2rem",
                fontSize: "0.85rem",
                color: "rgba(255,255,255,0.5)",
                textAlign: "center",
              }}
            >
              Transaction sécurisée terminée.
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default OrderScreen;
