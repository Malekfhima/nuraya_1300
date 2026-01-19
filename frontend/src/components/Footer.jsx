import React, { useState } from "react";
import { Link } from "react-router-dom";
import api from "../utils/axios";
import {
  FaInstagram,
  FaFacebook,
  FaTwitter,
  FaPinterest,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhone,
  FaCcVisa,
  FaCcMastercard,
  FaCcAmex
} from "react-icons/fa";
import { toast } from "react-toastify";
import "./Footer.css";

const Footer = () => {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const newsletterHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await api.post("/newsletter", { email });
      toast.success("Merci pour votre inscription !");
      setEmail("");
    } catch (err) {
      toast.error(err.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <footer className="footer">
      <div className="container">
        <div className="footer-grid">
          <div className="footer-brand">
            <Link to="/" className="logo">
              NURAYA
            </Link>
            <p>
              Façonnée par l'élégance et guidée par l'excellence. Nuraya
              redéfinit le luxe moderne à travers des pièces intemporelles
              conçues pour l'autonomie et l'expression de soi.
            </p>
            <div style={{ marginTop: "2rem" }}>
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <FaMapMarkerAlt size={14} color="var(--primary)" /> Avenue Habib
                Bourguiba, Tunis
              </p>
              <p
                style={{
                  display: "flex",
                  alignItems: "center",
                  gap: "10px",
                  marginBottom: "10px",
                }}
              >
                <FaPhone size={14} color="var(--primary)" /> (+216) 53 104 037
              </p>
              <p style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <FaEnvelope size={14} color="var(--primary)" />{" "}
                <a href="mailto:contact@nuraya.com">contact@nuraya.com</a>
              </p>
            </div>
          </div>

          <div className="footer-column">
            <h3>Boutique</h3>
            <ul className="footer-links">
              <li>
                <Link to="/shop">Nouvelle Collection</Link>
              </li>
              <li>
                <Link to="/shop">Montres de Luxe</Link>
              </li>
              <li>
                <Link to="/shop">Accessoires</Link>
              </li>
              <li>
                <Link to="/shop">Éditions Limitées</Link>
              </li>
            </ul>
          </div>

          <div className="footer-column">
            <h3>Informations</h3>
            <ul className="footer-links">
              <li>
                <Link to="/about">Notre Histoire</Link>
              </li>
              <li>
                <Link to="/contact">Contactez-nous</Link>
              </li>
              <li>
                <Link to="/shipping">Livraison & Retours</Link>
              </li>
              <li>
                <Link to="/privacy">Politique de Confidentialité</Link>
              </li>
            </ul>
          </div>

          <div className="footer-newsletter">
            <h3>Newsletter</h3>
            <p>
              Inscrivez-vous pour recevoir nos actualités exclusives et
              invitations aux lancements privés.
            </p>
            <form className="newsletter-form" onSubmit={newsletterHandler}>
              <input
                type="email"
                placeholder="Votre adresse email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
              />
              <button
                type="submit"
                className="btn-subscribe"
                disabled={loading}
              >
                {loading ? "..." : <FaEnvelope />}
              </button>
            </form>
            <div className="social-links">
              <a href="https://www.instagram.com/_nuraya__?igsh=MTNmOG4ybWRldm5xYw==" target="_blank" rel="noopener noreferrer">
                <FaInstagram />
              </a>
              <a href="https://m.facebook.com/61560894352497/" target="_blank" rel="noopener noreferrer">
                <FaFacebook />
              </a>
              {/* <a href="#" target="_blank" rel="noopener noreferrer">
                <FaTwitter />
              </a>
              <a href="#" target="_blank" rel="noopener noreferrer">
                <FaPinterest />
              </a> */}
            </div>
            {/* <div className="payment-icons">
              <FaCcVisa size={24} title="Visa" />
              <FaCcMastercard size={24} title="Mastercard" />
              <FaCcAmex size={24} title="American Express" />
            </div> */}
          </div>
        </div>

        <div className="footer-bottom">
          <div className="copyright">
            &copy; {new Date().getFullYear()} Nuraya. Tous droits réservés.
          </div>
          <div className="payment-methods">
            <span
              style={{
                fontSize: "0.7rem",
                textTransform: "uppercase",
                letterSpacing: "1px",
              }}
            >
              Paiement à la livraison
            </span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;