import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import './AuthForm.css';
import { FiUser, FiMail, FiLock } from 'react-icons/fi';

const AuthForm = () => {
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const navigate = useNavigate();

  const clearForm = () => {
    setFormData({
      email: '',
      password: '',
      name: ''
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // Only send required fields based on isLogin
      const payload = isLogin 
        ? { email: formData.email, password: formData.password }
        : formData;

      const response = await fetch(`${process.env.REACT_APP_API_URL}/api/${isLogin ? 'login' : 'signup'}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(payload)
      });

      const data = await response.json();
      
      if (response.ok) {
        if (isLogin) {
          localStorage.setItem('token', data.token);
          localStorage.setItem('isAdmin', data.isAdmin);
          localStorage.setItem('currentUser', JSON.stringify({
            username: formData.email
          }));
          clearForm();
          navigate('/');
          window.location.reload(); // Force reload to update navbar
        } else {
          clearForm();
          setIsLogin(true);
          alert('Registration successful! Please login.');
        }
      } else {
        alert(data.error || 'Authentication failed');
      }
    } catch (error) {
      console.error('Auth error:', error);
      alert('Authentication failed');
    }
  };

  useEffect(() => {
    clearForm();
  }, [isLogin]);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  return (
    <div className="auth-container">
      <div className="auth-form-container">
        <div className="auth-left-panel">
          <h1>TechNexus</h1>
          <p>Your Gateway to Premium Tech</p>
        </div>
        <div className="auth-right-panel">
          <form onSubmit={handleSubmit} className="auth-form">
            <h2>{isLogin ? 'Welcome Back' : 'Create Account'}</h2>
            
            {!isLogin && (
              <div className="form-group">
                <FiUser className="input-icon" />
                <input
                  type="text"
                  name="name"
                  placeholder="Full Name"
                  value={formData.name}
                  onChange={handleChange}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="form-group">
              <FiMail className="input-icon" />
              <input
                type="email"
                name="email"
                placeholder="Email Address"
                value={formData.email}
                onChange={handleChange}
                required
              />
            </div>
            
            <div className="form-group">
              <FiLock className="input-icon" />
              <input
                type="password"
                name="password"
                placeholder="Password"
                value={formData.password}
                onChange={handleChange}
                required
              />
            </div>
            
            <button type="submit" className="auth-button">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
            
            <p className="auth-switch" onClick={() => setIsLogin(!isLogin)}>
              {isLogin 
                ? "Don't have an account? Sign Up" 
                : "Already have an account? Login"}
            </p>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AuthForm;