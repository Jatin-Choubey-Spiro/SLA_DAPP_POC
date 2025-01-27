import React, { useState } from 'react';
import axios from 'axios';
import './login.css';
import spiroLogo from './logos/spiro.png';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [gasPrice, setGasPrice] = useState(null);

  const handleSubmit = (e) => {
    e.preventDefault();
    // Authentication logic here
    if (username === 'user' && password === 'password') {
      onLogin();
    } else {
      alert('Invalid credentials');
    }
  };

  return (
    <div className="login-container">
      <div className="login-card">
        <h1 className="login-title">
          Hey There
        </h1>
        <p className="login-subtitle">Sign In</p>
        <form onSubmit={handleSubmit}>
          <div className="input-group">
            <label htmlFor="username">Username</label>
            <input
              type="text"
              id="username"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="input-group">
            <label htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>
          <button type="submit" className="login-button">
            Login
          </button>
        </form>
      </div>
    </div>
  );
};

export default Login;