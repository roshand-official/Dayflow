import React, { useEffect } from 'react';
import { motion, useSpring, useMotionValue, useTransform } from 'framer-motion';
import { cn } from '../../utils/helpers';
import GlassCard from './GlassCard';

const KPICard = ({ title, value, subtitle, icon: Icon, trend, className, animated = false }) => {
  // Try to parse the numeric part of the value if animated is true
  const isNumericStr = typeof value === 'string' && value.match(/[\d.]+/);
  const isNumber = typeof value === 'number';
  
  const shouldAnimate = animated && (isNumericStr || isNumber);
  const numValue = isNumber ? value : (shouldAnimate ? parseFloat(value.match(/[\d.]+/)[0]) : 0);
  const prefix = isNumericStr ? value.substring(0, value.indexOf(value.match(/[\d.]+/)[0])) : '';
  const suffix = isNumericStr ? value.substring(value.indexOf(value.match(/[\d.]+/)[0]) + value.match(/[\d.]+/)[0].length) : '';
  
  const motionValue = useMotionValue(0);
  const springValue = useSpring(motionValue, { damping: 30, stiffness: 100 });
  const displayValue = useTransform(springValue, (latest) => {
    // Keep 1 decimal place if original had it, else whole number
    const isFloat = value.toString().includes('.');
    const fixed = isFloat ? latest.toFixed(1) : Math.round(latest);
    return `${prefix}${fixed}${suffix}`;
  });

  useEffect(() => {
    if (shouldAnimate) {
      motionValue.set(numValue);
    }
  }, [numValue, shouldAnimate, motionValue]);

  return (
    <GlassCard className={cn("flex flex-col h-full justify-between relative overflow-hidden", className)}>
      <div className="flex justify-between items-start mb-4 relative z-10">
        <div>
          <h3 className="text-secondary mb-1">{title}</h3>
          <div className="text-metric">
            {shouldAnimate ? <motion.span>{displayValue}</motion.span> : value}
          </div>
        </div>
        {Icon && (
          <div className="w-10 h-10 rounded-xl bg-df-bg flex items-center justify-center text-df-muted">
            <Icon size={20} />
          </div>
        )}
      </div>
      
      <div className="flex items-center gap-2 mt-2 relative z-10">
        {trend && (
          <span className={cn(
            "text-sm font-semibold",
            trend.isPositive ? "text-df-success-text" : "text-df-danger-text"
          )}>
            {trend.isPositive ? '+' : ''}{trend.value}%
          </span>
        )}
        <span className="text-sm text-df-muted">{subtitle}</span>
      </div>
      
      {/* Decorative abstract background element for animated cards */}
      {animated && (
        <div className="absolute -bottom-6 -right-6 w-24 h-24 rounded-full bg-gradient-to-br from-df-lime/10 to-transparent blur-xl -z-0" />
      )}
    </GlassCard>
  );
};

export default KPICard;
