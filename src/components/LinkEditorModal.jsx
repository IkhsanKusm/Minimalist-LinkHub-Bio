import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import NeumorphicButton from './NeumorphicButton';

const LinkEditorModal = ({ isOpen, onClose, link, onSave, isPro = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: 'standard'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (link) {
      setFormData(link);
    } else {
      setFormData({ title: '', url: '', type: 'standard' });
    }
    setErrors({});
  }, [link, isOpen]);

  const validateForm = () => {
    const newErrors = {};

    if (!formData.title.trim()) {
      newErrors.title = 'Title is required';
    }

    if (!formData.url.trim()) {
      newErrors.url = 'URL is required';
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL';
    }

    if ((formData.type === 'product' || formData.type === 'image') && !isPro) {
      newErrors.type = 'This feature requires Pro subscription';
    }

    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const isValidUrl = (string) => {
    try {
      new URL(string);
      return true;
    // eslint-disable-next-line no-unused-vars
    } catch (_) {
      return false;
    }
  };

  const linkTypes = [
    { 
      value: 'standard', 
      label: '🔗 Standard Link', 
      description: 'Regular website link',
      available: true
    },
    { 
      value: 'video', 
      label: '🎥 Video Embed', 
      description: 'Embed YouTube/Vimeo videos',
      available: true
    },
    { 
      value: 'image', 
      label: '🖼️ Image Embed', 
      description: 'Show image previews',
      available: isPro,
      pro: true
    },
    { 
      value: 'product', 
      label: '🛒 Product Card', 
      description: 'Product showcase with pricing',
      available: isPro,
      pro: true
    }
  ];

  const handleSave = () => {
    if (validateForm()) {
      onSave(formData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
      <GlassCard className="w-full max-w-md max-h-[90vh] overflow-y-auto">
        <div className="flex justify-between items-center mb-6 sticky top-0 bg-white py-4">
          <h2 className="text-2xl font-bold text-gray-900">
            {link ? 'Edit Link' : 'Add New Link'}
          </h2>
          <button 
            onClick={onClose} 
            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
          >
            ✕
          </button>
        </div>

        <div className="space-y-4">
          {/* Link Type Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link Type
            </label>
            <div className="grid grid-cols-2 gap-2">
              {linkTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  disabled={!type.available}
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                  className={`
                    p-3 rounded-xl border-2 text-left transition-all
                    ${formData.type === type.value
                      ? 'border-blue-500 bg-blue-50 ring-2 ring-blue-200'
                      : 'border-gray-200 hover:border-gray-300'
                    }
                    ${!type.available ? 'opacity-50 cursor-not-allowed' : ''}
                  `}
                >
                  <div className="font-medium text-gray-900 flex items-center justify-between">
                    {type.label}
                    {type.pro && (
                      <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded-full">
                        PRO
                      </span>
                    )}
                  </div>
                  <div className="text-xs text-gray-600 mt-1">{type.description}</div>
                </button>
              ))}
            </div>
            {errors.type && (
              <p className="mt-2 text-sm text-red-600 flex items-center space-x-1">
                <span>⚠️</span>
                <span>{errors.type}</span>
              </p>
            )}
          </div>

          {/* Title Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Link Title *
            </label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                ${errors.title ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200'}
              `}
              placeholder="e.g., My Instagram Profile"
            />
            {errors.title && (
              <p className="mt-1 text-sm text-red-600">{errors.title}</p>
            )}
          </div>

          {/* URL Input */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              URL *
            </label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all
                ${errors.url ? 'border-red-300 ring-2 ring-red-200' : 'border-gray-200'}
              `}
              placeholder="https://example.com"
            />
            {errors.url && (
              <p className="mt-1 text-sm text-red-600">{errors.url}</p>
            )}
          </div>

          {/* Dynamic Fields Based on Type */}
          {formData.type === 'product' && (
            <div className="space-y-3 p-4 bg-gradient-to-r from-amber-50 to-orange-50 rounded-xl border border-amber-200">
              <div className="flex items-center space-x-2 text-amber-800 mb-3">
                <span>⭐</span>
                <span className="font-medium">Product Information</span>
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Price
                </label>
                <input
                  type="text"
                  placeholder="$49.99"
                  className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Product Image URL
                </label>
                <input
                  type="url"
                  placeholder="https://example.com/product-image.jpg"
                  className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-amber-800 mb-2">
                  Description
                </label>
                <textarea
                  rows={2}
                  placeholder="Brief product description..."
                  className="w-full px-3 py-2 bg-white border border-amber-300 rounded-lg focus:ring-2 focus:ring-amber-500"
                />
              </div>
            </div>
          )}

          {formData.type === 'image' && (
            <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
              <div className="flex items-center space-x-2 text-blue-800">
                <span>🖼️</span>
                <span className="font-medium">Image Preview Enabled</span>
              </div>
              <p className="text-sm text-blue-600 mt-1">
                Visitors will see an image preview of your link
              </p>
            </div>
          )}

          {formData.type === 'video' && (
            <div className="p-4 bg-purple-50 rounded-xl border border-purple-200">
              <div className="flex items-center space-x-2 text-purple-800">
                <span>🎥</span>
                <span className="font-medium">Video Embed Enabled</span>
              </div>
              <p className="text-sm text-purple-600 mt-1">
                Supports YouTube, Vimeo, and other video platforms
              </p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex space-x-3 pt-4 sticky bottom-0 bg-white py-4">
            <NeumorphicButton
              variant="secondary"
              onClick={onClose}
              className="flex-1"
            >
              Cancel
            </NeumorphicButton>
            <NeumorphicButton
              onClick={handleSave}
              className="flex-1"
            >
              {link ? '💾 Update' : '✨ Create'} Link
            </NeumorphicButton>
          </div>
        </div>
      </GlassCard>
    </div>
  );
};

export default LinkEditorModal;