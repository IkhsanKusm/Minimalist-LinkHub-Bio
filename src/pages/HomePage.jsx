import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';
import NeumorphicButton from '../components/NeumorphicButton';
import ThreeDIcon from '../components/3DIcon';

const HomePage = () => {
  const stats = [
    { number: '10K+', label: 'Active Users' },
    { number: '50K+', label: 'Links Created' },
    { number: '1M+', label: 'Total Clicks' },
    { number: '99.9%', label: 'Uptime' }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <AnimatedBackground />
      
      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center">
            <div className="inline-flex items-center space-x-3 mb-8 px-6 py-3 bg-white/80 backdrop-blur-sm rounded-full border border-gray-200">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              <span className="text-sm font-medium text-gray-700">Trusted by 10,000+ creators worldwide</span>
            </div>

            <h1 className="text-5xl md:text-7xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 via-purple-600 to-blue-800 bg-clip-text text-transparent">
                One Link
              </span>
              <br />
              <span className="bg-gradient-to-r from-purple-600 to-pink-600 bg-clip-text text-transparent">
                For Everything
              </span>
            </h1>
            
            <p className="text-xl md:text-2xl text-gray-600 mb-8 max-w-3xl mx-auto leading-relaxed">
              The beautiful, customizable landing page that turns your audience into followers, 
              customers, and fans. Perfect for creators, entrepreneurs, and professionals.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center items-center mb-16">
              <Link to="/register" className="w-full sm:w-auto">
                <NeumorphicButton className="w-full sm:w-auto text-lg px-8 py-4">
                  🚀 Get Started Free
                </NeumorphicButton>
              </Link>
              <Link to="/features" className="w-full sm:w-auto">
                <NeumorphicButton variant="secondary" className="w-full sm:w-auto text-lg px-8 py-4">
                  📖 Learn More
                </NeumorphicButton>
              </Link>
            </div>
          </div>

          {/* Stats Section */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto mb-16">
            {stats.map((stat, index) => (
              <GlassCard key={index} className="p-6 text-center">
                <div className="text-2xl md:text-3xl font-bold text-gray-900 mb-2">{stat.number}</div>
                <div className="text-gray-600 text-sm">{stat.label}</div>
              </GlassCard>
            ))}
          </div>

          {/* Phone Mockup Preview */}
          <div className="max-w-md mx-auto">
            <GlassCard hover={true} className="p-8 transform hover:scale-105 transition-transform duration-300">
              <div className="bg-gradient-to-br from-purple-500 to-pink-500 rounded-3xl p-6 text-white shadow-2xl">
                <div className="text-center mb-6">
                  <div className="w-20 h-20 bg-white/20 rounded-full mx-auto mb-4 border-2 border-white/30 flex items-center justify-center">
                    <span className="text-2xl">👤</span>
                  </div>
                  <h3 className="text-xl font-semibold">@creativeuser</h3>
                  <p className="text-white/80 text-sm mt-1">Digital Creator • Sharing amazing content</p>
                </div>
                <div className="space-y-3">
                  {['📸 Instagram', '🎵 TikTok', '🛒 My Shop', '📧 Contact', '🎥 YouTube'].map((link, index) => (
                    <div 
                      key={index}
                      className="bg-white/20 backdrop-blur-sm rounded-xl py-3 px-4 text-center transition-all hover:bg-white/30 hover:scale-105 cursor-pointer border border-white/30"
                    >
                      {link}
                    </div>
                  ))}
                </div>
                <div className="text-center mt-4 text-white/60 text-xs">
                  Powered by LinkHub
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-20 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-3xl md:text-4xl font-bold text-white mb-4">
            Ready to Elevate Your Bio Link?
          </h2>
          <p className="text-blue-100 text-lg mb-8 max-w-2xl mx-auto">
            Join thousands of creators who are already using LinkHub to grow their audience and business.
          </p>
          <Link to="/register">
            <NeumorphicButton variant="glass" className="text-lg px-8 py-4 bg-white/20 hover:bg-white/30">
              ✨ Start Free Today
            </NeumorphicButton>
          </Link>
        </div>
      </section>
    </div>
  );
};

export default HomePage;