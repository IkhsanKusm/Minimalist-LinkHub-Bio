import React from 'react';
import { X, Trash2, AlertTriangle } from 'lucide-react';
import GlassCard from './GlassCard';
import NeumorphicButton from './NeumorphicButton';

const DeleteConfirmationModal = ({ isOpen, onClose, onConfirm, isLoading }) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-white/60 backdrop-blur-sm flex items-center justify-center z-50 p-4 animate-fade-in">
      <GlassCard className="w-full max-w-md p-0">
        <div className="p-6 flex justify-between items-center border-b border-white/20">
          <h2 className="text-2xl font-bold text-gray-900 flex items-center space-x-3">
            <AlertTriangle className="text-red-500" />
            <span>Confirm Deletion</span>
          </h2>
          <button onClick={onClose} className="p-2 text-gray-500 hover:text-gray-900 rounded-full hover:bg-gray-100 transition-colors">
            <X size={24} />
          </button>
        </div>

        <div className="p-6">
          <p className="text-gray-700 text-center text-base">
            Are you sure you want to delete this link? This action cannot be undone.
          </p>
        </div>

        <div className="p-6 flex justify-end space-x-3 bg-gray-50/50 rounded-b-2xl">
          <NeumorphicButton variant="secondary" onClick={onClose} disabled={isLoading}>
            Cancel
          </NeumorphicButton>
          <NeumorphicButton onClick={onConfirm} disabled={isLoading} className="bg-red-500 hover:bg-red-600 text-white shadow-red-200/50">
            {isLoading ? 'Deleting...' : 'Yes, Delete'}
          </NeumorphicButton>
        </div>
      </GlassCard>
    </div>
  );
};

export default DeleteConfirmationModal;