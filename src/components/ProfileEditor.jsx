import React, { useState } from 'react';
import GlassCard from './GlassCard';
import NeumorphicButton from './NeumorphicButton';

const ProfileEditor = ({ user, onSave }) => {
  const [formData, setFormData] = useState({
    username: user?.username || '',
    bio: user?.bio || '',
    avatar: user?.avatar || ''
  });
  const [isEditing, setIsEditing] = useState(false);

  const handleSave = () => {
    onSave(formData);
    setIsEditing(false);
  };

  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        {!isEditing ? (
          <NeumorphicButton onClick={() => setIsEditing(true)}>
            ✏️ Edit Profile
          </NeumorphicButton>
        ) : (
          <div className="flex space-x-2">
            <NeumorphicButton variant="secondary" onClick={() => setIsEditing(false)}>
              Cancel
            </NeumorphicButton>
            <NeumorphicButton onClick={handleSave}>
              💾 Save
            </NeumorphicButton>
          </div>
        )}
      </div>

      <div className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-center space-x-6">
          <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
            {formData.username?.[0]?.toUpperCase() || 'U'}
          </div>
          <div>
            <div className="text-sm text-gray-600 mb-2">Profile Picture</div>
            {isEditing && (
              <NeumorphicButton variant="secondary" className="text-sm">
                📁 Upload Image
              </NeumorphicButton>
            )}
          </div>
        </div>

        {/* Username */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Username
          </label>
          {isEditing ? (
            <input
              type="text"
              value={formData.username}
              onChange={(e) => setFormData(prev => ({ ...prev, username: e.target.value }))}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="yourusername"
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
              {formData.username}
            </div>
          )}
        </div>

        {/* Bio */}
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Bio
          </label>
          {isEditing ? (
            <textarea
              value={formData.bio}
              onChange={(e) => setFormData(prev => ({ ...prev, bio: e.target.value }))}
              rows={3}
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500"
              placeholder="Tell people about yourself..."
            />
          ) : (
            <div className="px-4 py-3 bg-gray-50 rounded-xl text-gray-900">
              {formData.bio || 'No bio yet...'}
            </div>
          )}
        </div>

        {/* Public URL Preview */}
        <div className="p-4 bg-blue-50 rounded-xl border border-blue-200">
          <div className="text-sm text-blue-800 font-medium mb-1">Your Public URL</div>
          <div className="text-blue-600">
            https://linkhub.com/{formData.username || 'username'}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default ProfileEditor;