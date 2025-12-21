import React, { useState } from 'react';
import { MdClose } from "react-icons/md";
import { BsCartX } from "react-icons/bs";
import { useNavigate } from 'react-router-dom';
import { initiateRazorpayPayment, createOrder, verifyPaymentSignature } from '../../utils/razorpay';
import "./Cart.css";

const Cart = ({ setShowCart }) => {
  const navigate = useNavigate();
  const [isProcessing, setIsProcessing] = useState(false);
  const cartItems = JSON.parse(localStorage.getItem('cart')) || [];

  const removeFromCart = (productId) => {
    const updatedCart = cartItems.filter(item => item.id !== productId);
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    // Dispatch cart update event
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const updateQuantity = (productId, change) => {
    const updatedCart = cartItems.map(item => {
      if (item.id === productId) {
        const newQuantity = item.quantity + change;
        return newQuantity > 0 ? { ...item, quantity: newQuantity } : item;
      }
      return item;
    });
    localStorage.setItem('cart', JSON.stringify(updatedCart));
    window.dispatchEvent(new Event('cartUpdated'));
  };

  const cartTotal = cartItems.reduce((total, item) => total + (item.price * item.quantity), 0);

  const handleCheckout = async () => {
    if (cartItems.length === 0) return;

    setIsProcessing(true);

    try {
      // Get user details (you can enhance this with a form)
      const userEmail = localStorage.getItem('userEmail') || 'customer@example.com';
      const userName = localStorage.getItem('userName') || 'Customer';
      const userPhone = localStorage.getItem('userPhone') || '9999999999';

      // Create order
      const orderResponse = await createOrder(cartTotal);
      
      if (!orderResponse.success) {
        alert('Failed to create order. Please try again.');
        setIsProcessing(false);
        return;
      }

      // Get product names for display
      const productNames = cartItems.map(item => item.name).join(', ');

      // Initiate Razorpay payment
      await initiateRazorpayPayment(
        {
          amount: cartTotal,
          orderId: orderResponse.orderId,
          customerEmail: userEmail,
          customerName: userName,
          customerPhone: userPhone,
          productNames: productNames
        },
        // On Success callback
        (paymentResponse) => {
          const verification = verifyPaymentSignature(paymentResponse);
          
          if (verification.verified) {
            // Clear cart after successful payment
            localStorage.removeItem('cart');
            localStorage.removeItem('userEmail');
            localStorage.removeItem('userName');
            localStorage.removeItem('userPhone');
            window.dispatchEvent(new Event('cartUpdated'));
            
            // Navigate to success page
            navigate('/success', {
              state: {
                paymentId: verification.paymentId,
                orderId: verification.orderId,
                amount: cartTotal
              }
            });
            setShowCart(false);
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
      alert(`Checkout Error: ${error.message}`);
      console.error('Checkout error:', error);
      setIsProcessing(false);
    }
  };

  return (
    <div className="cart-panel">
      <div className="opac-layer"></div>
      <div className="cart-content">
        <div className="cart-header">
          <span className="heading">Shopping Cart</span>
          <span className="close-btn" onClick={() => setShowCart(false)}>
            <MdClose />
            <span className="text">close</span>
          </span>
        </div>

        {cartItems.length === 0 && (
          <div className="empty-cart">
            <BsCartX />
            <span>No products in the cart.</span>
          </div>
        )}

        {cartItems.length > 0 && (
          <>
            <div className="cart-items">
              {cartItems.map(item => (
                <div className="cart-item" key={item.id}>
                  <div className="item-image">
                    <img src={item.image} alt={item.name} />
                  </div>
                  <div className="item-details">
                    <span className="name">{item.name}</span>
                    <div className="quantity-buttons">
                      <span onClick={() => updateQuantity(item.id, -1)}>-</span>
                      <span>{item.quantity}</span>
                      <span onClick={() => updateQuantity(item.id, 1)}>+</span>
                    </div>
                    <div className="text">
                      <span>{item.quantity}</span>
                      <span>x</span>
                      <span>₹{item.price}</span>
                    </div>
                  </div>
                  <div className="item-remove" onClick={() => removeFromCart(item.id)}>
                    <MdClose className="close-btn" />
                  </div>
                </div>
              ))}
            </div>
            <div className="cart-footer">
              <div className="subtotal">
                <span className="text">Subtotal:</span>
                <span className="text total">₹{cartTotal.toLocaleString('en-IN')}</span>
              </div>
              <div className="button">
                <button 
                  className="checkout-cta" 
                  onClick={handleCheckout}
                  disabled={isProcessing}
                >
                  {isProcessing ? 'Processing...' : 'Checkout'}
                </button>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default Cart;