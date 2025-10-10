import React from 'react';
import { Routes, Route, useLocation } from 'react-router-dom';
import Header from './components/Header';
import HomePage from './pages/HomePage';
import FeaturesPage from './pages/FeaturesPage';
import PlansPage from './pages/PlansPage';
import ContactPage from './pages/ContactPage';
import LoginPage from './pages/LoginPage';
import RegisterPage from './pages/RegisterPage';
import DashboardPage from './pages/DashboardPage';
import PublicProfilePage from './pages/PublicProfilePage';
import './App.css';

function App() {
  const location = useLocation();

  return (
    <div className="min-h-screen bg-white">
      <Header />
      
      <main className={`
        transition-all duration-300
        ${location.pathname === '/' || 
          location.pathname === '/login' || 
          location.pathname === '/register' ||
          location.pathname === '/features' ||
          location.pathname === '/plans' ||
          location.pathname === '/contact'
          ? '' 
          : 'pt-16'
        }
      `}>
        <Routes>
          {/* Public Website Routes */}
          <Route path="/" element={<HomePage />} />
          <Route path="/features" element={<FeaturesPage />} />
          <Route path="/plans" element={<PlansPage />} />
          <Route path="/contact" element={<ContactPage />} />
          
          {/* Auth Routes */}
          <Route path="/login" element={<LoginPage />} />
          <Route path="/register" element={<RegisterPage />} />
          
          {/* App Routes */}
          <Route path="/dashboard" element={<DashboardPage />} />
          <Route path="/:username" element={<PublicProfilePage />} />
          
          {/* 404 Page */}
          <Route path="*" element={
            <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-red-50 to-orange-50">
              <div className="text-center">
                <div className="text-9xl mb-4">😵</div>
                <h1 className="text-4xl font-bold text-gray-900 mb-4">Page Not Found</h1>
                <p className="text-gray-600 mb-8">The page you're looking for doesn't exist.</p>
                <a 
                  href="/" 
                  className="inline-flex items-center space-x-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-purple-600 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
                >
                  <span>🏠</span>
                  <span>Go Home</span>
                </a>
              </div>
            </div>
          } />
        </Routes>
      </main>

      {/* Global Footer - Only show on public pages */}
      {!location.pathname.includes('/dashboard') && location.pathname !== '/login' && location.pathname !== '/register' && (
        <footer className="bg-gray-900 text-white py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
              <div className="col-span-1 md:col-span-2">
                <div className="flex items-center space-x-3 mb-4">
                  <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-purple-600 rounded-lg"></div>
                  <span className="text-2xl font-bold text-white">LinkHub</span>
                </div>
                <p className="text-gray-400 max-w-md">
                  Create beautiful bio link pages that convert visitors into followers, 
                  customers, and fans. All with stunning design and powerful features.
                </p>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Product</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/features" className="hover:text-white transition-colors">Features</a></li>
                  <li><a href="/plans" className="hover:text-white transition-colors">Pricing</a></li>
                  <li><a href="/contact" className="hover:text-white transition-colors">Support</a></li>
                </ul>
              </div>
              
              <div>
                <h3 className="text-lg font-semibold mb-4">Company</h3>
                <ul className="space-y-2 text-gray-400">
                  <li><a href="/contact" className="hover:text-white transition-colors">Contact</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Privacy</a></li>
                  <li><a href="#" className="hover:text-white transition-colors">Terms</a></li>
                </ul>
              </div>
            </div>
            
            <div className="border-t border-gray-800 mt-8 pt-8 flex flex-col md:flex-row justify-between items-center">
              <p className="text-gray-400 text-sm">
                © 2024 LinkHub. All rights reserved.
              </p>
              <div className="flex space-x-6 mt-4 md:mt-0">
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Twitter</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">GitHub</a>
                <a href="#" className="text-gray-400 hover:text-white transition-colors">Discord</a>
              </div>
            </div>
          </div>
        </footer>
      )}
    </div>
  );
}

export default App;