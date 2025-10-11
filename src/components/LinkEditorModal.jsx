/* eslint-disable no-unused-vars */
import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import NeumorphicButton from './NeumorphicButton';
import { Link, Youtube, Image as ImageIcon, ShoppingCart, X } from 'lucide-react';

const LinkEditorModal = ({ isOpen, onClose, link, onSave, isPro = false }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: 'standard'
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (link) {
      setFormData({ title: link.title, url: link.url, type: link.type });
    } else {
      setFormData({ title: '', url: '', type: 'standard' });
    }
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
    { value: 'standard', label: 'Standard', icon: <Link size={24} />, pro: false },
    { value: 'video', label: 'Video', icon: <Youtube size={24} />, pro: false },
    { value: 'image', label: 'Image', icon: <ImageIcon size={24} />, pro: true },
    { value: 'product', label: 'Product', icon: <ShoppingCart size={24} />, pro: true },
  ];

  const handleSave = () => {
    // Basic validation
    if (!formData.title || !formData.url) {
      alert('Title and URL are required.');
      return;
    }
    onSave(formData);
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/20 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <GlassCard className="w-full max-w-lg p-0">
        <div className="p-6 flex justify-between items-center border-b border-white/20">
          <h2 className="text-2xl font-bold text-gray-900">{link ? 'Edit Link' : 'Add New Link'}</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Link Type</label>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
              {linkTypes.map((type) => (
                <button
                  key={type.value}
                  type="button"
                  disabled={type.pro && !isPro}
                  onClick={() => setFormData(prev => ({ ...prev, type: type.value }))}
                  className={`group p-4 rounded-xl border-2 text-center transition-all duration-300 relative
                    ${formData.type === type.value ? 'border-blue-500 bg-blue-50' : 'border-gray-200 hover:border-gray-300 bg-white'}
                    ${type.pro && !isPro ? 'opacity-60 cursor-not-allowed' : ''}`}
                >
                  <div className={`mx-auto w-fit transition-transform duration-300 ${formData.type === type.value ? 'text-blue-600 scale-110' : 'text-gray-500 group-hover:text-gray-900'}`}>{type.icon}</div>
                  <span className="block mt-2 font-medium text-sm text-gray-800">{type.label}</span>
                  {type.pro && (
                    <span className="absolute -top-2 -right-2 text-xs bg-yellow-400 text-yellow-900 px-2 py-0.5 rounded-full font-semibold">PRO</span>
                  )}
                </button>
              ))}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="e.g., My Portfolio"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">URL *</label>
            <input
              type="url"
              value={formData.url}
              onChange={(e) => setFormData(prev => ({ ...prev, url: e.target.value }))}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-all"
              placeholder="https://example.com"
            />
          </div>
        </div>

        <div className="p-6 flex justify-end space-x-3 bg-gray-50/50 rounded-b-2xl">
          <NeumorphicButton variant="secondary" onClick={onClose}>Cancel</NeumorphicButton>
          <NeumorphicButton onClick={handleSave}>{link ? 'Save Changes' : 'Create Link'}</NeumorphicButton>
        </div>
      </GlassCard>
    </div>
  );
};

export default LinkEditorModal;