import React, { useState, useEffect, useContext } from "react";
import { Link, useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";
import AdminLayout from "../components/AdminLayout";
import { Store } from "../context/StoreContext";
import "./AuthScreen.css";

const ProductEditScreen = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const isNewProduct = id === "new";

  const { state } = useContext(Store);
  const { userInfo } = state;

  const [name, setName] = useState("");
  const [price, setPrice] = useState("");
  const [image, setImage] = useState("");
  const [images, setImages] = useState([]);
  const [brand, setBrand] = useState("Nuraya");
  const [category, setCategory] = useState("");
  const [categories, setCategories] = useState([]);
  const [countInStock, setCountInStock] = useState("");
  const [description, setDescription] = useState("");

  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get("/api/categories");
        setCategories(data);
      } catch {
        toast.error("Erreur lors de la récupération des catégories");
      }
    };

    const fetchProductDetails = async () => {
      try {
        const { data } = await axios.get(`/api/products/${id}`);
        setName(data.name);
        setPrice(data.price);
        setImage(data.image);
        setImages(data.images || []);
        setBrand(data.brand);
        setCategory(data.category);
        setCountInStock(data.countInStock);
        setDescription(data.description);
      } catch (error) {
        toast.error("Erreur lors du chargement du produit");
      }
    };

    fetchCategories();

    if (!isNewProduct) {
      fetchProductDetails();
    }
  }, [id, isNewProduct]);

  const uploadFileHandler = async (e) => {
    const file = e.target.files[0];
    const formData = new FormData();
    formData.append("image", file);
    setUploading(true);

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };

      const { data } = await axios.post("/api/upload", formData, config);
      setImage(data);
      setUploading(false);
      toast.success("Image téléchargée");
    } catch {
      toast.error("Échec du téléchargement");
      setUploading(false);
    }
  };

  const uploadMultipleFilesHandler = async (e) => {
    const files = e.target.files;
    const formData = new FormData();
    for (let i = 0; i < files.length; i++) {
      formData.append("images", files[i]);
    }
    setUploading(true);

    try {
      const config = {
        headers: { "Content-Type": "multipart/form-data" },
      };
      const { data } = await axios.post(
        "/api/upload/multiple",
        formData,
        config,
      );
      setImages([...images, ...data]);
      setUploading(false);
      toast.success("Images téléchargées");
    } catch {
      toast.error("Échec du téléchargement multiple");
      setUploading(false);
    }
  };

  const removeImage = (img) => {
    setImages(images.filter((x) => x !== img));
  };

  const submitHandler = async (e) => {
    e.preventDefault();
    try {
      const config = {
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      const productData = {
        name,
        price,
        image,
        images,
        brand,
        category,
        description,
        countInStock,
      };

      if (isNewProduct) {
        await axios.post("/api/products", productData, config);
        toast.success("Produit créé avec succès");
      } else {
        await axios.put(`/api/products/${id}`, productData, config);
        toast.success("Produit mis à jour");
      }
      navigate("/admin/products");
    } catch (error) {
      toast.error(error.response?.data?.message || error.message);
    }
  };

  return (
    <AdminLayout activePage="products">
        <div
          className="auth-card"
          style={{ maxWidth: "800px", margin: "0 auto" }}
        >
          <Link
            to="/admin/products"
            className="btn btn-outline"
            style={{ marginBottom: "1rem" }}
          >
            Retour
          </Link>
          <h2>{isNewProduct ? "Ajouter un Produit" : "Modifier le Produit"}</h2>

          <form onSubmit={submitHandler}>
            <div className="form-group">
              <label>Nom</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Entrez le nom du produit"
                required
              />
            </div>

            <div className="form-group">
              <label>Prix (DT)</label>
              <input
                type="number"
                value={price}
                onChange={(e) => setPrice(e.target.value)}
                placeholder="Entrez le prix du produit"
                required
              />
            </div>

            <div className="form-group">
              <label>Image Principale</label>
              <input
                type="text"
                value={image}
                onChange={(e) => setImage(e.target.value)}
                placeholder="URL de l'image principale"
                required
              />
              <input type="file" onChange={uploadFileHandler} />
              {uploading && <div>Téléchargement...</div>}
            </div>

            <div className="form-group">
              <label>Images Additionnelles</label>
              <div
                style={{
                  display: "flex",
                  gap: "10px",
                  flexWrap: "wrap",
                  marginBottom: "10px",
                }}
              >
                {images.map((img, index) => (
                  <div key={index} style={{ position: "relative" }}>
                    <img
                      src={img}
                      alt="preview"
                      style={{
                        width: "60px",
                        height: "60px",
                        objectFit: "cover",
                      }}
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(img)}
                      style={{
                        position: "absolute",
                        top: -5,
                        right: -5,
                        background: "red",
                        color: "white",
                        border: "none",
                        borderRadius: "50%",
                        width: "20px",
                        height: "20px",
                        cursor: "pointer",
                      }}
                    >
                      x
                    </button>
                  </div>
                ))}
              </div>
              <input
                type="file"
                multiple
                onChange={uploadMultipleFilesHandler}
              />
            </div>

            <div className="grid-2">
              <div className="form-group">
                <label>Marque</label>
                <input
                  type="text"
                  value={brand}
                  onChange={(e) => setBrand(e.target.value)}
                  placeholder="Marque du produit"
                  required
                />
              </div>

              <div className="form-group">
                <label>Catégorie</label>
                <select
                  value={category}
                  onChange={(e) => setCategory(e.target.value)}
                  required
                >
                  <option value="">Sélectionner une catégorie</option>
                  {categories.map((cat) => (
                    <option key={cat._id} value={cat.name}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="form-group">
              <label>Quantité en Stock</label>
              <input
                type="number"
                value={countInStock}
                onChange={(e) => setCountInStock(e.target.value)}
                placeholder="Quantité disponible"
                required
              />
            </div>

            <div className="form-group">
              <label>Description</label>
              <textarea
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                rows="5"
                placeholder="Décrivez le produit en détail"
                required
              ></textarea>
            </div>

            <button type="submit" className="btn btn-primary btn-block">
              {isNewProduct ? "Créer" : "Mettre à Jour"}
            </button>
          </form>
        </div>
    </AdminLayout>
  );
};

export default ProductEditScreen;
