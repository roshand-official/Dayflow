import React from 'react';
import { cn } from '../../utils/helpers';

const Badge = ({ children, variant = 'info', className }) => {
  
  const variants = {
    info: 'bg-df-info text-df-info-text',
    success: 'bg-df-success text-df-success-text',
    warning: 'bg-df-warning text-df-warning-text',
    danger: 'bg-df-danger text-df-danger-text',
    neutral: 'bg-[#E8E6E1] text-[#111111]',
    active: 'bg-df-lime text-black',
  };

  return (
    <span className={cn(
      "px-3 py-1 rounded-full text-xs font-semibold tracking-wide uppercase",
      variants[variant],
      className
    )}>
      {children}
    </span>
  );
};

export default Badge;
