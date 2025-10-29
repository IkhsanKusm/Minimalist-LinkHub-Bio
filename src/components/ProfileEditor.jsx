import React, { useState, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';
import GlassCard from './GlassCard';
import NeumorphicButton from './NeumorphicButton';

const ProfileEditor = ({ user, onSave }) => {
  const { userInfo } = useContext(AuthContext);
  const [formData, setFormData] = useState({
    avatar: user?.avatar || '',
    username: user?.username || '',
    bio: user?.bio || '',
    profilePhotoUrl: user?.profilePhotoUrl || '',
  });
  const [isEditing, setIsEditing] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState(null);

  const handleSave = async () => {
    setIsLoading(true);
    try {
      setError(null); // Reset error on new save attempt
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      const { data: updatedUser } = await axios.put(
        '/api/users/profile',
        formData,
        config
      );
      onSave(updatedUser); // Update the parent state
      setIsEditing(false);
    } catch (error) {
      if (error.response && error.response.status === 409) {
        setError('This username is already taken. Please choose another one.');
      } else {
        setError('An error occurred while updating your profile. Please try again.');
      }
      console.error('Failed to update profile:', error);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <GlassCard className="p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-bold text-gray-900">Profile Settings</h2>
        {!isEditing ? (
          <NeumorphicButton onClick={() => setIsEditing(true)}>✏️ Edit Profile</NeumorphicButton>
        ) : (
          <div className="flex space-x-2">
            <NeumorphicButton variant="secondary" onClick={() => setIsEditing(false)}>Cancel</NeumorphicButton>
            <NeumorphicButton onClick={handleSave} disabled={isLoading}>
              {isLoading ? 'Saving...' : '💾 Save'}
            </NeumorphicButton>
          </div>
        )}
      </div>

      {error && (
        <div className="p-3 mb-4 bg-red-100 border border-red-300 text-red-800 rounded-xl text-sm flex items-center space-x-2">
          <span>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor"><path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7 4a1 1 0 11-2 0 1 1 0 012 0zm-1-9a1 1 0 00-1 1v4a1 1 0 102 0V6a1 1 0 00-1-1z" clipRule="evenodd" /></svg>
          </span>
          <span>{error}</span>
        </div>
      )}

      <div className="space-y-6">
        {/* Avatar Upload */}
        <div className="flex items-start space-x-6">
          <div className="w-20 h-20 rounded-full flex items-center justify-center overflow-hidden bg-gray-200 shadow-inner">
            {formData.profilePhotoUrl ? (
              <img src={formData.profilePhotoUrl} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              <div className="w-20 h-20 bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center text-white text-2xl font-bold">
                {formData.username?.[0]?.toUpperCase() || 'U'}
              </div>
            )}
          </div>
          <div className="flex-grow w-0">
            <label className="block text-sm font-medium text-gray-700 mb-2">Profile Picture URL</label>
            {isEditing ? (
              <input
                type="url"
                value={formData.profilePhotoUrl}
                onChange={(e) => setFormData(prev => ({ ...prev, profilePhotoUrl: e.target.value }))}
                className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
                placeholder="https://..."
              />
            ) : <p className="text-sm text-gray-500 truncate">{formData.profilePhotoUrl || 'No image URL set.'}</p>}
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
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
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
              className="w-full px-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:outline-none transition-all"
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
            https://onesi.com/{formData.username || 'username'}
          </div>
        </div>
      </div>
    </GlassCard>
  );
};

export default ProfileEditor;