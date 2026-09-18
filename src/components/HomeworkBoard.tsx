import React, { useState } from 'react';
import { HomeworkItem, Student, Role } from '../types';
import { 
  BookOpen, 
  CheckCircle2, 
  Clock, 
  FileText, 
  Send, 
  Plus, 
  Paperclip, 
  UserCheck, 
  Filter, 
  Calendar,
  AlertCircle,
  Sparkles,
  Download,
  Check
} from 'lucide-react';

interface HomeworkBoardProps {
  homework: HomeworkItem[];
  selectedStudent: Student;
  currentRole: Role;
  isHindi: boolean;
  onToggleComplete: (id: string) => void;
  onAcknowledgeParent: (id: string) => void;
  onSendHomework: (newHw: Omit<HomeworkItem, 'id' | 'isCompleted' | 'parentAcknowledged'>) => void;
}

export const HomeworkBoard: React.FC<HomeworkBoardProps> = ({
  homework,
  selectedStudent,
  currentRole,
  isHindi,
  onToggleComplete,
  onAcknowledgeParent,
  onSendHomework,
}) => {
  const [selectedClass, setSelectedClass] = useState<string>('all');
  const [selectedStatus, setSelectedStatus] = useState<'all' | 'pending' | 'completed'>('all');
  const [selectedType, setSelectedType] = useState<string>('all');
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  // New Homework form state
  const [targetClass, setTargetClass] = useState(selectedStudent.class);
  const [targetSection, setTargetSection] = useState(selectedStudent.section);
  const [subject, setSubject] = useState('Mathematics');
  const [title, setTitle] = useState('');
  const [titleHi, setTitleHi] = useState('');
  const [description, setDescription] = useState('');
  const [chapterOrTopic, setChapterOrTopic] = useState('');
  const [dueDate, setDueDate] = useState('19 Sep 2026');
  const [estimatedMinutes, setEstimatedMinutes] = useState(30);
  const [hwType, setHwType] = useState<'homework' | 'classwork' | 'project' | 'revision'>('homework');
  const [attachmentName, setAttachmentName] = useState('Practice_Worksheet_Q4.pdf');

  // Filter homework
  const filteredHomework = homework.filter((item) => {
    if (selectedClass !== 'all') {
      const classMatches = `${item.class}-${item.section}` === selectedClass || item.class === selectedClass;
      if (!classMatches) return false;
    }
    if (selectedStatus === 'pending' && item.isCompleted) return false;
    if (selectedStatus === 'completed' && !item.isCompleted) return false;
    if (selectedType !== 'all' && item.type !== selectedType) return false;
    return true;
  });

  const studentHomework = homework.filter(
    (h) => h.class === selectedStudent.class && h.section === selectedStudent.section
  );
  const completedCount = studentHomework.filter((h) => h.isCompleted).length;
  const pendingCount = studentHomework.length - completedCount;
  const totalEstimatedTime = studentHomework
    .filter((h) => !h.isCompleted)
    .reduce((acc, h) => acc + (h.estimatedMinutes || 30), 0);

  const handleSubmitNewHomework = (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim() || !description.trim()) return;

    onSendHomework({
      class: targetClass,
      section: targetSection,
      subject,
      teacherName: 'Mrs. Sunita Verma',
      assignedDate: '18 Sep 2026',
      dueDate,
      title: title.trim(),
      titleHi: titleHi.trim() || undefined,
      description: description.trim(),
      descriptionHi: isHindi ? description.trim() : undefined,
      chapterOrTopic: chapterOrTopic.trim() || 'Unit General Exercise',
      estimatedMinutes: Number(estimatedMinutes) || 30,
      attachmentName: attachmentName.trim() || undefined,
      type: hwType,
    });

    setTitle('');
    setTitleHi('');
    setDescription('');
    setChapterOrTopic('');
    setIsCreateModalOpen(false);
  };

  const getSubjectColor = (subj: string) => {
    const s = subj.toLowerCase();
    if (s.includes('math')) return 'bg-indigo-50 text-indigo-700 border-indigo-200';
    if (s.includes('sci') || s.includes('phy') || s.includes('chem')) return 'bg-emerald-50 text-emerald-700 border-emerald-200';
    if (s.includes('eng')) return 'bg-sky-50 text-sky-700 border-sky-200';
    if (s.includes('soc') || s.includes('hist')) return 'bg-amber-50 text-amber-700 border-amber-200';
    if (s.includes('hin')) return 'bg-rose-50 text-rose-700 border-rose-200';
    if (s.includes('comp') || s.includes('ai')) return 'bg-purple-50 text-purple-700 border-purple-200';
    return 'bg-slate-50 text-slate-700 border-slate-200';
  };

  return (
    <div className="space-y-6">
      
      {/* Header & Metrics Strip */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-indigo-100 text-indigo-700">
                <BookOpen className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {isHindi ? 'दैनिक गृहकार्य व कक्षा कार्य' : 'Daily Homework & Classwork Hub'}
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {isHindi 
                ? `विद्यार्थी: ${selectedStudent.name} (${selectedStudent.class}-${selectedStudent.section}) के लिए दैनिक असाइनमेंट एवं शिक्षक अपडेट`
                : `Active assignments, daily classwork and teacher notes for ${selectedStudent.name} (${selectedStudent.class}-${selectedStudent.section})`
              }
            </p>
          </div>

          <div className="flex items-center gap-3">
            {/* Quick Action Button to Send Daily Homework */}
            <button
              id="btn-open-create-homework"
              onClick={() => setIsCreateModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Send className="w-4 h-4" />
              <span>{isHindi ? 'नया गृहकार्य भेजें (शिक्षक)' : 'Send Daily Homework'}</span>
            </button>
          </div>
        </div>

        {/* 4 Stat Highlights */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mt-6 pt-6 border-t border-slate-100">
          <div className="bg-slate-50 rounded-xl p-3.5 border border-slate-200/60">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block">
              {isHindi ? 'कुल असाइनमेंट' : 'Total Assigned'}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-slate-900">{studentHomework.length}</span>
              <span className="text-xs text-slate-500">{selectedStudent.class}-{selectedStudent.section}</span>
            </div>
          </div>

          <div className="bg-emerald-50/70 rounded-xl p-3.5 border border-emerald-200/60">
            <span className="text-xs font-semibold text-emerald-700 uppercase tracking-wider block">
              {isHindi ? 'पूर्ण गृहकार्य' : 'Completed Work'}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-emerald-800">{completedCount}</span>
              <span className="text-xs text-emerald-600 font-medium">
                {studentHomework.length ? Math.round((completedCount / studentHomework.length) * 100) : 0}% done
              </span>
            </div>
          </div>

          <div className="bg-amber-50/70 rounded-xl p-3.5 border border-amber-200/60">
            <span className="text-xs font-semibold text-amber-700 uppercase tracking-wider block">
              {isHindi ? 'बकाया कार्य' : 'Pending Tasks'}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-amber-800">{pendingCount}</span>
              <span className="text-xs text-amber-700 font-medium">{isHindi ? 'जमा करना शेष' : 'Action needed'}</span>
            </div>
          </div>

          <div className="bg-purple-50/70 rounded-xl p-3.5 border border-purple-200/60">
            <span className="text-xs font-semibold text-purple-700 uppercase tracking-wider block">
              {isHindi ? 'अनुमानित समय' : 'Est. Study Time'}
            </span>
            <div className="flex items-baseline gap-2 mt-1">
              <span className="text-2xl font-black text-purple-800">{totalEstimatedTime}</span>
              <span className="text-xs text-purple-600 font-medium">{isHindi ? 'मिनट शेष' : 'minutes left'}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Filter and Control Bar */}
      <div className="bg-white rounded-2xl p-4 border border-slate-200 shadow-xs flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2">
          <span className="text-xs font-bold text-slate-500 flex items-center gap-1.5 mr-1">
            <Filter className="w-3.5 h-3.5" />
            {isHindi ? 'फिल्टर:' : 'Filter:'}
          </span>

          {/* Class Selector Filter */}
          <select
            id="filter-homework-class"
            value={selectedClass}
            onChange={(e) => setSelectedClass(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden"
          >
            <option value="all">{isHindi ? 'सभी कक्षाएं व सेक्शन' : 'All Classes & Sections'}</option>
            <option value={`${selectedStudent.class}-${selectedStudent.section}`}>
              ★ {selectedStudent.class}-{selectedStudent.section} ({selectedStudent.name})
            </option>
            <option value="Class 10-A">Class 10 - Section A</option>
            <option value="Class 10-B">Class 10 - Section B</option>
            <option value="Class 9-A">Class 9 - Section A</option>
            <option value="Class 8-B">Class 8 - Section B</option>
            <option value="Class 6-C">Class 6 - Section C</option>
            <option value="Class 12-A">Class 12 - Section A</option>
          </select>

          {/* Status Filter */}
          <div className="flex items-center bg-slate-100 p-0.5 rounded-lg border border-slate-200 text-xs">
            <button
              onClick={() => setSelectedStatus('all')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                selectedStatus === 'all' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-600'
              }`}
            >
              {isHindi ? 'सभी' : 'All'}
            </button>
            <button
              onClick={() => setSelectedStatus('pending')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                selectedStatus === 'pending' ? 'bg-white text-amber-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              {isHindi ? 'बकाया' : 'Pending'}
            </button>
            <button
              onClick={() => setSelectedStatus('completed')}
              className={`px-2.5 py-1 rounded-md font-semibold transition-all ${
                selectedStatus === 'completed' ? 'bg-white text-emerald-700 shadow-xs' : 'text-slate-600'
              }`}
            >
              {isHindi ? 'पूर्ण' : 'Completed'}
            </button>
          </div>

          {/* Type Filter */}
          <select
            id="filter-homework-type"
            value={selectedType}
            onChange={(e) => setSelectedType(e.target.value)}
            className="text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5 text-slate-800 focus:outline-hidden"
          >
            <option value="all">{isHindi ? 'सभी प्रकार' : 'All Task Types'}</option>
            <option value="homework">{isHindi ? 'दैनिक गृहकार्य (Homework)' : 'Daily Homework'}</option>
            <option value="classwork">{isHindi ? 'कक्षा कार्य (Classwork)' : 'Classwork'}</option>
            <option value="project">{isHindi ? 'परियोजना (Project)' : 'Project'}</option>
            <option value="revision">{isHindi ? 'अभ्यास / पुनरावृत्ति' : 'Revision'}</option>
          </select>
        </div>

        <div className="text-xs text-slate-500 font-medium">
          {filteredHomework.length} {isHindi ? 'असाइनमेंट उपलब्ध' : 'Assignments listed'}
        </div>
      </div>

      {/* Homework Cards List */}
      <div className="space-y-4">
        {filteredHomework.length === 0 ? (
          <div className="bg-white rounded-2xl p-12 text-center border border-slate-200 shadow-xs">
            <CheckCircle2 className="w-12 h-12 text-emerald-500 mx-auto mb-3" />
            <h3 className="font-bold text-slate-900 text-base">
              {isHindi ? 'कोई बकाया गृहकार्य नहीं है!' : 'No Homework Found for Selected Filter!'}
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              {isHindi 
                ? 'सभी कार्य समय पर पूर्ण किए जा चुके हैं अथवा चुने गए फिल्टर में कोई कार्य नहीं है।' 
                : 'All assigned tasks have been completed or no assignments match your filter criteria.'
              }
            </p>
          </div>
        ) : (
          filteredHomework.map((item) => {
            const isStudentClass = item.class === selectedStudent.class && item.section === selectedStudent.section;

            return (
              <div
                key={item.id}
                className={`bg-white rounded-2xl border transition-all p-5 shadow-xs ${
                  item.isCompleted 
                    ? 'border-emerald-200 bg-emerald-50/20' 
                    : 'border-slate-200 hover:border-indigo-300'
                }`}
              >
                <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                  
                  <div className="space-y-2 flex-1">
                    {/* Header Row: Subject, Class-Section, Due Date */}
                    <div className="flex flex-wrap items-center gap-2">
                      <span className={`px-2.5 py-0.5 rounded-full text-xs font-bold border ${getSubjectColor(item.subject)}`}>
                        {item.subject}
                      </span>

                      <span className="px-2 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700 border border-slate-200">
                        {item.class} • Section {item.section}
                      </span>

                      <span className="capitalize px-2 py-0.5 rounded-md text-[11px] font-semibold bg-indigo-50 text-indigo-700 border border-indigo-200">
                        {item.type}
                      </span>

                      {isStudentClass && (
                        <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-amber-100 text-amber-800 border border-amber-300">
                          ★ {selectedStudent.name}'s Task
                        </span>
                      )}

                      <div className="ml-auto flex items-center gap-2 text-xs font-medium text-slate-500">
                        <Calendar className="w-3.5 h-3.5 text-slate-400" />
                        <span>Due: <strong className="text-slate-800">{item.dueDate}</strong></span>
                      </div>
                    </div>

                    {/* Homework Title */}
                    <div>
                      <h3 className={`text-base font-bold text-slate-900 ${item.isCompleted ? 'line-through text-slate-500' : ''}`}>
                        {isHindi && item.titleHi ? item.titleHi : item.title}
                      </h3>
                      {item.chapterOrTopic && (
                        <span className="text-xs font-semibold text-indigo-600 block mt-0.5">
                          {item.chapterOrTopic}
                        </span>
                      )}
                    </div>

                    {/* Description / Instructions */}
                    <p className="text-xs sm:text-sm text-slate-600 leading-relaxed bg-slate-50/80 p-3 rounded-xl border border-slate-100">
                      {isHindi && item.descriptionHi ? item.descriptionHi : item.description}
                    </p>

                    {/* Metadata Strip: Teacher, Est Time, Attachment */}
                    <div className="flex flex-wrap items-center gap-3 pt-2 text-xs text-slate-500">
                      <div className="flex items-center gap-1.5 font-medium">
                        <span className="w-5 h-5 rounded-full bg-purple-100 text-purple-700 flex items-center justify-center font-bold text-[10px]">
                          {item.teacherName.charAt(0)}
                        </span>
                        <span>{item.teacherName}</span>
                      </div>

                      <span>•</span>

                      <div className="flex items-center gap-1">
                        <Clock className="w-3.5 h-3.5 text-slate-400" />
                        <span>Est: ~{item.estimatedMinutes || 30} mins</span>
                      </div>

                      {item.attachmentName && (
                        <>
                          <span>•</span>
                          <div 
                            className="flex items-center gap-1 text-indigo-600 hover:text-indigo-800 font-semibold cursor-pointer bg-indigo-50/70 px-2 py-0.5 rounded-md border border-indigo-200/60"
                            title="Download Worksheet / Resource File"
                          >
                            <Paperclip className="w-3.5 h-3.5" />
                            <span>{item.attachmentName}</span>
                            <Download className="w-3 h-3 ml-1" />
                          </div>
                        </>
                      )}
                    </div>
                  </div>

                  {/* Actions Column: Completion toggle & Parent verification */}
                  <div className="flex flex-col sm:flex-row md:flex-col items-stretch sm:items-center md:items-end gap-2.5 flex-shrink-0 pt-2 md:pt-0 border-t md:border-t-0 border-slate-100">
                    
                    {/* Student Mark as Done Button */}
                    <button
                      id={`btn-toggle-hw-${item.id}`}
                      onClick={() => onToggleComplete(item.id)}
                      className={`flex items-center justify-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        item.isCompleted
                          ? 'bg-emerald-600 hover:bg-emerald-700 text-white shadow-xs'
                          : 'bg-slate-100 hover:bg-indigo-50 text-slate-700 hover:text-indigo-700 border border-slate-200'
                      }`}
                    >
                      {item.isCompleted ? (
                        <>
                          <Check className="w-4 h-4" />
                          <span>{isHindi ? 'पूर्ण (Done)' : 'Completed'}</span>
                        </>
                      ) : (
                        <>
                          <span className="w-4 h-4 rounded-md border-2 border-slate-400" />
                          <span>{isHindi ? 'पूरा हुआ चिन्हित करें' : 'Mark as Done'}</span>
                        </>
                      )}
                    </button>

                    {item.isCompleted && item.completedAt && (
                      <span className="text-[11px] text-emerald-700 font-medium">
                        ✓ {item.completedAt}
                      </span>
                    )}

                    {/* Parent Verification / Sign-off Button */}
                    <div className="w-full sm:w-auto">
                      {item.parentAcknowledged ? (
                        <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold bg-blue-50 text-blue-700 border border-blue-200">
                          <UserCheck className="w-3.5 h-3.5 text-blue-600" />
                          <span>{isHindi ? 'अभिभावक सत्यापित' : 'Parent Verified'}</span>
                        </span>
                      ) : (
                        <button
                          id={`btn-ack-parent-${item.id}`}
                          onClick={() => onAcknowledgeParent(item.id)}
                          className="w-full text-center px-3 py-1.5 rounded-xl text-xs font-semibold bg-slate-50 hover:bg-emerald-50 text-slate-600 hover:text-emerald-700 border border-slate-200 hover:border-emerald-300 transition-all cursor-pointer"
                          title="Parent acknowledges that child has completed homework"
                        >
                          {isHindi ? 'अभिभावक हस्ताक्षर करें' : 'Parent Sign-Off'}
                        </button>
                      )}
                    </div>
                  </div>

                </div>
              </div>
            );
          })
        )}
      </div>

      {/* Modal: Send Daily Homework / Classwork (Teacher & Faculty) */}
      {isCreateModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-lg w-full p-6 shadow-2xl overflow-y-auto max-h-[92vh]">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-indigo-100 text-indigo-700 flex items-center justify-center">
                  <Send className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {isHindi ? 'दैनिक गृहकार्य / कक्षा कार्य भेजें' : 'Dispatch Daily Homework / Classwork'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    {isHindi ? 'सभी विद्यार्थियों व अभिभावकों को तुरंत नोटिफिकेशन जाएगा' : 'Push notification alerts will be sent immediately to parents'}
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsCreateModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleSubmitNewHomework} className="space-y-4 mt-4">
              
              {/* Target Class & Section */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHindi ? 'कक्षा (Class)' : 'Class'}
                  </label>
                  <select
                    value={targetClass}
                    onChange={(e) => setTargetClass(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-hidden"
                  >
                    <option value="Class 10">Class 10</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHindi ? 'सेक्शन (Section)' : 'Section'}
                  </label>
                  <select
                    value={targetSection}
                    onChange={(e) => setTargetSection(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-hidden"
                  >
                    <option value="A">Section A</option>
                    <option value="B">Section B</option>
                    <option value="C">Section C</option>
                  </select>
                </div>
              </div>

              {/* Subject & Type */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHindi ? 'विषय (Subject)' : 'Subject'}
                  </label>
                  <select
                    value={subject}
                    onChange={(e) => setSubject(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-hidden"
                  >
                    <option value="Mathematics">Mathematics</option>
                    <option value="Science">Science (Physics/Chem/Bio)</option>
                    <option value="English Language & Lit">English Language & Lit</option>
                    <option value="Social Science">Social Science</option>
                    <option value="Hindi Course A">Hindi Course A</option>
                    <option value="Computer Science (AI)">Computer Science (AI)</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHindi ? 'प्रकार (Task Type)' : 'Task Type'}
                  </label>
                  <select
                    value={hwType}
                    onChange={(e) => setHwType(e.target.value as typeof hwType)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-hidden"
                  >
                    <option value="homework">Daily Homework</option>
                    <option value="classwork">Daily Classwork</option>
                    <option value="project">Project / Practical</option>
                    <option value="revision">Exam Revision Set</option>
                  </select>
                </div>
              </div>

              {/* Title */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? 'गृहकार्य शीर्षक (Title in English)' : 'Assignment Title'} *
                </label>
                <input
                  type="text"
                  required
                  placeholder="e.g. NCERT Chapter 5: Arithmetic Progressions - Ex 5.2"
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-hidden"
                />
              </div>

              {/* Hindi Title (Optional) */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? 'हिंदी शीर्षक (वैकल्पिक)' : 'Title in Hindi (Optional)'}
                </label>
                <input
                  type="text"
                  placeholder="उदा. समांतर श्रेढ़ी प्रश्नावली 5.2 के प्रश्न 1 से 6"
                  value={titleHi}
                  onChange={(e) => setTitleHi(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-hidden"
                />
              </div>

              {/* Chapter / Topic */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? 'अध्याय / विषयवस्तु' : 'Chapter / Topic / NCERT Ref'}
                </label>
                <input
                  type="text"
                  placeholder="e.g. Ch-5 Arithmetic Progressions (nth term formulas)"
                  value={chapterOrTopic}
                  onChange={(e) => setChapterOrTopic(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-hidden"
                />
              </div>

              {/* Detailed Description */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? 'विस्तृत निर्देश (Instructions)' : 'Detailed Instructions'} *
                </label>
                <textarea
                  required
                  rows={3}
                  placeholder="Write clear steps: Solve Questions 1 to 6 in homework notebook. Show all intermediate formula steps..."
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-hidden"
                />
              </div>

              {/* Due Date & Est Minutes */}
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHindi ? 'जमा करने की तिथि' : 'Due Date'}
                  </label>
                  <input
                    type="text"
                    value={dueDate}
                    onChange={(e) => setDueDate(e.target.value)}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-hidden"
                  />
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">
                    {isHindi ? 'अनुमानित समय (मिनट)' : 'Est. Minutes'}
                  </label>
                  <input
                    type="number"
                    min={10}
                    max={180}
                    value={estimatedMinutes}
                    onChange={(e) => setEstimatedMinutes(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2 text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Attachment name */}
              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {isHindi ? 'संलग्नक फाइल नाम (वैकल्पिक)' : 'Worksheet / Reference Document File'}
                </label>
                <div className="flex items-center gap-2 bg-slate-50 border border-slate-200 rounded-lg px-2.5 py-1.5">
                  <Paperclip className="w-3.5 h-3.5 text-slate-400" />
                  <input
                    type="text"
                    placeholder="e.g. Worksheet_Ch5_Practice.pdf"
                    value={attachmentName}
                    onChange={(e) => setAttachmentName(e.target.value)}
                    className="w-full text-xs bg-transparent text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              {/* Submit Buttons */}
              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsCreateModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  id="btn-submit-send-homework"
                  type="submit"
                  className="flex items-center gap-2 px-5 py-2.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  <Send className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'गृहकार्य भेजें एवं अलर्ट प्रसारित करें' : 'Send & Dispatch Push Alert'}</span>
                </button>
              </div>

            </form>
          </div>
        </div>
      )}

    </div>
  );
};
