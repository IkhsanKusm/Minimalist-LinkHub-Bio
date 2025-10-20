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
      title: 'Complete Brand Customization',
      description: 'Take full control of your digital identity. Customize your profile, layout, and themes to create a beautiful, on-brand experience for your audience.',
      requirements: ['Custom Profile Picture & Bio', 'Unique @username URL', 'Professionally-Designed Themes']
    },
    {
      icon: '📊',
      title: 'Effortless Content Management',
      description: 'Our intuitive dashboard allows you to add, organize, and update your content in seconds. Spend less time managing links and more time creating.',
      requirements: ['Drag & Drop Reordering', 'Advanced Link Types (Video, Image)', 'Content Collections']
    },
    {
      icon: '👤',
      title: 'Advanced Link Types',
      description: 'Go beyond simple links. Embed YouTube videos, create stunning image galleries, and showcase your products to create a rich, interactive experience.',
      requirements: ['YouTube & Vimeo Video Embeds', 'Interactive Image Galleries', 'Product & Affiliate Links']
    },
    {
      icon: '🎨',
      title: 'Data-Driven Insights (Pro)',
      description: 'Understand your audience like never before. Track link clicks, view performance over time, and identify your most engaging content to make smarter decisions.',
      requirements: ['Detailed Click & View Tracking', 'Top-Performing Content Insights', 'Historical Performance Data']
    },
    {
      icon: '🛒',
      title: 'Integrated E-commerce (Pro)',
      description: 'Monetize your audience by selling digital or physical products directly from your page. Our integrated mini-shop makes it simple to turn followers into customers.',
      requirements: ['Elegant Product Displays', 'Direct-to-Customer Sales', 'Effortless Product Management']
    },
    {
      icon: '📈',
      title: 'Enterprise-Grade Security',
      description: 'Your digital presence is protected with industry-standard security, including JWT authentication and encrypted data, ensuring your account and audience are safe.',
      requirements: ['Secure User Authentication', 'Protected API Endpoints', 'Data Encryption']
    }
  ];

  const nonFunctional = [
    {
      icon: '⚡️',
      title: 'Global, High-Speed Delivery',
      description: 'Optimized assets and a global CDN ensure your page loads in under a second, providing a seamless experience for every visitor, anywhere in the world.'
    },
    {
      icon: '🛡️',
      title: 'Mobile-First Design', 
      description: 'Every theme and component is meticulously designed to look and function perfectly on any device, from smartphones to desktops.'
    },
    {
      icon: '🌐',
      title: 'Built to Scale',
      description: 'Our cloud-native architecture is designed to grow with you, effortlessly handling traffic spikes from your first follower to millions.'
    },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6 leading-tight tracking-tight">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">The All-In-One Platform for Your Links
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Onesi provides the ultimate toolkit to centralize your content, engage your audience, and transform your digital presence into a powerful, monetizable hub.
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

          {/* Non-Functional Requirements */}
          <GlassCard className="p-8 mb-20">
            <h2 className="text-3xl font-bold text-gray-900 mb-8 text-center">
              A Foundation of Excellence
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              {nonFunctional.map((item, index) => (
                <div key={index} className="text-center p-6">
                  <div className="text-4xl mb-4">{item.icon}</div>
                  <h3 className="text-lg font-semibold text-gray-900 mb-2">{item.title}</h3>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.description}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          {/* CTA Section */}
          <div className="text-center">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Ready to Elevate Your Digital Presence?
            </h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Join a growing community of creators, entrepreneurs, and brands who trust Onesi to be the center of their digital world.
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