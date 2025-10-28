import React from 'react';

const ThreeDIcon = ({ icon, gradient = 'from-blue-500 to-purple-600', className = '' }) => {
  return (
    <div className={`
      w-16 h-16 rounded-2xl bg-gradient-to-br ${gradient}
      flex items-center justify-center text-white text-2xl
      shadow-lg transform rotate-3 transition-transform duration-300
      hover:rotate-0 hover:scale-110
      ${className}
    `}>
      {icon}
    </div>
  );
};

export default ThreeDIcon;