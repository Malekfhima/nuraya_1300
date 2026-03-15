import React, { useState, useEffect } from 'react';
import { useLocation, Link } from 'react-router-dom';
import axios from 'axios';
import Product from '../components/Product';
import './ShopScreen.css';

const ShopScreen = () => {
  const { search } = useLocation();
  const sp = new URLSearchParams(search);
  const keyword = sp.get('keyword') || '';
  const pageNumber = sp.get('pageNumber') || 1;

  const [products, setProducts] = useState([]);
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showFilters, setShowFilters] = useState(false);

  // Filters
  const [category, setCategory] = useState('');
  const [minPrice, setMinPrice] = useState(0);
  const [maxPrice, setMaxPrice] = useState(2900);
  const [activePriceFilter, setActivePriceFilter] = useState(false);

  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get('/api/categories');
        setCategories(['Tout', ...data.map(c => c.name)]);
      } catch (err) {
        console.error(err);
      }
    };
    fetchCategories();
  }, []);

  // Dual Range handle logic
  const handleMinChange = (e) => {
    const value = Math.min(Number(e.target.value), maxPrice - 100);
    setMinPrice(value);
    setActivePriceFilter(true);
  };

  const handleMaxChange = (e) => {
    const value = Math.max(Number(e.target.value), minPrice + 100);
    setMaxPrice(value);
    setActivePriceFilter(true);
  };

  const resetPriceFilter = () => {
    setActivePriceFilter(false);
    setMinPrice(0);
    setMaxPrice(2900);
  };

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true);
      try {
        let url = `/api/products?keyword=${keyword}&pageNumber=${pageNumber}`;
        if (category && category !== 'Tout') url += `&category=${category}`;
        if (activePriceFilter) {
          url += `&min=${minPrice}&max=${maxPrice}`;
        }

        const { data } = await axios.get(url);
        setProducts(data.products);
        setPages(data.pages);
        setPage(data.page);
        setLoading(false);
      } catch (err) {
        setError(err.message);
        setLoading(false);
      }
    };
    fetchProducts();
  }, [keyword, pageNumber, category, minPrice, maxPrice, activePriceFilter]);

  return (
    <div className="container shop-screen">
      <div className="shop-header">
        <h1>Catalogue</h1>
        <p>Une élégance sélectionnée.</p>
        <button 
            className="btn btn-outline mobile-filter-toggle" 
            onClick={() => setShowFilters(!showFilters)}
            style={{ marginTop: '1rem', display: 'none' }} // Hidden by default via CSS logic, simpler to do in CSS
        >
            {showFilters ? 'Masquer les filtres' : 'Afficher les filtres'}
        </button>
      </div>

      <div className="shop-layout">
        <aside className={`shop-sidebar ${showFilters ? 'active' : ''}`}>
           <div className="filter-group">
            <h3>Catégories</h3>
            <ul>
              {categories.map((c) => (
                <li key={c} 
                    className={category === c ? 'active' : ''}
                    onClick={() => setCategory(c)}
                >
                  {c}
                </li>
              ))}
            </ul>
           </div>

           <div className="filter-group">
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1.8rem', borderBottom: '1px solid var(--border-color)', paddingBottom: '1rem' }}>
                <h3 style={{ 
                  margin: 0, 
                  border: 'none', 
                  padding: 0, 
                  fontSize: '0.95rem', 
                  textTransform: 'uppercase', 
                  letterSpacing: '0.15em', 
                  fontWeight: '700', 
                  color: 'var(--secondary)',
                  fontFamily: 'var(--font-heading)'
                }}>PRIX</h3>
                <span className="price-badge">{minPrice}DT - {maxPrice}DT</span>
            </div>
            
            <div className="dual-range-container">
                <div className="slider-track" style={{
                    background: `linear-gradient(to right, 
                        #e8e8e8 0%, 
                        #e8e8e8 ${(minPrice/3000)*100}%, 
                        #2c3e50 ${(minPrice/3000)*100}%, 
                        #2c3e50 ${(maxPrice/3000)*100}%, 
                        #e8e8e8 ${(maxPrice/3000)*100}%, 
                        #e8e8e8 100%)`
                }}></div>
                <input 
                    type="range" 
                    min="0" 
                    max="3000" 
                    step="10"
                    value={minPrice} 
                    onChange={handleMinChange}
                    className="double-slider min-slider"
                />
                <input 
                    type="range" 
                    min="0" 
                    max="3000" 
                    step="10"
                    value={maxPrice} 
                    onChange={handleMaxChange}
                    className="double-slider max-slider"
                />
            </div>

            <div className="range-labels">
                <span>0 DT</span>
                <span>3000 DT</span>
            </div>

            {activePriceFilter && (
                <button 
                  className="btn-text-small" 
                  onClick={resetPriceFilter}
                >
                  Réinitialiser l'intervalle
                </button>
            )}
           </div>
        </aside>

        <main className="shop-grid">
          {loading ? (
            <p>Chargement...</p>
          ) : error ? (
            <p>{error}</p>
          ) : products.length === 0 ? (
            <p>Aucun produit trouvé.</p>
          ) : (
            <>
              <div className="product-grid">
                {products.map((product) => (
                  <Product key={product._id} product={product} />
                ))}
              </div>

               {/* Pagination */}
               {pages > 1 && (
                  <div className="pagination">
                      {[...Array(pages).keys()].map((x) => (
                          <Link 
                            key={x+1} 
                            to={`/shop?keyword=${keyword}&pageNumber=${x+1}`}
                            className={x + 1 === page ? 'active' : ''}
                          >
                             {x + 1}
                          </Link>
                      ))}
                  </div>
               )}
            </>
          )}
        </main>
      </div>
    </div>
  );
};

export default ShopScreen;
