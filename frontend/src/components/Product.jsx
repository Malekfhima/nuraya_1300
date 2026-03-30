import React, { useContext, useMemo } from "react";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { Link } from "react-router-dom";
import { Store } from "../context/StoreContext";
import api from "../utils/axios";
import { toast } from "react-toastify";
import "./Product.css";

const Product = ({ product }) => {
  const { state } = useContext(Store);
  const { userInfo } = state;

  // Calculate wishlist status using useMemo instead of useEffect
  const isWishlisted = useMemo(() => {
    return userInfo && userInfo.wishlist
      ? userInfo.wishlist.includes(product._id)
      : false;
  }, [userInfo, product._id]);

  const addToWishlistHandler = async (e) => {
    e.preventDefault();
    if (!userInfo) {
      toast.error(
        "Veuillez vous connecter pour ajouter à la liste de souhaits",
      );
      return;
    }
    try {
      if (isWishlisted) {
        await api.delete(`/users/wishlist/${product._id}`);
        toast.success("Retiré des favoris");
        // Update user info in context
        const updatedWishlist = userInfo.wishlist.filter(
          (id) => id !== product._id,
        );
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            ...userInfo,
            wishlist: updatedWishlist,
          }),
        );
      } else {
        await api.post("/users/wishlist", { productId: product._id });
        toast.success("Ajouté aux favoris");
        // Update user info in context
        const updatedWishlist = [...(userInfo.wishlist || []), product._id];
        localStorage.setItem(
          "userInfo",
          JSON.stringify({
            ...userInfo,
            wishlist: updatedWishlist,
          }),
        );
      }
      // Refresh the page to update UI
      window.location.reload();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <div
      className="product-card"
      role="article"
      aria-label={`Produit: ${product.name}`}
    >
      <div className="product-image-container" style={{ position: "relative" }}>
        {(product.isPromoted || product.countInStock === 0) && (
          <div
            className="badges-container"
            style={{
              position: "absolute",
              top: "10px",
              left: "10px",
              zIndex: 2,
              display: "flex",
              flexDirection: "column",
              gap: "6px",
            }}
          >
            {product.isPromoted && (
              <div
                className="promo-badge"
                style={{
                  backgroundColor: "#e74c3c",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                }}
              >
                Promo
              </div>
            )}
            {product.countInStock === 0 && (
              <div
                className="sold-out-badge"
                style={{
                  backgroundColor: "#dc3545",
                  color: "white",
                  padding: "5px 10px",
                  borderRadius: "4px",
                  fontSize: "0.8rem",
                  fontWeight: "bold",
                }}
              >
                Sold Out
              </div>
            )}
          </div>
        )}
        <Link
          to={`/product/${product._id}`}
          aria-label={`Voir les détails du produit ${product.name}`}
        >
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
            onError={(e) => {
              e.target.onerror = null;
              e.target.src = "/images/placeholder-product.png";
            }}
          />
        </Link>
        <button
          className="wishlist-btn"
          onClick={addToWishlistHandler}
          aria-label={
            isWishlisted
              ? `Retirer ${product.name} des favoris`
              : `Ajouter ${product.name} aux favoris`
          }
          aria-pressed={isWishlisted}
        >
          {isWishlisted ? <FaHeart color="#ff4d4f" /> : <FaRegHeart />}
        </button>
      </div>
      <div className="product-info">
        <Link to={`/product/${product._id}`}>
          <div className="product-brand">{product.brand}</div>
          <h3 className="product-name">{product.name}</h3>
        </Link>
        <div className="rating">
          {[...Array(5)].map((_, index) => {
            const ratingValue = index + 1;
            return (
              <span key={index}>
                {product.rating >= ratingValue ? (
                  <FaStar color="#c9a227" />
                ) : product.rating >= ratingValue - 0.5 ? (
                  <FaStarHalfAlt color="#c9a227" />
                ) : (
                  <FaRegStar color="#c9a227" />
                )}
              </span>
            );
          })}
          <span className="num-reviews">({product.numReviews})</span>
        </div>
        <h3 className="product-price">
          {product.isPromoted ? (
            <>
              <span
                style={{
                  textDecoration: "line-through",
                  color: "#999",
                  marginRight: "10px",
                  fontSize: "0.9em",
                }}
              >
                {product.price} DT
              </span>
              <span style={{ color: "#e74c3c" }}>
                {product.discountPrice} DT
              </span>
            </>
          ) : (
            `${product.price} DT`
          )}
        </h3>
      </div>
    </div>
  );
};

export default Product;
