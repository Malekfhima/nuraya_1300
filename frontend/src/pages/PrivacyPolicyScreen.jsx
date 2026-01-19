import React from 'react';
import './PrivacyPolicyScreen.css';

const PrivacyPolicyScreen = () => {
  return (
    <div className="privacy-policy-screen">
      <div className="container">
        <div className="privacy-content">
          <h1 className="page-title">Politique de Confidentialité</h1>
          
          <section className="policy-section">
            <h2>1. Introduction</h2>
            <p>
              La présente politique de confidentialité régit la manière dont Nuraya collecte, 
              utilise, conserve et divulgue les informations recueillies auprès des utilisateurs 
              de son site web et de ses services.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>2. Informations que nous collectons</h2>
            <p>Nous pouvons collecter les types d'informations suivants :</p>
            <ul>
              <li>Informations personnelles telles que nom, prénom, adresse électronique, numéro de téléphone</li>
              <li>Informations de connexion comme l'adresse IP, le type de navigateur, le fournisseur de services Internet</li>
              <li>Informations relatives aux achats et préférences de navigation</li>
              <li>Informations concernant vos interactions avec nos services</li>
            </ul>
          </section>
          
          <section className="policy-section">
            <h2>3. Utilisation de vos informations</h2>
            <p>Nous utilisons vos informations pour :</p>
            <ul>
              <li>Traiter et gérer vos commandes</li>
              <li>Fournir un service client efficace</li>
              <li>Personnaliser votre expérience utilisateur</li>
              <li>Vous envoyer des communications marketing (avec votre consentement)</li>
              <li>Améliorer nos services et produits</li>
              <li>Prévenir la fraude et assurer la sécurité</li>
            </ul>
          </section>
          
          <section className="policy-section">
            <h2>4. Partage de vos informations</h2>
            <p>
              Nous ne vendons, ne louons ni ne commercialisons pas vos informations personnelles. 
              Nous pouvons partager vos informations avec :
            </p>
            <ul>
              <li>Fournisseurs de services tiers qui nous aident dans nos opérations</li>
              <li>Autorités légales lorsque cela est requis par la loi</li>
              <li>Partenaires de livraison pour traiter les commandes</li>
            </ul>
          </section>
          
          <section className="policy-section">
            <h2>5. Sécurité de vos informations</h2>
            <p>
              Nous mettons en œuvre des mesures de sécurité appropriées pour protéger vos 
              informations personnelles contre tout accès non autorisé, altération, divulgation 
              ou destruction.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>6. Vos droits</h2>
            <p>Vous avez le droit de :</p>
            <ul>
              <li>Accéder à vos informations personnelles</li>
              <li>Demander la correction de vos informations inexactes</li>
              <li>Demander la suppression de vos informations</li>
              <li>Retirer votre consentement à tout moment</li>
              <li>Portabilité des données dans certains cas</li>
            </ul>
          </section>
          
          <section className="policy-section">
            <h2>7. Cookies</h2>
            <p>
              Nous utilisons des cookies pour améliorer votre expérience de navigation, 
              analyser le trafic et vous proposer un contenu personnalisé. 
              Vous pouvez contrôler l'utilisation des cookies via les paramètres de votre navigateur.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>8. Modifications de cette politique</h2>
            <p>
              Nous pouvons modifier cette politique de confidentialité à tout moment. 
              Les modifications seront publiées sur cette page avec la date d'entrée en vigueur.
            </p>
          </section>
          
          <section className="policy-section">
            <h2>9. Contact</h2>
            <p>
              Si vous avez des questions concernant cette politique de confidentialité, 
              veuillez nous contacter à contact@nuraya.tn
            </p>
          </section>
        </div>
      </div>
    </div>
  );
};

export default PrivacyPolicyScreen;