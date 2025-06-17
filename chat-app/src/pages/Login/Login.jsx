import React, { useState } from 'react';
import './login.css';
import assets from '../../assets/assets';
import { useNavigate } from 'react-router-dom';
import { toast } from 'react-hot-toast';
import { signup, login, resetPassword } from '../../config/firebase';

const Login = () => {
  const navigate = useNavigate();
  const [currState, setCurrState] = useState("Sign up");
  const [isLoading, setIsLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [showResetModal, setShowResetModal] = useState(false);
  const [resetEmail, setResetEmail] = useState('');
  const [isResetting, setIsResetting] = useState(false);
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

    if (currState === "Sign up" && !formData.agreeToTerms) {
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
      if (currState === "Sign up") {
        const result = await signup(formData.username, formData.email, formData.password);
        if (result.success) {
          toast.success('Account created successfully! You may now login.');
          setCurrState("Login");
          setFormData({
            username: '',
            email: '',
            password: '',
            agreeToTerms: false
          });
          setErrors({});
        }
      } else {
        const result = await login(formData.email, formData.password);
        if (result.success) {
          toast.success('Login successful! Redirecting to chat...');
          navigate('/chat');
        }
      }
    } catch (error) {
      console.error('Auth error:', error);
      let errorMessage = error.message || 'Something went wrong. Please try again.';
      
      // Handle specific Firebase auth errors
      if (error.code === 'auth/email-already-in-use') {
        errorMessage = 'This email is already registered. Please try logging in.';
        setCurrState("Login");
      } else if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
        errorMessage = 'Invalid email or password. Please try again.';
      } else if (error.code === 'auth/too-many-requests') {
        errorMessage = 'Too many failed attempts. Please try again later.';
      }

      toast.error(errorMessage);
    } finally {
      setIsLoading(false);
    }
  };

  const handleResetPassword = async (e) => {
    e.preventDefault();
    if (!resetEmail.trim()) {
      toast.error('Please enter your email address');
      return;
    }
    if (!/\S+@\S+\.\S+/.test(resetEmail)) {
      toast.error('Please enter a valid email address');
      return;
    }

    setIsResetting(true);
    try {
      await resetPassword(resetEmail);
      toast.success('Password reset email sent! Please check your inbox.');
      setShowResetModal(false);
      setResetEmail('');
    } catch (error) {
      console.error('Reset error:', error);
      toast.error(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsResetting(false);
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

          {currState === "Sign up" && (
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
          )}

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

          <div className='login-forgot'>
            <p className='login-toggle'>
              {currState === "Sign up"
                ? "Already have an account? "
                : "Don't have an account? "}
              <span onClick={toggleState}>
                Click here
              </span>
            </p>
            {currState === "Login" && (
              <button 
                type="button" 
                className="forgot-password-btn"
                onClick={() => setShowResetModal(true)}
              >
                Forgot Password?
              </button>
            )}
          </div>
        </form>
      </div>

      {/* Reset Password Modal */}
      {showResetModal && (
        <div className="modal-overlay">
          <div className="modal-content">
            <h3>Reset Password</h3>
            <p>Enter your email address and we'll send you a link to reset your password.</p>
            <form onSubmit={handleResetPassword}>
              <div className="form-group">
                <input
                  type="email"
                  placeholder="Enter your email"
                  value={resetEmail}
                  onChange={(e) => setResetEmail(e.target.value)}
                  className="form-input"
                />
              </div>
              <div className="modal-buttons">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => {
                    setShowResetModal(false);
                    setResetEmail('');
                  }}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="submit-btn"
                  disabled={isResetting}
                >
                  {isResetting ? 'Sending...' : 'Send Reset Link'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};

export default Login;
