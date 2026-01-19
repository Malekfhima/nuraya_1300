import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import axios from 'axios';
import './PackingSlipScreen.css';

const PackingSlipScreen = () => {
    const { id } = useParams();
    const [order, setOrder] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {
        const fetchOrder = async () => {
            try {
                const userInfo = JSON.parse(localStorage.getItem('userInfo'));
                const config = {
                    headers: { Authorization: `Bearer ${userInfo.token}` },
                };
                const { data } = await axios.get(`/api/orders/${id}`, config);
                setOrder(data);
                setLoading(false);
            } catch (err) {
                setError(err.message);
                setLoading(false);
            }
        };
        fetchOrder();
    }, [id]);

    const printHandler = () => {
        window.print();
    };

    if (loading) return <div className="loader-container"><div className="spinner"></div></div>;
    if (error) return <div className="error-message">{error}</div>;

    return (
        <div className="packing-slip-page">
            <div className="no-print actions-bar">
                <Link to="/admin/orders" className="btn btn-outline">Retour</Link>
                <button onClick={printHandler} className="btn btn-primary">Imprimer le Bon de Livraison</button>
            </div>

            <div className="packing-slip-container" id="printable-area">
                <header className="ps-header">
                    <div className="ps-logo">
                        <h1>NURAYA</h1>
                        <span>ÉLÉGANCE & EXCELLENCE</span>
                    </div>
                    <div className="ps-title">
                        <h2>BON DE LIVRAISON</h2>
                        <p>Commande #{order._id.toUpperCase()}</p>
                    </div>
                </header>

                <div className="ps-info-grid">
                    <div className="ps-info-block">
                        <h3>Expéditeur</h3>
                        <strong>NURAYA Store</strong>
                        <p>Tunis, Tunisie</p>
                        <p>Email: contact@nuraya.tn</p>
                        <p>Tél: +216 22 000 000</p>
                    </div>
                    <div className="ps-info-block">
                        <h3>Destinataire</h3>
                        <strong>{order.shippingAddress.fullName || order.user.name}</strong>
                        <p>{order.shippingAddress.address}</p>
                        <p>{order.shippingAddress.city}, {order.shippingAddress.postalCode}</p>
                        <p>Pays: {order.shippingAddress.country}</p>
                        <p>Tél: {order.shippingAddress.phone || 'N/A'}</p>
                    </div>
                </div>

                <div className="ps-meta">
                    <div className="ps-meta-item">
                        <span>Date de Commande:</span>
                        <strong>{new Date(order.createdAt).toLocaleDateString('fr-FR')}</strong>
                    </div>
                    <div className="ps-meta-item">
                        <span>Méthode de Paiement:</span>
                        <strong>{order.paymentMethod}</strong>
                    </div>
                </div>

                <table className="ps-table">
                    <thead>
                        <tr>
                            <th>PRODUIT</th>
                            <th>RÉFÉRENCE</th>
                            <th className="text-center">QUANTITÉ</th>
                        </tr>
                    </thead>
                    <tbody>
                        {order.orderItems.map((item, index) => (
                            <tr key={index}>
                                <td>
                                    <strong>{item.name}</strong>
                                    {item.size && <p className="item-detail">Taille: {item.size} cm</p>}
                                </td>
                                <td>{item._id.substring(0, 8).toUpperCase()}</td>
                                <td className="text-center">{item.qty}</td>
                            </tr>
                        ))}
                    </tbody>
                </table>

                <div className="ps-footer">
                    <div className="ps-notes">
                        <p>Merci pour votre confiance chez <strong>NURAYA</strong>.</p>
                        <p>Veuillez vérifier le contenu du colis à la livraison.</p>
                    </div>
                </div>
            </div>
        </div>
    );
};

export default PackingSlipScreen;
