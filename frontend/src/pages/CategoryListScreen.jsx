import React, { useContext, useEffect, useReducer, useState } from "react";
import api from "../utils/axios";
import { toast } from "react-toastify";
import { Store } from "../context/StoreContext";
import AdminLayout from "../components/AdminLayout";

const reducer = (state, action) => {
  switch (action.type) {
    case "FETCH_REQUEST":
      return { ...state, loading: true };
    case "FETCH_SUCCESS":
      return { ...state, loading: false, categories: action.payload };
    case "FETCH_FAIL":
      return { ...state, loading: false, error: action.payload };
    case "CREATE_REQUEST":
      return { ...state, loadingCreate: true };
    case "CREATE_SUCCESS":
      return { ...state, loadingCreate: false };
    case "CREATE_FAIL":
      return { ...state, loadingCreate: false };
    case "DELETE_REQUEST":
      return { ...state, loadingDelete: true, successDelete: false };
    case "DELETE_SUCCESS":
      return { ...state, loadingDelete: false, successDelete: true };
    case "DELETE_FAIL":
      return { ...state, loadingDelete: false, successDelete: false };
    default:
      return state;
  }
};

export default function CategoryListScreen() {
  const { state } = useContext(Store);
  const { userInfo } = state;
  const [
    { loading, error, categories, loadingCreate, successDelete },
    dispatch,
  ] = useReducer(reducer, {
    loading: true,
    error: "",
    categories: [],
  });

  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  useEffect(() => {
    const fetchData = async () => {
      try {
        dispatch({ type: "FETCH_REQUEST" });
        const { data } = await api.get("/categories");
        dispatch({ type: "FETCH_SUCCESS", payload: data });
      } catch (err) {
        dispatch({
          type: "FETCH_FAIL",
          payload: err.message,
        });
      }
    };
    fetchData();
  }, [userInfo, successDelete]);

  const createHandler = async (e) => {
    e.preventDefault();
    try {
      dispatch({ type: "CREATE_REQUEST" });
      await api.post("/categories", { name, description });
      toast.success("Catégorie créée avec succès");
      dispatch({ type: "CREATE_SUCCESS" });
      setName("");
      setDescription("");

      const { data } = await api.get("/categories");
      dispatch({ type: "FETCH_SUCCESS", payload: data });
    } catch (err) {
      toast.error(err.response?.data?.message || err.message);
      dispatch({ type: "CREATE_FAIL" });
    }
  };

  const deleteHandler = async (category) => {
    if (
      window.confirm("Êtes-vous sûr de vouloir supprimer cette catégorie ?")
    ) {
      try {
        dispatch({ type: "DELETE_REQUEST" });
        await api.delete(`/categories/${category._id}`);
        toast.success("Catégorie supprimée");
        dispatch({ type: "DELETE_SUCCESS" });
      } catch (err) {
        toast.error(err.response?.data?.message || err.message);
        dispatch({ type: "DELETE_FAIL" });
      }
    }
  };

  return (
    <AdminLayout activePage="categories">
        <header className="admin-header">
          <h1>Catégories</h1>
        </header>

        <div className="report-card-full" style={{ marginBottom: "2rem" }}>
          <h3 style={{ marginBottom: "1.5rem" }}>Ajouter une Catégorie</h3>
          <form onSubmit={createHandler} className="admin-form">
            <div className="grid-2">
              <div className="form-group">
                <label>Nom de la catégorie</label>
                <input
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  placeholder="Ex: Montres Classiques"
                  required
                />
              </div>
              <div className="form-group">
                <label>Description</label>
                <input
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brève description..."
                />
              </div>
            </div>
            <button
              type="submit"
              className="btn btn-primary"
              style={{ marginTop: "1rem" }}
              disabled={loadingCreate}
            >
              {loadingCreate ? "Création..." : "Créer la Catégorie"}
            </button>
          </form>
        </div>

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
                  <th>DESCRIPTION</th>
                  <th>ACTIONS</th>
                </tr>
              </thead>
              <tbody>
                {categories.map((category) => (
                  <tr key={category._id}>
                    <td>{category._id.substring(0, 10)}...</td>
                    <td>{category.name}</td>
                    <td>{category.description || "-"}</td>
                    <td>
                      <button
                        type="button"
                        className="action-btn btn-delete"
                        onClick={() => deleteHandler(category)}
                      >
                        Supprimer
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
}
