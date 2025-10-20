/* eslint-disable no-unused-vars */
/* eslint-disable no-undef */
import React, { useState, useEffect, useContext, useMemo } from 'react';
import axios from 'axios';
import AuthContext from '../context/AuthContext';

import GlassCard from '../components/GlassCard';
import NeumorphicButton from '../components/NeumorphicButton';
import ThemeCustomizer from '../components/ThemeCustomizer';

import DraggableLinkList from '../components/DraggableLinkList';
import LinkEditorModal from '../components/LinkEditorModal';
import ProfileEditor from '../components/ProfileEditor';
import DeleteConfirmationModal from '../components/DeleteConfirmationModal';

import AnalyticsDashboard from '../components/AnalyticsDashboard';
import ShopManager from '../components/ShopManager';
import ProductEditorModal from '../components/ProductEditorModal';
import CollectionManager from '../components/CollectionManager';
import CollectionLinks from '../components/CollectionLinks';

const DashboardPage = () => {
  const { userInfo } = useContext(AuthContext);
  const isPro = userInfo?.isProUser || false;

  // States
  const [activeTab, setActiveTab] = useState('links');
  const [links, setLinks] = useState([]);
  const [products, setProducts] = useState([]);
  const [userProfile, setUserProfile] = useState({});
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);
  const [collections, setCollections] = useState([]);

  // Link Modal States
  const [isLinkModalOpen, setIsLinkModalOpen] = useState(false);
  const [editingLink, setEditingLink] = useState(null);
  const [isDeleteModalOpen, setIsDeleteModalOpen] = useState(false);
  const [deletingLinkId, setDeletingLinkId] = useState(null);
  const [isDeleting, setIsDeleting] = useState(false);

  // Collection Delete Modal States
  const [isDeleteCollectionModalOpen, setIsDeleteCollectionModalOpen] = useState(false);
  const [deletingCollectionId, setDeletingCollectionId] = useState(null);
  const [isDeletingCollection, setIsDeletingCollection] = useState(false);

  // --- NEW CENTRALIZED PRODUCT STATES ---
  const [isProductModalOpen, setIsProductModalOpen] = useState(false);
  const [editingProduct, setEditingProduct] = useState(null);  
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
        // Fetch links, profile and products in parallel
        const [linksRes, profileRes, productsRes, collectionsRes] = await Promise.all([
          axios.get('http://localhost:5001/api/links', config),
          axios.get('http://localhost:5001/api/users/profile', config),
          axios.get('http://localhost:5001/api/products', config),
          axios.get('http://localhost:5001/api/collections', config),
        ]);
        setLinks(linksRes.data);
        setUserProfile(profileRes.data);
        setProducts(productsRes.data);
        setCollections(collectionsRes.data);
      } catch (err) {
        setError('Failed to fetch data. Please try again.');
        console.error(err);
      } finally {
        setIsLoading(false);
      }
    };

    if (userInfo)
      fetchData();
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

  const openDeleteCollectionConfirmation = (collectionId) => {
    setDeletingCollectionId(collectionId);
    setIsDeleteCollectionModalOpen(true);
  };

  const confirmDeleteCollection = async () => {
    if (!deletingCollectionId) return;

    setIsDeletingCollection(true);
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`http://localhost:5001/api/collections/${deletingCollectionId}`, config);
      
      // Optimistically update state
      setCollections(collections.filter(col => col._id !== deletingCollectionId));
      // Uncategorize links that belonged to the deleted collection
      setLinks(links.map(link => 
        link.collectionId === deletingCollectionId 
          ? { ...link, collectionId: null } 
          : link
      ));

      setIsDeleteCollectionModalOpen(false);
      setDeletingCollectionId(null);
    } catch (err) {
      console.error('Failed to delete collection:', err);
      alert('Error: Could not delete collection.');
    } finally {
      setIsDeletingCollection(false);
    }
  };

  const handleThemeChange = async (themeId) => {
    try {
      const config = {
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${userInfo.token}`,
        },
      };
      // API call to update the theme
      const { data: updatedUser } = await axios.put(
        'http://localhost:5001/api/users/profile',
        { theme: themeId }, // Send only the theme to be updated
        config
      );

      // Update the local state instantly for a great UX
      setUserProfile(prevProfile => ({ ...prevProfile, theme: updatedUser.theme }));
    } catch (error) {
      console.error('Failed to update theme:', error);
      alert('Error: Could not save theme preference.');
    }
  };

  // --- FULLY IMPLEMENTED PRODUCT CRUD HANDLERS ---
  const handleAddProductClick = () => {
    setEditingProduct(null); // Ensure we are in "create" mode
    setIsProductModalOpen(true);
  };

  const handleEditProductClick = (product) => {
    setEditingProduct(product); // Set the product to edit
    setIsProductModalOpen(true);
  };
  
  const handleSaveProduct = async (productData) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };

    try {
      if (editingProduct) {
        // UPDATE Product
        const { data: updatedProduct } = await axios.put(
          `http://localhost:5001/api/products/${editingProduct._id}`,
          productData,
          config
        );
        setProducts(products.map(p => (p._id === updatedProduct._id ? updatedProduct : p)));
      } else {
        // CREATE Product
        const { data: newProduct } = await axios.post(
          'http://localhost:5001/api/products',
          productData,
          config
        );
        setProducts([...products, newProduct]);
      }
      setIsProductModalOpen(false);
      setEditingProduct(null);
      // Close the modal, which is handled in ShopManager, but user need to tell it to close
      // For simplicity, user can let ShopManager handle its own modal state.
      // The onSave prop will trigger the API call and update the global state here.
    } catch (err) {
      console.error('Failed to save product:', err);
      alert('Error: Could not save product.');
    }
  };

  const handleDeleteProduct = async (productId) => {
    if (!window.confirm('Are you sure you want to delete this product?')) 
      return;
    try {
      const config = { headers: { Authorization: `Bearer ${userInfo.token}` } };
      await axios.delete(`http://localhost:5001/api/products/${productId}`, config);
      setProducts(products.filter(p => p._id !== productId));
    } catch (err) {
      console.error('Failed to delete product:', err);
      alert('Error: Could not delete product.');
    }
  };

  const handleAssignLinkToCollection = async (linkId, collectionId) => {
    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    try {
      const { data: updatedLink } = await axios.put(
        `http://localhost:5001/api/links/${linkId}`,
        { collectionId: collectionId },
        config
      );
      setLinks(links.map(link => (link._id === updatedLink._id ? updatedLink : link)));
    } catch (err) {
      console.error('Failed to assign link to collection:', err);
      alert('Error: Could not assign link.');
    }
  };

  const handleReorderCollections = async (reorderedCollections) => {
    // Optimistic UI update
    setCollections(reorderedCollections);

    const config = {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${userInfo.token}`,
      },
    };
    try {
      const orderedIds = reorderedCollections.map(c => c._id);
      await axios.put('http://localhost:5001/api/collections/reorder', { orderedIds }, config);
    } catch (err) {
      console.error('Failed to reorder collections:', err);
      // NOTE: Here user might want to revert the state to its previous value
    }
  };

  const { categorizedLinks, uncategorizedLinks } = useMemo(() => {
    const categorized = {};
    const uncategorized = [];

    collections.forEach(collection => {
      categorized[collection._id] = [];
    });

    links.forEach(link => {
      if (link.collectionId && categorized[link.collectionId]) {
        categorized[link.collectionId].push(link);
      } else {
        uncategorized.push(link);
      }
    });

    return { categorizedLinks: categorized, uncategorizedLinks: uncategorized };
  }, [links]);

  const handleReorderLinks = (collectionId, reorderedLinksInCollection) => {
    // This is a complex operation if user want to persist order to the backend.
    // For now, user will just update the local state for a good UX.
    // A proper implementation would involve an API call to save the new order.
    const otherLinks = links.filter(link => link.collectionId !== collectionId);
    if (collectionId === 'uncategorized') {
      const otherCategorizedLinks = links.filter(link => !!link.collectionId);
      setLinks([...reorderedLinksInCollection, ...otherCategorizedLinks]);
    } else {
      const uncategorized = links.filter(link => !link.collectionId);
      setLinks([...otherLinks.filter(l => l.collectionId !== collectionId), ...reorderedLinksInCollection, ...uncategorized]);
    }
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
                  { id: 'shop', label: '🛒 My Shop' },
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
              <div className="space-y-8">
              <CollectionManager 
                collections={collections} 
                onCreate={async (title) => {
                  const config = {
                    headers: {
                      'Content-Type': 'application/json', // The property 'title' does not exist on type '{ name: any; }
                      Authorization: `Bearer ${userInfo.token}`,
                    },
                  };
                  try {
                    const { data: newCollection } = await axios.post(
                      'http://localhost:5001/api/collections',
                      { title },
                      config,
                    );
                    setCollections([...collections, newCollection]);
                  } catch (err) {
                    console.error('Failed to create collection:', err);
                    alert('Error: Could not create collection.');
                  }
                }}
                onDelete={openDeleteCollectionConfirmation}
                onReorder={handleReorderCollections}
              />
              {/* Display links within each collection */}
              {collections.map(collection => (
                categorizedLinks[collection._id]?.length > 0 && (
                  <CollectionLinks
                    key={collection._id}
                    collection={collection}
                    links={categorizedLinks[collection._id]}
                    onReorder={(collectionId, reordered) => setLinks([...links.filter(l => l.collectionId !== collectionId), ...reordered])}
                    onEdit={(link) => { setEditingLink(link); setIsLinkModalOpen(true); }}
                    onDelete={openDeleteConfirmation}
                    onAssignToCollection={handleAssignLinkToCollection}
                  />
                )
              ))}

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
                  links={uncategorizedLinks}
                  collections={collections}
                  onReorder={(reordered) => handleReorderLinks('uncategorized', reordered)}
                  onEdit={(link) => {
                    setEditingLink(link);
                    setIsLinkModalOpen(true);
                  }}
                  onDelete={openDeleteConfirmation}
                  onAssignToCollection={handleAssignLinkToCollection}
                />

                {links.length === 0 && (
                  <div className="text-center py-12 border-t border-gray-200 mt-6">
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
              </div>
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
                  // Pass the theme from the userProfile state
                  currentTheme={userProfile.theme || 'default'} 
                  // Pass the new handler function
                  onThemeChange={handleThemeChange}
                  isPro={isPro}
                />
              </GlassCard>
            )}

            {activeTab === 'analytics' && (
              isPro ? (
                <AnalyticsDashboard />
              ) : (
                <GlassCard className='p-6'>
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">📊</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro Feature</h3>
                    <p className="text-gray-600 mb-6">Upgrade to Pro to view detailed analytics</p>
                    <NeumorphicButton onClick={() => setIsPro(true)}>
                      🚀 Upgrade to Pro
                    </NeumorphicButton>
                  </div>
                </GlassCard>
              )
            )}

            {activeTab === 'shop' && (
              isPro ? (
                <ShopManager
                  products={products}
                  onAdd={handleAddProductClick}
                  onEdit={handleEditProductClick}
                  onDelete={handleDeleteProduct}
                />
              ) : (
                <GlassCard className="p-6">
                  <div className="text-center py-12">
                    <div className="text-6xl mb-4">🛒</div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-2">Pro Feature</h3>
                    <p className="text-gray-600 mb-6">Upgrade to Pro to build your own shop.</p>
                    <NeumorphicButton>🚀 Upgrade to Pro</NeumorphicButton>
                  </div>
                </GlassCard>
              )
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
        collections={collections}
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

      {/* Collection Delete Confirmation Modal */}
      <DeleteConfirmationModal
        isOpen={isDeleteCollectionModalOpen}
        onClose={() => {
          setIsDeleteCollectionModalOpen(false);
          setDeletingCollectionId(null);
        }}
        onConfirm={confirmDeleteCollection}
        isLoading={isDeletingCollection}
        title="Delete Collection?"
        message="Are you sure you want to delete this collection? All links within it will become uncategorized. This action cannot be undone."
      />

      <ProductEditorModal
        isOpen={isProductModalOpen}
        onClose={() => setIsProductModalOpen(false)}
        product={editingProduct}
        onSave={handleSaveProduct}
      />
    </div>
  );
};

export default DashboardPage;