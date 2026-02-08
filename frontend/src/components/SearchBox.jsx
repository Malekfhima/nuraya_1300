import React, { useState, useEffect, useMemo } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { FaSearch } from 'react-icons/fa';
import api from '../utils/axios';
import './SearchBox.css';

const SearchBox = () => {
  const navigate = useNavigate();
  const location = useLocation();

  // Extract keyword from URL using useMemo for better performance
  const urlKeyword = useMemo(() => {
    const sp = new URLSearchParams(location.search);
    return location.pathname === '/shop' ? sp.get('keyword') || '' : '';
  }, [location.search, location.pathname]);

  const [keyword, setKeyword] = useState(urlKeyword);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);

  // Sync keyword when URL changes
  useEffect(() => {
    setKeyword(urlKeyword);
  }, [urlKeyword]);

  // Handle form submission
  const submitHandler = (e) => {
    e.preventDefault();
    if (keyword.trim()) {
      navigate(`/shop?keyword=${encodeURIComponent(keyword)}`);
    } else {
      navigate('/shop');
    }
  };

  // Fetch suggestions with debounce
  useEffect(() => {
    const fetchSuggestions = async () => {
      if (keyword.length > 1) {
        try {
          const response = await api.get(`/products/suggestions?query=${encodeURIComponent(keyword)}`);
          setSuggestions(response.data);
          setShowSuggestions(true);
        } catch (error) {
          console.error('Failed to fetch suggestions:', error);
          setSuggestions([]);
        }
      } else {
        setSuggestions([]);
        setShowSuggestions(false);
      }
    };

    const timeoutId = setTimeout(fetchSuggestions, 300);
    return () => clearTimeout(timeoutId);
  }, [keyword]);

  // Handle navigation with debounce
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (keyword.trim()) {
        if (location.pathname === '/shop' || keyword.length > 2) {
          navigate(`/shop?keyword=${encodeURIComponent(keyword)}`);
        }
      } else if (keyword === '' && location.pathname === '/shop' && location.search.includes('keyword')) {
        navigate('/shop');
      }
    }, 500);

    return () => clearTimeout(delayDebounceFn);
  }, [keyword, navigate, location.pathname, location.search]);

  return (
    <div className="search-container">
      <form onSubmit={submitHandler} className="search-box">
        <input
          type="text"
          name="q"
          onChange={(e) => setKeyword(e.target.value)}
          value={keyword}
          placeholder="Rechercher..."
          className="search-input"
          autoComplete="off"
          onBlur={() => setTimeout(() => setShowSuggestions(false), 200)}
          onFocus={() => keyword.length > 1 && setShowSuggestions(true)}
        />
        <button type="submit" className="search-btn">
          <FaSearch />
        </button>
      </form>
      
      {showSuggestions && suggestions.length > 0 && (
        <ul className="search-suggestions">
          {suggestions.map((product) => (
            <li 
              key={product._id} 
              onClick={() => {
                setKeyword(product.name);
                navigate(`/product/${product._id}`);
                setShowSuggestions(false);
              }}
              className="suggestion-item"
            >
              <img 
                src={product.image} 
                alt={product.name} 
                className="suggestion-image"
              />
              <div className="suggestion-info">
                <div className="suggestion-name">{product.name}</div>
                <div className="suggestion-category">
                  {product.category}
                </div>
                <div className="suggestion-price">{product.price} DT</div>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default SearchBox;