import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';
import './HomePage.css';

function HomePage() {
  const [products, setProducts] = useState([]);
  const location = useLocation();

  const fetchProducts = (query = '') => {
    const url = query ? `http://localhost:5000/search-product${query}` : 'http://localhost:5000/get-product';
    axios.get(url)
      .then((res) => {
        console.log(res.data.products, "fetched products");  // Check this console log
        if (res.data.products) {
          setProducts(res.data.products);
        }
      })
      .catch((err) => {
        console.log(err);
        alert('Server error');
      });
  };

  useEffect(() => {
    const query = new URLSearchParams(location.search).toString();
    fetchProducts(query ? `?${query}` : '');
  }, [location]);

  return (
    <div className="product-container">
      {products && products.length > 0 ? (
        products.map((item, index) => (
          <div key={index} className="product-card">
            <img src={`http://localhost:5000/${item.image}`} alt={item.name} className="product-image" />
            <p className="product-description">{item.description}</p>
            <p className="product-price">Price: ${item.price}</p>
          </div>
        ))
      ) : (
        <p>No products available.</p>
      )}
    </div>
  );
}

export default HomePage;
