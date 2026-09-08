import React from 'react';

export const GlassCard = ({ 
  children, 
  className = '', 
  accent = false, 
  interactive = false,
  onClick = null
}) => {
  return (
    <div 
      onClick={onClick}
      className={`
        ${accent ? 'liquid-glass-accent' : 'liquid-glass'}
        ${interactive ? 'liquid-glass-hover cursor-pointer' : ''}
        rounded-2xl p-5 relative overflow-hidden transition-all duration-300
        ${className}
      `}
    >
      {/* Specular sheen highlight along top rim */}
      <div className="absolute inset-x-0 top-0 h-[1px] bg-gradient-to-r from-transparent via-white/15 to-transparent pointer-events-none" />
      {children}
    </div>
  );
};
