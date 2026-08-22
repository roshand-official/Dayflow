import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Briefcase, Menu } from 'lucide-react';
import { useAuth } from '../../context/AuthContext';

const MOBILE_NAV_ITEMS = [
  { path: '/', label: 'Home', icon: LayoutDashboard },
  { path: '/people', label: 'People', icon: Users },
  { path: '/attendance', label: 'Time', icon: Calendar },
  { path: '/leave', label: 'Leave', icon: Briefcase },
  { path: '/settings', label: 'Settings', icon: Menu },
];

const MobileNav = () => {
  return (
    <div className="flex items-center justify-around h-16 px-2 pb-safe">
      {MOBILE_NAV_ITEMS.map((item) => (
        <NavLink
          key={item.path}
          to={item.path}
          className={({ isActive }) => `
            flex flex-col items-center justify-center w-16 h-full transition-colors
            ${isActive ? 'text-df-text' : 'text-df-muted'}
          `}
        >
          {({ isActive }) => (
            <>
              <div className={`
                p-1.5 rounded-xl mb-1
                ${isActive ? 'bg-df-lime text-black' : 'bg-transparent'}
              `}>
                <item.icon size={20} strokeWidth={isActive ? 2.5 : 2} />
              </div>
              <span className={`text-[10px] font-medium ${isActive ? 'font-bold' : ''}`}>
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </div>
  );
};

export default MobileNav;
