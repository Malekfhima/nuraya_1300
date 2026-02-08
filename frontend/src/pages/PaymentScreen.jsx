import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../context/StoreContext";
import "./AuthScreen.css";

const PaymentScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress, paymentMethod },
  } = state;

  const [paymentMethodName, setPaymentMethodName] = useState(
    paymentMethod || "Paiement à la Livraison"
  );

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
      <div className="auth-card" style={{ maxWidth: "600px" }}>
        <h2 className="uppercase tracking-wide">Mode de Paiement</h2>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            {/* Cash on Delivery Option */}
            <div
              className={`checkbox-container ${
                paymentMethodName === "Paiement à la Livraison" ? "active" : ""
              }`}
              style={{
                marginBottom: "1rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.2rem",
                background:
                  paymentMethodName === "Paiement à la Livraison"
                    ? "var(--accent)"
                    : "#f9f9f9",
                border: "1px solid var(--border-color)",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onClick={() => setPaymentMethodName("Paiement à la Livraison")}
            >
              <input
                type="radio"
                id="COD"
                value="Paiement à la Livraison"
                checked={paymentMethodName === "Paiement à la Livraison"}
                onChange={(e) => setPaymentMethodName(e.target.value)}
                style={{ width: "auto", cursor: "pointer" }}
              />
              <label
                htmlFor="COD"
                style={{ fontWeight: "500", cursor: "pointer", margin: 0 }}
              >
                Paiement à la Livraison (Cash on Delivery)
              </label>
            </div>

            {/* Advance Payment Option */}
            <div
              className={`checkbox-container ${
                paymentMethodName === "Avance" ? "active" : ""
              }`}
              style={{
                marginBottom: "1.5rem",
                display: "flex",
                alignItems: "center",
                gap: "1rem",
                padding: "1.2rem",
                background:
                  paymentMethodName === "Avance"
                    ? "var(--accent)"
                    : "#f9f9f9",
                border: "1px solid var(--border-color)",
                cursor: "pointer",
                transition: "all 0.3s",
              }}
              onClick={() => setPaymentMethodName("Avance")}
            >
              <input
                type="radio"
                id="Advance"
                value="Avance"
                checked={paymentMethodName === "Avance"}
                onChange={(e) => setPaymentMethodName(e.target.value)}
                style={{ width: "auto", cursor: "pointer" }}
              />
              <label
                htmlFor="Advance"
                style={{ fontWeight: "500", cursor: "pointer", margin: 0 }}
              >
                Avance (Virement / Versement)
              </label>
            </div>

            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--text-light)",
                lineHeight: "1.6",
                marginBottom: "2rem",
                fontStyle: "italic",
              }}
            >
              {paymentMethodName === "Paiement à la Livraison"
                ? "Vous réglerez le montant total directement auprès du transporteur lors de la réception de votre colis."
                : "Veuillez effectuer le paiement par avance (virement ou versement) et nous contacter avec la preuve de paiement pour valider votre commande."}
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
