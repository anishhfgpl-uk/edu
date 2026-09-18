import React, { useEffect } from 'react';
import { NotificationItem } from '../types';
import { Bell, CheckCircle2, Award, CreditCard, Megaphone, X } from 'lucide-react';

interface ToastAlertProps {
  notification: NotificationItem | null;
  onDismiss: () => void;
  onClick: (notification: NotificationItem) => void;
}

export const ToastAlert: React.FC<ToastAlertProps> = ({
  notification,
  onDismiss,
  onClick,
}) => {
  useEffect(() => {
    if (!notification) return;
    const timer = setTimeout(() => {
      onDismiss();
    }, 6000);
    return () => clearTimeout(timer);
  }, [notification, onDismiss]);

  if (!notification) return null;

  const getIcon = () => {
    switch (notification.category) {
      case 'attendance':
        return <CheckCircle2 className="w-5 h-5 text-emerald-600" />;
      case 'result':
        return <Award className="w-5 h-5 text-purple-600" />;
      case 'fee':
        return <CreditCard className="w-5 h-5 text-amber-600" />;
      case 'notice':
        return <Megaphone className="w-5 h-5 text-blue-600" />;
      default:
        return <Bell className="w-5 h-5 text-indigo-600" />;
    }
  };

  const getBorderColor = () => {
    switch (notification.category) {
      case 'attendance':
        return 'border-emerald-500/40 bg-emerald-50/95';
      case 'result':
        return 'border-purple-500/40 bg-purple-50/95';
      case 'fee':
        return 'border-amber-500/40 bg-amber-50/95';
      case 'notice':
        return 'border-blue-500/40 bg-blue-50/95';
      default:
        return 'border-indigo-500/40 bg-indigo-50/95';
    }
  };

  return (
    <div className="fixed bottom-5 right-5 z-50 max-w-sm w-full animate-bounce-short shadow-2xl rounded-2xl overflow-hidden pointer-events-auto">
      <div 
        id="toast-alert-card"
        onClick={() => onClick(notification)}
        className={`p-4 border backdrop-blur-md cursor-pointer transition-all hover:scale-[1.02] ${getBorderColor()}`}
      >
        <div className="flex items-start gap-3">
          <div className="p-2 rounded-xl bg-white shadow-xs flex-shrink-0">
            {getIcon()}
          </div>
          
          <div className="flex-1 min-w-0 pr-2">
            <div className="flex items-center justify-between gap-1">
              <span className="text-xs font-bold uppercase tracking-wider text-slate-700">
                🔔 Live Alert • {notification.category}
              </span>
              <span className="text-[10px] text-slate-500">{notification.timestamp}</span>
            </div>
            <h4 className="text-sm font-bold text-slate-900 truncate mt-0.5">
              {notification.title}
            </h4>
            <p className="text-xs text-slate-600 line-clamp-2 mt-0.5 leading-relaxed">
              {notification.message}
            </p>
          </div>

          <button
            id="toast-close-btn"
            onClick={(e) => {
              e.stopPropagation();
              onDismiss();
            }}
            className="p-1 rounded-md text-slate-400 hover:text-slate-700 hover:bg-slate-200/50 transition-colors flex-shrink-0"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Progress bar animation */}
        <div className="w-full bg-slate-200/60 h-1 mt-3 rounded-full overflow-hidden">
          <div className="h-full bg-indigo-600 animate-[shrink_6s_linear_forwards] origin-left" />
        </div>
      </div>
    </div>
  );
};
