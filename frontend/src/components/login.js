import React, { useState } from 'react';
import axios from 'axios';
import './login.css';

const Login = ({ onLogin }) => {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [isSignup, setIsSignup] = useState(false);
  const [error, setError] = useState('');

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError('');

    if (isSignup) {
      // Signup logic
      try {
        const response = await axios.post('http://localhost:5000/signup', {
          username,
          password,
        });
        if (response.status === 201) {
          setIsSignup(false);
          setUsername('');
          setPassword('');
        }
      } catch (error) {
        setError(error.response?.data?.error || 'Signup failed');
      }
    } else {
      // Login logic
      try {
        const response = await axios.post('http://localhost:5000/login', {
          username,
          password,
        });
        if (response.status === 200) {
          onLogin(); // Directly log in without an alert
        }
      } catch (error) {
        setError(error.response?.data?.error || 'Invalid credentials');
      }
    }
  };

  return (
    <div className="login-container d-flex align-items-center justify-content-center vh-100">
      <div className="glass-card">
        <h2 className="text-center text-white mb-3">{isSignup ? 'Create Account' : 'Welcome Back'}</h2>
        {error && <p className="text-danger text-center">{error}</p>}
        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label htmlFor="username" className="form-label text-white">Username</label>
            <input
              type="text"
              id="username"
              className="form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              autoComplete='off'
              required
            />
          </div>
          <div className="mb-3">
            <label htmlFor="password" className="form-label text-white">Password</label>
            <input
              type="password"
              id="password"
              className="form-control"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              autoComplete='new-password'
              required
            />
          </div>
          <button type="submit" className="btn btn-primary w-100">{isSignup ? 'Sign Up' : 'Login'}</button>
        </form>
        <p className="text-center text-white mt-3">
          {isSignup ? 'Already have an account?' : "Don't have an account?"}
          <button className="btn btn-link text-white" onClick={() => setIsSignup(!isSignup)}>
            {isSignup ? 'Login' : 'Sign up'}
          </button>
        </p>
      </div>
    </div>
  );
};

export default Login;
