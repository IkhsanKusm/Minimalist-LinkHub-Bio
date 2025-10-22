import React, { useState, useMemo } from 'react';
import GlassCard from './GlassCard';
import NeumorphicButton from './NeumorphicButton';
import DeleteConfirmationModal from './DeleteConfirmationModal';
import { Edit, Trash2, Search, PackageX } from 'lucide-react';

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="group relative rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm transition-all duration-300 hover:shadow-lg">
      <div className="aspect-square bg-gray-100 overflow-hidden">
        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-3">
        <h4 className="font-semibold text-gray-800 truncate">{product.title}</h4>
        <p className="text-green-600 font-bold text-sm">
          Rp{Number(product.price || 0).toLocaleString('id-ID')}
        </p>
      </div>
      {/* Hover Actions */}
      <div className="absolute top-3 right-3 flex flex-col space-y-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
        <button 
          onClick={() => onEdit(product)} 
          className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-blue-600 hover:bg-white hover:text-blue-700 shadow-md transition-all"
          aria-label="Edit product"
        >
          <Edit size={16} />
        </button>
        <button 
          onClick={() => onDelete(product._id)} 
          className="p-2 bg-white/80 backdrop-blur-sm rounded-full text-red-600 hover:bg-white hover:text-red-700 shadow-md transition-all"
          aria-label="Delete product"
        >
          <Trash2 size={16} />
        </button>
      </div>
    </div>
  );
};

const ShopManager = ({ products, onAdd, onEdit, onDelete }) => {
  const [searchTerm, setSearchTerm] = useState('');
  // State for delete confirmation modal
  const [isDeleteProductModalOpen, setIsDeleteProductModalOpen] = useState(false);
  const [deletingProductId, setDeletingProductId] = useState(null);
  const [isDeletingProduct, setIsDeletingProduct] = useState(false);

  const openDeleteProductConfirmation = (productId) => {
    setDeletingProductId(productId);
    setIsDeleteProductModalOpen(true);
  };

  const confirmDeleteProduct = async () => {
    if (!deletingProductId) return;

    setIsDeletingProduct(true);
    try {
      await onDelete(deletingProductId); // Call the onDelete prop from DashboardPage
      setIsDeleteProductModalOpen(false);
      setDeletingProductId(null);
    } catch (error) {
      console.error('Failed to delete product:', error);
      alert('Error: Could not delete product.'); // Display error if deletion fails
    } finally {
      setIsDeletingProduct(false);
    }
  };
  const filteredProducts = useMemo(() => {
    if (!searchTerm) {
      return products;
    }
    return products.filter(product =>
      product.title.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [products, searchTerm]);

  return (
    <>
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Shop</h2>
            <p className="text-gray-600">Manage products for your public page</p>
          </div>
          <NeumorphicButton onClick={onAdd}>
            + Add Product
          </NeumorphicButton>
        </div>

        {/* Search Input - only show if there are products */}
        {products.length > 0 && (
          <div className="relative mb-6">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" size={20} />
            <input
              type="text"
              placeholder="Search products..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-12 pr-4 py-3 bg-white border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 transition-all"
            />
          </div>
        )}

        {products.length > 0 ? ( // Check original products array for initial state
          filteredProducts.length > 0 ? (
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredProducts.map(product => (
                <ProductCard
                  key={product._id}
                  product={product}
                  onEdit={onEdit}
                  onDelete={openDeleteProductConfirmation} // Use the new handler
                />
              ))}
            </div>
          ) : (
            <div className="text-center py-12">
              <PackageX className="mx-auto text-gray-400" size={48} />
              <h3 className="text-xl font-semibold text-gray-900 mt-4 mb-2">No Products Found</h3>
              <p className="text-gray-600">Your search for "{searchTerm}" did not match any products.</p>
            </div>
          )
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your shop is empty</h3>
            <p className="text-gray-600 mb-6">Add your first product to start selling!</p>
            <NeumorphicButton onClick={onAdd}>
              Create First Product
            </NeumorphicButton>
          </div>
        )}
      </GlassCard> 

      {/* Delete Confirmation Modal for Products */}
      <DeleteConfirmationModal
        isOpen={isDeleteProductModalOpen}
        onClose={() => {
          setIsDeleteProductModalOpen(false);
          setDeletingProductId(null);
        }}
        onConfirm={confirmDeleteProduct}
        isLoading={isDeletingProduct}
        title="Delete Product?"
        message="Are you sure you want to delete this product? This action cannot be undone."
      />
    </>
  );
};

export default ShopManager;