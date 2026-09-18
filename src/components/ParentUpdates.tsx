import React, { useState } from 'react';
import { Student, ParentTeacherNote } from '../types';
import { 
  Users, 
  Phone, 
  Send, 
  CheckCircle2, 
  Clock, 
  Calendar, 
  Bus, 
  ShieldCheck, 
  MessageSquare,
  Sparkles,
  HelpCircle
} from 'lucide-react';

interface ParentUpdatesProps {
  student: Student;
  parentNotes: ParentTeacherNote[];
  onAddParentNote: (message: string) => void;
  isHindi: boolean;
  onNavigateTab: (tab: string) => void;
}

export const ParentUpdates: React.FC<ParentUpdatesProps> = ({
  student,
  parentNotes,
  onAddParentNote,
  isHindi,
  onNavigateTab,
}) => {
  const [newNoteMessage, setNewNoteMessage] = useState('');

  const handleSubmitNote = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newNoteMessage.trim()) return;
    onAddParentNote(newNoteMessage);
    setNewNoteMessage('');
  };

  return (
    <div className="space-y-6">
      
      {/* Parent Welcome Banner */}
      <div className="bg-gradient-to-r from-emerald-800 to-teal-900 rounded-2xl p-6 text-white shadow-md">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-emerald-300">
              <Users className="w-6 h-6" />
            </div>
            <div>
              <span className="text-xs uppercase font-bold tracking-wider text-emerald-300">
                {isHindi ? 'अभिभावक निगरानी डैशबोर्ड' : 'Parent Supervision Dashboard'}
              </span>
              <h2 className="text-xl sm:text-2xl font-black mt-0.5">
                {student.parentName}
              </h2>
              <p className="text-xs text-emerald-100">
                {isHindi ? `विद्यार्थी: ${student.name} (कक्षा ${student.class}-${student.section})` : `Monitoring: ${student.name} (${student.class}-${student.section})`}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => onNavigateTab('results')}
              className="px-3.5 py-2 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-xs font-bold transition-colors"
            >
              {isHindi ? 'वार्षिक परिणाम देखें' : 'View Final Result'}
            </button>
            <button
              onClick={() => onNavigateTab('fees')}
              className="px-3.5 py-2 rounded-xl bg-emerald-400 hover:bg-emerald-300 text-slate-950 text-xs font-bold transition-colors shadow-xs"
            >
              {isHindi ? 'फीस लेज़र देखें' : 'View Fees Ledger'}
            </button>
          </div>
        </div>
      </div>

      {/* Live Campus Updates Strip */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        
        {/* Morning Entry */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-emerald-50 text-emerald-600 flex-shrink-0">
            <CheckCircle2 className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {isHindi ? 'सुबह का प्रवेश' : 'Morning Campus Entry'}
            </span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              08:04 AM • Gate #2
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Biometric check-in verified.
            </p>
          </div>
        </div>

        {/* School Bus Route Status */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-blue-50 text-blue-600 flex-shrink-0">
            <Bus className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {isHindi ? 'स्कूल बस रूट' : 'School Transport Route'}
            </span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              Route #14 (Noida Sec-62)
            </div>
            <p className="text-xs text-emerald-600 font-semibold mt-0.5">
              ● Reached school safely
            </p>
          </div>
        </div>

        {/* Next PTM Meeting */}
        <div className="bg-white rounded-2xl border border-slate-200 p-4 shadow-xs flex items-start gap-3">
          <div className="p-2.5 rounded-xl bg-indigo-50 text-indigo-600 flex-shrink-0">
            <Calendar className="w-5 h-5" />
          </div>
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block">
              {isHindi ? 'अगली अभिभावक बैठक' : 'Next Scheduled PTM'}
            </span>
            <div className="text-sm font-bold text-slate-900 mt-0.5">
              Saturday • 09:30 AM
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Room 204 with Mrs. Sunita Verma
            </p>
          </div>
        </div>

      </div>

      {/* Main Two-Column Parent View: Teacher Communication Board & Academic Health */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Direct Teacher-Parent Interaction Feed */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-4 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                <h3 className="font-bold text-base text-slate-900">
                  {isHindi ? 'कक्षा अध्यापक संवाद एवं टिप्पणियां' : 'Direct Class Teacher Communication'}
                </h3>
              </div>
              <span className="text-xs text-slate-500">
                Mentor: {student.classTeacher.name}
              </span>
            </div>

            {/* Notes List */}
            <div className="mt-4 space-y-3 max-h-[380px] overflow-y-auto pr-1">
              {parentNotes.map((note) => {
                const isTeacher = note.author === 'Teacher';
                return (
                  <div
                    key={note.id}
                    className={`p-4 rounded-xl text-xs ${
                      isTeacher
                        ? 'bg-indigo-50/70 border border-indigo-100 mr-4'
                        : 'bg-emerald-50/70 border border-emerald-100 ml-4'
                    }`}
                  >
                    <div className="flex items-center justify-between mb-1.5">
                      <span className={`font-bold ${isTeacher ? 'text-indigo-900' : 'text-emerald-900'}`}>
                        {note.authorName}
                      </span>
                      <span className="text-[10px] text-slate-400">{note.date}</span>
                    </div>
                    <p className="text-slate-700 leading-relaxed">
                      {note.message}
                    </p>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Send Note Input Box */}
          <form onSubmit={handleSubmitNote} className="mt-4 pt-4 border-t border-slate-100">
            <label className="block text-xs font-bold text-slate-700 mb-1">
              {isHindi ? 'कक्षा अध्यापक को संदेश या प्रश्न भेजें' : 'Send a Note or Inquiry to Class Teacher'}
            </label>
            <div className="flex gap-2">
              <input
                type="text"
                value={newNoteMessage}
                onChange={(e) => setNewNoteMessage(e.target.value)}
                placeholder={isHindi ? 'जैसे: कृपया आर्यन के प्रोजेक्ट वर्क के बारे में बताएं...' : 'e.g. Kindly advise on the upcoming science olympiad prep...'}
                className="flex-1 px-3.5 py-2 text-xs border border-slate-300 rounded-xl focus:outline-indigo-600"
              />
              <button
                type="submit"
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-xl text-xs font-bold shadow-xs transition-colors flex items-center gap-1.5 cursor-pointer flex-shrink-0"
              >
                <Send className="w-3.5 h-3.5" />
                <span>{isHindi ? 'भेजें' : 'Send'}</span>
              </button>
            </div>
            <span className="text-[11px] text-slate-400 mt-1 block">
              {isHindi ? 'संदेश भेजते ही अध्यापक को सूचना अलर्ट प्राप्त होगा।' : 'Submitting dispatches a live alert to the faculty console.'}
            </span>
          </form>
        </div>

        {/* School Helpdesk & Parent Guidelines */}
        <div className="space-y-6">
          
          {/* Quick Helpdesk Support Card */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <Phone className="w-4 h-4 text-emerald-600" />
              <span>{isHindi ? 'स्कूल हेल्पडेस्क संपर्क' : 'School Parent Helpdesk'}</span>
            </h3>

            <div className="space-y-2.5 text-xs text-slate-600">
              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-bold block text-slate-800">{isHindi ? 'शैक्षणिक पूछताछ' : 'Academic Office'}:</span>
                <span className="font-mono text-indigo-700">+91 (0120) 2400-192</span>
                <span className="text-[10px] text-slate-400 block">Mon - Fri, 08:30 AM - 03:00 PM</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-bold block text-slate-800">{isHindi ? 'परिवहन व बस हेल्पलाइन' : 'Transport Incharge'}:</span>
                <span className="font-mono text-indigo-700">+91 98101 23456 (Mr. Ram Singh)</span>
              </div>

              <div className="p-2.5 rounded-xl bg-slate-50 border border-slate-200/60">
                <span className="font-bold block text-slate-800">{isHindi ? 'फीस एवं लेखा विभाग' : 'Accounts & Fee Desk'}:</span>
                <span className="font-mono text-indigo-700">accounts@educateschool.edu</span>
              </div>
            </div>
          </div>

          {/* Academic Highlights Summary */}
          <div className="bg-emerald-50/50 rounded-2xl border border-emerald-100 p-5">
            <h4 className="font-bold text-xs text-emerald-950 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-emerald-600" />
              <span>{isHindi ? 'अभिभावक त्वरित रिपोर्ट' : 'Parent Quick Insights'}</span>
            </h4>
            <p className="text-xs text-emerald-900 leading-relaxed">
              Aryan has achieved <strong>94.67%</strong> in the Annual Final Exam (Rank #2 in Class 10-A) and maintains <strong>92.8%</strong> attendance. He is fully eligible for the Board Honors scholarship.
            </p>
          </div>

        </div>

      </div>

    </div>
  );
};
