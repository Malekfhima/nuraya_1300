import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import { FaEdit, FaTrash, FaPlus } from "react-icons/fa";
import AdminLayout from "../components/AdminLayout";
import { Store } from "../context/StoreContext";

const ProductListScreen = () => {
  const navigate = useNavigate();
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const { state } = useContext(Store);
  const { userInfo } = state;

  const fetchProducts = async () => {
    try {
      const { data } = await axios.get("/api/products");
      setProducts(data.products);
      setLoading(false);
    } catch (err) {
      setError(err.message);
      setLoading(false);
    }
  };

  useEffect(() => {
    const loadProducts = async () => {
      if (userInfo && userInfo.isAdmin) {
        await fetchProducts();
      } else {
        navigate("/login");
      }
    };

    loadProducts();
  }, [navigate, userInfo]);

  const deleteHandler = async (id) => {
    if (window.confirm("Êtes-vous sûr de vouloir supprimer ce produit ?")) {
      try {
        const config = {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        };
        await axios.delete(`/api/products/${id}`, config); // Corrected to products API
        toast.success("Produit supprimé avec succès"); // Added success toast
        fetchProducts(); // Refresh list
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
      }
    }
  };

  const createProductHandler = async () => {
    // Ne crée plus de produit automatiquement
    // Redirige directement vers une page de création vide
    navigate("/admin/product/new/edit");
  };

  return (
    <AdminLayout activePage="products">
      <header className="admin-header">
          <h1>Produits</h1>
          <button className="btn btn-primary" onClick={createProductHandler}>
            <FaPlus style={{ marginRight: "10px" }} /> Ajouter un Produit
          </button>
        </header>

        {loading ? (
          <p>Chargement...</p>
        ) : error ? (
          <p className="error">{error}</p>
        ) : (
          <div className="table-responsive">
            <table className="admin-table">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>NOM</th>
                  <th>PRIX</th>
                  <th>CATÉGORIE</th>
                  <th>MARQUE</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {products.map((product) => (
                  <tr key={product._id}>
                    <td>{product._id.substring(0, 10)}...</td>
                    <td>{product.name}</td>
                    <td>{product.price.toFixed(2)} DT</td>
                    <td>{product.category}</td>
                    <td>{product.brand}</td>
                    <td>
                      <Link to={`/admin/product/${product._id}/edit`}>
                        <button className="action-btn btn-edit">
                          <FaEdit />
                        </button>
                      </Link>
                      <button
                        className="action-btn btn-delete"
                        onClick={() => deleteHandler(product._id)}
                      >
                        <FaTrash />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
    </AdminLayout>
  );
};

export default ProductListScreen;
