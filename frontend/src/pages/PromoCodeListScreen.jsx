import React, { useState, useEffect, useContext } from "react";
import axios from "axios";
import { toast } from "react-toastify";
import { FaTrash, FaPlus, FaToggleOn, FaToggleOff } from "react-icons/fa";
import AdminLayout from "../components/AdminLayout";
import { Store } from "../context/StoreContext";

const PromoCodeListScreen = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);
  
  // New Promo Code Form
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [isActive, setIsActive] = useState(true);

  const { state } = useContext(Store);
  const { userInfo } = state;

  const fetchPromoCodes = async () => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      const { data } = await axios.get("/api/promocodes", config);
      setPromoCodes(data);
      setLoading(false);
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchPromoCodes();
  }, [userInfo]);

  const createHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      await axios.post("/api/promocodes", { code, discountPercentage, isActive }, config);
      toast.success("Code promo créé avec succès");
      setCode("");
      setDiscountPercentage("");
      setIsActive(true);
      fetchPromoCodes();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const deleteHandler = async (id) => {
    if (window.confirm("Voulez-vous vraiment supprimer ce code promo ?")) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        await axios.delete(`/api/promocodes/${id}`, config);
        toast.success("Code promo supprimé");
        fetchPromoCodes();
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  const toggleActiveHandler = async (promo) => {
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };
      await axios.put(`/api/promocodes/${promo._id}`, { isActive: !promo.isActive }, config);
      toast.success(`Code promo ${!promo.isActive ? 'activé' : 'désactivé'}`);
      fetchPromoCodes();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  return (
    <AdminLayout activePage="promocodes">
      <header className="admin-header">
        <h1>Codes Promotionnels</h1>
      </header>

      <div className="auth-card" style={{ maxWidth: '100%', marginBottom: '2rem' }}>
        <h3>Ajouter un nouveau code promo</h3>
        <form onSubmit={createHandler} style={{ display: 'flex', gap: '15px', alignItems: 'flex-end', flexWrap: 'wrap' }}>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
            <label>Code (ex: SUMMER20)</label>
            <input 
              type="text" 
              value={code} 
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Entrez le code"
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: 0, flex: 1, minWidth: '200px' }}>
            <label>Réduction (%)</label>
            <input 
              type="number" 
              min="1" max="100"
              value={discountPercentage} 
              onChange={(e) => setDiscountPercentage(e.target.value)}
              placeholder="Ex: 20"
              required 
            />
          </div>
          <div className="form-group" style={{ marginBottom: '10px' }}>
            <label style={{ display: "flex", alignItems: "center", gap: "10px", cursor: "pointer", height: '100%' }}>
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                style={{ width: "auto" }}
              />
              Actif
            </label>
          </div>
          <button type="submit" className="btn btn-primary" style={{ padding: '12px 20px', height: '45px' }}>
            <FaPlus /> Ajouter
          </button>
        </form>
      </div>

      {loading ? (
        <p>Chargement...</p>
      ) : (
        <div className="table-responsive">
          <table className="admin-table">
            <thead>
              <tr>
                <th>CODE</th>
                <th>RÉDUCTION</th>
                <th>STATUT</th>
                <th>DATE CRÉATION</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((promo) => (
                <tr key={promo._id}>
                  <td style={{ fontWeight: 'bold', letterSpacing: '1px' }}>{promo.code}</td>
                  <td><span style={{ backgroundColor: '#e74c3c', color: 'white', padding: '3px 8px', borderRadius: '4px', fontWeight: 'bold' }}>-{promo.discountPercentage}%</span></td>
                  <td>
                    <span 
                      style={{ 
                        color: promo.isActive ? '#28a745' : '#dc3545',
                        fontWeight: '600',
                        fontSize: '0.9rem'
                      }}
                    >
                      {promo.isActive ? 'Actif' : 'Inactif'}
                    </span>
                  </td>
                  <td>{promo.createdAt.substring(0, 10)}</td>
                  <td>
                    <button
                      className="action-btn"
                      onClick={() => toggleActiveHandler(promo)}
                      title={promo.isActive ? 'Désactiver' : 'Activer'}
                      style={{ 
                        background: promo.isActive ? '#ffc107' : '#28a745',
                        border: 'none',
                        marginRight: '8px'
                      }}
                    >
                      {promo.isActive ? <FaToggleOff /> : <FaToggleOn />}
                    </button>
                    <button
                      className="action-btn btn-delete"
                      onClick={() => deleteHandler(promo._id)}
                    >
                      <FaTrash />
                    </button>
                  </td>
                </tr>
              ))}
              {promoCodes.length === 0 && (
                <tr>
                  <td colSpan="5" style={{ textAlign: 'center', padding: '2rem' }}>
                    Aucun code promotionnel trouvé.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </AdminLayout>
  );
};

export default PromoCodeListScreen;
