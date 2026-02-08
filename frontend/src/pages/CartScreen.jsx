import React, { useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import { FaTrash } from "react-icons/fa";
import { Store } from "../context/StoreContext";
import "./CartScreen.css";

const CartScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { cartItems },
  } = state;

  const updateCartHandler = (item, qty) => {
    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...item, qty },
    });
  };

  const removeItemHandler = (item) => {
    ctxDispatch({ type: "CART_REMOVE_ITEM", payload: item });
  };

  const checkoutHandler = () => {
    navigate("/login?redirect=/shipping");
  };

  const subtotal = cartItems.reduce(
    (acc, item) => acc + item.qty * item.price,
    0,
  );

  return (
    <div className="container cart-screen">
      <h1 className="page-title">Mon Panier</h1>

      {cartItems.length === 0 ? (
        <div className="empty-cart" style={{ textAlign: "center" }}>
          <p>Votre panier est vide.</p>
          <Link to="/shop" className="btn btn-primary">
            Continuer vos achats
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          <div className="cart-items">
            {cartItems.map((item) => (
              <div key={`${item._id}-${item.size}`} className="cart-item">
                <img src={item.image} alt={item.name} />
                <div className="item-details">
                  <Link to={`/product/${item._id}`} className="item-name">
                    {item.name}
                  </Link>
                  <p className="item-price">{item.price} DT</p>
                  <p
                    style={{ fontSize: "0.85rem", color: "var(--text-light)" }}
                  >
                    Taille: {item.size} cm
                  </p>
                </div>
                <div className="item-actions">
                  <div className="qty-controls-cart">
                    <button
                      type="button"
                      className="qty-btn-cart"
                      onClick={() =>
                        updateCartHandler(item, Math.max(1, item.qty - 1))
                      }
                      disabled={item.qty <= 1}
                    >
                      −
                    </button>
                    <span className="qty-display-cart">{item.qty}</span>
                    <button
                      type="button"
                      className="qty-btn-cart"
                      onClick={() =>
                        updateCartHandler(
                          item,
                          Math.min(item.countInStock, item.qty + 1),
                        )
                      }
                      disabled={item.qty >= item.countInStock}
                    >
                      +
                    </button>
                  </div>
                  <button
                    className="btn-remove"
                    onClick={() => removeItemHandler(item)}
                  >
                    <FaTrash />
                  </button>
                </div>
              </div>
            ))}
          </div>

          <div className="cart-summary">
            <h3>Résumé</h3>
            <div className="summary-row">
              <span>
                Sous-total ({cartItems.reduce((a, c) => a + c.qty, 0)} articles)
              </span>
              <span>{subtotal.toFixed(2)} DT</span>
            </div>
            <div className="summary-row">
              <span>Livraison</span>
              <span>Calculé au paiement</span>
            </div>
            <div className="summary-total">
              <span>Total</span>
              <span>{subtotal.toFixed(2)} DT</span>
            </div>
            <button
              className="btn btn-primary btn-block"
              onClick={checkoutHandler}
              disabled={cartItems.length === 0}
            >
              Paiement
            </button>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartScreen;
