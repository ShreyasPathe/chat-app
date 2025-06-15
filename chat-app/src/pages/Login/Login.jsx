import React, { useState } from 'react';
import './login.css';
import assets from '../../assets/assets';

const Login = () => {
  const [currState, setCurrState] = useState("Sign up");

  const toggleState = () => {
    setCurrState(prev => (prev === "Sign up" ? "Login" : "Sign up"));
  };

  return (
    <div className='login'>
      <img src={assets.logo_big} alt="" className='logo' />
      <form className="login-form">
        <h2>{currState}</h2>

        {currState === "Sign up" && (
          <input type="text" placeholder='Username' className='form-input' required />
        )}

        <input type="email" placeholder='Email address' className='form-input' required />
        <input type="password" placeholder='Password' className='form-input' required />
        <button type='submit'>{currState}</button>

        <div className='login-term'>
          <input type="checkbox" />
          <p>Agree to the terms of use & privacy policy.</p>
        </div>

        <div className='login-forgot'>
          <p className='login-toggle'>
            {currState === "Sign up"
              ? "Already have an account? "
              : "Don't have an account? "}
            <span onClick={toggleState} style={{ cursor: 'pointer', color: 'blue' }}>
              Click here
            </span>
          </p>
        </div>
      </form>
    </div>
  );
};

export default Login;
