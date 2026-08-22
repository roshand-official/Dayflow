import React, { createContext, useContext, useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { CheckCircle, X, AlertTriangle, Info } from 'lucide-react';

const ToastContext = createContext(null);

let toastId = 0;

export const ToastProvider = ({ children }) => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback(({ message, type = 'info', duration = 4000 }) => {
    const id = ++toastId;
    setToasts(prev => [...prev, { id, message, type }]);
    if (duration > 0) {
      setTimeout(() => {
        setToasts(prev => prev.filter(t => t.id !== id));
      }, duration);
    }
    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts(prev => prev.filter(t => t.id !== id));
  }, []);

  const toast = {
    success: (message, opts) => addToast({ message, type: 'success', ...opts }),
    error: (message, opts) => addToast({ message, type: 'error', ...opts }),
    warning: (message, opts) => addToast({ message, type: 'warning', ...opts }),
    info: (message, opts) => addToast({ message, type: 'info', ...opts }),
  };

  return (
    <ToastContext.Provider value={toast}>
      {children}
      <ToastContainer toasts={toasts} onDismiss={removeToast} />
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
};

const iconMap = {
  success: CheckCircle,
  error: AlertTriangle,
  warning: AlertTriangle,
  info: Info,
};

const styleMap = {
  success: 'bg-[#F2FCF4] border-[#BFE8C4] text-[#2A5A30]',
  error: 'bg-[#FFF0F0] border-[#F2A6A0] text-[#702621]',
  warning: 'bg-[#FFFBEB] border-[#F4D98A] text-[#6B5205]',
  info: 'bg-[#F0F7FA] border-[#BFDCE8] text-[#2A5366]',
};

const ToastContainer = ({ toasts, onDismiss }) => {
  return (
    <div className="fixed top-4 right-4 z-[100] flex flex-col gap-3 max-w-sm w-full pointer-events-none">
      <AnimatePresence mode="popLayout">
        {toasts.map(toast => {
          const Icon = iconMap[toast.type] || Info;
          return (
            <motion.div
              key={toast.id}
              layout
              initial={{ opacity: 0, x: 60, scale: 0.95 }}
              animate={{ opacity: 1, x: 0, scale: 1 }}
              exit={{ opacity: 0, x: 60, scale: 0.95 }}
              transition={{ type: 'spring', stiffness: 400, damping: 30 }}
              className={`pointer-events-auto flex items-start gap-3 p-4 rounded-xl border shadow-lg backdrop-blur-sm ${styleMap[toast.type]}`}
            >
              <Icon size={20} className="shrink-0 mt-0.5" />
              <p className="text-sm font-medium flex-1">{toast.message}</p>
              <button
                onClick={() => onDismiss(toast.id)}
                className="shrink-0 opacity-60 hover:opacity-100 transition-opacity"
              >
                <X size={16} />
              </button>
            </motion.div>
          );
        })}
      </AnimatePresence>
    </div>
  );
};
