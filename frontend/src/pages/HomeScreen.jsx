import React, { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import Product from "../components/Product";
import "./HomeScreen.css";

const CategorySlider = ({ categoryName, images, link }) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [isHovered, setIsHovered] = useState(false);

  useEffect(() => {
    if (images.length <= 1 || isHovered) return;
    const intervalId = setInterval(() => {
      setCurrentImageIndex((prevIndex) => (prevIndex + 1) % images.length);
    }, 4000); // 4 seconds interval
    return () => clearInterval(intervalId);
  }, [images.length, isHovered]);

  return (
    <Link
      to={link}
      className="category-card"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <div className="category-image">
        {images.length > 0 ? (
          images.map((img, index) => (
            <img
              key={index}
              src={img}
              alt={categoryName}
              className={index === currentImageIndex ? "active" : ""}
              style={{ animationPlayState: isHovered ? "paused" : "running" }}
            />
          ))
        ) : (
          <div className="category-placeholder">NURAYA</div>
        )}
        <div className="category-overlay">
          <h3 className="category-name">{categoryName}</h3>
          <span className="category-discover">Découvrir</span>
        </div>
      </div>
    </Link>
  );
};

const HomeScreen = () => {
  const [products, setProducts] = useState([]);
  const [topProducts, setTopProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    const fetchHomeData = async () => {
      try {
        const [prodRes, topRes, catRes] = await Promise.all([
          api.get("/products"),
          api.get("/products/top"),
          api.get("/categories"),
        ]);
        setProducts(prodRes.data.products);
        setTopProducts(topRes.data);
        setCategories(catRes.data);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };

    fetchHomeData();
  }, []);

  const getCategoryImages = (catName) => {
    return products
      .filter((p) => p.category.toLowerCase() === catName.toLowerCase())
      .map((p) => p.image);
  };

  return (
    <div className="home-screen">
      <div className="hero-banner">
        <div className="hero-content">
          <h1 className="fade-in">L'Expérience du Luxe</h1>
          <p className="fade-in">
            Découvrez notre collection exclusive de montres et accessoires
            premium.
          </p>
          <Link to="/shop" className="btn btn-primary slide-up">
            Acheter Maintenant
          </Link>
        </div>
      </div>

      <div className="container" id="shop">
        <h2 className="section-title fade-in">Les Incontournables</h2>
        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
        ) : (
          <div className="product-grid" style={{ marginBottom: "5rem" }}>
            {topProducts.map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        )}

        <h2 className="section-title fade-in">Explorer nos Collections</h2>
        <div className="category-grid">
          {categories.map((cat) => (
            <CategorySlider
              key={cat._id}
              categoryName={cat.name}
              images={getCategoryImages(cat.name)}
              link={`/shop?category=${cat.name}`}
            />
          ))}
        </div>

        <h2 className="section-title fade-in">Nouveautés</h2>
        {loading ? (
          <div className="loader-container">
            <div className="spinner"></div>
          </div>
        ) : error ? (
          <div className="error-message">{error}</div>
        ) : (
          <div className="product-grid">
            {products.slice(0, 4).map((product) => (
              <Product key={product._id} product={product} />
            ))}
          </div>
        )}
        <div className="text-center" style={{ marginBottom: "4rem" }}>
          <Link
            to="/shop"
            className="btn btn-outline slide-up"
            style={{ padding: "12px 30px" }}
          >
            Voir Toute la Boutique
          </Link>
        </div>
      </div>

      {/* <div className="why-choose-us">
        <div className="container">
           <div className="benefits-grid">
              <div className="benefit-item fade-in">
                 <div className="benefit-icon">✨</div>
                 <h3>Artisanat d'Excellence</h3>
                 <p>Chaque pièce est sélectionnée pour sa qualité supérieure et son design exceptionnel.</p>
              </div>
              <div className="benefit-item fade-in">
                 <div className="benefit-icon">🚚</div>
                 <h3>Livraison Gratuite</h3>
                 <p>Profitez de la livraison gratuite sur toutes les commandes de plus de 200 DT.</p>
              </div>
              <div className="benefit-item fade-in">
                 <div className="benefit-icon">🛡️</div>
                 <h3>Paiement Sécurisé</h3>
                 <p>Paiement à la livraison ou via nos partenaires de paiement hautement sécurisés.</p>
              </div>
              <div className="benefit-item fade-in">
                 <div className="benefit-icon">💎</div>
                 <h3>Garantie Premium</h3>
                 <p>Tous nos produits bénéficient d'une garantie d'authenticité et de satisfaction totale.</p>
              </div>
           </div>
        </div>
      </div> */}
    </div>
  );
};

export default HomeScreen;
