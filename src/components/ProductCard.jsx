import React from 'react';

const ProductCard = ({ product, onClick, theme }) => {
  return (
    <a
      href={product.productUrl}
      target="_blank"
      rel="noopener noreferrer"
      onClick={onClick}
      className={`group relative block rounded-2xl overflow-hidden shadow-lg transform hover:-translate-y-1 transition-all duration-300 
                 ${theme.button || 'bg-white'} 
                 hover:shadow-xl hover:shadow-blue-500/20`}
      >
      <div className="aspect-square bg-gray-100 overflow-hidden relative p-1">
        <img 
          src={product.imageUrl} 
          alt={product.title} 
          className="w-full h-full object-cover rounded-xl group-hover:scale-105 transition-transform duration-500"
        />
        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center">
          <span className={`px-4 py-2 rounded-full text-sm font-semibold ${theme.name} ${theme.button}`}>
            Shop Now
          </span>
        </div>
      </div>
      <div className="p-4">
        <h3 className={`font-bold truncate transition-colors ${theme.name || 'text-gray-900'}`}>
          {product.title}
        </h3>
        <p className={`text-sm truncate h-5 ${theme.text || 'text-gray-600'}`}>{product.description || ' '}</p>
        <div className="mt-2">
          <span className={`text-lg font-extrabold ${theme.accent || 'text-green-600'}`}>
            Rp{Number(product.price || 0).toLocaleString('id-ID', {
              minimumFractionDigits: 0,
              maximumFractionDigits: 2,
            })}
          </span>
        </div>
      </div>
    </a>
  );
};

export default ProductCard;