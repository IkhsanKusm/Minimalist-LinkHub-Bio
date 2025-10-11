import React, { useState, useContext } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';
import NeumorphicButton from '../components/NeumorphicButton';
import ThreeDIcon from '../components/3DIcon';
import PasswordInput from '../components/PasswordInput';

const LoginPage = () => {
  const [formData, setFormData] = useState({ email: '', password: '' });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const { login } = useContext(AuthContext); // Get the login function from context
  const navigate = useNavigate();

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setError('');

    try {
      const config = {
        headers: { 'Content-Type': 'application/json' },
      };
      const { data } = await axios.post(
        'http://localhost:5001/api/users/login',
        { email: formData.email, password: formData.password },
        config
      );
      
      login(data); // Save user info to context and local storage
      navigate('/dashboard'); // Redirect on success

    } catch (err) {
      setError(err.response?.data?.message || 'Invalid email or password');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50 to-pink-50 relative overflow-hidden flex items-center justify-center">
      <AnimatedBackground />
      
      <div className="relative z-10 w-full max-w-md mx-4">
        <GlassCard className="p-8">
          <div className="text-center mb-8">
            <Link to="/" className="inline-flex items-center space-x-2 mb-6">
              <ThreeDIcon icon="⚡" gradient="from-blue-500 to-purple-600" className="w-12 h-12" />
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                LinkHub
              </span>
            </Link>
            <h1 className="text-3xl font-bold text-gray-900 mb-2">Welcome Back</h1>
            <p className="text-gray-600">Sign in to your LinkHub account</p>
          </div>

          {/* Display Login Error */}
          {error && (
            <div className="p-3 mb-4 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center space-x-2">
              <span>❌</span>
              <span>{error}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <input
                type="email"
                id="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your email"
                required
              />
            </div>

            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <PasswordInput
                id="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="w-full px-4 py-3 bg-white/50 backdrop-blur-sm border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all duration-300"
                placeholder="Enter your password"
                required
              />
            </div>

            <NeumorphicButton 
              type="submit" 
              className="w-full py-4 text-lg"
              disabled={isLoading}
            >
              {isLoading ? 'Signing In...' : '🔑 Sign In'}
            </NeumorphicButton>
          </form>

          <div className="mt-6 text-center">
            <p className="text-gray-600">
              Don't have an account?{' '}
              <Link to="/register" className="text-blue-600 hover:text-blue-700 font-semibold">
                Sign up here
              </Link>
            </p>
          </div>
        </GlassCard>
      </div>
    </div>
  );
};

export default LoginPage;