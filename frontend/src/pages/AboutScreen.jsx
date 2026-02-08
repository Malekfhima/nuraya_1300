import React from 'react';
import { FaGem, FaHeart, FaLeaf, FaStar, FaShieldAlt, FaHandHoldingHeart, FaUsers, FaAward, FaRecycle, FaMapMarkerAlt, FaPhone, FaEnvelope } from 'react-icons/fa';
import './AboutScreen.css';

const AboutScreen = () => {
  return (
    <div className="about-screen">
      <div className="about-hero">
        <div className="container">
          <span className="hero-subtitle">Depuis 2026</span>
          <h1>L'Art de l'Élégance Intemporelle</h1>
          <p className="hero-description">
            Où le raffinement rencontre l'authenticité
          </p>
        </div>
      </div>

      <div className="container about-content">
        {/* Brand Story */}
        <section className="story-section">
          <div className="story-grid">
            <div className="story-text">
              <span className="section-label">Notre Histoire</span>
              <h2>Une Vision de Luxe Accessible</h2>
              <p>
                Fondée en 2026 à Tunis, <strong>NURAYA</strong> est née d'une passion pour l'élégance intemporelle 
                et le désir de rendre le luxe authentique accessible à toutes les femmes tunisiennes qui apprécient 
                la qualité et le raffinement.
              </p>
              <p>
                Inspirée par l'esthétique "Old Money" — sobre, durable et sophistiquée — notre marque 
                célèbre la femme moderne qui valorise l'authenticité plutôt que l'ostentation, 
                la qualité plutôt que la quantité. Nous combinons l'héritage artisanal tunisien 
                avec des designs internationaux pour créer des pièces uniques.
              </p>
              <p>
                Chaque pièce de notre collection est soigneusement sélectionnée pour incarner 
                l'élégance discrète et le savoir-faire exceptionnel qui définissent le véritable luxe.
              </p>
            </div>
            <div className="story-image">
              <div className="image-placeholder">
                <FaGem size={80} color="var(--primary)" />
              </div>
            </div>
          </div>
        </section>

        {/* Timeline Section */}
        <section className="timeline-section">
          <div className="section-header">
            <span className="section-label">Notre Parcours</span>
            <h2>Milestones Importants</h2>
          </div>
          
          <div className="timeline">
            <div className="timeline-item">
              <div className="timeline-marker">2026</div>
              <div className="timeline-content">
                <h3>Fondation de NURAYA</h3>
                <p>Lancement officiel de la marque avec une collection de 50 pièces uniques</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker">2027</div>
              <div className="timeline-content">
                <h3>Expansion Nationale</h3>
                <p>Ouverture de notre première boutique physique à Tunis et partenariat avec 15 artisans locaux</p>
              </div>
            </div>
            
            <div className="timeline-item">
              <div className="timeline-marker">2028</div>
              <div className="timeline-content">
                <h3>Reconnaissance Internationale</h3>
                <p>Présence dans 3 salons internationaux de mode et collaboration avec des designers européens</p>
              </div>
            </div>
          </div>
        </section>

        {/* Team Section */}
        <section className="team-section">
          <div className="section-header">
            <span className="section-label">Notre Équipe</span>
            <h2>Les Visages derrière NURAYA</h2>
          </div>
          
          <div className="team-grid">
            <div className="team-member">
              <div className="member-avatar">
                <FaUsers size={40} />
              </div>
              <h3>Amira Ben Salah</h3>
              <p className="member-role">Fondatrice & Directrice Créative</p>
              <p className="member-bio">Designer de mode diplômée de l'École de la Cambre à Bruxelles, passionnée par fusionner l'artisanat tunisien avec l'élégance européenne.</p>
            </div>
            
            <div className="team-member">
              <div className="member-avatar">
                <FaAward size={40} />
              </div>
              <h3>Khalil Miled</h3>
              <p className="member-role">Directeur Artistique</p>
              <p className="member-bio">Expert en design de bijoux avec 15 ans d'expérience, spécialisé dans la création de pièces intemporelles inspirées de l'architecture mauresque.</p>
            </div>
            
            <div className="team-member">
              <div className="member-avatar">
                <FaRecycle size={40} />
              </div>
              <h3>Sarah Toumi</h3>
              <p className="member-role">Responsable Durabilité</p>
              <p className="member-bio">Chimiste spécialisée en matériaux durables, garantissant que chaque produit respecte nos standards environnementaux stricts.</p>
            </div>
          </div>
        </section>

        {/* Values Section */}
        <section className="values-section">
          <div className="section-header">
            <span className="section-label">Nos Valeurs</span>
            <h2>Ce Qui Nous Définit</h2>
          </div>
          
          <div className="values-grid">
            <div className="value-card">
              <div className="value-icon">
                <FaLeaf />
              </div>
              <h3>Durabilité</h3>
              <p>
                Nous nous engageons pour un approvisionnement éthique et une mode durable. 
                Chaque produit est choisi pour sa qualité exceptionnelle et sa longévité.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaHeart />
              </div>
              <h3>Authenticité</h3>
              <p>
                Le luxe véritable réside dans l'authenticité. Nous valorisons la transparence 
                et l'honnêteté dans chaque aspect de notre activité.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaStar />
              </div>
              <h3>Excellence</h3>
              <p>
                Nous ne faisons aucun compromis sur la qualité. Chaque article est sélectionné 
                selon les standards les plus élevés de savoir-faire et de design.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaShieldAlt />
              </div>
              <h3>Intégrité</h3>
              <p>
                Transparence dans nos prix, nos matériaux et nos pratiques commerciales. 
                Nous honorons la confiance que vous nous accordez.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaHandHoldingHeart />
              </div>
              <h3>Service Client</h3>
              <p>
                Votre satisfaction est notre priorité. Nous offrons un service personnalisé 
                et attentionné à chaque étape de votre expérience.
              </p>
            </div>

            <div className="value-card">
              <div className="value-icon">
                <FaGem />
              </div>
              <h3>Raffinement</h3>
              <p>
                Nous célébrons l'élégance discrète et le bon goût. Chaque détail compte 
                dans la création d'une expérience luxueuse.
              </p>
            </div>
          </div>
        </section>

        {/* Statistics Section */}
        <section className="stats-section">
          <div className="stats-grid">
            <div className="stat-item">
              <div className="stat-number">5000+</div>
              <div className="stat-label">Clients Satisfaits</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">150+</div>
              <div className="stat-label">Pièces Uniques</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">25+</div>
              <div className="stat-label">Artisans Partenaires</div>
            </div>
            <div className="stat-item">
              <div className="stat-number">98%</div>
              <div className="stat-label">Satisfaction Client</div>
            </div>
          </div>
        </section>

        {/* Philosophy Section */}
        <section className="philosophy-section">
          <div className="philosophy-content">
            <span className="section-label">Notre Philosophie</span>
            <h2>L'Élégance au Quotidien</h2>
            <p className="philosophy-text">
              Chez NURAYA, nous croyons que le véritable luxe n'est pas une question de prix, 
              mais de qualité, d'authenticité et d'intemporalité. Nous nous inspirons de l'élégance 
              discrète de l'ancien monde tout en embrassant la modernité et l'innovation.
            </p>
            <p className="philosophy-text">
              Notre mission est de vous offrir des pièces exceptionnelles qui transcendent les tendances 
              éphémères et deviennent des compagnons fidèles de votre style personnel. Chaque article 
              est une invitation à célébrer votre propre élégance, votre confiance et votre individualité.
            </p>
          </div>
        </section>

        {/* Contact Info */}
        <section className="contact-section">
          <div className="section-header">
            <span className="section-label">Nous Contacter</span>
            <h2>Restons Connectés</h2>
          </div>
          
          <div className="contact-grid">
            <div className="contact-method">
              <div className="contact-icon">
                <FaMapMarkerAlt />
              </div>
              <h3>Adresse</h3>
              <p>15 Avenue Habib Bourguiba<br/>Tunis, 1000<br/>Tunisie</p>
            </div>
            
            <div className="contact-method">
              <div className="contact-icon">
                <FaPhone />
              </div>
              <h3>Téléphone</h3>
              <p>+216 71 123 456<br/>+216 29 876 543</p>
            </div>
            
            <div className="contact-method">
              <div className="contact-icon">
                <FaEnvelope />
              </div>
              <h3>Email</h3>
              <p><a href="mailto:contact@nuraya.tn">contact@nuraya.tn</a></p>
            </div>
          </div>
        </section>

        {/* Quote Section */}
        <section className="quote-section">
          <div className="quote-ornament">❝</div>
          <blockquote>
            L'élégance, c'est quand l'intérieur est aussi beau que l'extérieur.
          </blockquote>
          <cite>— Coco Chanel</cite>
        </section>

        {/* Promise Section */}
        <section className="promise-section">
          <div className="promise-grid">
            <div className="promise-item">
              <h4>Qualité Garantie</h4>
              <p>Chaque produit est rigoureusement sélectionné pour sa qualité exceptionnelle</p>
            </div>
            <div className="promise-item">
              <h4>Livraison Sécurisée</h4>
              <p>Vos commandes sont traitées avec soin et livrées en toute sécurité</p>
            </div>
            <div className="promise-item">
              <h4>Service Personnalisé</h4>
              <p>Notre équipe est à votre écoute pour vous accompagner dans vos choix</p>
            </div>
            <div className="promise-item">
              <h4>Satisfaction Client</h4>
              <p>Votre bonheur est notre réussite, nous nous engageons à vous satisfaire</p>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
};

export default AboutScreen;