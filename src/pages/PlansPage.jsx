import React from 'react';
import { Link } from 'react-router-dom';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';
import NeumorphicButton from '../components/NeumorphicButton';

const PlansPage = () => {
  const plans = [
    {
      name: 'Free',
      description: 'Perfect for creators getting started',
      price: '$0',
      period: 'forever',
      popular: false,
      features: [
        { name: 'Unlimited Links', included: true },
        { name: 'Basic Link Management', included: true },
        { name: 'Pre-defined Themes', included: true },
        { name: 'Profile Customization', included: true },
        { name: 'Public Profile Page', included: true },
        { name: 'Basic Support', included: true },
        { name: 'Mini-Shop Feature', included: false },
        { name: 'Click Analytics', included: false },
        { name: 'Advanced Themes', included: false },
        { name: 'No Branding', included: false },
        { name: 'Priority Support', included: false }
      ],
      cta: 'Get Started Free',
      color: 'from-gray-500 to-gray-700'
    },
    {
      name: 'Pro',
      description: 'For professionals and businesses',
      price: '$9',
      period: 'per month',
      popular: true,
      features: [
        { name: 'Unlimited Links', included: true },
        { name: 'Basic Link Management', included: true },
        { name: 'Pre-defined Themes', included: true },
        { name: 'Profile Customization', included: true },
        { name: 'Public Profile Page', included: true },
        { name: 'Basic Support', included: true },
        { name: 'Mini-Shop Feature', included: true },
        { name: 'Click Analytics', included: true },
        { name: 'Advanced Themes', included: true },
        { name: 'No Branding', included: true },
        { name: 'Priority Support', included: true }
      ],
      cta: 'Go Pro',
      color: 'from-purple-500 to-pink-600'
    }
  ];

  const comparison = [
    {
      feature: 'User Authentication & Dashboard',
      free: true,
      pro: true
    },
    {
      feature: 'Unlimited Links',
      free: true,
      pro: true
    },
    {
      feature: 'Basic Link Management (CRUD)',
      free: true,
      pro: true
    },
    {
      feature: 'Basic Customization (pre-defined themes)',
      free: true,
      pro: true
    },
    {
      feature: 'Mini-Shop Functionality',
      free: false,
      pro: true
    },
    {
      feature: 'Basic Analytics (click counts)',
      free: false,
      pro: true
    },
    {
      feature: 'Advanced Customization',
      free: false,
      pro: true
    },
    {
      feature: 'No "Powered by LinkHub" branding',
      free: false,
      pro: true
    },
    {
      feature: 'Priority Support',
      free: false,
      pro: true
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
                Simple Pricing
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Start free, upgrade when you need advanced features. No hidden fees, no surprises.
            </p>
          </div>

          {/* Pricing Cards */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 max-w-5xl mx-auto mb-20">
            {plans.map((plan, index) => (
              <GlassCard 
                key={index} 
                className={`p-8 relative ${
                  plan.popular ? 'ring-2 ring-purple-500 transform scale-105' : ''
                }`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <span className="bg-gradient-to-r from-purple-500 to-pink-600 text-white px-4 py-2 rounded-full text-sm font-semibold">
                      Most Popular
                    </span>
                  </div>
                )}
                
                <div className="text-center mb-8">
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                  <p className="text-gray-600 mb-6">{plan.description}</p>
                  
                  <div className="mb-4">
                    <span className="text-4xl font-bold text-gray-900">{plan.price}</span>
                    {plan.period !== 'forever' && (
                      <span className="text-gray-600">/{plan.period}</span>
                    )}
                  </div>
                  
                  <Link to="/register">
                    <NeumorphicButton 
                      className={`w-full py-4 ${
                        plan.popular ? '' : 'variant="secondary"'
                      }`}
                    >
                      {plan.cta}
                    </NeumorphicButton>
                  </Link>
                </div>

                <ul className="space-y-4">
                  {plan.features.map((feature, idx) => (
                    <li key={idx} className="flex items-center">
                      {feature.included ? (
                        <span className="text-green-500 mr-3">✅</span>
                      ) : (
                        <span className="text-gray-300 mr-3">❌</span>
                      )}
                      <span className={feature.included ? 'text-gray-900' : 'text-gray-400'}>
                        {feature.name}
                      </span>
                    </li>
                  ))}
                </ul>
              </GlassCard>
            ))}
          </div>

          {/* Feature Comparison Table */}
          <GlassCard className="p-8 mb-12">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              Plan Comparison
            </h2>
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="border-b border-gray-200">
                    <th className="text-left py-4 font-semibold text-gray-900">Feature</th>
                    <th className="text-center py-4 font-semibold text-gray-900">Free</th>
                    <th className="text-center py-4 font-semibold text-gray-900">Pro</th>
                  </tr>
                </thead>
                <tbody>
                  {comparison.map((item, index) => (
                    <tr key={index} className="border-b border-gray-100">
                      <td className="py-4 text-gray-900">{item.feature}</td>
                      <td className="text-center py-4">
                        {item.free ? (
                          <span className="text-green-500 text-lg">✅</span>
                        ) : (
                          <span className="text-gray-300 text-lg">❌</span>
                        )}
                      </td>
                      <td className="text-center py-4">
                        {item.pro ? (
                          <span className="text-green-500 text-lg">✅</span>
                        ) : (
                          <span className="text-gray-300 text-lg">❌</span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </GlassCard>

          {/* Business Model Info */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 text-center">
            <GlassCard className="p-6">
              <div className="text-3xl mb-4">🎯</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Free Plan Strategy</h3>
              <p className="text-gray-600">
                Get users and validate core features with zero cost. Perfect for creators 
                who need a simple, clean bio link solution.
              </p>
            </GlassCard>

            <GlassCard className="p-6">
              <div className="text-3xl mb-4">💎</div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">Pro Plan Value</h3>
              <p className="text-gray-600">
                Advanced tools for professionals. Monetize your audience with mini-shop 
                and track performance with analytics.
              </p>
            </GlassCard>
          </div>
        </div>
      </div>
    </div>
  );
};

export default PlansPage;