import React from 'react';
import { cn } from '../../utils/helpers';

const shimmer = "relative overflow-hidden before:absolute before:inset-0 before:-translate-x-full before:animate-[shimmer_1.5s_ease-in-out_infinite] before:bg-gradient-to-r before:from-transparent before:via-white/60 before:to-transparent";

export const SkeletonLine = ({ className }) => (
  <div className={cn("h-4 bg-[#E8E6E1] rounded-lg", shimmer, className)} />
);

export const SkeletonCircle = ({ className }) => (
  <div className={cn("w-10 h-10 bg-[#E8E6E1] rounded-full", shimmer, className)} />
);

export const SkeletonCard = ({ className, children }) => (
  <div className={cn("glass-card animate-pulse", className)}>
    {children || (
      <>
        <div className="flex justify-between items-start mb-4">
          <div className="space-y-2 flex-1">
            <SkeletonLine className="w-24 h-3" />
            <SkeletonLine className="w-16 h-8" />
          </div>
          <SkeletonCircle className="w-10 h-10 rounded-xl" />
        </div>
        <SkeletonLine className="w-32 h-3" />
      </>
    )}
  </div>
);

export const SkeletonEmployeeCard = () => (
  <div className="glass-card animate-pulse">
    <div className="flex justify-between items-start mb-4">
      <SkeletonCircle className="w-14 h-14" />
      <SkeletonCircle className="w-8 h-8 rounded-lg" />
    </div>
    <div className="space-y-2 mb-4">
      <SkeletonLine className="w-3/4 h-5" />
      <SkeletonLine className="w-1/2 h-3" />
    </div>
    <div className="flex gap-2 mb-6">
      <SkeletonLine className="w-20 h-6 rounded-full" />
      <SkeletonLine className="w-14 h-6 rounded-full" />
    </div>
    <div className="pt-4 border-t border-df-border flex justify-between">
      <div className="flex gap-2">
        <SkeletonCircle />
        <SkeletonCircle />
      </div>
      <SkeletonLine className="w-20 h-4 mt-2" />
    </div>
  </div>
);

export const SkeletonTableRow = () => (
  <tr className="animate-pulse">
    <td className="py-4 px-6">
      <div className="flex items-center gap-3">
        <SkeletonCircle className="w-8 h-8" />
        <div className="space-y-1">
          <SkeletonLine className="w-28 h-4" />
          <SkeletonLine className="w-16 h-3" />
        </div>
      </div>
    </td>
    <td className="py-4 px-6"><SkeletonLine className="w-24 h-4" /></td>
    <td className="py-4 px-6"><SkeletonLine className="w-16 h-6 rounded-full" /></td>
    <td className="py-4 px-6"><SkeletonLine className="w-32 h-4" /></td>
    <td className="py-4 px-6 text-right"><SkeletonCircle className="w-8 h-8 rounded-lg ml-auto" /></td>
  </tr>
);
