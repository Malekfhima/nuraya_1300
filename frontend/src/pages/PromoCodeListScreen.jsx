import React, {
  useState,
  useEffect,
  useContext,
  useCallback,
  useRef,
} from "react";
import axios from "axios";
import { toast } from "react-toastify";
import {
  FaTrash,
  FaPlus,
  FaToggleOn,
  FaToggleOff,
  FaEdit,
} from "react-icons/fa";
import AdminLayout from "../components/AdminLayout";
import { Store } from "../context/StoreContext";

const PromoCodeListScreen = () => {
  const [promoCodes, setPromoCodes] = useState([]);
  const [loading, setLoading] = useState(true);

  // New Promo Code Form
  const [code, setCode] = useState("");
  const [discountPercentage, setDiscountPercentage] = useState("");
  const [isActive, setIsActive] = useState(true);
  const [expirationDate, setExpirationDate] = useState("");

  // Edit mode
  const [editingId, setEditingId] = useState(null);
  const [isEditing, setIsEditing] = useState(false);

  const { state } = useContext(Store);
  const { userInfo } = state;
  const hasFetched = useRef(false);

  const fetchPromoCodes = useCallback(async () => {
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
  }, [userInfo]);

  useEffect(() => {
    if (userInfo && !hasFetched.current) {
      hasFetched.current = true;
      setTimeout(() => fetchPromoCodes(), 0);
    }
  }, [userInfo, fetchPromoCodes]);

  const createHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      };

      if (isEditing) {
        // Update existing promo code
        await axios.put(
          `/api/promocodes/${editingId}`,
          { code, discountPercentage, isActive, expirationDate },
          config,
        );
        toast.success("Code promo mis à jour avec succès");
        setIsEditing(false);
        setEditingId(null);
      } else {
        // Create new promo code
        await axios.post(
          "/api/promocodes",
          { code, discountPercentage, isActive, expirationDate },
          config,
        );
        toast.success("Code promo créé avec succès");
      }

      setCode("");
      setDiscountPercentage("");
      setIsActive(true);
      setExpirationDate("");
      fetchPromoCodes();
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
    }
  };

  const editHandler = (promo) => {
    setCode(promo.code);
    setDiscountPercentage(promo.discountPercentage);
    setIsActive(promo.isActive);
    setExpirationDate(
      promo.expirationDate
        ? new Date(promo.expirationDate).toISOString().split("T")[0]
        : "",
    );
    setEditingId(promo._id);
    setIsEditing(true);
  };

  const cancelEdit = () => {
    setCode("");
    setDiscountPercentage("");
    setIsActive(true);
    setExpirationDate("");
    setEditingId(null);
    setIsEditing(false);
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
      await axios.put(
        `/api/promocodes/${promo._id}`,
        { isActive: !promo.isActive },
        config,
      );
      toast.success(`Code promo ${!promo.isActive ? "activé" : "désactivé"}`);
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

      <div
        className="auth-card"
        style={{ maxWidth: "100%", marginBottom: "2rem" }}
      >
        <h3>
          {isEditing
            ? "Modifier le code promo"
            : "Ajouter un nouveau code promo"}
        </h3>
        <form
          onSubmit={createHandler}
          style={{
            display: "flex",
            gap: "15px",
            alignItems: "flex-end",
            flexWrap: "wrap",
          }}
        >
          <div
            className="form-group"
            style={{ marginBottom: 0, flex: 1, minWidth: "200px" }}
          >
            <label>Code (ex: SUMMER20)</label>
            <input
              type="text"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              placeholder="Entrez le code"
              required
            />
          </div>
          <div
            className="form-group"
            style={{ marginBottom: 0, flex: 1, minWidth: "200px" }}
          >
            <label>Réduction (%)</label>
            <input
              type="number"
              min="1"
              max="100"
              value={discountPercentage}
              onChange={(e) => setDiscountPercentage(e.target.value)}
              placeholder="Ex: 20"
              required
            />
          </div>
          <div
            className="form-group"
            style={{ marginBottom: 0, flex: 1, minWidth: "200px" }}
          >
            <label>Date d'expiration (optionnel)</label>
            <input
              type="date"
              value={expirationDate}
              onChange={(e) => setExpirationDate(e.target.value)}
              min={new Date().toISOString().split("T")[0]}
            />
          </div>
          <div className="form-group" style={{ marginBottom: "10px" }}>
            <label
              style={{
                display: "flex",
                alignItems: "center",
                gap: "10px",
                cursor: "pointer",
                height: "100%",
              }}
            >
              <input
                type="checkbox"
                checked={isActive}
                onChange={(e) => setIsActive(e.target.checked)}
                style={{ width: "auto" }}
              />
              Actif
            </label>
          </div>
          <button
            type="submit"
            className="btn btn-primary"
            style={{ padding: "12px 20px", height: "45px" }}
          >
            <FaPlus /> {isEditing ? "Mettre à jour" : "Ajouter"}
          </button>
          {isEditing && (
            <button
              type="button"
              className="btn btn-secondary"
              onClick={cancelEdit}
              style={{
                padding: "12px 20px",
                height: "45px",
                marginLeft: "10px",
              }}
            >
              Annuler
            </button>
          )}
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
                <th>DATE EXPIRATION</th>
                <th>ACTIONS</th>
              </tr>
            </thead>
            <tbody>
              {promoCodes.map((promo) => (
                <tr key={promo._id}>
                  <td style={{ fontWeight: "bold", letterSpacing: "1px" }}>
                    {promo.code}
                  </td>
                  <td>
                    <span
                      style={{
                        backgroundColor: "#e74c3c",
                        color: "white",
                        padding: "3px 8px",
                        borderRadius: "4px",
                        fontWeight: "bold",
                      }}
                    >
                      -{promo.discountPercentage}%
                    </span>
                  </td>
                  <td>
                    <span
                      style={{
                        color: promo.isActive ? "#28a745" : "#dc3545",
                        fontWeight: "600",
                        fontSize: "0.9rem",
                      }}
                    >
                      {promo.isActive ? "Actif" : "Inactif"}
                    </span>
                  </td>
                  <td>{promo.createdAt.substring(0, 10)}</td>
                  <td>
                    {promo.expirationDate ? (
                      <span
                        style={{
                          color:
                            new Date() > new Date(promo.expirationDate)
                              ? "#dc3545"
                              : "#28a745",
                          fontWeight: "600",
                        }}
                      >
                        {new Date(promo.expirationDate).toLocaleDateString(
                          "fr-FR",
                        )}
                        {new Date() > new Date(promo.expirationDate) &&
                          " (Expiré)"}
                      </span>
                    ) : (
                      <span style={{ color: "#6c757d" }}>Illimitée</span>
                    )}
                  </td>
                  <td>
                    <button
                      className="action-btn"
                      onClick={() => editHandler(promo)}
                      title="Modifier"
                      style={{
                        background: "#17a2b8",
                        border: "none",
                        marginRight: "8px",
                      }}
                    >
                      <FaEdit />
                    </button>
                    <button
                      className="action-btn"
                      onClick={() => toggleActiveHandler(promo)}
                      title={promo.isActive ? "Désactiver" : "Activer"}
                      style={{
                        background: promo.isActive ? "#ffc107" : "#28a745",
                        border: "none",
                        marginRight: "8px",
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
                  <td
                    colSpan="6"
                    style={{ textAlign: "center", padding: "2rem" }}
                  >
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
