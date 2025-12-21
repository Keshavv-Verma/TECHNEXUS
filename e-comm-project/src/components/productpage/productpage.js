import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { FiShoppingCart, FiHeart, FiShare2, FiCheckCircle, FiTruck } from 'react-icons/fi';
import { initiateRazorpayPayment, createOrder, verifyPaymentSignature } from '../../utils/razorpay';
import './productpage.css';

const ProductPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [selectedImage, setSelectedImage] = useState(0);
  const [isAdded, setIsAdded] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/products/${id}`);
        if (!response.ok) throw new Error('Product not found');
        const data = await response.json();
        setProduct(data);
        setLoading(false);
      } catch (error) {
        setError(error.message);
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    const cart = JSON.parse(localStorage.getItem('cart')) || [];
    const existingItem = cart.find(item => item.id === product.id);
    
    if (existingItem) {
      const updatedCart = cart.map(item =>
        item.id === product.id 
          ? { ...item, quantity: item.quantity + 1 }
          : item
      );
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    } else {
      const updatedCart = [...cart, { ...product, quantity: 1 }];
      localStorage.setItem('cart', JSON.stringify(updatedCart));
    }
    
    // Dispatch cart update event
    window.dispatchEvent(new Event('cartUpdated'));
    setIsAdded(true);
    setTimeout(() => setIsAdded(false), 2000);
  };

  const handleBuyNow = async () => {
    if (!product) return;

    setIsProcessing(true);

    try {
      // Get user details
      const userEmail = localStorage.getItem('userEmail') || 'customer@example.com';
      const userName = localStorage.getItem('userName') || 'Customer';
      const userPhone = localStorage.getItem('userPhone') || '9999999999';

      // Create order
      const orderResponse = await createOrder(product.price);
      
      if (!orderResponse.success) {
        alert('Failed to create order. Please try again.');
        setIsProcessing(false);
        return;
      }

      // Initiate Razorpay payment for single product
      await initiateRazorpayPayment(
        {
          amount: product.price,
          orderId: orderResponse.orderId,
          customerEmail: userEmail,
          customerName: userName,
          customerPhone: userPhone,
          productNames: product.name
        },
        // On Success callback
        (paymentResponse) => {
          const verification = verifyPaymentSignature(paymentResponse);
          
          if (verification.verified) {
            // Clear stored user data
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            localStorage.removeItem('userPhone');
            
            // Navigate to success page
            navigate('/success', {
              state: {
                paymentId: verification.paymentId,
                orderId: verification.orderId,
                amount: product.price,
                productName: product.name
              }
            });
          }
          setIsProcessing(false);
        },
        // On Error callback
        (error) => {
          alert(`Payment Error: ${error}`);
          console.error('Payment error:', error);
          setIsProcessing(false);
        }
      );
    } catch (error) {
      alert(`Buy Now Error: ${error.message}`);
      console.error('Buy Now error:', error);
      setIsProcessing(false);
    }
  };

  if (loading) {
    return (
      <div className="loading-container">
        <div className="loading-spinner"></div>
        <p>Loading amazing product...</p>
      </div>
    );
  }

  if (error) {
    return <div className="error-container">{error}</div>;
  }

  if (!product) {
    return <div className="error-container">Product not found</div>;
  }

  return (
    <div className="product-page-container">
      <div className="product-glass-container">
        <div className="product-image-section">
          <div className="main-image-container">
            <img src={product.image} alt={product.name} className="main-product-image" />
            <div className="image-overlay">
              <button className="overlay-btn wishlist-btn">
                <FiHeart />
              </button>
              <button className="overlay-btn share-btn">
                <FiShare2 />
              </button>
            </div>
          </div>
        </div>

        <div className="product-info-section">
          <div className="product-header">
            <h1>{product.name}</h1>
            <div className="product-meta">
              <div className="rating-container">
                {Array.from({ length: 5 }).map((_, i) => (
                  <span key={i} className={`star ${i < product.rating ? 'filled' : ''}`}>
                    ★
                  </span>
                ))}
                <span className="rating-count">({product.rating} / 5)</span>
              </div>
              <span className="product-category">{product.category?.name || 'Uncategorized'}</span>
            </div>
          </div>

          <div className="price-section">
            <h2 className="price">₹{product.price.toLocaleString('en-IN')}</h2>
            <span className="tax-info">Inclusive of all taxes</span>
          </div>

          <div className="product-description">
            <h3>Product Description</h3>
            <p>{product.description}</p>
          </div>

          <div className="product-features">
            <div className="feature-item">
              <FiCheckCircle />
              <span>Genuine Product</span>
            </div>
            <div className="feature-item">
              <FiTruck />
              <span>Fast Delivery</span>
            </div>
          </div>

          <div className="action-buttons">
            <button 
              className={`add-to-cart-btn ${isAdded ? 'added' : ''}`}
              onClick={handleAddToCart}
            >
              <FiShoppingCart />
              {isAdded ? 'Added to Cart' : 'Add to Cart'}
            </button>
            <button className="buy-now-btn" onClick={handleBuyNow} disabled={isProcessing}>
              {isProcessing ? 'Processing Payment...' : 'Buy Now'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductPage;