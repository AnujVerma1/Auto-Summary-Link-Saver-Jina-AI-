import React, { useState } from 'react';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';
import { FaEye, FaEyeSlash } from 'react-icons/fa';


const LoginForm = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState('');

  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('https://auto-summary-link-saver-jina-ai-backend.onrender.com', { email, password });
      localStorage.setItem('token', res.data.token);
      setTimeout(() => {
        navigate('/dashboard');
      }, 100);
    } catch (err) {
      console.error(err);
      setError('Invalid email or password');
    }
  };

  const togglePasswordVisibility = () => {
    setShowPassword((prev) => !prev);
  };

  return (
    <div className="vh-100 d-flex align-items-center justify-content-center" style={{ background: 'linear-gradient(135deg, #0f2027, #203a43, #2c5364)', minHeight: '100vh' }}>
      <div
        className="p-4"
        style={{
          maxWidth: '400px',
          width: '100%',
          background: 'rgba(255, 255, 255, 0.05)', 
          borderRadius: '12px',
          boxShadow: '0 8px 32px 0 rgba( 31, 38, 135, 0.37 )',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          border: '1px solid rgba(255, 255, 255, 0.18)',
          color: 'white'
        }}
      >

        <h3 className="text-center mb-4">Login</h3>
        <form onSubmit={handleLogin}>
          <div className="mb-3">
            <label htmlFor="email" className="form-label">Email</label>
            <input
              type="email"
              className="form-control"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter email"
              required
            />
          </div>
          <div className="mb-4 position-relative">
            <label htmlFor="password" className="form-label">Password</label>

            <input
              type={showPassword ? 'text' : 'password'}
              className="form-control pe-5"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter password"
              required
            />

            <span
              onClick={togglePasswordVisibility}
              style={{
                position: 'absolute',
                top: '38px',
                right: '15px',
                cursor: 'pointer',
                color: '#6c757d',
              }}
            >
              {showPassword ? <FaEyeSlash /> : <FaEye />}
            </span>
          </div>

          {error && (
            <div className="alert alert-danger py-1 my-2" role="alert">
              {error}
            </div>
          )}

          <button type="submit" className="btn btn-primary w-100 mb-2">Login</button>
        </form>

        <p className="mt-3 text-center">
          Don’t have an account? <Link to="/signup">Sign up</Link>
        </p>
      </div>
    </div>
  );
};

export default LoginForm;
