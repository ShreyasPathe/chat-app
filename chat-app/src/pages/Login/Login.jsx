import React, { useState } from 'react';
import './login.css';
import assets from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';

const Login = () => {
  const navigate = useNavigate();
  const [currState, setCurrState] = useState("Sign up");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    agreeToTerms: false
  });
  const [errors, setErrors] = useState({});

  const toggleState = () => {
    setCurrState(prev => (prev === "Sign up" ? "Login" : "Sign up"));
    setErrors({});
    setFormData({
      username: '',
      email: '',
      password: '',
      agreeToTerms: false
    });
  };

  const handleInputChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: type === 'checkbox' ? checked : value
    }));
    // Clear error when user starts typing
    if (errors[name]) {
      setErrors(prev => ({ ...prev, [name]: '' }));
    }
  };

  const validateForm = () => {
    const newErrors = {};
    
    if (currState === "Sign up" && !formData.username.trim()) {
      newErrors.username = 'Username is required';
    }
    
    if (!formData.email.trim()) {
      newErrors.email = 'Email is required';
    } else if (!/\S+@\S+\.\S+/.test(formData.email)) {
      newErrors.email = 'Please enter a valid email';
    }
    
    if (!formData.password) {
      newErrors.password = 'Password is required';
    } else if (formData.password.length < 6) {
      newErrors.password = 'Password must be at least 6 characters';
    }

    if (!formData.agreeToTerms) {
      newErrors.agreeToTerms = 'You must agree to the terms';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!validateForm()) {
      return;
    }

    setIsLoading(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success(`${currState} successful!`);
      // Redirect to home page after successful login/signup
      navigate('/');
    } catch (error) {
      toast.error('Something went wrong. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className='login'>
      <div className="login-container">
        <div className="logo-container">
          <img src={assets.logo_big} alt="Chat App Logo" className='logo' />
        </div>
        <form className="login-form" onSubmit={handleSubmit}>
          <h2>{currState}</h2>

          {currState === "Sign up" && (
            <div className="form-group">
              <input
                type="text"
                name="username"
                placeholder='Username'
                className={`form-input ${errors.username ? 'error' : ''}`}
                value={formData.username}
                onChange={handleInputChange}
              />
              {errors.username && <span className="error-message">{errors.username}</span>}
            </div>
          )}

          <div className="form-group">
            <input
              type="email"
              name="email"
              placeholder='Email address'
              className={`form-input ${errors.email ? 'error' : ''}`}
              value={formData.email}
              onChange={handleInputChange}
            />
            {errors.email && <span className="error-message">{errors.email}</span>}
          </div>

          <div className="form-group">
            <div className="password-input-container">
              <input
                type={showPassword ? "text" : "password"}
                name="password"
                placeholder='Password'
                className={`form-input ${errors.password ? 'error' : ''}`}
                value={formData.password}
                onChange={handleInputChange}
              />
              <button
                type="button"
                className="password-toggle"
                onClick={() => setShowPassword(!showPassword)}
              >
                {showPassword ? "Hide" : "Show"}
              </button>
            </div>
            {errors.password && <span className="error-message">{errors.password}</span>}
          </div>

          <button 
            type='submit' 
            className={`submit-button ${isLoading ? 'loading' : ''}`}
            disabled={isLoading}
          >
            {isLoading ? (
              <span className="loading-spinner"></span>
            ) : (
              currState
            )}
          </button>

          <div className='login-term'>
            <input
              type="checkbox"
              name="agreeToTerms"
              checked={formData.agreeToTerms}
              onChange={handleInputChange}
            />
            <p>Agree to the terms of use & privacy policy.</p>
            {errors.agreeToTerms && <span className="error-message">{errors.agreeToTerms}</span>}
          </div>

          <div className='login-forgot'>
            <p className='login-toggle'>
              {currState === "Sign up"
                ? "Already have an account? "
                : "Don't have an account? "}
              <span onClick={toggleState}>
                Click here
              </span>
            </p>
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
