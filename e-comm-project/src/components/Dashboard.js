import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './Dashboard.css';

const Dashboard = () => {
  const [products, setProducts] = useState([]);
  const [error, setError] = useState(null);
  const [newProduct, setNewProduct] = useState({
    name: '',
    category: '',
    price: '',
    rating: 4,
    image: '',
    description: ''
  });
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) {
      navigate('/login');
      return;
    }

    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/products', {
        headers: {
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        }
      });
      if (response.status === 401 || response.status === 403) {
        navigate('/login');
        return;
      }
      const data = await response.json();
      setProducts(data.products || []);
    } catch (error) {
      console.error('Error:', error);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // Clear previous errors
    
    // Validate form
    if (!newProduct.name || !newProduct.category || !newProduct.price) {
      setError('Please fill in all required fields (Name, Category, Price)');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/products', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${localStorage.getItem('token')}`
        },
        body: JSON.stringify({
          ...newProduct,
          category: newProduct.category.toUpperCase(),
          price: Number(newProduct.price),
          rating: 4
        })
      });
      
      if (response.status === 401 || response.status === 403) {
        setError('You are not authorized. Please login again.');
        setTimeout(() => navigate('/login'), 2000);
        return;
      }

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Failed to add product');
      }

      const savedProduct = await response.json();
      console.log('Product saved:', savedProduct);
      
      // Update products list
      setProducts(prevProducts => [...prevProducts, savedProduct]);
      
      // Reset form
      setNewProduct({
        name: '',
        category: '',
        price: '',
        rating: 4,
        image: '',
        description: ''
      });
      
      alert('Product added successfully!');
    } catch (error) {
      console.error('Error adding product:', error);
      setError(error.message || 'An error occurred while adding the product');
    }
  };

  return (
    <div className="admin-dashboard-wrapper dark">
      <div className="admin-dashboard-header">
        <h1>Product Management Console</h1>
        <p className="admin-dashboard-subtitle">Add and manage your products</p>
      </div>
      
      {error && (
        <div style={{
          padding: '12px 16px',
          background: '#fee',
          border: '1px solid #fcc',
          borderRadius: '6px',
          color: '#c33',
          marginBottom: '16px'
        }}>
          Error: {error}
        </div>
      )}
      
      <div className="admin-dashboard-content">
        <div className="admin-product-form-container">
          <div className="admin-form-header">
            <h2>Add New Product</h2>
            <span className="admin-form-icon">+</span>
          </div>
          <form onSubmit={handleSubmit} className="admin-product-form">
            <div className="admin-form-group">
              <label>Product Name</label>
              <input
                type="text"
                value={newProduct.name}
                onChange={(e) => setNewProduct({...newProduct, name: e.target.value})}
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label>Category</label>
              <select
                value={newProduct.category}
                onChange={(e) => setNewProduct({...newProduct, category: e.target.value})}
                className="admin-form-select"
              >
                <option value="">Select Category</option>
                <option value="mobile">Mobile & Accessories</option>
                <option value="electronics">Electronics</option>
              </select>
            </div>

            <div className="admin-form-group">
              <label>Price (₹)</label>
              <input
                type="number"
                value={newProduct.price}
                onChange={(e) => setNewProduct({...newProduct, price: e.target.value})}
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label>Image URL</label>
              <input
                type="text"
                value={newProduct.image}
                onChange={(e) => setNewProduct({...newProduct, image: e.target.value})}
                className="admin-form-input"
              />
            </div>

            <div className="admin-form-group">
              <label>Description</label>
              <textarea
                value={newProduct.description}
                onChange={(e) => setNewProduct({...newProduct, description: e.target.value})}
                className="admin-form-textarea"
              />
            </div>

            <button type="submit" className="admin-submit-btn">
              Add Product
              <span className="admin-btn-icon">→</span>
            </button>
          </form>
        </div>

        <div className="admin-products-overview">
          <div className="admin-overview-header">
            <h2>RECENTLY ADDED</h2>
            <span className="admin-product-count">{products.length} items</span>
          </div>
          <div className="admin-products-grid">
            {products && products.length > 0 ? (
              products.map(product => (
                <div key={product.id} className="admin-product-card">
                  <div className="admin-product-image-container">
                    <img src={product.image || 'https://via.placeholder.com/200'} alt={product.name} className="admin-product-image" />
                    <span className="admin-product-category">{product.category?.name || 'Unknown'}</span>
                  </div>
                  <div className="admin-product-details">
                    <h3 className="admin-product-name">{product.name}</h3>
                    <p className="admin-product-price">₹{product.price}</p>
                  </div>
                </div>
              ))
            ) : (
              <p style={{color: '#888', gridColumn: '1/-1'}}>No products added yet</p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;
