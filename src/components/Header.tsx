import React from 'react';
import { Role, Student, NotificationItem } from '../types';
import { 
  GraduationCap, 
  Bell, 
  Volume2, 
  VolumeX, 
  UserCheck, 
  Users, 
  ShieldCheck, 
  Sparkles,
  ChevronDown
} from 'lucide-react';

interface HeaderProps {
  currentRole: Role;
  onRoleChange: (role: Role) => void;
  students: Student[];
  selectedStudent: Student;
  onStudentChange: (student: Student) => void;
  notifications: NotificationItem[];
  onOpenNotifications: () => void;
  soundEnabled: boolean;
  onToggleSound: () => void;
  isHindi: boolean;
  onToggleLanguage: () => void;
  onOpenAdminModal: () => void;
}

export const Header: React.FC<HeaderProps> = ({
  currentRole,
  onRoleChange,
  students,
  selectedStudent,
  onStudentChange,
  notifications,
  onOpenNotifications,
  soundEnabled,
  onToggleSound,
  isHindi,
  onToggleLanguage,
  onOpenAdminModal,
}) => {
  const unreadCount = notifications.filter((n) => !n.read).length;

  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200 shadow-xs">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-18 gap-3">
          
          {/* Brand Logo & Name */}
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-xl bg-gradient-to-br from-indigo-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-indigo-100 flex-shrink-0">
              <GraduationCap className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-extrabold text-xl tracking-tight text-slate-900">
                  Educate
                </span>
                <span className="inline-flex items-center px-2 py-0.5 rounded-full text-xs font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                  2025–26
                </span>
              </div>
              <p className="text-xs text-slate-500 hidden sm:block">
                {isHindi ? 'विद्यार्थी एवं अभिभावक अकादमिक पोर्टल' : 'Student & Parent Academic Portal'}
              </p>
            </div>
          </div>

          {/* Role Switcher Tabs */}
          <div className="hidden md:flex items-center bg-slate-100/90 p-1 rounded-xl border border-slate-200/80">
            <button
              id="role-btn-student"
              onClick={() => onRoleChange('student')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'student'
                  ? 'bg-white text-indigo-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <UserCheck className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isHindi ? 'विद्यार्थी' : 'Student'}</span>
            </button>

            <button
              id="role-btn-parent"
              onClick={() => onRoleChange('parent')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'parent'
                  ? 'bg-white text-emerald-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Users className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isHindi ? 'अभिभावक (Parent)' : 'Parent View'}</span>
            </button>

            <button
              id="role-btn-teacher"
              onClick={() => onRoleChange('teacher')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                currentRole === 'teacher'
                  ? 'bg-white text-purple-700 shadow-xs font-bold'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <ShieldCheck className="w-3.5 h-3.5 text-purple-600" />
              <span>{isHindi ? 'शिक्षक / एडमिन' : 'Teacher / Admin'}</span>
            </button>
          </div>

          {/* Right Action Controls */}
          <div className="flex items-center gap-2 sm:gap-3">
            
            {/* Student Selector Dropdown */}
            <div className="relative">
              <label htmlFor="student-select" className="sr-only">Select Student</label>
              <div className="flex items-center gap-1.5 bg-slate-50 hover:bg-slate-100 border border-slate-200 rounded-lg px-2.5 py-1.5 transition-colors cursor-pointer">
                <img
                  src={selectedStudent.avatar}
                  alt={selectedStudent.name}
                  className="w-6 h-6 rounded-full object-cover border border-indigo-200"
                />
                <select
                  id="student-select"
                  value={selectedStudent.id}
                  onChange={(e) => {
                    const found = students.find((s) => s.id === e.target.value);
                    if (found) onStudentChange(found);
                  }}
                  className="bg-transparent text-xs font-semibold text-slate-800 focus:outline-hidden cursor-pointer pr-4 appearance-none"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.class}-{s.section})
                    </option>
                  ))}
                </select>
                <ChevronDown className="w-3.5 h-3.5 text-slate-400 pointer-events-none -ml-3" />
              </div>
            </div>

            {/* Teacher Quick Action trigger to test live alerts */}
            <button
              id="btn-quick-admin-action"
              onClick={onOpenAdminModal}
              title="Test real-time alert trigger (Attendance, Marks, Fees, Notice)"
              className="flex items-center gap-1.5 px-2.5 py-1.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-white rounded-lg text-xs font-semibold shadow-xs transition-all"
            >
              <Sparkles className="w-3.5 h-3.5" />
              <span className="hidden lg:inline">{isHindi ? 'नया अपडेट भेजें' : 'Trigger Alert'}</span>
            </button>

            {/* Language Toggle */}
            <button
              id="btn-language-toggle"
              onClick={onToggleLanguage}
              className="px-2 py-1 text-xs font-semibold border border-slate-200 rounded-md text-slate-700 hover:bg-slate-50 transition-colors"
              title="Switch language: English / हिंदी"
            >
              {isHindi ? 'ENG' : 'हिंदी'}
            </button>

            {/* Sound Toggle */}
            <button
              id="btn-sound-toggle"
              onClick={onToggleSound}
              className={`p-2 rounded-lg border text-xs transition-colors ${
                soundEnabled
                  ? 'border-indigo-200 text-indigo-700 bg-indigo-50/50 hover:bg-indigo-100'
                  : 'border-slate-200 text-slate-400 hover:bg-slate-50'
              }`}
              title={soundEnabled ? 'Chime alerts on' : 'Chime alerts muted'}
            >
              {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
            </button>

            {/* Notification Bell with Badge */}
            <button
              id="btn-notification-bell"
              onClick={onOpenNotifications}
              className="relative p-2 rounded-lg border border-slate-200 hover:border-indigo-300 text-slate-700 hover:text-indigo-600 hover:bg-indigo-50/40 transition-colors cursor-pointer"
              title="View all notifications & alerts"
            >
              <Bell className="w-4 h-4" />
              {unreadCount > 0 && (
                <span className="absolute -top-1 -right-1 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-red-600 text-white text-[10px] font-bold rounded-full animate-pulse shadow-xs">
                  {unreadCount}
                </span>
              )}
            </button>
          </div>
        </div>

        {/* Mobile Role Switcher Bar */}
        <div className="flex md:hidden items-center justify-between py-2 border-t border-slate-100 gap-1 overflow-x-auto">
          <button
            onClick={() => onRoleChange('student')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-xs font-semibold whitespace-nowrap ${
              currentRole === 'student' ? 'bg-indigo-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <UserCheck className="w-3 h-3" />
            <span>{isHindi ? 'विद्यार्थी' : 'Student'}</span>
          </button>
          <button
            onClick={() => onRoleChange('parent')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-xs font-semibold whitespace-nowrap ${
              currentRole === 'parent' ? 'bg-emerald-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <Users className="w-3 h-3" />
            <span>{isHindi ? 'अभिभावक' : 'Parent'}</span>
          </button>
          <button
            onClick={() => onRoleChange('teacher')}
            className={`flex-1 flex items-center justify-center gap-1 py-1.5 px-2 rounded-md text-xs font-semibold whitespace-nowrap ${
              currentRole === 'teacher' ? 'bg-purple-600 text-white' : 'bg-slate-100 text-slate-600'
            }`}
          >
            <ShieldCheck className="w-3 h-3" />
            <span>{isHindi ? 'शिक्षक' : 'Teacher'}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
