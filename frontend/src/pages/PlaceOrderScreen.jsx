import React, { useContext, useEffect, useState, useMemo } from "react";
import { toast } from "react-toastify";
import { Link, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import { Store } from "../context/StoreContext";
import "./PlaceOrderScreen.css";

const PlaceOrderScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart } = state;

  // Calculate prices using useMemo to avoid mutations
  const { itemsPrice, shippingPrice, taxPrice, discountAmount, totalPrice } = useMemo(() => {
    const round2 = (num) => Math.round(num * 100 + Number.EPSILON) / 100;
    const calculatedItemsPrice = round2(
      cart.cartItems.reduce((a, c) => a + c.qty * c.price, 0),
    );
    const calculatedShippingPrice =
      calculatedItemsPrice > 300 ? round2(0) : round2(15);
    const calculatedTaxPrice = round2(0); // TVA removed
    
    // Calculate promo discount
    const calculatedDiscountAmount = cart.promoCode 
      ? round2((calculatedItemsPrice * cart.promoCode.discountPercentage) / 100) 
      : 0;

    const calculatedTotalPrice = calculatedItemsPrice - calculatedDiscountAmount + calculatedShippingPrice;

    return {
      itemsPrice: calculatedItemsPrice,
      shippingPrice: calculatedShippingPrice,
      taxPrice: calculatedTaxPrice,
      discountAmount: calculatedDiscountAmount,
      totalPrice: calculatedTotalPrice,
    };
  }, [cart.cartItems, cart.promoCode]);

  const [loading, setLoading] = useState(false);

  const placeOrderHandler = async () => {
    try {
      setLoading(true);
      const { data } = await api.post("/orders", {
        orderItems: cart.cartItems.map((item) => ({
          ...item,
          product: item._id,
        })),
        shippingAddress: cart.shippingAddress,
        paymentMethod: cart.paymentMethod,
        itemsPrice: itemsPrice,
        shippingPrice: shippingPrice,
        taxPrice: taxPrice,
        discountAmount: discountAmount,
        promoCode: cart.promoCode ? cart.promoCode.code : undefined,
        totalPrice: totalPrice,
      });
      ctxDispatch({ type: "CART_CLEAR" });
      setLoading(false);
      navigate(`/order/${data._id}`);
      toast.success("Commande passée avec succès");
    } catch (err) {
      setLoading(false);
      console.error("Place order error:", err);
      toast.error(
        err.response?.data?.message || err.message || "Une erreur inconnue est survenue"
      );
    }
  };

  useEffect(() => {
    if (!cart.paymentMethod) {
      navigate("/payment");
    }
  }, [cart, navigate]);

  return (
    <div className="container placeorder-screen">
      <h1 className="page-title text-center uppercase tracking-wide">
        Résumé de la Commande
      </h1>

      <div className="placeorder-layout">
        <div className="order-details-section">
          <div className="checkout-card">
            <div style={{ display: "flex", alignItems: "center" }}>
              <h2>Expédition</h2>
              <Link to="/shipping" className="edit-link">
                Modifier
              </Link>
            </div>
            <p>
              <strong>Destinataire:</strong> {cart.shippingAddress.fullName}{" "}
              <br />
              <strong>Tél:</strong> {cart.shippingAddress.phone} <br />
              <strong>Adresse:</strong> {cart.shippingAddress.address},{" "}
              {cart.shippingAddress.city},{cart.shippingAddress.postalCode},{" "}
              {cart.shippingAddress.country}
            </p>
          </div>

          <div className="checkout-card">
            <div style={{ display: "flex", alignItems: "center" }}>
              <h2>Mode de Paiement</h2>
              <Link to="/payment" className="edit-link">
                Modifier
              </Link>
            </div>
            <p>
              <strong>Méthode:</strong> {cart.paymentMethod}
            </p>
            <p
              style={{
                fontSize: "0.9rem",
                color: "var(--success)",
                marginTop: "0.5rem",
              }}
            >
              ✅ Paiement à la livraison sélectionné
            </p>
          </div>

          <div className="checkout-card">
            <h2>Articles commandés</h2>
            <div className="items-list">
              {cart.cartItems.map((item) => (
                <div key={item._id} className="order-item-mini">
                  <img src={item.image} alt={item.name} />
                  <div className="item-info">
                    <Link to={`/product/${item._id}`}>{item.name}</Link>
                    <span>
                      Quantité: {item.qty} &times; {item.price.toFixed(2)} DT
                    </span>
                  </div>
                  <div className="item-total-price">
                    {(item.qty * item.price).toFixed(2)} DT
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="order-summary-card">
          <h2 className="uppercase tracking-wide">Récapitulatif</h2>

          <div className="summary-line">
            <span>Sous-total</span>
            <span>{itemsPrice.toFixed(2)} DT</span>
          </div>

          {cart.promoCode && (
            <div className="summary-line" style={{ color: "#e74c3c" }}>
              <span>Réduction ({cart.promoCode.code})</span>
              <span>-{discountAmount.toFixed(2)} DT</span>
            </div>
          )}

          <div className="summary-line">
            <span>Livraison</span>
            <span>
              {shippingPrice === 0
                ? "Gratuite"
                : `${shippingPrice.toFixed(2)} DT`}
            </span>
          </div>

          <div className="summary-line grand-total">
            <span>Total</span>
            <span>{totalPrice.toFixed(2)} DT</span>
          </div>

          <div
            style={{
              backgroundColor: "#e8f5e8",
              padding: "1rem",
              borderRadius: "8px",
              margin: "1rem 0",
              border: "1px solid #4caf50",
            }}
          >
            <p
              style={{
                margin: 0,
                fontSize: "0.9rem",
                color: "#2e7d32",
                fontWeight: "500",
              }}
            >
              💰 Paiement à la livraison
            </p>
            <p
              style={{
                margin: "0.5rem 0 0 0",
                fontSize: "0.8rem",
                color: "#388e3c",
              }}
            >
              Vous paierez le montant total ({totalPrice.toFixed(2)} DT) en
              espèces au livreur lors de la réception de votre commande.
            </p>
          </div>

          <button
            type="button"
            className="btn btn-place-order uppercase tracking-wide"
            onClick={placeOrderHandler}
            disabled={cart.cartItems.length === 0 || loading}
          >
            {loading ? "Chargement..." : "Passer la commande"}
          </button>

          <p
            style={{
              fontSize: "0.8rem",
              opacity: 0.6,
              marginTop: "1.5rem",
              textAlign: "center",
            }}
          >
            Paiement sécurisé et confidentiel - Paiement à la livraison
            uniquement.
          </p>
        </div>
      </div>
    </div>
  );
};

export default PlaceOrderScreen;
