import React, { useState } from 'react';
import { Student, AttendanceRecord, Role } from '../types';
import { 
  CheckCircle2, 
  XCircle, 
  Clock, 
  Calendar as CalendarIcon, 
  FileText, 
  AlertTriangle, 
  ChevronLeft, 
  ChevronRight,
  Send,
  Plus
} from 'lucide-react';

interface AttendanceTrackerProps {
  student: Student;
  attendanceRecords: AttendanceRecord[];
  currentRole: Role;
  onRecordAttendanceToday: (studentId: string, status: 'present' | 'absent', remarks?: string) => void;
  onApplyLeave: (reason: string, fromDate: string, toDate: string) => void;
  isHindi: boolean;
}

export const AttendanceTracker: React.FC<AttendanceTrackerProps> = ({
  student,
  attendanceRecords,
  currentRole,
  onRecordAttendanceToday,
  onApplyLeave,
  isHindi,
}) => {
  const [selectedMonth, setSelectedMonth] = useState<'2026-09' | '2026-08'>('2026-09');
  const [selectedDayRecord, setSelectedDayRecord] = useState<AttendanceRecord | null>(null);
  const [showLeaveModal, setShowLeaveModal] = useState(false);
  const [leaveReason, setLeaveReason] = useState('');
  const [leaveFrom, setLeaveFrom] = useState('2026-09-22');
  const [leaveTo, setLeaveTo] = useState('2026-09-23');

  // Filter records for the selected month
  const monthRecords = attendanceRecords.filter((r) => r.date.startsWith(selectedMonth));
  
  const presentDays = monthRecords.filter((r) => r.status === 'present').length;
  const absentDays = monthRecords.filter((r) => r.status === 'absent').length;
  const leaveDays = monthRecords.filter((r) => r.status === 'leave').length;
  const holidays = monthRecords.filter((r) => r.status === 'holiday').length;
  const workingDays = presentDays + absentDays + leaveDays;
  const monthlyPercent = workingDays > 0 ? Math.round((presentDays / workingDays) * 100 * 10) / 10 : 100;

  // Calendar days generation
  const year = parseInt(selectedMonth.split('-')[0], 10);
  const monthIndex = parseInt(selectedMonth.split('-')[1], 10) - 1; // 0-indexed
  const daysInMonth = new Date(year, monthIndex + 1, 0).getDate();
  const firstDayWeekday = new Date(year, monthIndex, 1).getDay(); // 0 = Sun, 1 = Mon ...

  const daysArray = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const emptyPaddingDays = Array.from({ length: firstDayWeekday }, (_, i) => i);

  const handleLeaveSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!leaveReason.trim()) return;
    onApplyLeave(leaveReason, leaveFrom, leaveTo);
    setShowLeaveModal(false);
    setLeaveReason('');
  };

  const monthName = selectedMonth === '2026-09' 
    ? (isHindi ? 'सितंबर 2026' : 'September 2026')
    : (isHindi ? 'अगस्त 2026' : 'August 2026');

  return (
    <div className="space-y-6">
      
      {/* Top Banner with Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        
        {/* Overall Attendance Metric */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
            <span className="text-xl font-black text-emerald-700">
              {student.attendancePercentage}%
            </span>
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHindi ? 'वार्षिक कुल उपस्थिति' : 'Cumulative Attendance'}
            </h4>
            <div className="flex items-center gap-1 mt-0.5 text-sm font-black text-slate-900">
              <span>{student.attendancePercentage >= 75 ? (isHindi ? 'सुरक्षित क्षेत्र' : 'Safe Zone') : (isHindi ? 'कम उपस्थिति' : 'Low Attendance')}</span>
              <span className="text-[11px] font-normal text-emerald-600">(&gt; 75% Req)</span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5">
              {isHindi ? 'बोर्ड परीक्षा के लिए योग्य' : 'Eligible for final exams'}
            </p>
          </div>
        </div>

        {/* Working Days */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-indigo-50 border border-indigo-200 flex items-center justify-center flex-shrink-0">
            <CalendarIcon className="w-6 h-6 text-indigo-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHindi ? 'कार्य दिवस' : 'Working Days'}
            </h4>
            <div className="text-xl font-black text-slate-900 mt-0.5">
              {workingDays} <span className="text-xs text-slate-500 font-normal">{isHindi ? 'दिन' : 'days'}</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {monthName}
            </p>
          </div>
        </div>

        {/* Present Count */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-emerald-50 border border-emerald-200 flex items-center justify-center flex-shrink-0">
            <CheckCircle2 className="w-6 h-6 text-emerald-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHindi ? 'उपस्थित' : 'Present Days'}
            </h4>
            <div className="text-xl font-black text-emerald-700 mt-0.5">
              {presentDays} <span className="text-xs text-slate-500 font-normal">/ {workingDays}</span>
            </div>
            <p className="text-[11px] text-emerald-600 font-semibold">
              {monthlyPercent}% {isHindi ? 'इस माह' : 'this month'}
            </p>
          </div>
        </div>

        {/* Absent & Leave Count */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-rose-50 border border-rose-200 flex items-center justify-center flex-shrink-0">
            <XCircle className="w-6 h-6 text-rose-600" />
          </div>
          <div>
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-500">
              {isHindi ? 'अनुपस्थित / अवकाश' : 'Absent / Leaves'}
            </h4>
            <div className="text-xl font-black text-rose-700 mt-0.5">
              {absentDays} <span className="text-xs font-normal text-slate-500">Abs</span> • {leaveDays} <span className="text-xs font-normal text-slate-500">Leave</span>
            </div>
            <p className="text-[11px] text-slate-500">
              {holidays} {isHindi ? 'अवकाश/रविवार' : 'Holidays'}
            </p>
          </div>
        </div>

      </div>

      {/* Teacher / Admin Action Banner (When in Teacher Role or Testing) */}
      {currentRole === 'teacher' && (
        <div className="bg-purple-50 border border-purple-200 rounded-2xl p-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-purple-600 text-white flex items-center justify-center flex-shrink-0">
              <Clock className="w-5 h-5" />
            </div>
            <div>
              <h4 className="text-sm font-bold text-purple-900">
                {isHindi ? 'शिक्षक नियंत्रण: आज की उपस्थिति दर्ज करें' : 'Teacher Desk: Mark Today\'s Attendance'}
              </h4>
              <p className="text-xs text-purple-700">
                {isHindi ? 'उपस्थिति दर्ज करते ही अभिभावक को तुरंत अलर्ट भेजा जाएगा।' : 'Recording attendance will immediately dispatch an SMS & app alert to parents.'}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto">
            <button
              id="mark-today-present-btn"
              onClick={() => onRecordAttendanceToday(student.id, 'present', 'On time, smart uniform')}
              className="flex-1 sm:flex-none px-3 py-1.5 bg-emerald-600 hover:bg-emerald-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <CheckCircle2 className="w-3.5 h-3.5" />
              <span>{isHindi ? 'उपस्थित (Present)' : 'Mark Present'}</span>
            </button>
            <button
              id="mark-today-absent-btn"
              onClick={() => onRecordAttendanceToday(student.id, 'absent', 'Uninformed absence')}
              className="flex-1 sm:flex-none px-3 py-1.5 bg-rose-600 hover:bg-rose-700 text-white text-xs font-bold rounded-lg shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <XCircle className="w-3.5 h-3.5" />
              <span>{isHindi ? 'अनुपस्थित (Absent)' : 'Mark Absent'}</span>
            </button>
          </div>
        </div>
      )}

      {/* Main Attendance Calendar & Day Detail Section */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Monthly Calendar View */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
          
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-4 border-b border-slate-100">
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {isHindi ? 'दैनिक उपस्थिति कैलेंडर' : 'Daily Attendance Calendar'}
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi ? 'किसी भी तारीख पर क्लिक करके समय व विवरण देखें' : 'Click any date to inspect time-in and log remarks'}
              </p>
            </div>

            {/* Month switch buttons */}
            <div className="flex items-center gap-2">
              <button
                onClick={() => setSelectedMonth('2026-08')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  selectedMonth === '2026-08'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Aug 2026
              </button>
              <button
                onClick={() => setSelectedMonth('2026-09')}
                className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                  selectedMonth === '2026-09'
                    ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                    : 'bg-white text-slate-600 border-slate-200 hover:bg-slate-50'
                }`}
              >
                Sep 2026 (Current)
              </button>

              <button
                id="btn-apply-leave"
                onClick={() => setShowLeaveModal(true)}
                className="ml-2 px-3 py-1.5 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-lg transition-colors flex items-center gap-1 cursor-pointer"
              >
                <Plus className="w-3.5 h-3.5" />
                <span>{isHindi ? 'अवकाश आवेदन' : 'Apply Leave'}</span>
              </button>
            </div>
          </div>

          {/* Legend */}
          <div className="flex flex-wrap items-center gap-4 py-3 text-xs text-slate-600">
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-emerald-500" />
              <span>{isHindi ? 'उपस्थित (Present)' : 'Present'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-rose-500" />
              <span>{isHindi ? 'अनुपस्थित (Absent)' : 'Absent'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-amber-500" />
              <span>{isHindi ? 'स्वीकृत अवकाश (Leave)' : 'Approved Leave'}</span>
            </span>
            <span className="flex items-center gap-1.5">
              <span className="w-3 h-3 rounded-full bg-slate-300" />
              <span>{isHindi ? 'रविवार / अवकाश (Holiday)' : 'Holiday / Weekend'}</span>
            </span>
          </div>

          {/* Calendar Grid */}
          <div className="mt-2">
            {/* Weekday headers */}
            <div className="grid grid-cols-7 text-center text-xs font-bold text-slate-400 py-2 border-b border-slate-100">
              <span>Sun</span>
              <span>Mon</span>
              <span>Tue</span>
              <span>Wed</span>
              <span>Thu</span>
              <span>Fri</span>
              <span>Sat</span>
            </div>

            {/* Days grid */}
            <div className="grid grid-cols-7 gap-1 sm:gap-2 pt-2">
              {/* Empty leading padding days */}
              {emptyPaddingDays.map((i) => (
                <div key={`empty-${i}`} className="h-12 sm:h-14 rounded-xl bg-slate-50/50" />
              ))}

              {/* Real month days */}
              {daysArray.map((day) => {
                const dayStr = day < 10 ? `0${day}` : `${day}`;
                const dateKey = `${selectedMonth}-${dayStr}`;
                const rec = monthRecords.find((r) => r.date === dateKey);

                let bgClass = 'bg-slate-50 text-slate-400 border-slate-100';
                let indicator = null;

                if (rec) {
                  if (rec.status === 'present') {
                    bgClass = 'bg-emerald-50/70 border-emerald-200 text-emerald-900 hover:bg-emerald-100';
                    indicator = <span className="w-2 h-2 rounded-full bg-emerald-500" />;
                  } else if (rec.status === 'absent') {
                    bgClass = 'bg-rose-50/90 border-rose-300 text-rose-900 hover:bg-rose-100 font-bold';
                    indicator = <span className="w-2 h-2 rounded-full bg-rose-600 animate-ping" />;
                  } else if (rec.status === 'leave') {
                    bgClass = 'bg-amber-50 border-amber-200 text-amber-900 hover:bg-amber-100';
                    indicator = <span className="w-2 h-2 rounded-full bg-amber-500" />;
                  } else if (rec.status === 'holiday') {
                    bgClass = 'bg-slate-100/60 border-slate-200 text-slate-400';
                    indicator = <span className="text-[9px] font-semibold uppercase text-slate-400">Off</span>;
                  }
                }

                const isSelected = selectedDayRecord?.date === dateKey;

                return (
                  <button
                    key={day}
                    onClick={() => rec && setSelectedDayRecord(rec)}
                    className={`h-12 sm:h-14 rounded-xl border p-1 sm:p-2 flex flex-col justify-between items-center transition-all text-xs cursor-pointer ${bgClass} ${
                      isSelected ? 'ring-2 ring-indigo-600 ring-offset-1 font-bold' : ''
                    }`}
                  >
                    <span className="font-semibold text-[11px] sm:text-xs">{day}</span>
                    <div className="flex items-center justify-center">
                      {indicator}
                    </div>
                  </button>
                );
              })}
            </div>
          </div>
        </div>

        {/* Selected Day Log Details & Leave Request History */}
        <div className="space-y-6">
          
          {/* Day details */}
          <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
            <h3 className="font-bold text-sm text-slate-900 mb-3 flex items-center gap-2">
              <CalendarIcon className="w-4 h-4 text-indigo-600" />
              <span>{isHindi ? 'दैनिक विवरण व प्रविष्टि' : 'Day Entry Inspector'}</span>
            </h3>

            {selectedDayRecord ? (
              <div className="bg-slate-50 p-4 rounded-xl border border-slate-200/70 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Date:</span>
                  <span className="text-xs font-bold text-slate-900">{selectedDayRecord.date}</span>
                </div>

                <div className="flex items-center justify-between">
                  <span className="text-xs font-semibold text-slate-500">Status:</span>
                  <span className={`px-2 py-0.5 rounded-full text-xs font-bold uppercase ${
                    selectedDayRecord.status === 'present'
                      ? 'bg-emerald-100 text-emerald-800'
                      : selectedDayRecord.status === 'absent'
                      ? 'bg-rose-100 text-rose-800'
                      : selectedDayRecord.status === 'leave'
                      ? 'bg-amber-100 text-amber-800'
                      : 'bg-slate-200 text-slate-700'
                  }`}>
                    {selectedDayRecord.status}
                  </span>
                </div>

                {selectedDayRecord.timeIn && (
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-semibold text-slate-500">Time-In (RFID/Gate):</span>
                    <span className="text-xs font-mono font-bold text-indigo-700 bg-indigo-50 px-2 py-0.5 rounded-md">
                      {selectedDayRecord.timeIn}
                    </span>
                  </div>
                )}

                <div className="pt-2 border-t border-slate-200">
                  <span className="text-[11px] font-semibold text-slate-500 block mb-1">Remarks:</span>
                  <p className="text-xs text-slate-700 italic bg-white p-2.5 rounded-lg border border-slate-200/60">
                    "{selectedDayRecord.remarks || 'Normal attendance routine'}"
                  </p>
                </div>
              </div>
            ) : (
              <div className="py-10 text-center text-slate-400 bg-slate-50/50 rounded-xl border border-dashed border-slate-200">
                <Clock className="w-8 h-8 mx-auto opacity-30 mb-2" />
                <p className="text-xs text-slate-600 font-medium">
                  {isHindi ? 'कैलेंडर में किसी भी तारीख को चुनें' : 'Select any date from calendar'}
                </p>
                <p className="text-[11px] text-slate-400 mt-1">
                  {isHindi ? 'प्रवेश समय व टिप्पणी देखने हेतु' : 'to view entry timestamp & gate remarks'}
                </p>
              </div>
            )}
          </div>

          {/* Attendance Norms & Leave Policies */}
          <div className="bg-indigo-50/60 rounded-2xl border border-indigo-100 p-5">
            <h4 className="font-bold text-xs text-indigo-950 uppercase tracking-wider flex items-center gap-1.5 mb-2">
              <FileText className="w-3.5 h-3.5 text-indigo-600" />
              <span>{isHindi ? 'स्कूल उपस्थिति नियम' : 'Attendance Regulations'}</span>
            </h4>
            <ul className="text-xs text-indigo-900 space-y-1.5 list-disc list-inside">
              <li>{isHindi ? 'वार्षिक परीक्षा में बैठने हेतु न्यूनतम 75% अनिवार्य है।' : 'Minimum 75% attendance mandatory for final exams.'}</li>
              <li>{isHindi ? 'सुबह 08:15 के बाद आने पर विलंब दर्ज किया जाता है।' : 'Late entry flagged after 08:15 AM.'}</li>
              <li>{isHindi ? '2 दिन से अधिक अनुपस्थिति पर मेडिकल प्रमाणपत्र अनिवार्य है।' : 'Medical certificate mandatory for 2+ consecutive absence.'}</li>
            </ul>
          </div>

        </div>

      </div>

      {/* Apply for Leave Modal */}
      {showLeaveModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="p-2 rounded-xl bg-indigo-50 text-indigo-600">
                  <FileText className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {isHindi ? 'अवकाश आवेदन पत्र' : 'Apply for Student Leave'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {student.name} • {student.class}-{student.section}
                  </p>
                </div>
              </div>
              <button
                onClick={() => setShowLeaveModal(false)}
                className="text-slate-400 hover:text-slate-700 p-1"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleLeaveSubmit} className="mt-4 space-y-4">
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'प्रारंभ तिथि (From)' : 'Start Date'}
                  </label>
                  <input
                    type="date"
                    value={leaveFrom}
                    onChange={(e) => setLeaveFrom(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-indigo-600"
                  />
                </div>
                <div>
                  <label className="block text-xs font-semibold text-slate-700 mb-1">
                    {isHindi ? 'अंतिम तिथि (To)' : 'End Date'}
                  </label>
                  <input
                    type="date"
                    value={leaveTo}
                    onChange={(e) => setLeaveTo(e.target.value)}
                    required
                    className="w-full px-3 py-2 text-xs border border-slate-300 rounded-lg focus:outline-indigo-600"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold text-slate-700 mb-1">
                  {isHindi ? 'अवकाश का कारण (Reason)' : 'Reason for Leave'}
                </label>
                <textarea
                  rows={3}
                  value={leaveReason}
                  onChange={(e) => setLeaveReason(e.target.value)}
                  placeholder={isHindi ? 'जैसे: तेज बुखार / पारिवारिक कार्यक्रम...' : 'e.g., Viral fever recovery / Family outstation travel...'}
                  required
                  className="w-full p-2.5 text-xs border border-slate-300 rounded-lg focus:outline-indigo-600"
                />
              </div>

              <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-xs text-slate-600 flex items-center justify-between">
                <div>
                  <span className="font-semibold block text-slate-800">
                    {isHindi ? 'अभिभावक सहमति' : 'Parent Authorization'}
                  </span>
                  <span className="text-[11px] text-slate-500">
                    {isHindi ? 'यह आवेदन कक्षा अध्यापक को भेजा जाएगा' : 'Submitted directly to Mrs. Sunita Verma'}
                  </span>
                </div>
                <span className="text-emerald-600 font-bold text-xs bg-emerald-50 px-2 py-1 rounded-md border border-emerald-200">
                  Verified
                </span>
              </div>

              <div className="flex justify-end gap-2 pt-2">
                <button
                  type="button"
                  onClick={() => setShowLeaveModal(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:bg-slate-100 rounded-lg"
                >
                  {isHindi ? 'रद्द करें' : 'Cancel'}
                </button>
                <button
                  type="submit"
                  className="px-4 py-2 bg-indigo-600 hover:bg-indigo-700 text-white text-xs font-bold rounded-lg shadow-xs flex items-center gap-1.5 cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'आवेदन भेजें' : 'Submit Application'}</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

    </div>
  );
};
