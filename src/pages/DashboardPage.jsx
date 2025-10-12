/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect, useContext } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

import GlassCard from '../components/GlassCard';
import NeumorphicButton from '../components/NeumorphicButton';
import DraggableLinkList from '../components/DraggableLinkList';
import LinkEditorModal from '../components/LinkEditorModal';
import ProfileEditor from '../components/ProfileEditor';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';
import ThemeCustomizer from '../components/ThemeCustomizer';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('links');
  const { userInfo } = useContext(AuthContext);

  const [links, setLinks] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const isPro = userInfo?.isProUser || false;
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingLinkId, setDeletingLinkId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);
  const [currentTheme, setCurrentTheme] = useState('default');

  // --- FETCH DATA FROM BACKEND ---
  useEffect(() => {
    const fetchData = async () => {
      setIsLoading(true);
      setError(null);
      const config = {
        headers: {
          Authorization: `Bearer ${userInfo.token}`,
        },
      };

      try {
        // Fetch links and profile in parallel
        const [linksRes, profileRes] = await Promise.all([
          axios.get('http://localhost:5001/api/links', config),
          axios.get('http://localhost:5001/api/users/profile', config)
        ]);

        setLinks(linksRes.data);
        setUserProfile(profileRes.data);

      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userInfo) {
      fetchData();
    }
  }, [userInfo]); // Re-fetch if userInfo changes

  // --- FULLY IMPLEMENTED CRUD HANDLERS ---

  const handleSaveLink = async (linkData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    try {
      if (editingLink) {
        // --- UPDATE (PUT) ---
        const { data: updatedLink } = await axios.put(
          `http://localhost:5001/api/links/${editingLink._id}`,
          linkData,
          config
        );
        setLinks(links.map(link => (link._id === updatedLink._id ? updatedLink : link)));
      } else {
        // --- CREATE (POST) ---
        const { data: newLink } = await axios.post(
          'http://localhost:5001/api/links',
          linkData,
          config
        );
        setLinks([...links, newLink]);
      }
      setIsLinkModalOpen(false);
      setEditingLink(null);
    } catch (err) {
      console.error('Failed to save link:', err);
      alert('Error: Could not save link.');
    }
  };

  const openDeleteConfirmation = (linkId) => {
    setDeletingLinkId(linkId);
    setIsDeleteModalOpen(true);
  };

  const confirmDeleteLink = async () => {
    if (!deletingLinkId) return;

    setIsDeleting(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      // --- DELETE ---
      await axios.delete(`http://localhost:5001/api/links/${deletingLinkId}`, config);
      setLinks(links.filter(link => link._id !== deletingLinkId));
      
      // Close modal and reset state
      setIsDeleteModalOpen(false);
      setDeletingLinkId(null);
    } catch (err) {
      console.error('Failed to delete link:', err);
      alert('Error: Could not delete link.');
    } finally {
      setIsDeleting(false);
    }
  };

  const handleReorderLinks = (reorderedLinks) => {
    setLinks(reorderedLinks);
  };

  if (isLoading) {
    return <div className="pt-32 text-center">Loading your dashboard...</div>;
  }

  if (error) {
    return <div className="pt-32 text-center text-red-500">{error}</div>;
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <GlassCard className="p-6 sticky top-24">
              <div className="space-y-1">
                {[
                  { id: 'links', label: '🔗 My Links' },
                  { id: 'profile', label: '👤 Profile' },
                  { id: 'themes', label: '🎨 Themes' },
                  { id: 'analytics', label: '📊 Analytics' }
                ].map((tab) => (
                  <button
                    key={tab.id}
                    onClick={() => setActiveTab(tab.id)}
                    className={`w-full text-left p-3 rounded-xl transition-all duration-300 ${
                      activeTab === tab.id
                        ? 'bg-blue-500 text-white shadow-lg'
                        : 'text-gray-700 hover:bg-gray-100'
                    }`}
                  >
                    <span className="flex items-center space-x-3">
                      <span>{tab.icon}</span>
                      <span className="font-medium">{tab.label}</span>
                    </span>
                  </button>
                ))}
              </div>

              {/* Pro Upgrade Banner */}
              {!isPro && (
                <div className="mt-6 p-4 bg-gradient-to-r from-amber-500 to-orange-500 rounded-xl text-white">
                  <div className="text-sm font-semibold mb-1">🚀 Go Pro</div>
                  <div className="text-xs opacity-90 mb-3">Unlock advanced features</div>
                  <NeumorphicButton 
                    variant="glass" 
                    className="w-full text-sm bg-white/20 hover:bg-white/30"
                    onClick={() => setIsPro(true)}
                  >
                    Upgrade Now
                  </NeumorphicButton>
                </div>
              )}
            </GlassCard>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3">
            {activeTab === 'links' && (
              <GlassCard className="p-6">
                <div className="flex justify-between items-center mb-6">
                  <div>
                    <h2 className="text-2xl font-bold text-gray-900">My Links</h2>
                    <p className="text-gray-600">Manage and organize your bio links</p>
                  </div>
                  <NeumorphicButton 
                    onClick={() => {
                      setEditingLink(null);
                      setIsLinkModalOpen(true);
                    }}
                  >
                    + Add New Link
                  </NeumorphicButton>
                </div>

                {/* --- DYNAMIC CONTENT --- */}
                {isLoading ? (
                  <div className="text-center py-12">Loading your links...</div>
                ) : error ? (
                  <div className="text-center py-12 text-red-500">{error}</div>
                ) : (
                  <>
                <DraggableLinkList
                  links={links}
                  onReorder={handleReorderLinks}
                  onEdit={(link) => {
                    setEditingLink(link);
                    setIsLinkModalOpen(true);
                  }}
                  onDelete={openDeleteConfirmation}
                />

                {links.length === 0 && (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🔗</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">No links yet</h3>
                    <p className="text-gray-600 mb-6">Add your first link to get started!</p>
                    <NeumorphicButton 
                      onClick={() => setIsLinkModalOpen(true)}
                    >
                      Create Your First Link
                    </NeumorphicButton>
                  </div>
                  )}
                </>
                )}
              </GlassCard>
            )}

            {activeTab === 'profile' && (
              <ProfileEditor 
                user={userProfile}
                onSave={(updatedUser) => setUserProfile(updatedUser)}
              />
            )}

            {activeTab === 'themes' && (
              <GlassCard className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Themes</h2>
                <ThemeCustomizer 
                  currentTheme={currentTheme}
                  onThemeChange={setCurrentTheme}
                  isPro={isPro}
                />
              </GlassCard>
            )}

            {activeTab === 'analytics' && (
              <GlassCard className="p-6">
                <h2 className="text-2xl font-bold text-gray-900 mb-6">Analytics</h2>
                {isPro ? (
                  <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                    <div className="text-center p-6 bg-blue-50 rounded-xl">
                      <div className="text-3xl font-bold text-blue-600 mb-2">
                        {links.reduce((total, link) => total + link.clicks, 0)}
                      </div>
                      <div className="text-gray-600">Total Clicks</div>
                    </div>
                    <div className="text-center p-6 bg-green-50 rounded-xl">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {links.length}
                      </div>
                      <div className="text-gray-600">Active Links</div>
                    </div>
                    <div className="text-center p-6 bg-purple-50 rounded-xl">
                      <div className="text-3xl font-bold text-purple-600 mb-2">
                        {Math.round(links.reduce((total, link) => total + link.clicks, 0) / links.length) || 0}
                      </div>
                      <div className="text-gray-600">Avg. Clicks/Link</div>
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro Feature</h3>
                    <p className="text-gray-600 mb-6">Upgrade to Pro to view detailed analytics</p>
                    <NeumorphicButton onClick={() => setIsPro(true)}>
                      🚀 Upgrade to Pro
                    </NeumorphicButton>
                  </div>
                )}
              </GlassCard>
            )}
          </div>
        </div>
      </div>

      {/* Link Editor Modal */}
      <LinkEditorModal
        isOpen={isLinkModalOpen}
        onClose={() => {
          setIsLinkModalOpen(false);
          setEditingLink(null);
        }}
        link={editingLink}
        onSave={handleSaveLink}
        isPro={isPro}
      />

      {/* Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteModalOpen}
        onClose={() => {
          setIsDeleteModalOpen(false);
          setDeletingLinkId(null);
        }}
        onConfirm={confirmDeleteLink}
        isLoading={isDeleting}
      />
    </div>
  );
};

export default DashboardPage;