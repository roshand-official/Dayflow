import React, { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Bell, Search, Check, CheckCheck } from 'lucide-react';
import client from '../../api/client';
import { useAuth } from '../../context/AuthContext';
import Avatar from '../ui/Avatar';

const TopBar = () => {
  const { user } = useAuth();
  const location = useLocation();
  const navigate = useNavigate();
  
  const [searchQuery, setSearchQuery] = useState('');
  const [searchResults, setSearchResults] = useState([]);
  const [showSearchDropdown, setShowSearchDropdown] = useState(false);
  const searchRef = useRef(null);

  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);
  const [showNotifDropdown, setShowNotifDropdown] = useState(false);
  const notifRef = useRef(null);

  useEffect(() => {
    // Fetch notifications
    const fetchNotifs = async () => {
      try {
        const res = await client.get('/notifications');
        setNotifications(res.data.notifications);
        setUnreadCount(res.data.unread_count);
      } catch (e) {
        console.error(e);
      }
    };
    if (user) fetchNotifs();
  }, [user]);

  useEffect(() => {
    const delayDebounceFn = setTimeout(async () => {
      if (searchQuery.trim().length > 0) {
        try {
          const res = await client.get(`/employees/search?q=${searchQuery}`);
          setSearchResults(res.data);
          setShowSearchDropdown(true);
        } catch (e) {
          console.error(e);
        }
      } else {
        setSearchResults([]);
        setShowSearchDropdown(false);
      }
    }, 300);

    return () => clearTimeout(delayDebounceFn);
  }, [searchQuery]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (searchRef.current && !searchRef.current.contains(event.target)) {
        setShowSearchDropdown(false);
      }
      if (notifRef.current && !notifRef.current.contains(event.target)) {
        setShowNotifDropdown(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleMarkAsRead = async (id) => {
    try {
      await client.put(`/notifications/${id}/read`);
      setNotifications(prev => prev.map(n => n.id === id ? { ...n, is_read: true } : n));
      setUnreadCount(prev => Math.max(0, prev - 1));
    } catch (e) {
      console.error(e);
    }
  };

  const handleMarkAllRead = async () => {
    try {
      await client.put('/notifications/read-all');
      setNotifications(prev => prev.map(n => ({ ...n, is_read: true })));
      setUnreadCount(0);
    } catch (e) {
      console.error(e);
    }
  };
  
  const getPageTitle = () => {
    const path = location.pathname;
    if (path === '/') return 'Dashboard';
    if (path.startsWith('/people')) return 'People Directory';
    if (path.startsWith('/attendance')) return 'Attendance';
    if (path.startsWith('/leave')) return 'Leave Management';
    if (path.startsWith('/payroll')) return 'Payroll';
    if (path.startsWith('/reports')) return 'Reports';
    if (path.startsWith('/profile')) return 'My Profile';
    if (path.startsWith('/settings')) return 'Settings';
    return 'DayFlow';
  };

  return (
    <div className="h-full px-4 md:px-8 flex items-center justify-between">
      <h1 className="text-xl md:text-2xl font-bold">{getPageTitle()}</h1>
      
      <div className="flex items-center gap-4 md:gap-6">
        <div className="hidden md:flex relative" ref={searchRef}>
          <div className="flex items-center bg-df-bg rounded-full px-4 py-2 border border-df-border w-64 focus-within:border-black dark:focus-within:border-white transition-colors">
            <Search size={18} className="text-df-muted mr-2" />
            <input 
              type="text" 
              placeholder="Search employees..." 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onFocus={() => searchQuery && setShowSearchDropdown(true)}
              className="bg-transparent border-none outline-none text-sm w-full text-df-text placeholder-df-muted"
            />
          </div>
          
          {showSearchDropdown && searchResults.length > 0 && (
            <div className="absolute top-full mt-2 w-full bg-df-surface border border-df-border rounded-xl shadow-lg z-50 overflow-hidden">
              {searchResults.map(emp => (
                <div 
                  key={emp.id} 
                  className="p-3 border-b border-df-border last:border-0 hover:bg-df-bg cursor-pointer flex items-center gap-3"
                  onClick={() => {
                    navigate(`/people/${emp.id}`);
                    setShowSearchDropdown(false);
                    setSearchQuery('');
                  }}
                >
                  <Avatar src={emp.photo_url} alt={emp.full_name} size="sm" />
                  <div>
                    <p className="font-semibold text-sm leading-tight text-df-text">{emp.full_name}</p>
                    <p className="text-xs text-df-muted truncate">{emp.job_title}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
          {showSearchDropdown && searchQuery && searchResults.length === 0 && (
            <div className="absolute top-full mt-2 w-full bg-df-surface border border-df-border rounded-xl shadow-lg z-50 p-4 text-center text-sm text-df-muted">
              No results found.
            </div>
          )}
        </div>
        
        <div className="relative" ref={notifRef}>
          <button 
            className="relative p-2 text-df-muted hover:text-df-text transition-colors"
            onClick={() => setShowNotifDropdown(!showNotifDropdown)}
          >
            <Bell size={22} />
            {unreadCount > 0 && (
              <span className="absolute top-1 right-1 w-2.5 h-2.5 bg-df-lime border-2 border-df-surface rounded-full"></span>
            )}
          </button>

          {showNotifDropdown && (
            <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 bg-df-surface border border-df-border rounded-xl shadow-lg z-50 overflow-hidden flex flex-col max-h-[400px]">
              <div className="p-4 border-b border-df-border flex justify-between items-center bg-df-bg">
                <h3 className="font-bold">Notifications</h3>
                {unreadCount > 0 && (
                  <button onClick={handleMarkAllRead} className="text-xs font-semibold text-df-muted hover:text-df-text flex items-center gap-1">
                    <CheckCheck size={14} /> Mark all read
                  </button>
                )}
              </div>
              <div className="overflow-y-auto flex-1">
                {notifications.length > 0 ? (
                  notifications.map(notif => (
                    <div 
                      key={notif.id} 
                      className={`p-4 border-b border-df-border last:border-0 hover:bg-df-bg cursor-pointer ${notif.is_read ? 'opacity-70' : 'bg-[#D7FF00]/5 dark:bg-[#D7FF00]/10'}`}
                      onClick={() => {
                        handleMarkAsRead(notif.id);
                        if (notif.link) {
                          navigate(notif.link);
                          setShowNotifDropdown(false);
                        }
                      }}
                    >
                      <div className="flex justify-between items-start mb-1">
                        <p className={`font-semibold text-sm ${notif.is_read ? 'text-df-text' : 'text-black dark:text-white'}`}>{notif.title}</p>
                        {!notif.is_read && <span className="w-2 h-2 rounded-full bg-df-lime mt-1.5 shrink-0"></span>}
                      </div>
                      <p className="text-xs text-df-muted">{notif.message}</p>
                    </div>
                  ))
                ) : (
                  <div className="p-8 text-center text-df-muted text-sm">
                    No notifications yet.
                  </div>
                )}
              </div>
            </div>
          )}
        </div>
        
        <div className="flex items-center gap-3 pl-4 border-l border-df-border">
          <div className="hidden md:block text-right">
            <p className="text-sm font-semibold">{user?.employee_name || 'Admin User'}</p>
            <p className="text-xs text-df-muted capitalize">{user?.role.replace('_', ' ')}</p>
          </div>
          <div className="w-10 h-10 rounded-full bg-df-bg flex items-center justify-center font-semibold text-df-text overflow-hidden border border-df-border">
            {user?.photo_url ? (
              <img src={user.photo_url} alt="Profile" className="w-full h-full object-cover" />
            ) : (
              (user?.employee_name?.[0] || user?.email?.[0] || 'U').toUpperCase()
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TopBar;
