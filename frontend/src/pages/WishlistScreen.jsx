import React, { useState, useEffect, useContext } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import { FaTrash, FaShoppingCart } from "react-icons/fa";
import { Store } from "../context/StoreContext";
import { toast } from "react-toastify";
import "./WishlistScreen.css";

const WishlistScreen = () => {
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;
  const [wishlistItems, setWishlistItems] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadWishlist = async () => {
      // If no user, stop loading immediately
      if (!userInfo) {
        setLoading(false);
        return;
      }

      let isMounted = true;

      try {
        const { data } = await api.get("/users/wishlist");
        if (isMounted) {
          setWishlistItems(data);
          setLoading(false);
        }
      } catch (err) {
        if (isMounted) {
          toast.error(err.response?.data?.message || err.message);
          setLoading(false);
        }
      }

      return () => {
        isMounted = false;
      };
    };

    loadWishlist();
  }, [userInfo]);

  const removeFromWishlistHandler = async (productId) => {
    try {
      await api.delete(`/users/wishlist/${productId}`);
      setWishlistItems(wishlistItems.filter((item) => item._id !== productId));
      toast.success("Retiré de la liste de souhaits");
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const addToCartHandler = (product) => {
    const existItem = state.cart.cartItems.find((x) => x._id === product._id);
    const qty = existItem ? existItem.qty + 1 : 1;

    if (product.countInStock < qty) {
      toast.error("Produit en rupture de stock");
      return;
    }

    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: {
        ...product,
        qty,
        size: product.variations?.[0]?.options?.[0] || "Default",
      },
    });
    toast.success("Ajouté au panier");
  };

  // Show login prompt if user not authenticated
  if (!userInfo) {
    return (
      <div className="container my-5 text-center">
        <h2>Veuillez vous connecter pour voir votre liste de souhaits</h2>
        <Link to="/login" className="btn btn-primary mt-3">
          Connexion
        </Link>
      </div>
    );
  }

  return (
    <div className="container wishlist-screen">
      <h1 className="page-title">Ma Liste de Souhaits</h1>

      {loading ? (
        <div className="loader">Chargement...</div>
      ) : wishlistItems.length === 0 ? (
        <div className="empty-wishlist text-center">
          <p>Votre liste de souhaits est vide.</p>
          <Link to="/shop" className="btn btn-primary">
            Découvrir nos produits
          </Link>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item._id} className="wishlist-item">
              <Link to={`/product/${item._id}`}>
                <img src={item.image} alt={item.name} />
              </Link>
              <div className="item-info">
                <Link to={`/product/${item._id}`} className="item-name">
                  {item.name}
                </Link>
                <div className="item-price">{item.price} DT</div>
              </div>
              <div className="item-actions">
                <button
                  onClick={() => addToCartHandler(item)}
                  className="btn btn-primary btn-sm"
                  title="Ajouter au panier"
                >
                  <FaShoppingCart />
                </button>
                <button
                  onClick={() => removeFromWishlistHandler(item._id)}
                  className="btn btn-danger btn-sm"
                  title="Retirer"
                >
                  <FaTrash />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistScreen;
