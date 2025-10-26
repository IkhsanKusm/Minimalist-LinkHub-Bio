import React, { useState, useEffect } from 'react';
import GlassCard from './GlassCard';
import NeumorphicButton from './NeumorphicButton';
import { X, Image as ImageIcon } from 'lucide-react';
import { isValidUrl } from '../utils/linkParser';

const ProductEditorModal = ({ isOpen, onClose, product, onSave }) => {
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    price: '',
    imageUrl: '',
    productUrl: ''
  });
  const [errors, setErrors] = useState({});

  useEffect(() => {
    if (product) {
      setFormData({
        title: product.title,
        description: product.description || '',
        price: product.price,
        imageUrl: product.imageUrl,
        productUrl: product.productUrl,
      });
    } else {
      // Reset form for new product
      setFormData({ title: '', description: '', price: '', imageUrl: '', productUrl: '' });
    }
    setErrors({}); // Clear errors when modal opens or product changes
  }, [product, isOpen]);

  const validate = () => {
    const newErrors = {};
    if (!formData.title) newErrors.title = 'Title is required.';
    if (!formData.price || isNaN(formData.price) || formData.price < 0) newErrors.price = 'Please enter a valid price.';
    if (!formData.imageUrl) {
      newErrors.imageUrl = 'Image URL is required.';
    } else if (!isValidUrl(formData.imageUrl)) {
      newErrors.imageUrl = 'Please enter a valid image URL.';
    }
    if (!formData.productUrl) newErrors.productUrl = 'Product link is required.';
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleSave = () => {
    if (validate()) {
      // Ensure URLs have a protocol
      const finalData = { ...formData };
      if (finalData.imageUrl && !finalData.imageUrl.startsWith('http')) {
        finalData.imageUrl = `https://` + finalData.imageUrl;
      }
      if (finalData.productUrl && !finalData.productUrl.startsWith('http')) {
        finalData.productUrl = `https://` + finalData.productUrl;
      }
      onSave(finalData);
    }
  };

  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in`}>
      <div className="w-full max-w-lg bg-white rounded-2xl shadow-2xl flex flex-col max-h-[90vh] border border-gray-200/80 transform transition-all animate-pop-in">
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900">{product ? 'Edit Product' : 'Add New Product'}</h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6 space-y-6 flex-1 overflow-y-auto">
          {/* Image Preview */}
          <div className="aspect-square w-full bg-gray-100 rounded-xl border border-gray-200 flex items-center justify-center overflow-hidden">
            {formData.imageUrl ? (
              <img src={formData.imageUrl} alt="Product preview" className="w-full h-full object-cover" />
            ) : (
              <ImageIcon className="text-gray-400" size={48} />
            )}
          </div>
          
          {/* Form Fields */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Title *</label>
            <input 
              type="text" 
              value={formData.title} 
              onChange={(e) => setFormData(p => ({ ...p, title: e.target.value }))} 
              className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition-all ${errors.title ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`} 
              placeholder="e.g., Handcrafted Leather Wallet" 
            />
            {errors.title && <p className="text-xs text-red-600 mt-1">{errors.title}</p>}
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
            <textarea 
              value={formData.description} 
              onChange={(e) => setFormData(p => ({ ...p, description: e.target.value }))} 
              className="w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition-all border-gray-200 focus:ring-blue-500" 
              rows="3" 
              placeholder="Copywriting your product"
            ></textarea>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Price ($) *</label>
              <input 
                type="number" 
                step="1000" 
                value={formData.price} 
                onChange={(e) => setFormData(p => ({ ...p, price: e.target.value }))} 
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition-all ${errors.price ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`} 
                placeholder="e.g., 150000" 
              />
              {errors.price && <p className="text-xs text-red-600 mt-1">{errors.price}</p>}
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Image URL *</label>
              <input 
                type="url" 
                value={formData.imageUrl} 
                onChange={(e) => setFormData(p => ({ ...p, imageUrl: e.target.value }))} 
                className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition-all ${errors.imageUrl ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`} 
                placeholder="https://..." 
              />
              {errors.imageUrl && <p className="text-xs text-red-600 mt-1">{errors.imageUrl}</p>}
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Product URL *</label>
            <input 
              type="url" 
              value={formData.productUrl} 
              onChange={(e) => setFormData(p => ({ ...p, productUrl: e.target.value }))} 
              className={`w-full px-4 py-3 bg-white border rounded-xl focus:ring-2 focus:border-transparent focus:outline-none transition-all ${errors.productUrl ? 'border-red-500 focus:ring-red-500' : 'border-gray-200 focus:ring-blue-500'}`} 
              placeholder="Link to your purchase page" 
            />
            {errors.productUrl && <p className="text-xs text-red-600 mt-1">{errors.productUrl}</p>}
          </div>
        </div>

        <div className="p-6 flex justify-end space-x-3 bg-gray-50 rounded-b-2xl border-t border-gray-200">
          <NeumorphicButton variant="secondary" onClick={onClose}>Cancel</NeumorphicButton>
          <NeumorphicButton onClick={handleSave}>{product ? 'Save Changes' : 'Create Product'}</NeumorphicButton>
        </div>
      </div>
    </div>
  );
};

export default ProductEditorModal;