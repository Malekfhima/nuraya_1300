import React, { useState, useContext, useEffect } from "react";
import { toast } from "react-toastify";
import { Link, useLocation, useNavigate } from "react-router-dom";
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

  useEffect(() => {
    if (userInfo) {
      navigate(redirect);
    }
  }, [navigate, redirect, userInfo]);

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
            <input
              type="password"
              id="password"
              placeholder="Entrez votre mot de passe"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div style={{ textAlign: "right", marginTop: "5px" }}>
              <Link to="/forgotpassword" style={{ fontSize: "0.85rem" }}>
                Mot de passe oublié ?
              </Link>
            </div>
          </div>

          <button type="submit" className="btn btn-primary btn-block">
            Se connecter
          </button>
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
