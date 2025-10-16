import React from 'react';
import GlassCard from './GlassCard';
import NeumorphicButton from './NeumorphicButton';

const ProductCard = ({ product, onEdit, onDelete }) => {
  return (
    <div className="rounded-2xl overflow-hidden bg-white border border-gray-200 shadow-sm">
      <div className="aspect-square bg-gray-100">
        <img src={product.imageUrl} alt={product.title} className="w-full h-full object-cover" />
      </div>
      <div className="p-4">
        <h4 className="font-semibold text-gray-900 truncate">{product.title}</h4>
        <p className="text-green-600 font-bold">${product.price.toFixed(2)}</p>
        <div className="flex space-x-2 mt-3">
          <button onClick={() => onEdit(product)} className="text-xs font-medium text-blue-600 hover:text-blue-800">Edit</button>
          <button onClick={() => onDelete(product._id)} className="text-xs font-medium text-red-600 hover:text-red-800">Delete</button>
        </div>
      </div>
    </div>
  );
};

const ShopManager = ({ products, onAdd, onEdit, onDelete }) => {
  return (
    <>
      <GlassCard className="p-6">
        <div className="flex justify-between items-center mb-6">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">My Shop</h2>
            <p className="text-gray-600">Manage your products for sale</p>
          </div>
          <NeumorphicButton onClick={onAdd}>
            + Add Product
          </NeumorphicButton>
        </div>

        {products.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(product => (
              <ProductCard
                key={product._id}
                product={product}
                onEdit={onEdit}
                onDelete={onDelete}
              />
            ))}
          </div>
        ) : (
          <div className="text-center py-12">
            <div className="text-6xl mb-4">🛍️</div>
            <h3 className="text-xl font-semibold text-gray-900 mb-2">Your shop is empty</h3>
            <p className="text-gray-600 mb-6">Add your first product to start selling!</p>
            <NeumorphicButton onClick={onAdd}>
              Create First Product
            </NeumorphicButton>
          </div>
        )}
      </GlassCard> 
    </>
  );
};

export default ShopManager;