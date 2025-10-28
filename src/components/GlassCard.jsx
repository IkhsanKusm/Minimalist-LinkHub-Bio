import React from 'react';

const GlassCard = ({ children, className = '', hover = false }) => {
  return (
    <div className={`
      bg-white/10 backdrop-blur-md border border-white/20 rounded-2xl
      shadow-[0_8px_32px_0_rgba(31,38,135,0.37)]
      ${hover ? 'hover:bg-white/20 hover:shadow-[0_8px_32px_0_rgba(31,38,135,0.5)] transition-all duration-300' : ''}
      ${className}
    `}>
      {children}
    </div>
  );
};

export default GlassCard;