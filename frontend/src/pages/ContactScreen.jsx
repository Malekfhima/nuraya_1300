import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from 'axios';
import { FaMapMarkerAlt, FaEnvelope, FaClock, FaPhone } from 'react-icons/fa';
import './ContactScreen.css';

const ContactScreen = () => {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    subject: '',
    message: ''
  });

  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.id]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      await axios.post('/api/contact', formData);
      toast.success("Merci de nous avoir contactés. Nous vous répondrons sous peu.");
      setFormData({ name: '', email: '', subject: '', message: '' });
    } catch (err) {
      toast.error(err.response?.data?.message || "Une erreur est survenue.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="contact-screen">
      <div className="contact-hero">
        <div className="container">
          <span className="hero-subtitle">Restons en Contact</span>
          <h1>Nous Sommes à Votre Écoute</h1>
          <p className="hero-description">
            Notre équipe est ravie de répondre à toutes vos questions
          </p>
        </div>
      </div>

      <div className="container contact-container">
        <div className="contact-grid">
          <div className="contact-info-section">
            <div className="section-label">Informations</div>
            <h2>Comment Nous Joindre</h2>
            <p className="contact-desc">
              Nous restons à votre entière disposition. Que ce soit pour une demande d'information,
              une commande exclusive, ou pour rejoindre le cercle NURAYA.
            </p>
            
            <div className="info-cards">
              <div className="info-card">
                <div className="info-icon">
                  <FaMapMarkerAlt />
                </div>
                <div className="info-content">
                  <h3>Adresse</h3>
                  <p>Avenue Habib Bourguiba<br/>Tunis, Tunisie</p>
                </div>
              </div>
              
              <div className="info-card">
                <div className="info-icon">
                  <FaEnvelope />
                </div>
                <div className="info-content">
                  <h3>Email</h3>
                  <p>contact@nuraya.tn</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <FaPhone />
                </div>
                <div className="info-content">
                  <h3>Téléphone</h3>
                  <p>(+216) 53 104 037</p>
                </div>
              </div>

              <div className="info-card">
                <div className="info-icon">
                  <FaClock />
                </div>
                <div className="info-content">
                  <h3>Horaires</h3>
                  <p>Toujours ouvert</p>
                </div>
              </div>
            </div>
          </div>

          <div className="contact-form-section">
            <div className="form-header">
              <div className="section-label">Formulaire</div>
              <h2>Envoyez-nous un Message</h2>
            </div>
            
            <form onSubmit={handleSubmit} className="contact-form">
              <div className="form-row">
                <div className="form-group">
                  <label htmlFor="name">Nom Complet</label>
                  <input 
                    type="text" 
                    id="name" 
                    value={formData.name} 
                    onChange={handleChange} 
                    placeholder="Votre nom"
                    required 
                  />
                </div>
                
                <div className="form-group">
                  <label htmlFor="email">Adresse Email</label>
                  <input 
                    type="email" 
                    id="email" 
                    value={formData.email} 
                    onChange={handleChange} 
                    placeholder="votre@email.com"
                    required 
                  />
                </div>
              </div>

              <div className="form-group">
                <label htmlFor="subject">Sujet</label>
                <input 
                  type="text" 
                  id="subject" 
                  value={formData.subject} 
                  onChange={handleChange} 
                  placeholder="Objet de votre message"
                />
              </div>

              <div className="form-group">
                <label htmlFor="message">Message</label>
                <textarea 
                  id="message" 
                  rows="6" 
                  value={formData.message} 
                  onChange={handleChange} 
                  placeholder="Écrivez votre message ici..."
                  required
                ></textarea>
              </div>

              <button type="submit" className="btn btn-primary btn-block" disabled={loading}>
                {loading ? 'Envoi en cours...' : 'Envoyer le Message'}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactScreen;
