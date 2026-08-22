import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Moon, Sun, Bell, Lock, User, Globe, Trash2 } from 'lucide-react';
import { useTranslation } from 'react-i18next';
import { useTheme } from '../context/ThemeContext';
import { useAuth } from '../context/AuthContext';
import { useToast } from '../components/ui/Toast';
import GlassCard from '../components/ui/GlassCard';
import Button from '../components/ui/Button';

const LANGUAGE_MAP = {
  'English': 'en',
  'Spanish': 'es',
  'French': 'fr',
  'Hindi': 'hi',
};

const Settings = () => {
  const { theme, toggleTheme } = useTheme();
  const { user, logout } = useAuth();
  const toast = useToast();
  const { t, i18n } = useTranslation();
  
  const [activeTab, setActiveTab] = useState('appearance');
  
  const [settings, setSettings] = useState(() => {
    const saved = localStorage.getItem('dayflow_settings');
    return saved ? JSON.parse(saved) : {
      emailNotif: true,
      pushNotif: true,
      soundNotif: false,
      profileVisible: true,
      showStatus: true,
      twoFactor: false,
      language: 'English',
      timezone: 'Asia/Kolkata'
    };
  });

  const updateSetting = (key, value) => {
    const newSettings = { ...settings, [key]: value };
    setSettings(newSettings);
    localStorage.setItem('dayflow_settings', JSON.stringify(newSettings));
    toast.success(t('settings.updated'));
  };

  const changeLanguage = (langName) => {
    const code = LANGUAGE_MAP[langName] || 'en';
    i18n.changeLanguage(code);
    localStorage.setItem('dayflow_language', code);
    updateSetting('language', langName);
  };

  const tabs = [
    { id: 'appearance', label: t('settings.appearance'), icon: Sun },
    { id: 'notifications', label: t('settings.notifications'), icon: Bell },
    { id: 'privacy', label: t('settings.privacy'), icon: Lock },
    { id: 'account', label: t('settings.account'), icon: User },
    { id: 'language', label: t('settings.language'), icon: Globe },
  ];

  return (
    <div className="space-y-6 pb-20 md:pb-0 max-w-5xl mx-auto h-full flex flex-col">
      <div>
        <h2 className="text-3xl font-bold tracking-tight">{t('settings.title')}</h2>
        <p className="text-df-muted mt-1">{t('settings.subtitle')}</p>
      </div>

      <div className="flex flex-col md:flex-row gap-6 flex-1">
        {/* Sidebar Tabs */}
        <div className="w-full md:w-64 shrink-0">
          <GlassCard className="!p-2 flex flex-row md:flex-col gap-1 overflow-x-auto md:overflow-visible">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-3 px-4 py-3 rounded-xl transition-all whitespace-nowrap md:whitespace-normal text-left ${
                  activeTab === tab.id 
                    ? 'bg-df-bg font-semibold' 
                    : 'text-df-muted hover:bg-df-bg/50 hover:text-df-text'
                }`}
              >
                <tab.icon size={18} />
                <span>{tab.label}</span>
              </button>
            ))}
          </GlassCard>
        </div>

        {/* Content Area */}
        <div className="flex-1">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.2 }}
          >
            <GlassCard className="min-h-[400px]">
              
              {/* APPEARANCE */}
              {activeTab === 'appearance' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">{t('settings.theme_title')}</h3>
                    <p className="text-df-muted mb-6">{t('settings.theme_desc')}</p>
                    
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                      <button 
                        onClick={() => theme !== 'light' && toggleTheme()}
                        className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-4 ${theme === 'light' ? 'border-df-lime bg-df-bg' : 'border-df-border hover:border-df-muted'}`}
                      >
                        <div className="w-14 h-14 rounded-full bg-white flex items-center justify-center text-black shadow-md">
                          <Sun size={28} />
                        </div>
                        <span className="font-semibold">{t('settings.light_mode')}</span>
                      </button>
                      
                      <button 
                        onClick={() => theme !== 'dark' && toggleTheme()}
                        className={`p-6 rounded-xl border-2 transition-all flex flex-col items-center gap-4 ${theme === 'dark' ? 'border-df-lime bg-df-bg' : 'border-df-border hover:border-df-muted'}`}
                      >
                        <div className="w-14 h-14 rounded-full bg-[#111111] flex items-center justify-center text-white shadow-md">
                          <Moon size={28} />
                        </div>
                        <span className="font-semibold">{t('settings.dark_mode')}</span>
                      </button>
                    </div>
                  </div>
                </div>
              )}

              {/* NOTIFICATIONS */}
              {activeTab === 'notifications' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">{t('settings.notif_title')}</h3>
                    <p className="text-df-muted mb-6">{t('settings.notif_desc')}</p>
                    
                    <div className="space-y-4">
                      <ToggleSetting 
                        label={t('settings.email_notif')}
                        description={t('settings.email_notif_desc')}
                        checked={settings.emailNotif}
                        onChange={(val) => updateSetting('emailNotif', val)}
                      />
                      <ToggleSetting 
                        label={t('settings.push_notif')}
                        description={t('settings.push_notif_desc')}
                        checked={settings.pushNotif}
                        onChange={(val) => updateSetting('pushNotif', val)}
                      />
                      <ToggleSetting 
                        label={t('settings.sound_notif')}
                        description={t('settings.sound_notif_desc')}
                        checked={settings.soundNotif}
                        onChange={(val) => updateSetting('soundNotif', val)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* PRIVACY */}
              {activeTab === 'privacy' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">{t('settings.privacy_title')}</h3>
                    <p className="text-df-muted mb-6">{t('settings.privacy_desc')}</p>
                    
                    <div className="space-y-4">
                      <ToggleSetting 
                        label={t('settings.profile_visible')}
                        description={t('settings.profile_visible_desc')}
                        checked={settings.profileVisible}
                        onChange={(val) => updateSetting('profileVisible', val)}
                      />
                      <ToggleSetting 
                        label={t('settings.show_status')}
                        description={t('settings.show_status_desc')}
                        checked={settings.showStatus}
                        onChange={(val) => updateSetting('showStatus', val)}
                      />
                    </div>
                  </div>
                </div>
              )}

              {/* ACCOUNT */}
              {activeTab === 'account' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">{t('settings.account_title')}</h3>
                    <div className="bg-df-bg p-4 rounded-xl mb-6">
                      <p className="text-sm text-df-muted mb-1">{t('settings.email_address')}</p>
                      <p className="font-semibold">{user?.email}</p>
                    </div>
                    
                    <h4 className="font-semibold mb-4">{t('settings.security')}</h4>
                    <div className="space-y-4 mb-8">
                      <Button variant="secondary" onClick={() => toast.info('Password reset link sent to email')}>
                        {t('settings.change_password')}
                      </Button>
                      <ToggleSetting 
                        label={t('settings.two_factor')}
                        description={t('settings.two_factor_desc')}
                        checked={settings.twoFactor}
                        onChange={(val) => updateSetting('twoFactor', val)}
                      />
                    </div>
                    
                    <h4 className="font-semibold mb-4 text-df-danger-text">{t('settings.danger_zone')}</h4>
                    <Button variant="danger" icon={Trash2} onClick={() => logout()}>
                      {t('settings.sign_out')}
                    </Button>
                  </div>
                </div>
              )}

              {/* LANGUAGE */}
              {activeTab === 'language' && (
                <div className="space-y-8">
                  <div>
                    <h3 className="text-xl font-bold mb-4">{t('settings.lang_title')}</h3>
                    <p className="text-df-muted mb-6">{t('settings.lang_desc')}</p>
                    
                    <div className="space-y-6">
                      <div>
                        <label className="block text-sm font-semibold mb-2">{t('settings.lang_label')}</label>
                        <select 
                          className="w-full max-w-md h-12 px-4 rounded-xl border border-df-border bg-df-bg text-df-text outline-none"
                          value={settings.language}
                          onChange={(e) => changeLanguage(e.target.value)}
                        >
                          <option value="English">English</option>
                          <option value="Spanish">Español</option>
                          <option value="French">Français</option>
                          <option value="Hindi">हिन्दी</option>
                        </select>
                      </div>
                      
                      <div>
                        <label className="block text-sm font-semibold mb-2">{t('settings.timezone_label')}</label>
                        <select 
                          className="w-full max-w-md h-12 px-4 rounded-xl border border-df-border bg-df-bg text-df-text outline-none"
                          value={settings.timezone}
                          onChange={(e) => updateSetting('timezone', e.target.value)}
                        >
                          <option value="Asia/Kolkata">Asia/Kolkata (IST)</option>
                          <option value="America/New_York">America/New_York (EST)</option>
                          <option value="Europe/London">Europe/London (GMT)</option>
                        </select>
                      </div>
                    </div>
                  </div>
                </div>
              )}

            </GlassCard>
          </motion.div>
        </div>
      </div>
    </div>
  );
};

// Helper component for toggle switches
const ToggleSetting = ({ label, description, checked, onChange }) => (
  <div className="flex items-center justify-between py-3 border-b border-df-border last:border-0">
    <div className="pr-4">
      <p className="font-semibold">{label}</p>
      <p className="text-sm text-df-muted">{description}</p>
    </div>
    <button 
      onClick={() => onChange(!checked)}
      className={`relative w-12 h-6 rounded-full transition-colors shrink-0 ${checked ? 'bg-df-lime-dark' : 'bg-df-border'}`}
    >
      <span 
        className={`absolute top-1 left-1 bg-white w-4 h-4 rounded-full transition-transform ${checked ? 'translate-x-6' : 'translate-x-0'}`} 
      />
    </button>
  </div>
);

export default Settings;
