import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../context/StoreContext";
import "./AuthScreen.css";

const PaymentScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress },
  } = state;

  const [paymentMethodName] = useState("Cash on Delivery");

  if (!shippingAddress.address) {
    navigate("/shipping");
  }

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({ type: "SAVE_PAYMENT_METHOD", payload: paymentMethodName });
    navigate("/placeorder");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="uppercase tracking-wide">Mode de Paiement</h2>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <div
              className="checkbox-container"
              style={{
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.5rem",
                background: "#f9f9f9",
                border: "1px solid var(--border-color)",
              }}
            >
              <input
                type="radio"
                id="COD"
                value="Cash on Delivery"
                checked={true}
                readOnly
                style={{ width: "auto" }}
              />
              <label
                htmlFor="COD"
                style={{ fontWeight: "500", cursor: "pointer" }}
              >
                Paiement à la Livraison (Cash on Delivery)
              </label>
            </div>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-light)",
                lineHeight: "1.6",
                marginBottom: "2rem",
              }}
            >
              Pour le moment, seul le paiement à la livraison est disponible.
              Vous réglerez le montant total directement auprès du transporteur
              lors de la réception de votre colis.
            </p>
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block uppercase tracking-wide"
          >
            Vérifier la commande
          </button>
        </form>
      </div>
    </div>
  );
};

export default PaymentScreen;
