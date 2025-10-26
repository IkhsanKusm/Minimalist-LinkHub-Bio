import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import GlassCard from './GlassCard';
import NeumorphicButton from './NeumorphicButton';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading, title = "Confirm Deletion", message = "Are you sure? This action cannot be undone." }) => {
  if (!isOpen) return null;

  return (
    <div className={`fixed inset-0 bg-gray-900/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in`}>
      <div className="w-full max-w-md bg-white rounded-2xl shadow-2xl border border-gray-200/80 transform transition-all animate-pop-in">
        <div className="p-6 flex justify-between items-center border-b border-gray-200">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
            <AlertTriangle className="text-red-500" size={28} />
            <span>{title}</span>
          </h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 text-center text-base">
            {message}
          </p>
        </div>

        <div className="p-6 flex justify-end space-x-3 bg-gray-50 rounded-b-2xl border-t border-gray-200">
          <NeumorphicButton variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </NeumorphicButton>
          <NeumorphicButton onClick={onConfirm} disabled={isLoading} className="bg-red-500 hover:bg-red-600 text-white shadow-red-200/50">
            {isLoading ? 'Deleting...' : 'Yes, Delete'}
          </NeumorphicButton>
        </div>
      </div>
    </div>
  );
};

export default DeleteConfirmationModal;