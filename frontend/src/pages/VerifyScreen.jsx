import React, { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import api from '../utils/axios';
import { toast } from 'react-toastify';
import './AuthScreen.css';

const VerifyScreen = () => {
    const navigate = useNavigate();
    const { search } = useLocation();
    const email = new URLSearchParams(search).get('email') || '';
    const [code, setCode] = useState('');
    const [loading, setLoading] = useState(false);

    useEffect(() => {
        if (!email) {
            navigate('/register');
        }
    }, [email, navigate]);

    const submitHandler = async (e) => {
        e.preventDefault();
        setLoading(true);
        try {
            const { data } = await api.post('/users/verify', { email, code });
            toast.success(data.message);
            navigate('/login');
        } catch (err) {
            toast.error(err.response && err.response.data.message ? err.response.data.message : err.message);
            setLoading(false);
        }
    };

    return (
        <div className="auth-container">
            <div className="auth-card" style={{ textAlign: 'center' }}>
                <h2>Vérification du compte</h2>
                <p className="auth-subtitle">Nous avons envoyé un code de 6 chiffres à <strong>{email}</strong></p>
                
                <form onSubmit={submitHandler} style={{ marginTop: '2rem' }}>
                    <div className="form-group">
                        <label htmlFor="code">Code de vérification</label>
                        <input 
                            type="text" 
                            id="code" 
                            placeholder="000000" 
                            maxLength="6"
                            style={{ 
                                textAlign: 'center', 
                                fontSize: '24px', 
                                letterSpacing: '8px',
                                fontWeight: 'bold'
                            }}
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                        />
                    </div>

                    <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                        {loading ? 'Vérification...' : 'Vérifier mon compte'}
                    </button>
                </form>

                <div className="auth-footer">
                    Vous n'avez pas reçu de code ? <a href="#" onClick={(e) => {
                        e.preventDefault();
                        toast.info("Une nouvelle demande d'inscription renverra un code.");
                    }}>Renvoyer</a>
                </div>
            </div>
        </div>
    );
};

export default VerifyScreen;
