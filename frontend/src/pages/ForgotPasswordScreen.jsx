import React, { useState } from 'react';
import api from '../utils/axios';
import { toast } from 'react-toastify';
import { Link } from 'react-router-dom';
import './AuthScreen.css';

const ForgotPasswordScreen = () => {
  const [email, setEmail] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      const { data } = await api.post('/users/forgotpassword', { email });
      toast.success(data.message);
      setLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Mot de passe oublié</h2>
        <p className="auth-subtitle">Entrez votre adresse e-mail pour recevoir un lien de réinitialisation</p>
        
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

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Envoi en cours...' : 'Envoyer le lien'}
          </button>
        </form>

        <div className="auth-footer">
          <Link to="/login">Retour à la connexion</Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPasswordScreen;
