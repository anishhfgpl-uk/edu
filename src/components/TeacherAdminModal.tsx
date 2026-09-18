import React, { useState } from 'react';
import { Student, ExamReport, FeeHead } from '../types';
import { 
  X, 
  Sparkles, 
  CheckCircle2, 
  Award, 
  CreditCard, 
  Megaphone,
  Clock,
  Send,
  BookOpen,
  Bus
} from 'lucide-react';

interface TeacherAdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  students: Student[];
  selectedStudent: Student;
  feeHeads: FeeHead[];
  onTriggerAttendanceAlert: (studentId: string, status: 'present' | 'absent', remark: string) => void;
  onTriggerMarksAlert: (examTerm: string, subject: string, marks: number, maxMarks: number) => void;
  onTriggerFeeAlert: (feeHeadId: string, amount: number) => void;
  onBroadcastNotice: (title: string, message: string, category: 'academic' | 'notice') => void;
  onTriggerHomeworkAlert?: (title: string, subject: string, targetClass: string, targetSection: string) => void;
  onTriggerBusAlert?: (routeNumber: string, message: string) => void;
  isHindi: boolean;
}

export const TeacherAdminModal: React.FC<TeacherAdminModalProps> = ({
  isOpen,
  onClose,
  students,
  selectedStudent,
  feeHeads,
  onTriggerAttendanceAlert,
  onTriggerMarksAlert,
  onTriggerFeeAlert,
  onBroadcastNotice,
  onTriggerHomeworkAlert,
  onTriggerBusAlert,
  isHindi,
}) => {
  const [activeTab, setActiveTab] = useState<'attendance' | 'marks' | 'fee' | 'homework' | 'bus' | 'notice'>('attendance');

  // Form states
  const [targetStudentId, setTargetStudentId] = useState(selectedStudent.id);
  const [attendanceStatus, setAttendanceStatus] = useState<'present' | 'absent'>('present');
  const [attendanceRemark, setAttendanceRemark] = useState('Reported on time at 08:02 AM');

  const [examName, setExamName] = useState('Final Board Examination');
  const [subjectName, setSubjectName] = useState('Mathematics');
  const [marksObtained, setMarksObtained] = useState(98);
  const [maxMarks, setMaxMarks] = useState(100);

  const [selectedFeeHead, setSelectedFeeHead] = useState(feeHeads[3]?.id || feeHeads[0]?.id);
  const [feeAmount, setFeeAmount] = useState(6000);

  const [hwTitle, setHwTitle] = useState('NCERT Exercise 4.3 - Quadratic Equations (Q1 to Q8)');
  const [hwSubject, setHwSubject] = useState('Mathematics');
  const [hwClass, setHwClass] = useState(selectedStudent.class);
  const [hwSection, setHwSection] = useState(selectedStudent.section);

  const [busRouteNum, setBusRouteNum] = useState('Route #14');
  const [busMessage, setBusMessage] = useState('Bus UP-16-BT-4821 is approaching Sector 62 Enclave. Estimated arrival in 3 minutes.');

  const [noticeTitle, setNoticeTitle] = useState('Sports Day & Annual Athletic Meet');
  const [noticeMessage, setNoticeMessage] = useState('All students are requested to report in sports tracksuits this Friday. Parents are cordially invited to attend the inaugural ceremony at 09:00 AM.');

  if (!isOpen) return null;

  const handleAttendanceSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerAttendanceAlert(targetStudentId, attendanceStatus, attendanceRemark);
    onClose();
  };

  const handleMarksSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerMarksAlert(examName, subjectName, Number(marksObtained), Number(maxMarks));
    onClose();
  };

  const handleFeeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onTriggerFeeAlert(selectedFeeHead, Number(feeAmount));
    onClose();
  };

  const handleHomeworkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onTriggerHomeworkAlert) {
      onTriggerHomeworkAlert(hwTitle, hwSubject, hwClass, hwSection);
    }
    onClose();
  };

  const handleBusSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (onTriggerBusAlert) {
      onTriggerBusAlert(busRouteNum, busMessage);
    }
    onClose();
  };

  const handleNoticeSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!noticeTitle.trim() || !noticeMessage.trim()) return;
    onBroadcastNotice(noticeTitle, noticeMessage, 'notice');
    onClose();
  };


  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
      <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]">
        
        {/* Header */}
        <div className="flex items-center justify-between pb-4 border-b border-slate-100">
          <div className="flex items-center gap-2.5">
            <div className="w-10 h-10 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
              <Sparkles className="w-5 h-5" />
            </div>
            <div>
              <h3 className="font-bold text-base text-slate-900">
                {isHindi ? 'शिक्षक व एडमिन नियंत्रण कक्ष' : 'Faculty & Admin Action Console'}
              </h3>
              <p className="text-xs text-slate-500">
                {isHindi ? 'यहाँ से कोई भी अपडेट करने पर तुरंत लाइव अलर्ट भेजा जाएगा' : 'Every action dispatches an immediate real-time push alert'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="text-slate-400 hover:text-slate-700 p-1"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Action Tabs */}
        <div className="grid grid-cols-6 gap-1 p-1 bg-slate-100 rounded-xl mt-4">
          <button
            type="button"
            onClick={() => setActiveTab('attendance')}
            className={`py-1.5 px-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'attendance'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CheckCircle2 className="w-3 h-3" />
            <span className="truncate">Attendance</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('marks')}
            className={`py-1.5 px-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'marks'
                ? 'bg-white text-purple-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Award className="w-3 h-3" />
            <span className="truncate">Results</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('fee')}
            className={`py-1.5 px-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'fee'
                ? 'bg-white text-emerald-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <CreditCard className="w-3 h-3" />
            <span className="truncate">Fees</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('homework')}
            className={`py-1.5 px-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'homework'
                ? 'bg-white text-indigo-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <BookOpen className="w-3 h-3" />
            <span className="truncate">Homework</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('bus')}
            className={`py-1.5 px-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'bus'
                ? 'bg-white text-amber-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Bus className="w-3 h-3" />
            <span className="truncate">Bus Alert</span>
          </button>

          <button
            type="button"
            onClick={() => setActiveTab('notice')}
            className={`py-1.5 px-1.5 rounded-lg text-[11px] font-bold transition-all flex items-center justify-center gap-1 ${
              activeTab === 'notice'
                ? 'bg-white text-blue-700 shadow-xs'
                : 'text-slate-600 hover:text-slate-900'
            }`}
          >
            <Megaphone className="w-3 h-3" />
            <span className="truncate">Notice</span>
          </button>
        </div>

        {/* Tab Content Forms */}
        <div className="flex-1 overflow-y-auto pt-4">
          
          {/* TAB 1: Attendance Trigger */}
          {activeTab === 'attendance' && (
            <form onSubmit={handleAttendanceSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-indigo-900">
                {isHindi 
                  ? 'उपस्थिति दर्ज करने पर अभिभावक को तुरंत SMS व ऐप नोटिफिकेशन भेजा जाएगा।' 
                  : 'Submitting attendance automatically notifies parents with the exact time-in.'}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Student</label>
                <select
                  value={targetStudentId}
                  onChange={(e) => setTargetStudentId(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  {students.map((s) => (
                    <option key={s.id} value={s.id}>
                      {s.name} ({s.class}-{s.section}, Roll #{s.rollNo})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Status</label>
                <div className="grid grid-cols-2 gap-2">
                  <button
                    type="button"
                    onClick={() => {
                      setAttendanceStatus('present');
                      setAttendanceRemark('Reported on time at 08:04 AM');
                    }}
                    className={`py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                      attendanceStatus === 'present'
                        ? 'bg-emerald-50 border-emerald-500 text-emerald-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <CheckCircle2 className="w-4 h-4 text-emerald-600" />
                    <span>Present (उपस्थित)</span>
                  </button>

                  <button
                    type="button"
                    onClick={() => {
                      setAttendanceStatus('absent');
                      setAttendanceRemark('Uninformed absence - Alert sent to parent');
                    }}
                    className={`py-2 px-3 rounded-lg border font-bold flex items-center justify-center gap-1.5 cursor-pointer ${
                      attendanceStatus === 'absent'
                        ? 'bg-rose-50 border-rose-500 text-rose-800'
                        : 'border-slate-200 text-slate-600'
                    }`}
                  >
                    <X className="w-4 h-4 text-rose-600" />
                    <span>Absent (अनुपस्थित)</span>
                  </button>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Teacher Remarks / Gate Time</label>
                <input
                  type="text"
                  value={attendanceRemark}
                  onChange={(e) => setAttendanceRemark(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Send className="w-4 h-4" />
                <span>Dispatch Attendance Alert</span>
              </button>
            </form>
          )}

          {/* TAB 2: Exam Marks Update Trigger */}
          {activeTab === 'marks' && (
            <form onSubmit={handleMarksSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-purple-50/60 rounded-xl border border-purple-100 text-purple-900">
                {isHindi 
                  ? 'अंक अपडेट करने पर छात्र और अभिभावक दोनों को रैंक व ग्रेड कार्ड का अलर्ट भेजा जाएगा।' 
                  : 'Updating exam marks automatically recalculates rank and dispatches a report card alert.'}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Examination Term</label>
                  <select
                    value={examName}
                    onChange={(e) => setExamName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Final Board Examination">Final Board Exam (2025-26)</option>
                    <option value="Unit Test 2">Unit Test 2</option>
                    <option value="Mid-Term Examination">Mid-Term Examination</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Subject</label>
                  <select
                    value={subjectName}
                    onChange={(e) => setSubjectName(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science</option>
                    <option value="Computer Science (AI)">Computer Science (AI)</option>
                    <option value="English Language & Lit">English Language & Lit</option>
                    <option value="Social Science">Social Science</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Marks Obtained</label>
                  <input
                    type="number"
                    value={marksObtained}
                    onChange={(e) => setMarksObtained(Number(e.target.value))}
                    max={maxMarks}
                    min={0}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold text-sm"
                    required
                  />
                </div>
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Max Marks</label>
                  <input
                    type="number"
                    value={maxMarks}
                    onChange={(e) => setMaxMarks(Number(e.target.value))}
                    className="w-full p-2 border border-slate-300 rounded-lg font-bold text-sm"
                    required
                  />
                </div>
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-purple-600 hover:bg-purple-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Award className="w-4 h-4" />
                <span>Publish Result & Send Notification</span>
              </button>
            </form>
          )}

          {/* TAB 3: Counter Fee Payment Record */}
          {activeTab === 'fee' && (
            <form onSubmit={handleFeeSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-emerald-50/60 rounded-xl border border-emerald-100 text-emerald-900">
                {isHindi 
                  ? 'फीस काउंटर पर रसीद काटते ही अभिभावक को तुरंत रसीद नंबर के साथ सूचना जाएगी।' 
                  : 'Recording counter payment generates receipt #REC and alerts the parent instantly.'}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Select Fee Component</label>
                <select
                  value={selectedFeeHead}
                  onChange={(e) => setSelectedFeeHead(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  {feeHeads.map((f) => (
                    <option key={f.id} value={f.id}>
                      {f.title} (Due: ₹{f.dueAmount})
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Amount Paid (INR)</label>
                <input
                  type="number"
                  value={feeAmount}
                  onChange={(e) => setFeeAmount(Number(e.target.value))}
                  min={500}
                  className="w-full p-2 border border-slate-300 rounded-lg font-black text-sm"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-emerald-600 hover:bg-emerald-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <CreditCard className="w-4 h-4" />
                <span>Generate Receipt & Dispatch Alert</span>
              </button>
            </form>
          )}

          {/* TAB 4: Daily Homework Trigger */}
          {activeTab === 'homework' && (
            <form onSubmit={handleHomeworkSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-indigo-50/60 rounded-xl border border-indigo-100 text-indigo-900">
                {isHindi 
                  ? 'गृहकार्य भेजने पर कक्षा के सभी छात्रों व अभिभावकों को तुरंत नोटिफिकेशन जाएगा।' 
                  : 'Sending daily homework dispatches an instant push alert to all students and parents in this section.'}
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block font-bold text-slate-700 mb-1">Target Class</label>
                  <select
                    value={hwClass}
                    onChange={(e) => setHwClass(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="Class 10">Class 10</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="block font-bold text-slate-700 mb-1">Section</label>
                  <select
                    value={hwSection}
                    onChange={(e) => setHwSection(e.target.value)}
                    className="w-full p-2 border border-slate-300 rounded-lg"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Subject</label>
                <select
                  value={hwSubject}
                  onChange={(e) => setHwSubject(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  <option value="Mathematics">Mathematics</option>
                  <option value="Science">Science</option>
                  <option value="English Language & Lit">English Language & Lit</option>
                  <option value="Social Science">Social Science</option>
                  <option value="Hindi Course A">Hindi Course A</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Homework Title & Tasks</label>
                <input
                  type="text"
                  required
                  value={hwTitle}
                  onChange={(e) => setHwTitle(e.target.value)}
                  placeholder="e.g. Chapter 4 Exercise 4.3 questions 1 to 8"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <BookOpen className="w-4 h-4" />
                <span>Send Daily Homework & Dispatch Alert</span>
              </button>
            </form>
          )}

          {/* TAB 5: Bus Transport Alert */}
          {activeTab === 'bus' && (
            <form onSubmit={handleBusSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-amber-50/60 rounded-xl border border-amber-100 text-amber-900">
                {isHindi 
                  ? 'बस रूट अलर्ट इस रूट के सभी विद्यार्थियों व अभिभावकों के फ़ोन पर तुरंत पहुंचेगा।' 
                  : 'Bus alerts reach all students and parents registered on this specific bus route.'}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Bus Route</label>
                <select
                  value={busRouteNum}
                  onChange={(e) => setBusRouteNum(e.target.value)}
                  className="w-full p-2 border border-slate-300 rounded-lg"
                >
                  <option value="Route #14">Route #14 (Bus UP-16-BT-4821 - Express)</option>
                  <option value="Route #08">Route #08 (Bus DL-01-EQ-9304 - Indirapuram)</option>
                  <option value="Route #21">Route #21 (Bus UP-14-AC-7890 - Vasundhara)</option>
                  <option value="Route #03">Route #03 (Bus DL-04-TR-1122 - Greater Noida)</option>
                </select>
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Alert Message / Status Update</label>
                <textarea
                  rows={3}
                  required
                  value={busMessage}
                  onChange={(e) => setBusMessage(e.target.value)}
                  placeholder="e.g. Bus is running 10 mins delayed or Approaching Stop..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-amber-600 hover:bg-amber-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Bus className="w-4 h-4" />
                <span>Send Real-Time Bus Alert to Parents</span>
              </button>
            </form>
          )}

          {/* TAB 6: Broadcast Notice */}
          {activeTab === 'notice' && (
            <form onSubmit={handleNoticeSubmit} className="space-y-4 text-xs">
              <div className="p-3 bg-blue-50/60 rounded-xl border border-blue-100 text-blue-900">
                {isHindi 
                  ? 'यह परिपत्र (Circular) सभी विद्यार्थियों एवं अभिभावकों के डैशबोर्ड पर तुरंत फ्लैश होगा।' 
                  : 'Circular broadcast broadcasts an alert to all student and parent portals.'}
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Notice / Circular Title</label>
                <input
                  type="text"
                  value={noticeTitle}
                  onChange={(e) => setNoticeTitle(e.target.value)}
                  placeholder="e.g. Science Exhibition / Holiday Announcement"
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <div>
                <label className="block font-bold text-slate-700 mb-1">Detailed Message</label>
                <textarea
                  rows={3}
                  value={noticeMessage}
                  onChange={(e) => setNoticeMessage(e.target.value)}
                  placeholder="Write official notice announcement..."
                  className="w-full p-2 border border-slate-300 rounded-lg"
                  required
                />
              </div>

              <button
                type="submit"
                className="w-full py-2.5 bg-blue-600 hover:bg-blue-700 text-white font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
              >
                <Megaphone className="w-4 h-4" />
                <span>Broadcast Notice to All Parents</span>
              </button>
            </form>
          )}

        </div>

      </div>
    </div>
  );
};
