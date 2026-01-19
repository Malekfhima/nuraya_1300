import React, { useContext, useState } from "react";
import { useNavigate } from "react-router-dom";
import { Store } from "../context/StoreContext";
import "./AuthScreen.css";

const ShippingScreen = () => {
  const navigate = useNavigate();
  const { state, dispatch: ctxDispatch } = useContext(Store);
  const {
    cart: { shippingAddress },
  } = state;

  const [fullName, setFullName] = useState(shippingAddress.fullName || "");
  const [address, setAddress] = useState(shippingAddress.address || "");
  const [phone, setPhone] = useState(shippingAddress.phone || "");
  const [city, setCity] = useState(shippingAddress.city || "");
  const [postalCode, setPostalCode] = useState(
    shippingAddress.postalCode || "",
  );
  const [country, setCountry] = useState(shippingAddress.country || "");

  const submitHandler = (e) => {
    e.preventDefault();
    ctxDispatch({
      type: "SAVE_SHIPPING_ADDRESS",
      payload: { fullName, address, city, postalCode, country, phone },
    });
    navigate("/payment");
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="uppercase tracking-wide">Adresse de Livraison</h2>
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label>Nom complet</label>
            <input
              type="text"
              placeholder="Ex: Malek Fhima"
              value={fullName}
              onChange={(e) => setFullName(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Numéro de Téléphone</label>
            <input
              type="tel"
              placeholder="Ex: +216 22 000 000"
              value={phone}
              onChange={(e) => setPhone(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Adresse</label>
            <input
              type="text"
              placeholder="Rue, appartement, etc."
              value={address}
              onChange={(e) => setAddress(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Ville</label>
            <input
              type="text"
              placeholder="Ex: Tunis"
              value={city}
              onChange={(e) => setCity(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Code Postal</label>
            <input
              type="text"
              placeholder="Ex: 1000"
              value={postalCode}
              onChange={(e) => setPostalCode(e.target.value)}
              required
            />
          </div>
          <div className="form-group">
            <label>Pays</label>
            <input
              type="text"
              placeholder="Ex: Tunisie"
              value={country}
              onChange={(e) => setCountry(e.target.value)}
              required
            />
          </div>
          <button
            type="submit"
            className="btn btn-primary btn-block uppercase tracking-wide"
          >
            Continuer vers le Paiement
          </button>
        </form>
      </div>
    </div>
  );
};

export default ShippingScreen;
