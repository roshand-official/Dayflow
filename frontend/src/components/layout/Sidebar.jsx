import React from 'react';
import { NavLink } from 'react-router-dom';
import { LayoutDashboard, Users, Calendar, Briefcase, DollarSign, BarChart2, User, LogOut, Settings as SettingsIcon } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useAuth } from '../../context/AuthContext';

const Sidebar = () => {
  const { user, logout } = useAuth();
  const { t } = useTranslation();

  const NAV_ITEMS = [
    { path: '/', label: t('nav.dashboard'), icon: LayoutDashboard },
    { path: '/people', label: t('nav.people'), icon: Users },
    { path: '/attendance', label: t('nav.attendance'), icon: Calendar },
    { path: '/leave', label: t('nav.leave'), icon: Briefcase },
    { path: '/payroll', label: t('nav.payroll'), icon: DollarSign },
    { path: '/reports', label: t('nav.reports'), icon: BarChart2, role: 'hr_officer' },
  ];

  const filteredNav = NAV_ITEMS.filter(item => 
    !item.role || item.role === user?.role
  );

  return (
    <div className="flex flex-col h-full py-6">
      <div className="px-6 mb-8 flex items-center gap-3">
        <div className="w-8 h-8 rounded-lg bg-df-lime flex items-center justify-center font-bold text-black text-xl">
          D
        </div>
        <span className="text-xl font-bold text-df-text tracking-tight">DayFlow</span>
      </div>

      <div className="flex-1 px-4 space-y-1">
        {filteredNav.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => `
              flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200
              ${isActive 
                ? 'bg-df-lime text-black font-semibold' 
                : 'text-df-muted hover:bg-df-bg hover:text-df-text font-medium'}
            `}
          >
            <item.icon size={20} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </div>

      <div className="px-4 mt-auto space-y-1">
        <NavLink
          to="/settings"
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200
            ${isActive 
              ? 'bg-df-lime text-black font-semibold' 
              : 'text-df-muted hover:bg-df-bg hover:text-df-text font-medium'}
          `}
        >
          <SettingsIcon size={20} />
          <span>{t('nav.settings')}</span>
        </NavLink>
        <NavLink
          to="/profile"
          className={({ isActive }) => `
            flex items-center gap-3 px-4 py-3 rounded-xl transition-colors duration-200
            ${isActive 
              ? 'bg-df-lime text-black font-semibold' 
              : 'text-df-muted hover:bg-df-bg hover:text-df-text font-medium'}
          `}
        >
          <User size={20} />
          <span>{t('nav.profile')}</span>
        </NavLink>
        
        <button
          onClick={logout}
          className="w-full flex items-center gap-3 px-4 py-3 rounded-xl text-df-danger-text hover:bg-df-danger/20 font-medium transition-colors duration-200"
        >
          <LogOut size={20} />
          <span>{t('nav.logout')}</span>
        </button>
      </div>
    </div>
  );
};

export default Sidebar;
