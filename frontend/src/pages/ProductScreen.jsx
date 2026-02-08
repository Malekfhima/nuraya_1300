import { toast } from "react-toastify";
import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useMemo,
} from "react";
import { useParams, Link, useNavigate } from "react-router-dom";
import api from "../utils/axios";
import {
  FaStar,
  FaStarHalfAlt,
  FaRegStar,
  FaArrowLeft,
  FaHeart,
  FaRegHeart,
} from "react-icons/fa";
import { Store } from "../context/StoreContext";
import "./ProductScreen.css";

const ProductScreen = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [qty, setQty] = useState(1);
  const [size, setSize] = useState("");
  const [selectedImage, setSelectedImage] = useState("");

  const [rating, setRating] = useState(0);
  const [hover, setHover] = useState(0);
  const [comment, setComment] = useState("");
  const [userReview, setUserReview] = useState(null);
  const [zoomStyle, setZoomStyle] = useState({
    transformOrigin: "center center",
  });

  const handleMouseMove = useCallback((e) => {
    const { left, top, width, height } =
      e.currentTarget.getBoundingClientRect();
    const x = ((e.clientX - left) / width) * 100;
    const y = ((e.clientY - top) / height) * 100;
    setZoomStyle({ transformOrigin: `${x}% ${y}%` });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setZoomStyle({ transformOrigin: "center center" });
  }, []);

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { cart, userInfo } = state;

  const fetchProduct = useCallback(async () => {
    try {
      const { data } = await api.get(`/products/${id}`);
      setProduct(data);
      setSelectedImage(data.image);

      if (userInfo && data.reviews) {
        const myReview = data.reviews.find((r) => r.user === userInfo._id);
        if (myReview) {
          setUserReview(myReview);
          setRating(myReview.rating);
          setComment(myReview.comment);
        }
      }
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  }, [id, userInfo]);

  useEffect(() => {
    fetchProduct();
  }, [fetchProduct]);

  const addToCartHandler = useCallback(async () => {
    if (!size) {
      toast.error("Veuillez entrer votre taille en cm");
      return;
    }
    const existItem = cart.cartItems.find(
      (x) => x._id === product._id && x.size === size,
    );
    const quantity = existItem ? existItem.qty + Number(qty) : Number(qty);

    if (product.countInStock < quantity) {
      toast.error("Désolé. Le produit est en rupture de stock");
      return;
    }

    ctxDispatch({
      type: "CART_ADD_ITEM",
      payload: { ...product, image: selectedImage || product.image, qty: quantity, size },
    });
    navigate("/cart");
  }, [
    size,
    product,
    selectedImage,
    qty,
    cart.cartItems,
    ctxDispatch,
    navigate,
  ]);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (!rating) {
      toast.error("Veuillez entrer une note");
      return;
    }

    try {
      if (userReview) {
        await api.put(`/products/${id}/reviews`, { rating, comment });
        toast.success("Avis mis à jour");
      } else {
        await api.post(`/products/${id}/reviews`, { rating, comment });
        toast.success("Avis soumis");
      }
      fetchProduct();
    } catch (err) {
      toast.error(
        err.response && err.response.data.message
          ? err.response.data.message
          : err.message,
      );
    }
  };

  const deleteReviewHandler = async () => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer votre avis ?")) {
      try {
        await api.delete(`/products/${id}/reviews`);
        toast.success("Avis supprimé");
        fetchProduct();
      } catch (err) {
        toast.error(
          err.response && err.response.data.message
            ? err.response.data.message
            : err.message,
        );
      }
    }
  };

  const isWishlisted = useMemo(() => {
    return userInfo && userInfo.wishlist && product && product._id
      ? userInfo.wishlist.includes(product._id)
      : false;
  }, [userInfo, product]);

  const addToWishlistHandler = async () => {
    if (!userInfo) {
      toast.error(
        "Veuillez vous connecter pour ajouter à la liste de souhaits",
      );
      return;
    }
    try {
      let updatedWishlist;
      if (isWishlisted) {
        await api.delete(`/users/wishlist/${product._id}`);
        toast.success("Retiré de la liste de souhaits");
        updatedWishlist = userInfo.wishlist.filter(
          (id) => id !== product._id,
        );
      } else {
        await api.post("/users/wishlist", { productId: product._id });
        toast.success("Ajouté à la liste de souhaits");
        updatedWishlist = [...(userInfo.wishlist || []), product._id];
      }

      const updatedUser = { ...userInfo, wishlist: updatedWishlist };
      ctxDispatch({ type: "USER_SIGNIN", payload: updatedUser });
      
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  if (loading) return <div className="loader">Chargement...</div>;
  if (error) return <div className="error">{error}</div>;
  if (!product) return null;

  return (
    <div className="container product-screen">
      <Link to="/" className="btn btn-back">
        <FaArrowLeft /> Retour à la boutique
      </Link>

      <div className="product-details-grid">
        <div className="product-image-col">
          <div className="thumbnail-gallery">
            {[product.image, ...product.images]
              .filter(Boolean)
              .map((img, index) => (
                <img
                  key={index}
                  src={img}
                  alt={`thumb-${index}`}
                  className={`thumbnail ${
                    selectedImage === img ? "active" : ""
                  }`}
                  onClick={() => setSelectedImage(img)}
                />
              ))}
          </div>

          <div
            className="main-image-container"
            style={{ position: "relative" }}
            onMouseMove={handleMouseMove}
            onMouseLeave={handleMouseLeave}
          >
            <img
              src={selectedImage || product.image}
              alt={product.name}
              className="main-image"
              style={zoomStyle}
            />

            {/* Navigation Arrows */}
            {[product.image, ...product.images].filter(Boolean).length > 1 && (
              <>
                <button
                  onClick={() => {
                    const allImages = [product.image, ...product.images].filter(
                      Boolean,
                    );
                    const currentIndex = allImages.indexOf(
                      selectedImage || product.image,
                    );
                    const prevIndex =
                      (currentIndex - 1 + allImages.length) % allImages.length;
                    setSelectedImage(allImages[prevIndex]);
                  }}
                  className="gallery-arrow left"
                >
                  &#10094;
                </button>
                <button
                  onClick={() => {
                    const allImages = [product.image, ...product.images].filter(
                      Boolean,
                    );
                    const currentIndex = allImages.indexOf(
                      selectedImage || product.image,
                    );
                    const nextIndex = (currentIndex + 1) % allImages.length;
                    setSelectedImage(allImages[nextIndex]);
                  }}
                  className="gallery-arrow right"
                >
                  &#10095;
                </button>
              </>
            )}
          </div>
        </div>

        <div className="product-info-col">
          <span className="brand-name">{product.brand}</span>
          <h1>{product.name}</h1>
          <div className="rating-large">
            <div className="stars">
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
            </div>
            <span>({product.numReviews} avis client)</span>
          </div>
          <div className="price-tag">{product.price.toFixed(2)} DT</div>
          <p className="description">{product.description}</p>

          <div className="stock-status">
            Statut:{" "}
            {product.countInStock > 0 ? (
              <span className="success">Disponible</span>
            ) : (
              <span className="danger">Rupture de Stock</span>
            )}
          </div>

          {product.countInStock > 0 && (
            <div className="qty-selector">
              <label>Quantité:</label>
              <div className="qty-controls">
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() => setQty(Math.max(1, qty - 1))}
                  disabled={qty <= 1}
                >
                  −
                </button>
                <span className="qty-display">{qty}</span>
                <button
                  type="button"
                  className="qty-btn"
                  onClick={() =>
                    setQty(Math.min(product.countInStock, qty + 1))
                  }
                  disabled={qty >= product.countInStock}
                >
                  +
                </button>
              </div>
              <span className="stock-info">
                {product.countInStock} disponible(s)
              </span>
            </div>
          )}

          <div className="form-group" style={{ marginBottom: "1rem" }}>
            <label>Taille (cm):</label>
            <input
              type="number"
              placeholder="Entrez votre taille en cm"
              value={size}
              onChange={(e) => setSize(e.target.value)}
              style={{
                width: "100%",
                padding: "10px",
                border: "1px solid var(--border-color)",
              }}
            />
          </div>

          <div
            className="action-buttons"
            style={{ display: "flex", gap: "1rem" }}
          >
            <button
              className="btn btn-primary"
              style={{ flex: 1 }}
              disabled={product.countInStock === 0}
              onClick={addToCartHandler}
            >
              {product.countInStock === 0
                ? "Rupture de Stock"
                : "Ajouter au Panier"}
            </button>
            <button
              className={`btn ${
                isWishlisted ? "btn-wishlisted" : "btn-outline"
              }`}
              onClick={addToWishlistHandler}
              style={{
                width: "50px",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              {isWishlisted ? <FaHeart color="#ff4d4f" /> : <FaRegHeart />}
            </button>
          </div>
        </div>
      </div>

      <div className="reviews-section" style={{ marginTop: "4rem" }}>
        <h2
          style={{
            fontFamily: "var(--font-heading)",
            fontSize: "2rem",
            marginBottom: "2rem",
          }}
        >
          Avis
        </h2>
        {product.reviews.length === 0 && <p>Aucun avis pour le moment</p>}
        <ul style={{ listStyle: "none", padding: 0 }}>
          {product.reviews.map((review) => (
            <li
              key={review._id}
              style={{
                borderBottom: "1px solid var(--border-color)",
                marginBottom: "1rem",
                paddingBottom: "1rem",
              }}
            >
              <strong>{review.name}</strong>
              <div className="rating-small">
                {[...Array(5)].map((_, index) => (
                  <FaStar
                    key={index}
                    color={review.rating >= index + 1 ? "#c9a227" : "#e4e5e9"}
                    size={12}
                  />
                ))}
              </div>
              <p>{review.createdAt.substring(0, 10)}</p>
              <p>{review.comment}</p>
            </li>
          ))}
        </ul>

        <div style={{ marginTop: "2rem" }}>
          <h3>Écrire un avis client</h3>
          {userInfo ? (
            <form onSubmit={submitHandler}>
              <div className="form-group">
                <label style={{ display: "block", marginBottom: "0.5rem" }}>
                  Note
                </label>
                <div className="star-rating-input">
                  {[...Array(5)].map((_, index) => {
                    const ratingValue = index + 1;
                    return (
                      <FaStar
                        key={index}
                        size={24}
                        className="star-icon"
                        color={
                          ratingValue <= (hover || rating)
                            ? "#c9a227"
                            : "#e4e5e9"
                        }
                        onMouseEnter={() => setHover(ratingValue)}
                        onMouseLeave={() => setHover(0)}
                        onClick={() => setRating(ratingValue)}
                        style={{ cursor: "pointer", marginRight: 5 }}
                      />
                    );
                  })}
                </div>
                <span
                  style={{
                    fontSize: "0.9rem",
                    color: "#666",
                    marginLeft: "10px",
                  }}
                >
                  {rating ? `${rating} Étoiles` : ""}
                </span>
              </div>

              <div className="form-group" style={{ marginTop: "1rem" }}>
                <label>Commentaire (optionnel)</label>
                <textarea
                  rows="3"
                  value={comment}
                  onChange={(e) => setComment(e.target.value)}
                  placeholder="Partagez votre expérience avec ce produit..."
                ></textarea>
              </div>
              <div style={{ display: "flex", gap: "10px" }}>
                <button type="submit" className="btn btn-primary">
                  {userReview ? "Mettre à jour l'avis" : "Soumettre l'avis"}
                </button>
                {userReview && (
                  <button
                    type="button"
                    className="btn btn-outline"
                    style={{ borderColor: "red", color: "red" }}
                    onClick={deleteReviewHandler}
                  >
                    Supprimer l'avis
                  </button>
                )}
              </div>
            </form>
          ) : (
            <p>
              Veuillez{" "}
              <Link to="/login" style={{ textDecoration: "underline" }}>
                vous connecter
              </Link>{" "}
              pour écrire un avis
            </p>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProductScreen;
