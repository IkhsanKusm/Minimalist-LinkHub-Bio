import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import NeumorphicButton from './NeumorphicButton';
import { Link, Youtube, Image as ImageIcon, ShoppingCart, X } from 'lucide-react';
import { getLinkDetails, isValidUrl } from '../utils/linkParser';

const LinkEditorModal = ({ isOpen, onClose, link, onSave, isPro = false, collections = [] }) => {
  const [formData, setFormData] = useState({
    title: '',
    url: '',
    type: 'standard'
  });
  const [errors, setErrors] = useState({});
  const [preview, setPreview] = useState({ type: 'standard' });

  useEffect(() => {
    if (link) {
      setFormData({ title: link.title, url: link.url, type: link.type, collectionId: link.collectionId || '' });
      setPreview(getLinkDetails(link.url));
    } else {
      setFormData({ title: '', url: '', type: 'standard', collectionId: '' });
      setPreview({ type: 'standard' });
    }
    setErrors({}); // Clear errors when modal opens/closes
  }, [link, isOpen]);

  const linkTypes = [
    { value: 'standard', label: 'Standard', icon: <Link size={24} />, pro: false },
    { value: 'image', label: 'Image', icon: <ImageIcon size={24} />, pro: false },
    { value: 'video', label: 'Video', icon: <Youtube size={24} />, pro: true },
    { value: 'product', label: 'Product', icon: <ShoppingCart size={24} />, pro: true },
  ];

  const handleUrlChange = (e) => {
    const newUrl = e.target.value;
    setFormData(prev => ({ ...prev, url: newUrl }));

    if (isValidUrl(newUrl)) {
      const details = getLinkDetails(newUrl);
      setPreview(details);
      // Auto-select link type if it's a special type
      if (details.type === 'image' || details.type === 'video') {
        setFormData(prev => ({ ...prev, type: details.type }));
      }
    } else {
      setPreview({ type: 'standard' });
    }
  };

  const handleSave = () => {
    const newErrors = {};
    if (!formData.title.trim()) {
      newErrors.title = 'Title cannot be empty.';
    }
    if (!formData.url.trim()) {
      newErrors.url = 'URL cannot be empty.';
    } else if (!isValidUrl(formData.url)) {
      newErrors.url = 'Please enter a valid URL (e.g., example.com)';
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    let finalUrl = formData.url;
    if (!finalUrl.startsWith('http')) {
      finalUrl = `https://` + finalUrl;
    }
    onSave({ ...formData, url: finalUrl });
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in`}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] border border-gray-200/80 transform transition-all animate-pop-in">
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{link ? 'Edit Link' : 'Add New Link'}</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto">
          <div className="p-6 space-y-6">
            {errors.general && (
              <div className="p-3 bg-red-50 border border-red-200 rounded-xl text-red-700 text-sm flex items-center space-x-2">
                <span>⚠️</span>
                <span>{errors.general}</span>
              </div>
            )}

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
                onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}                className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition-all ${
                  errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                }`}
                placeholder="e.g., My Portfolio"
                required
              />
              {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">URL *</label>
              <input
                type="url"
                value={formData.url}
                onChange={handleUrlChange}
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition-all ${
                  errors.url ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'
                }`}
                placeholder="https://example.com"
                required
              />
              {errors.url && <p className="text-xs text-red-600 mt-1">{errors.url}</p>}
            </div>

            {/* --- NEW COLLECTION DROPDOWN --- */}
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Collection (Optional)</label>
                <select
                  value={formData.collectionId || ''}
                  onChange={(e) => setFormData(prev => ({ ...prev, collectionId: e.target.value }))}
                  className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                >
                  <option value="">Uncategorized</option>
                  {collections.map(collection => (
                    <option key={collection._id} value={collection._id}>
                      {collection.title}
                    </option>
                  ))}
                </select>
              </div>
          </div>

          {/* Live Preview Section */}
          {preview.type !== 'standard' && (
            <div className="p-6 pt-0">
              <h3 className="text-sm font-medium text-gray-600 mb-3">Preview</h3>
              <div className="rounded-xl overflow-hidden bg-gray-100 border border-gray-200 flex items-center justify-center aspect-video animate-fade-in">
                {preview.type === 'image' && (
                  <img src={preview.src} alt="Link preview" className="w-full h-full object-cover" />
                )}
                {preview.type === 'video' && preview.platform === 'youtube' && (
                  <iframe
                    className="w-full h-full"
                    src={`https://www.youtube.com/embed/${preview.videoId}`}
                    title="YouTube video player"
                    frameBorder="0"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                    allowFullScreen
                  ></iframe>
                )}
                {preview.type === 'video' && preview.platform === 'vimeo' && (
                  <iframe
                    className="w-full h-full"
                    src={`https://player.vimeo.com/video/${preview.videoId}`}
                    title="Vimeo video player"
                    frameBorder="0"
                    allow="autoplay; fullscreen; picture-in-picture"
                    allowFullScreen></iframe>
                )}
              </div>
            </div>
          )}
        </div>

        <div className="p-6 flex justify-end space-x-3 bg-gray-50 rounded-b-2xl border-t border-gray-200">
          <NeumorphicButton variant="secondary" onClick={onClose}>Cancel</NeumorphicButton>
          <NeumorphicButton onClick={handleSave}>{link ? 'Save Changes' : 'Create Link'}</NeumorphicButton>
        </div>
      </div>
    </div>
  );
};

export default LinkEditorModal;