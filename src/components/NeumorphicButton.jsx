import React from 'react';

const NeumorphicButton = ({ 
  children, 
  onClick, 
  variant = 'primary',
  className = '',
  ...props 
}) => {
  const baseStyles = `
    rounded-xl font-semibold transition-all duration-300 active:transform active:scale-95
    focus:outline-none focus:ring-2 focus:ring-offset-2
  `;

  const variants = {
    primary: `
      bg-gradient-to-r from-blue-500 to-purple-600 text-white
      shadow-lg shadow-blue-500/25
      hover:shadow-xl hover:shadow-blue-500/40 hover:from-blue-600 hover:to-purple-700
      focus:ring-blue-500
    `,
    secondary: `
      bg-gray-100 text-gray-700
      shadow-[inset_2px_2px_5px_rgba(255,255,255,0.6),inset_-2px_-2px_5px_rgba(0,0,0,0.1)]
      hover:shadow-[inset_3px_3px_6px_rgba(255,255,255,0.6),inset_-3px_-3px_6px_rgba(0,0,0,0.1)]
      hover:bg-gray-200
      focus:ring-gray-400
    `,
    glass: `
      bg-white/10 backdrop-blur-md text-white border border-white/20
      shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
      hover:bg-white/20 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.5)]
      focus:ring-white/50
    `
  };

  return (
    <button
      className={`${baseStyles} ${variants[variant]} ${className} px-6 py-3`}
      onClick={onClick}
      {...props}
    >
      {children}
    </button>
  );
};

export default NeumorphicButton;