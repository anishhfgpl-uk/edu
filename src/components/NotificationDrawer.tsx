import React, { useState } from 'react';
import { NotificationItem, NotificationCategory } from '../types';
import { 
  X, 
  CheckCheck, 
  Trash2, 
  Bell, 
  CheckCircle2, 
  Award, 
  CreditCard, 
  Megaphone,
  BookOpen,
  Filter
} from 'lucide-react';

interface NotificationDrawerProps {
  isOpen: boolean;
  onClose: () => void;
  notifications: NotificationItem[];
  onMarkAllRead: () => void;
  onMarkAsRead: (id: string) => void;
  onClearAll: () => void;
  onSelectNotification: (item: NotificationItem) => void;
  isHindi: boolean;
}

export const NotificationDrawer: React.FC<NotificationDrawerProps> = ({
  isOpen,
  onClose,
  notifications,
  onMarkAllRead,
  onMarkAsRead,
  onClearAll,
  onSelectNotification,
  isHindi,
}) => {
  const [activeCategory, setActiveCategory] = useState<string>('all');

  if (!isOpen) return null;

  const filtered = notifications.filter((n) => {
    if (activeCategory === 'all') return true;
    return n.category === activeCategory;
  });

  const unreadCount = notifications.filter((n) => !n.read).length;

  const getCategoryIcon = (category: NotificationCategory) => {
    switch (category) {
      case 'attendance':
        return <CheckCircle2 className="w-4 h-4 text-emerald-600" />;
      case 'result':
        return <Award className="w-4 h-4 text-purple-600" />;
      case 'fee':
        return <CreditCard className="w-4 h-4 text-amber-600" />;
      case 'notice':
        return <Megaphone className="w-4 h-4 text-blue-600" />;
      default:
        return <BookOpen className="w-4 h-4 text-indigo-600" />;
    }
  };

  const categories = [
    { id: 'all', label: isHindi ? 'सभी' : 'All', icon: Filter },
    { id: 'attendance', label: isHindi ? 'उपस्थिति' : 'Attendance', icon: CheckCircle2 },
    { id: 'result', label: isHindi ? 'परिणाम' : 'Results', icon: Award },
    { id: 'fee', label: isHindi ? 'फीस' : 'Fees', icon: CreditCard },
    { id: 'notice', label: isHindi ? 'सूचना' : 'Notices', icon: Megaphone },
  ];

  return (
    <div className="fixed inset-0 z-50 overflow-hidden">
      {/* Backdrop */}
      <div 
        id="drawer-backdrop"
        onClick={onClose}
        className="absolute inset-0 bg-slate-900/50 backdrop-blur-xs transition-opacity"
      />

      <div className="fixed inset-y-0 right-0 max-w-full flex pl-10">
        <div className="w-screen max-w-md bg-white shadow-2xl flex flex-col">
          
          {/* Header */}
          <div className="p-4 sm:p-5 border-b border-slate-200 bg-slate-50/70">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 flex items-center justify-center text-indigo-700">
                  <Bell className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-base font-bold text-slate-900">
                    {isHindi ? 'सूचना एवं अलर्ट केंद्र' : 'Alerts & Notifications'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {unreadCount > 0 
                      ? `${unreadCount} ${isHindi ? 'नई अपठित सूचनाएं' : 'unread notifications'}`
                      : isHindi ? 'सभी सूचनाएं पढ़ी जा चुकी हैं' : 'All updates are up to date'}
                  </p>
                </div>
              </div>

              <button
                id="close-drawer-btn"
                onClick={onClose}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-200/60 transition-colors"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Quick Actions */}
            <div className="flex items-center justify-between mt-4 pt-3 border-t border-slate-200/60 text-xs">
              <button
                id="mark-all-read-btn"
                onClick={onMarkAllRead}
                disabled={unreadCount === 0}
                className="flex items-center gap-1.5 font-semibold text-indigo-600 hover:text-indigo-800 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <CheckCheck className="w-4 h-4" />
                <span>{isHindi ? 'सभी पढ़ी चिह्नित करें' : 'Mark all as read'}</span>
              </button>

              <button
                id="clear-all-notifs-btn"
                onClick={onClearAll}
                disabled={notifications.length === 0}
                className="flex items-center gap-1 text-slate-400 hover:text-red-600 disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
              >
                <Trash2 className="w-3.5 h-3.5" />
                <span>{isHindi ? 'साफ़ करें' : 'Clear all'}</span>
              </button>
            </div>

            {/* Category Filter Pills */}
            <div className="flex items-center gap-1.5 mt-3 overflow-x-auto pb-1">
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setActiveCategory(cat.id)}
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold whitespace-nowrap transition-all ${
                    activeCategory === cat.id
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                  }`}
                >
                  {cat.label}
                </button>
              ))}
            </div>
          </div>

          {/* Notifications List */}
          <div className="flex-1 overflow-y-auto p-4 space-y-3">
            {filtered.length === 0 ? (
              <div className="py-16 text-center text-slate-400">
                <Bell className="w-10 h-10 mx-auto opacity-40 mb-2" />
                <p className="text-sm font-medium text-slate-600">
                  {isHindi ? 'कोई नई सूचना उपलब्ध नहीं है' : 'No notifications in this category'}
                </p>
                <p className="text-xs text-slate-400 mt-1">
                  {isHindi ? 'नए अपडेट यहां दिखाई देंगे' : 'Every academic event triggers an instant alert here.'}
                </p>
              </div>
            ) : (
              filtered.map((item) => (
                <div
                  key={item.id}
                  onClick={() => {
                    onMarkAsRead(item.id);
                    onSelectNotification(item);
                  }}
                  className={`p-3.5 rounded-xl border transition-all cursor-pointer relative group ${
                    item.read
                      ? 'bg-white border-slate-200 hover:border-slate-300'
                      : 'bg-indigo-50/40 border-indigo-200/90 shadow-xs hover:bg-indigo-50/70'
                  }`}
                >
                  {!item.read && (
                    <span className="absolute top-3.5 right-3.5 w-2.5 h-2.5 rounded-full bg-indigo-600" />
                  )}

                  <div className="flex items-start gap-2.5">
                    <div className="p-2 rounded-lg bg-slate-100/90 flex-shrink-0 mt-0.5">
                      {getCategoryIcon(item.category)}
                    </div>

                    <div className="flex-1 min-w-0 pr-3">
                      <div className="flex items-center gap-2">
                        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
                          {item.category}
                        </span>
                        {item.badgeText && (
                          <span className="px-1.5 py-0.5 rounded-md text-[10px] font-semibold bg-slate-100 text-slate-700">
                            {item.badgeText}
                          </span>
                        )}
                        <span className="text-[10px] text-slate-400 ml-auto">
                          {item.timestamp}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 mt-1">
                        {isHindi && item.titleHi ? item.titleHi : item.title}
                      </h4>

                      <p className="text-xs text-slate-600 mt-1 leading-relaxed">
                        {isHindi && item.messageHi ? item.messageHi : item.message}
                      </p>

                      <div className="mt-2.5 flex items-center gap-2">
                        <span className="text-[11px] font-semibold text-indigo-600 group-hover:underline inline-flex items-center gap-1">
                          {isHindi ? 'विस्तार से देखें' : 'View details'} &rarr;
                        </span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}
          </div>

          {/* Footer Info */}
          <div className="p-3 bg-slate-50 border-t border-slate-200 text-center">
            <p className="text-[11px] text-slate-500">
              {isHindi 
                ? 'सिस्टम स्वचालित रूप से उपस्थिति, परीक्षा और फीस अपडेट पर अलर्ट भेजता है' 
                : 'Automated instant alerts powered by Educate Real-Time Dispatch'}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};
