import React from 'react';
import { cn } from '../../utils/helpers';

const Avatar = ({ src, alt, fallback, size = 'md', className }) => {
  const sizes = {
    sm: 'w-8 h-8 text-xs',
    md: 'w-12 h-12 text-base',
    lg: 'w-16 h-16 text-xl',
    xl: 'w-24 h-24 text-3xl',
  };

  return (
    <div 
      className={cn(
        "relative rounded-full flex items-center justify-center font-bold overflow-hidden bg-[#E8E6E1] text-[#111111] border border-[#E8E6E1]",
        sizes[size],
        className
      )}
    >
      {src ? (
        <img src={src} alt={alt} className="w-full h-full object-cover" />
      ) : (
        <span>{fallback || (alt ? alt[0].toUpperCase() : 'U')}</span>
      )}
    </div>
  );
};

export default Avatar;
