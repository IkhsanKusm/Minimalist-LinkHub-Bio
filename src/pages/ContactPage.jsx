import React from 'react';
import AnimatedBackground from '../components/AnimatedBackground';
import GlassCard from '../components/GlassCard';
import NeumorphicButton from '../components/NeumorphicButton';

const ContactPage = () => {

  const contactMethods = [
    {
      icon: '📧',
      title: 'Email',
      description: 'Send us an email anytime',
      value: 'support@onesi.com',
      link: 'mailto:support@onesi.com'
    },
    {
      icon: '🐙',
      title: 'GitHub',
      description: 'Check out our open source',
      value: 'github.com/onesi',
      link: 'https://github.com'
    },
    {
      icon: '💬',
      title: 'Community',
      description: 'Join our Discord community',
      value: 'discord.gg/onesi',
      link: 'https://discord.com'
    }
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-purple-50 relative overflow-hidden">
      <AnimatedBackground />
      
      <div className="relative z-10 pt-32 pb-20">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Header */}
          <div className="text-center mb-16">
            <h1 className="text-4xl md:text-6xl font-bold mb-6">
              <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Get In Touch
              </span>
            </h1>
            <p className="text-xl text-gray-600 max-w-3xl mx-auto">
              Have questions about Onesi? We're here to help! Reach out to our team 
              and we'll get back to you as soon as possible.
            </p>
          </div>

          <div className="grid grid-cols-1 lg:grid-cols-3 gap-12">
            {/* Contact Information */}
            <div className="lg:col-span-1">
              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Contact Information</h2>
                <p className="text-gray-600 mb-8">
                  We're always happy to hear from our users. Whether you have a question, 
                  feedback, or need support, don't hesitate to reach out.
                </p>
                
                <div className="space-y-6">
                  {contactMethods.map((method, index) => (
                    <a
                      key={index}
                      href={method.link}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-start space-x-4 p-4 rounded-xl border border-gray-200 hover:border-blue-300 transition-colors group"
                    >
                      <div className="text-2xl flex-shrink-0">{method.icon}</div>
                      <div>
                        <h3 className="font-semibold text-gray-900 group-hover:text-blue-600 transition-colors">
                          {method.title}
                        </h3>
                        <p className="text-gray-600 text-sm mb-1">{method.description}</p>
                        <p className="text-blue-600 font-medium">{method.value}</p>
                      </div>
                    </a>
                  ))}
                </div>

                {/* FAQ Preview */}
                <div className="mt-8 p-6 bg-blue-50 rounded-xl border border-blue-200">
                  <h3 className="font-semibold text-blue-900 mb-3">Quick Help</h3>
                  <p className="text-blue-700 text-sm mb-4">
                    Check our documentation for common questions about setup, features, and troubleshooting.
                  </p>
                  <button className="text-blue-600 hover:text-blue-700 font-medium text-sm">
                    View Documentation →
                  </button>
                </div>
              </GlassCard>
            </div>

            {/* Contact Form */}
            <div className="lg:col-span-2">
              <GlassCard className="p-8">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Send us a Message</h2>
                
                <iframe 
                  src="https://docs.google.com/forms/d/e/1FAIpQLSeYQAAn149LG9D72IFzNJP4Ugb4IRtzaNZPqcAm_lE-D7azRA/viewform?embedded=true" 
                  width="640" 
                  height="800" 
                  frameborder="0" 
                  marginheight="0" 
                  marginwidth="0"
                  title="Onesi Contact Form">
                    Loading…
                </iframe>
              </GlassCard>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ContactPage;