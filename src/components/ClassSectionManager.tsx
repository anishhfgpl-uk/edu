import React, { useState } from 'react';
import { SchoolClass, Student, Role } from '../types';
import { 
  Building2, 
  Users, 
  Calendar, 
  Clock, 
  Search, 
  Plus, 
  GraduationCap, 
  Phone, 
  Mail, 
  MapPin, 
  ShieldCheck, 
  UserCheck, 
  ArrowRight,
  BookOpen
} from 'lucide-react';

interface ClassSectionManagerProps {
  classes: SchoolClass[];
  students: Student[];
  selectedStudent: Student;
  currentRole: Role;
  isHindi: boolean;
  onSelectStudent: (student: Student) => void;
  onAddNewSection: (newClass: SchoolClass) => void;
  onNavigateToTab: (tab: string) => void;
}

export const ClassSectionManager: React.FC<ClassSectionManagerProps> = ({
  classes,
  students,
  selectedStudent,
  currentRole,
  isHindi,
  onSelectStudent,
  onAddNewSection,
  onNavigateToTab,
}) => {
  // Currently viewed class/section in the manager
  const initialClassId = classes.find(
    (c) => c.className === selectedStudent.class && c.section === selectedStudent.section
  )?.id || classes[0].id;

  const [selectedClassId, setSelectedClassId] = useState<string>(initialClassId);
  const [searchTerm, setSearchTerm] = useState('');
  const [activeSubTab, setActiveSubTab] = useState<'roster' | 'timetable'>('timetable');
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);

  // New section form
  const [newClassName, setNewClassName] = useState('Class 10');
  const [newSection, setNewSection] = useState('C');
  const [newRoom, setNewRoom] = useState('Room 206 (2nd Floor)');
  const [newTeacherName, setNewTeacherName] = useState('Mr. Vikram Seth');
  const [newTeacherSubject, setNewTeacherSubject] = useState('Chemistry & General Science');
  const [newCapacity, setNewCapacity] = useState(40);
  const [newWing, setNewWing] = useState<'Primary' | 'Middle' | 'Secondary' | 'Senior Secondary'>('Secondary');

  const currentClass = classes.find((c) => c.id === selectedClassId) || classes[0];

  // Students belonging to the currently selected class & section
  const sectionStudents = students.filter(
    (s) => s.class === currentClass.className && s.section === currentClass.section
  );

  const filteredStudents = sectionStudents.filter(
    (s) =>
      s.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      s.rollNo.includes(searchTerm) ||
      s.admissionNo.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const handleCreateSection = (e: React.FormEvent) => {
    e.preventDefault();
    const newClassObj: SchoolClass = {
      id: `cls-${Date.now()}`,
      className: newClassName,
      section: newSection.toUpperCase(),
      roomNo: newRoom,
      classTeacherName: newTeacherName,
      classTeacherSubject: newTeacherSubject,
      classTeacherAvatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80',
      totalStudents: 0,
      capacity: Number(newCapacity) || 40,
      wing: newWing,
      schedule: [
        { periodNo: 1, time: '08:30 - 09:15 AM', subject: 'English', teacher: 'Faculty TBD', room: newRoom },
        { periodNo: 2, time: '09:15 - 10:00 AM', subject: 'Mathematics', teacher: 'Faculty TBD', room: newRoom },
        { periodNo: 3, time: '10:00 - 10:45 AM', subject: 'Science', teacher: 'Faculty TBD', room: newRoom },
        { periodNo: 4, time: '11:15 - 12:00 PM', subject: 'Social Studies', teacher: 'Faculty TBD', room: newRoom },
      ],
    };

    onAddNewSection(newClassObj);
    setSelectedClassId(newClassObj.id);
    setIsAddModalOpen(false);
  };

  return (
    <div className="space-y-6">
      
      {/* Top Banner */}
      <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-2">
              <span className="p-2 rounded-xl bg-purple-100 text-purple-700">
                <Building2 className="w-5 h-5" />
              </span>
              <h2 className="text-xl font-bold text-slate-900">
                {isHindi ? 'कक्षा एवं सेक्शन प्रबंधन' : 'Class & Section Management Hub'}
              </h2>
            </div>
            <p className="text-sm text-slate-500 mt-1">
              {isHindi 
                ? 'सभी कक्षाओं, सेक्शनों, कक्षा अध्यापकों, समय सारिणी (Timetable) एवं छात्र उपस्थिति का केंद्रीकृत अवलोकन'
                : 'Centralized directory for school classes, sections, faculty coordinators, schedules and student rosters'
              }
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              id="btn-open-add-section-modal"
              onClick={() => setIsAddModalOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs sm:text-sm font-semibold shadow-xs transition-all cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>{isHindi ? 'नया सेक्शन जोड़ें' : 'Create New Section'}</span>
            </button>
          </div>
        </div>

        {/* Class / Section Tabs Switcher */}
        <div className="flex items-center gap-2 overflow-x-auto pb-1 mt-6 pt-4 border-t border-slate-100">
          <span className="text-xs font-bold text-slate-400 whitespace-nowrap mr-2">
            {isHindi ? 'कक्षा चुनें:' : 'Select Class:'}
          </span>
          {classes.map((cls) => {
            const isSelected = cls.id === selectedClassId;
            const isMyStudentSection = cls.className === selectedStudent.class && cls.section === selectedStudent.section;

            return (
              <button
                key={cls.id}
                onClick={() => setSelectedClassId(cls.id)}
                className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all cursor-pointer ${
                  isSelected
                    ? 'bg-purple-700 text-white shadow-xs'
                    : 'bg-slate-50 hover:bg-slate-100 text-slate-700 border border-slate-200'
                }`}
              >
                <span>{cls.className} - {cls.section}</span>
                {isMyStudentSection && (
                  <span className="px-1.5 py-0.2 rounded-full text-[10px] bg-amber-300 text-slate-900 font-extrabold">
                    {selectedStudent.name.split(' ')[0]}
                  </span>
                )}
              </button>
            );
          })}
        </div>
      </div>

      {/* Selected Class Section Information Card */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Left 1 Col: Class & Teacher Info Profile */}
        <div className="space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-5">
            <div>
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold uppercase tracking-wider text-purple-700 bg-purple-50 px-2.5 py-0.5 rounded-full border border-purple-200">
                  {currentClass.wing || 'Secondary Wing'}
                </span>
                <span className="text-xs text-slate-500 font-medium">Session 2025–26</span>
              </div>
              <h3 className="text-2xl font-black text-slate-900 mt-2">
                {currentClass.className} — Section {currentClass.section}
              </h3>
              <p className="text-xs text-slate-500 flex items-center gap-1.5 mt-1">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>{currentClass.roomNo}</span>
              </p>
            </div>

            {/* Class Capacity Meter */}
            <div className="bg-slate-50 rounded-xl p-4 border border-slate-200/60 space-y-2">
              <div className="flex items-center justify-between text-xs font-semibold">
                <span className="text-slate-600">Enrolled Strength:</span>
                <span className="text-slate-900 font-bold">
                  {currentClass.totalStudents} / {currentClass.capacity} Students
                </span>
              </div>
              <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden">
                <div 
                  className="bg-purple-600 h-full rounded-full"
                  style={{ width: `${Math.min(100, Math.round((currentClass.totalStudents / currentClass.capacity) * 100))}%` }}
                />
              </div>
              <span className="text-[11px] text-slate-500 block text-right">
                {currentClass.capacity - currentClass.totalStudents} seats available
              </span>
            </div>

            {/* Class Teacher Card */}
            <div className="p-4 bg-purple-50/50 rounded-xl border border-purple-100 space-y-3">
              <span className="text-[10px] font-bold uppercase tracking-wider text-purple-800 block">
                Class Mentor & Incharge
              </span>
              <div className="flex items-center gap-3">
                <img
                  src={currentClass.classTeacherAvatar || 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80'}
                  alt={currentClass.classTeacherName}
                  className="w-12 h-12 rounded-xl object-cover border border-purple-200"
                />
                <div>
                  <h4 className="text-sm font-bold text-slate-900">{currentClass.classTeacherName}</h4>
                  <p className="text-xs text-purple-700 font-medium">{currentClass.classTeacherSubject}</p>
                </div>
              </div>

              <div className="pt-2 border-t border-purple-100/80 flex items-center justify-between text-xs">
                <span className="text-slate-600">Role: Faculty HOD</span>
                <span className="inline-flex items-center gap-1 text-emerald-700 font-semibold">
                  <ShieldCheck className="w-3.5 h-3.5" />
                  Verified
                </span>
              </div>
            </div>

            {/* Quick Actions */}
            <div className="space-y-2 pt-2 border-t border-slate-100">
              <button
                onClick={() => onNavigateToTab('attendance')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
              >
                <span>Take Attendance for this Class</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => onNavigateToTab('homework')}
                className="w-full flex items-center justify-between px-3.5 py-2.5 bg-slate-50 hover:bg-purple-50 hover:text-purple-700 rounded-xl text-xs font-semibold text-slate-700 transition-colors"
              >
                <span>Send Homework to {currentClass.className}-{currentClass.section}</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </div>

        {/* Right 2 Cols: Timetable vs Student Roster */}
        <div className="lg:col-span-2 space-y-6">
          <div className="bg-white rounded-2xl p-6 border border-slate-200 shadow-xs space-y-4">
            
            {/* Sub Tabs: Timetable vs Student Roster */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
              <div className="flex items-center bg-slate-100 p-1 rounded-xl text-xs font-bold">
                <button
                  onClick={() => setActiveSubTab('timetable')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                    activeSubTab === 'timetable'
                      ? 'bg-white text-purple-700 shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Calendar className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'दैनिक समय सारिणी (Timetable)' : 'Daily Class Timetable'}</span>
                </button>

                <button
                  onClick={() => setActiveSubTab('roster')}
                  className={`flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg transition-all ${
                    activeSubTab === 'roster'
                      ? 'bg-white text-purple-700 shadow-xs font-extrabold'
                      : 'text-slate-600 hover:text-slate-900'
                  }`}
                >
                  <Users className="w-3.5 h-3.5" />
                  <span>{isHindi ? 'छात्र सूची (Roster)' : 'Student Directory'}</span>
                </button>
              </div>

              {activeSubTab === 'roster' && (
                <div className="relative">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search student or roll no..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="text-xs bg-slate-50 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 focus:outline-hidden w-full sm:w-52"
                  />
                </div>
              )}
            </div>

            {/* TAB 1: DAILY TIMETABLE */}
            {activeSubTab === 'timetable' && (
              <div className="space-y-3">
                <div className="flex items-center justify-between text-xs text-slate-500 font-medium">
                  <span>Regular Schedule (Monday to Friday)</span>
                  <span>School Hours: 08:30 AM – 02:00 PM</span>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-3 pt-1">
                  {currentClass.schedule.map((period) => (
                    <div
                      key={period.periodNo}
                      className="p-3.5 rounded-xl border border-slate-200 bg-slate-50/70 hover:bg-purple-50/30 hover:border-purple-200 transition-all space-y-1.5"
                    >
                      <div className="flex items-center justify-between">
                        <span className="px-2 py-0.5 rounded-md text-[10px] font-extrabold bg-purple-100 text-purple-800">
                          Period {period.periodNo}
                        </span>
                        <span className="text-xs text-slate-500 font-semibold flex items-center gap-1">
                          <Clock className="w-3 h-3 text-slate-400" />
                          {period.time}
                        </span>
                      </div>

                      <h4 className="text-sm font-bold text-slate-900 pt-1">{period.subject}</h4>
                      
                      <div className="flex items-center justify-between text-xs text-slate-600 pt-1">
                        <span className="font-medium text-slate-700">{period.teacher}</span>
                        <span className="text-slate-400 text-[11px]">{period.room}</span>
                      </div>
                    </div>
                  ))}
                </div>

                <div className="p-3 bg-amber-50 rounded-xl border border-amber-200/80 text-xs text-amber-900 flex items-center gap-2 mt-2">
                  <span className="font-bold">Note:</span>
                  <span>Recess break is from 10:45 AM to 11:15 AM. Laboratory and sports sessions require specific gear.</span>
                </div>
              </div>
            )}

            {/* TAB 2: STUDENT ROSTER */}
            {activeSubTab === 'roster' && (
              <div className="space-y-3">
                {filteredStudents.length === 0 ? (
                  <div className="p-8 text-center text-slate-500 text-xs">
                    No student matching search in {currentClass.className}-{currentClass.section}.
                  </div>
                ) : (
                  <div className="divide-y divide-slate-100">
                    {filteredStudents.map((st) => {
                      const isCurrentlyActive = st.id === selectedStudent.id;

                      return (
                        <div
                          key={st.id}
                          className={`py-3 px-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 rounded-xl transition-all ${
                            isCurrentlyActive ? 'bg-purple-50/70' : 'hover:bg-slate-50'
                          }`}
                        >
                          <div className="flex items-center gap-3">
                            <img
                              src={st.avatar}
                              alt={st.name}
                              className="w-10 h-10 rounded-full object-cover border border-slate-200"
                            />
                            <div>
                              <div className="flex items-center gap-2">
                                <h4 className="text-sm font-bold text-slate-900">{st.name}</h4>
                                <span className="text-[11px] font-semibold bg-slate-100 text-slate-700 px-1.5 py-0.2 rounded-md">
                                  Roll: {st.rollNo}
                                </span>
                                {isCurrentlyActive && (
                                  <span className="text-[10px] font-bold bg-purple-600 text-white px-2 py-0.2 rounded-full">
                                    Active View
                                  </span>
                                )}
                              </div>
                              <p className="text-xs text-slate-500 mt-0.5">
                                Parent: {st.parentName} • {st.parentPhone}
                              </p>
                            </div>
                          </div>

                          <div className="flex items-center gap-3">
                            <div className="text-right text-xs">
                              <span className="font-bold text-emerald-700 block">{st.attendancePercentage}% Attendance</span>
                              <span className="text-[11px] text-slate-400">{st.busRoute.split('(')[0]}</span>
                            </div>

                            <button
                              onClick={() => onSelectStudent(st)}
                              className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                                isCurrentlyActive
                                  ? 'bg-purple-600 text-white'
                                  : 'bg-slate-100 hover:bg-purple-100 text-slate-700 hover:text-purple-700'
                              }`}
                            >
                              {isCurrentlyActive ? 'Selected' : 'Select'}
                            </button>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            )}

          </div>
        </div>

      </div>

      {/* Modal: Create New Section */}
      {isAddModalOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-xs">
          <div className="bg-white rounded-2xl border border-slate-200 max-w-md w-full p-6 shadow-2xl">
            
            <div className="flex items-center justify-between pb-3 border-b border-slate-100">
              <div className="flex items-center gap-2">
                <div className="w-9 h-9 rounded-xl bg-purple-100 text-purple-700 flex items-center justify-center">
                  <Plus className="w-4 h-4" />
                </div>
                <div>
                  <h3 className="font-bold text-base text-slate-900">
                    {isHindi ? 'नया सेक्शन एवं कक्षा जोड़ें' : 'Create New Class Section'}
                  </h3>
                  <p className="text-xs text-slate-500">
                    Add new section to school academic hierarchy
                  </p>
                </div>
              </div>

              <button
                onClick={() => setIsAddModalOpen(false)}
                className="p-1.5 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100"
              >
                ✕
              </button>
            </div>

            <form onSubmit={handleCreateSection} className="space-y-4 mt-4">
              
              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Class</label>
                  <select
                    value={newClassName}
                    onChange={(e) => setNewClassName(e.target.value)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-hidden"
                  >
                    <option value="Class 10">Class 10</option>
                    <option value="Class 9">Class 9</option>
                    <option value="Class 8">Class 8</option>
                    <option value="Class 7">Class 7</option>
                    <option value="Class 6">Class 6</option>
                    <option value="Class 11">Class 11</option>
                    <option value="Class 12">Class 12</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Section</label>
                  <input
                    type="text"
                    required
                    maxLength={2}
                    value={newSection}
                    onChange={(e) => setNewSection(e.target.value)}
                    placeholder="e.g. C or D"
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-hidden uppercase"
                  />
                </div>
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Room Number</label>
                <input
                  type="text"
                  required
                  value={newRoom}
                  onChange={(e) => setNewRoom(e.target.value)}
                  placeholder="e.g. Room 208 (2nd Floor)"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Class Teacher Name</label>
                <input
                  type="text"
                  required
                  value={newTeacherName}
                  onChange={(e) => setNewTeacherName(e.target.value)}
                  placeholder="e.g. Mr. Vikram Seth"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-hidden"
                />
              </div>

              <div>
                <label className="block text-xs font-bold text-slate-700 mb-1">Subject Specialization</label>
                <input
                  type="text"
                  value={newTeacherSubject}
                  onChange={(e) => setNewTeacherSubject(e.target.value)}
                  placeholder="e.g. Chemistry & Science"
                  className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-hidden"
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Wing</label>
                  <select
                    value={newWing}
                    onChange={(e) => setNewWing(e.target.value as typeof newWing)}
                    className="w-full text-xs font-semibold bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-hidden"
                  >
                    <option value="Middle">Middle Wing</option>
                    <option value="Secondary">Secondary Wing</option>
                    <option value="Senior Secondary">Senior Secondary</option>
                    <option value="Primary">Primary Wing</option>
                  </select>
                </div>

                <div>
                  <label className="block text-xs font-bold text-slate-700 mb-1">Capacity</label>
                  <input
                    type="number"
                    min={20}
                    max={60}
                    value={newCapacity}
                    onChange={(e) => setNewCapacity(Number(e.target.value))}
                    className="w-full text-xs bg-slate-50 border border-slate-200 rounded-lg p-2.5 text-slate-900 focus:outline-hidden"
                  />
                </div>
              </div>

              <div className="flex items-center justify-end gap-3 pt-3 border-t border-slate-100">
                <button
                  type="button"
                  onClick={() => setIsAddModalOpen(false)}
                  className="px-4 py-2 text-xs font-semibold text-slate-600 hover:text-slate-800 rounded-lg"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-5 py-2.5 bg-purple-600 hover:bg-purple-700 text-white rounded-xl text-xs font-bold shadow-xs cursor-pointer"
                >
                  Create Section
                </button>
              </div>

            </form>

          </div>
        </div>
      )}

    </div>
  );
};
