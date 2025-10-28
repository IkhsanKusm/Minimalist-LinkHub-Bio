import React, { useState, useEffect, useContext } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import AuthContext from '../context/AuthContext';
import NeumorphicButton from './NeumorphicButton';
import ThreeDIcon from './3DIcon';

const Header = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();

  const { userInfo, logout } = useContext(AuthContext);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 10);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const isAuthPage = location.pathname === '/login' || location.pathname === '/register';
  const isDashboard = location.pathname === '/dashboard';

  // Hide header on auth pages and public profile pages
  if (isAuthPage || (location.pathname !== '/' && location.pathname !== '/features' && location.pathname !== '/plans' && location.pathname !== '/contact' && location.pathname !== '/dashboard')) {
    return null;
  }

  return (
    <header className={`
      fixed top-0 left-0 right-0 z-50 transition-all duration-500
      ${isScrolled || isDashboard 
        ? 'bg-white/90 backdrop-blur-xl shadow-lg border-b border-gray-200/50' 
        : 'bg-transparent'
      }
    `}>
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center py-4">
          {/* Logo */}
          <Link 
            to="/" 
            className="flex items-center space-x-3 group"
            onClick={() => setIsMobileMenuOpen(false)}
          >
            <ThreeDIcon 
              icon="⚡" 
              gradient="from-blue-500 to-purple-600" 
              className="w-10 h-10 group-hover:scale-110 transition-transform duration-300"
            />
            <div className="flex flex-col">
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Onesi
              </span>
              <span className="text-xs text-gray-500 -mt-1">by Creators</span>
            </div>
          </Link>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link 
              to="/features" 
              className="text-gray-700 hover:text-blue-600 font-medium transition-colors duration-300 relative group"
            >
              Features
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-blue-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/plans" 
              className="text-gray-700 hover:text-purple-600 font-medium transition-colors duration-300 relative group"
            >
              Pricing
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-purple-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-green-600 font-medium transition-colors duration-300 relative group"
            >
              Contact
              <span className="absolute bottom-0 left-0 w-0 h-0.5 bg-green-600 group-hover:w-full transition-all duration-300"></span>
            </Link>
          </nav>

          {/* Desktop Auth Buttons */}
          <div className="hidden md:flex items-center space-x-4">
            {userInfo ? (
              <>
                <NeumorphicButton 
                  variant="secondary"
                  onClick={() => navigate('/dashboard')}
                >
                  Dashboard
                </NeumorphicButton>
                <NeumorphicButton onClick={handleLogout}>
                  Logout
                </NeumorphicButton>
              </>
            ) : (
              <>
                <Link to="/login">
                  <NeumorphicButton variant="secondary">Sign In</NeumorphicButton>
                </Link>
                <Link to="/register">
                  <NeumorphicButton>Get Started Free</NeumorphicButton>
                </Link>
              </>
            )}
          </div>

          {/* Mobile Menu Button */}
          <button
            className="md:hidden p-2 rounded-xl bg-white/50 backdrop-blur-sm border border-gray-200"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            <div className="w-6 h-6 flex flex-col justify-center space-y-1">
              <span className={`w-full h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'rotate-45 translate-y-1.5' : ''}`}></span>
              <span className={`w-full h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? 'opacity-0' : 'opacity-100'}`}></span>
              <span className={`w-full h-0.5 bg-gray-700 transition-all duration-300 ${isMobileMenuOpen ? '-rotate-45 -translate-y-1.5' : ''}`}></span>
            </div>
          </button>
        </div>

        {/* Mobile Menu */}
        <div className={`
          md:hidden absolute top-full left-0 right-0 bg-white/95 backdrop-blur-xl border-t border-gray-200/50
          transition-all duration-500 overflow-hidden
          ${isMobileMenuOpen ? 'max-h-96 opacity-100 py-4' : 'max-h-0 opacity-0 py-0'}
        `}>
          <div className="flex flex-col space-y-4 px-4">
            <Link 
              to="/features" 
              className="text-gray-700 hover:text-blue-600 font-medium py-2 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Features
            </Link>
            <Link 
              to="/plans" 
              className="text-gray-700 hover:text-purple-600 font-medium py-2 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Pricing
            </Link>
            <Link 
              to="/contact" 
              className="text-gray-700 hover:text-green-600 font-medium py-2 border-b border-gray-100"
              onClick={() => setIsMobileMenuOpen(false)}
            >
              Contact
            </Link>
            
            <div className="pt-4 space-y-3">
              {userInfo ? (
                <>
                  <NeumorphicButton variant="secondary" onClick={() => { navigate('/dashboard'); setIsMobileMenuOpen(false); }} className="w-full justify-center">
                    Dashboard
                  </NeumorphicButton>
                  <NeumorphicButton onClick={() => { handleLogout(); setIsMobileMenuOpen(false); }} className="w-full justify-center">
                    Logout
                  </NeumorphicButton>
                </>
              ) : (
                <>
                  <Link to="/login" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                    <NeumorphicButton variant="secondary" className="w-full justify-center">Sign In</NeumorphicButton>
                  </Link>
                  <Link to="/register" className="block" onClick={() => setIsMobileMenuOpen(false)}>
                    <NeumorphicButton className="w-full justify-center">Get Started Free</NeumorphicButton>
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      </div>
    </header>
  );
};

export default Header;