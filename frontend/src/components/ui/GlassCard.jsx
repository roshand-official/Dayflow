import React from 'react';
import { cn } from '../../utils/helpers';

const GlassCard = ({ children, className, onClick }) => {
  return (
    <div 
      onClick={onClick}
      className={cn(
        "glass-card",
        onClick && "cursor-pointer",
        className
      )}
    >
      {children}
    </div>
  );
};

export default GlassCard;
