import React from 'react';
import { cn } from '../../utils/helpers';
import Spinner from './Spinner';

const Button = ({ 
  children, 
  variant = 'primary', 
  size = 'md', 
  className, 
  isLoading = false,
  disabled,
  icon: Icon,
  ...props 
}) => {
  const baseStyle = "inline-flex items-center justify-center font-semibold transition-all duration-200 disabled:opacity-50 disabled:cursor-not-allowed";
  
  const variants = {
    primary: "bg-df-lime text-black hover:bg-df-lime-dark shadow-sm",
    secondary: "bg-white text-black border border-df-border hover:bg-[#F7F6F2]",
    danger: "bg-[#FFF0F0] text-df-danger-text hover:bg-[#FFE5E5]",
    ghost: "bg-transparent text-df-muted hover:text-black hover:bg-[#F7F6F2]",
  };

  const sizes = {
    sm: "h-9 px-4 text-sm rounded-lg",
    md: "h-12 px-6 text-base rounded-xl",
    lg: "h-14 px-8 text-lg rounded-2xl",
    icon: "h-12 w-12 rounded-xl",
  };

  return (
    <button 
      className={cn(baseStyle, variants[variant], sizes[size], className)}
      disabled={disabled || isLoading}
      {...props}
    >
      {isLoading ? (
        <Spinner size="sm" color={variant === 'primary' ? 'black' : 'current'} />
      ) : (
        <>
          {Icon && <Icon size={size === 'sm' ? 16 : 20} className={cn(children ? "mr-2" : "")} />}
          {children}
        </>
      )}
    </button>
  );
};

export default Button;
