import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';
import NeumorphicButton from '../components/NeumorphicButton';
import ThreeDIcon from '../components/3DIcon';

const FeaturesPage = () => {
  const features = [
    {
      icon: '🔐',
      title: 'Secure Authentication',
      description: 'Email/password authentication with JWT protection and password hashing using Bcrypt.',
      requirements: ['User sign-up, log-in, and log-out', 'JWT endpoint protection', 'Secure password storage']
    },
    {
      icon: '📊',
      title: 'Smart Dashboard',
      description: 'Private authenticated area for users to manage their profile and links with drag-and-drop functionality.',
      requirements: ['Link CRUD operations', 'Drag & drop reordering', 'Real-time preview']
    },
    {
      icon: '👤',
      title: 'Profile Management',
      description: 'Complete control over your public profile with customizable bio, username, and profile photo.',
      requirements: ['Profile photo updates', 'Bio customization', 'Unique username']
    },
    {
      icon: '🎨',
      title: 'Theme Customization',
      description: 'Choose from beautifully crafted themes to match your brand and personality.',
      requirements: ['Pre-defined themes', 'Pro: Custom colors', 'Mobile-optimized designs']
    },
    {
      icon: '🛒',
      title: 'Mini-Shop (Pro)',
      description: 'Sell products directly from your bio with beautiful product cards and external image URLs.',
      requirements: ['Product card display', 'External image URLs', 'Price and description']
    },
    {
      icon: '📈',
      title: 'Basic Analytics (Pro)',
      description: 'Track link performance with simple click counters to understand what resonates with your audience.',
      requirements: ['Click tracking', 'Total click counts', 'Per-link analytics']
    }
  ];

  const mvpScope = {
    inScope: [
      'Authentication system',
      'Link CRUD functionality', 
      'Public profile pages',
      'Basic & advanced theming',
      'Mini-Shop for Pro users',
      'Basic click analytics',
      'Drag-and-drop reordering'
    ],
    outOfScope: [
      'Automated payment gateways',
      'Advanced analytics (demographics, geography)',
      'Custom domains',
      'Social logins',
      'File uploads',
      'Full link shortening service'
    ]
  };

  const nonFunctional = [
    {
      title: 'Performance',
      description: 'Public pages load under 1 second with optimized assets and efficient rendering.'
    },
    {
      title: 'Security', 
      description: 'Password hashing with Bcrypt, JWT protection, and secure API endpoints.'
    },
    {
      title: 'Scalability',
      description: 'Horizontally scalable architecture to handle growing user base without redesign.'
    },
    {
      title: 'Usability',
      description: 'Simple, intuitive UI/UX with mobile-first responsive design.'
    },
    {
      title: 'Compatibility',
      description: 'Works on all modern browsers and mobile devices with full responsiveness.'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Powerful Features
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Everything you need to create a stunning bio link page that converts visitors 
              into followers, customers, and fans.
            </p>
          </div>

          {/* Features Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mb-20">
            {features.map((feature, index) => (
              <GlassCard key={index} hover={true} className="p-6">
                <ThreeDIcon 
                  icon={feature.icon}
                  gradient={index % 2 === 0 ? 'from-blue-500 to-cyan-500' : 'from-purple-500 to-pink-500'}
                  className="mb-4"
                />
                <h3 className="text-xl font-semibold text-gray-900 mb-3">{feature.title}</h3>
                <p className="text-gray-600 mb-4 leading-relaxed">{feature.description}</p>
                <ul className="space-y-2">
                  {feature.requirements.map((req, idx) => (
                    <li key={idx} className="flex items-center text-sm text-gray-500">
                      <span className="w-1.5 h-1.5 bg-blue-500 rounded-full mr-3"></span>
                      {req}
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>

          {/* MVP Scope */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 mb-20">
            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-green-500 mr-3">✅</span>
                In Scope (MVP)
              </h2>
              <ul className="space-y-3">
                {mvpScope.inScope.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-700">
                    <span className="w-2 h-2 bg-green-500 rounded-full mr-4"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </GlassCard>

            <GlassCard className="p-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-6 flex items-center">
                <span className="text-gray-400 mr-3">⏳</span>
                Future Enhancements
              </h2>
              <ul className="space-y-3">
                {mvpScope.outOfScope.map((item, index) => (
                  <li key={index} className="flex items-center text-gray-500">
                    <span className="w-2 h-2 bg-gray-400 rounded-full mr-4"></span>
                    {item}
                  </li>
                ))}
              </ul>
            </GlassCard>
          </div>

          {/* Non-Functional Requirements */}
          <GlassCard className="p-8 mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Technical Excellence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {nonFunctional.map((item, index) => (
                <div key={index} className="text-center p-6">
                  <div className="text-3xl mb-4">⭐</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm">{item.description}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Ready to Get Started?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join thousands of creators who trust Onesi for their bio link needs. 
              Start free and upgrade when you're ready for advanced features.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Link to="/register">
                <NeumorphicButton className="px-8 py-4">
                  🚀 Start Free Today
                </NeumorphicButton>
              </Link>
              <Link to="/plans">
                <NeumorphicButton variant="secondary" className="px-8 py-4">
                  💎 View Plans
                </NeumorphicButton>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default FeaturesPage;