import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa"; // Imported icons
import api from "../utils/axios";
import { Store } from "../context/StoreContext";
import "./AuthScreen.css";

const LoginScreen = () => {
  const navigate = useNavigate();
  const { search } = useLocation();
  const redirectInUrl = new URLSearchParams(search).get("redirect");
  const redirect = redirectInUrl ? redirectInUrl : "/";

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false); // State for toggle

  const { state, dispatch: ctxDispatch } = useContext(Store);
  const { userInfo } = state;

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const { data } = await api.post("/users/login", {
        email,
        password,
      });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      navigate(redirect || "/");
    } catch (error) {
      toast.error(
        error.response?.data?.message || "Email ou mot de passe invalide",
      );
    }
  };

  const googleClientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  const handleCredentialResponse = async (response) => {
    if (!response?.credential) return;
    try {
      const { data } = await api.post("/users/google", { idToken: response.credential });
      ctxDispatch({ type: "USER_SIGNIN", payload: data });
      navigate(redirect || "/");
    } catch (error) {
      toast.error(error.response?.data?.message || "Erreur lors de la connexion Google");
    }
  };

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

  useEffect(() => {
    const initGoogle = () => {
      if (!window.google) return;
      if (!googleClientId) {
        console.error("VITE_GOOGLE_CLIENT_ID not set");
        return;
      }
      window.google.accounts.id.initialize({
        client_id: googleClientId,
        callback: handleCredentialResponse,
      });
      window.google.accounts.id.renderButton(document.getElementById("g-btn"), {
        theme: "outline",
        size: "large",
      });
    };

    if (window.google) {
      initGoogle();
      return;
    }

    const script = document.createElement("script");
    script.src = "https://accounts.google.com/gsi/client";
    script.async = true;
    script.defer = true;
    script.onload = initGoogle;
    document.body.appendChild(script);

    return () => {
      if (script && script.parentNode) script.parentNode.removeChild(script);
    };
  }, []);

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Bon Retour</h2>
        <p className="auth-subtitle">Veuillez vous connecter pour continuer</p>

        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="email">Adresse Email</label>
            <input
              type="email"
              id="email"
              placeholder="Entrez votre email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Mot de passe</label>
            <div className="password-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                id="password"
                placeholder="Entrez votre mot de passe"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="password-toggle-icon"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? <FaEyeSlash /> : <FaEye />}
              </span>
            </div>
            <div style={{ textAlign: "right", marginTop: "5px" }}>
              <Link to="/forgotpassword" style={{ fontSize: "0.85rem" }}>
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Se connecter
          </button>
          <div style={{ textAlign: 'center', marginTop: '12px' }}>ou</div>
          <div id="g-btn" className="google-btn-wrapper" style={{ display: 'flex', justifyContent: 'center', marginTop: '12px' }} />
        </form>

        <div className="auth-footer">
          Nouveau client ?{" "}
          <Link to={`/register?redirect=${redirect}`}>Créer un compte</Link>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
