import React, { useState } from 'react';
import GlassCard from '../components/GlassCard';
import NeumorphicButton from '../components/NeumorphicButton';
import DraggableLinkList from '../components/DraggableLinkList';
import LinkEditorModal from '../components/LinkEditorModal';
import ProfileEditor from '../components/ProfileEditor';
import ThemeCustomizer from '../components/ThemeCustomizer';

const DashboardPage = () => {
  const [activeTab, setActiveTab] = useState('links');
  const [isPro, setIsPro] = useState(false);
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  
  const [user, setUser] = useState({
    username: 'johndoe',
    bio: 'Digital creator sharing amazing content ✨',
    avatar: ''
  });
  
  const [links, setLinks] = useState([
    { id: '1', title: 'Instagram', url: 'https://instagram.com/johndoe', type: 'standard', clicks: 123 },
    { id: '2', title: 'My Portfolio', url: 'https://portfolio.com', type: 'standard', clicks: 45 },
    { id: '3', title: 'YouTube', url: 'https://youtube.com', type: 'video', clicks: 89 }
  ]);

  const [currentTheme, setCurrentTheme] = useState('default');

  const handleSaveLink = (linkData) => {
    if (editingLink) {
      setLinks(links.map(link => 
        link.id === editingLink.id ? { ...link, ...linkData } : link
      ));
    } else {
      const newLink = {
        id: Date.now().toString(),
        clicks: 0,
        ...linkData
      };
      setLinks([...links, newLink]);
    }
    setIsLinkModalOpen(false);
    setEditingLink(null);
  };

  const handleDeleteLink = (linkId) => {
    setLinks(links.filter(link => link.id !== linkId));
  };

  const handleReorderLinks = (reorderedLinks) => {
    setLinks(reorderedLinks);
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50 pt-16">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <GlassCard className="p-6 sticky top-24">
              <div className="space-y-1">
                {[
                  { id: 'links', label: '🔗 My Links', icon: '🔗' },
                  { id: 'profile', label: '👤 Profile', icon: '👤' },
                  { id: 'themes', label: '🎨 Themes', icon: '🎨' },
                  { id: 'analytics', label: '📊 Analytics', icon: '📊' }
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

                <DraggableLinkList
                  links={links}
                  onReorder={handleReorderLinks}
                  onEdit={(link) => {
                    setEditingLink(link);
                    setIsLinkModalOpen(true);
                  }}
                  onDelete={handleDeleteLink}
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
              </GlassCard>
            )}

            {activeTab === 'profile' && (
              <ProfileEditor 
                user={user}
                onSave={(updatedUser) => setUser(updatedUser)}
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
    </div>
  );
};

export default DashboardPage;