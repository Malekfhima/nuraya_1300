import React, { useState } from 'react';
import api from '../utils/axios';
import { toast } from 'react-toastify';
import { useParams, useNavigate } from 'react-router-dom';
import './AuthScreen.css';

const ResetPasswordScreen = () => {
  const navigate = useNavigate();
  const { token } = useParams();
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();
    if (password !== confirmPassword) {
      toast.error('Les mots de passe ne correspondent pas');
      return;
    }
    setLoading(true);
    try {
      const { data } = await api.put(`/users/resetpassword/${token}`, { password });
      toast.success(data.message);
      navigate('/login');
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2>Réinitialiser le mot de passe</h2>
        <p className="auth-subtitle">Entrez votre nouveau mot de passe ci-dessous</p>
        
        <form onSubmit={submitHandler}>
          <div className="form-group">
            <label htmlFor="password">Nouveau mot de passe</label>
            <input 
              type="password" 
              id="password" 
              placeholder="Entrez le nouveau mot de passe" 
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="confirmPassword">Confirmer le nouveau mot de passe</label>
            <input 
              type="password" 
              id="confirmPassword" 
              placeholder="Confirmez le nouveau mot de passe" 
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
            {loading ? 'Réinitialisation...' : 'Réinitialiser le mot de passe'}
          </button>
        </form>
      </div>
    </div>
  );
};

export default ResetPasswordScreen;
