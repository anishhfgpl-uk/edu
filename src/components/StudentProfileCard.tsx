import React from 'react';
import { Student } from '../types';
import { 
  User, 
  BookOpen, 
  Phone, 
  MapPin, 
  Bus, 
  Heart, 
  Calendar, 
  Award, 
  CheckCircle2, 
  AlertCircle,
  GraduationCap
} from 'lucide-react';

interface StudentProfileCardProps {
  student: Student;
  isHindi: boolean;
  onNavigateTab: (tab: string) => void;
}

export const StudentProfileCard: React.FC<StudentProfileCardProps> = ({
  student,
  isHindi,
  onNavigateTab,
}) => {
  return (
    <div className="space-y-6">
      
      {/* Primary Identity Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          
          <div className="flex items-start sm:items-center gap-4">
            <div className="relative">
              <img
                src={student.avatar}
                alt={student.name}
                className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl object-cover border-2 border-indigo-200 shadow-sm"
              />
              <span className="absolute -bottom-1 -right-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-emerald-600 text-white shadow-xs">
                Active
              </span>
            </div>

            <div>
              <div className="flex flex-wrap items-center gap-2">
                <h2 className="text-xl sm:text-2xl font-black text-slate-900">
                  {student.name}
                </h2>
                <button
                  type="button"
                  onClick={() => onNavigateTab('classes')}
                  className="px-2.5 py-0.5 rounded-md text-xs font-bold bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 cursor-pointer transition-colors"
                  title="Click to view Class & Section Schedule"
                >
                  {student.class} - {student.section} ↗
                </button>
                <span className="px-2.5 py-0.5 rounded-md text-xs font-semibold bg-slate-100 text-slate-700">
                  Roll #{student.rollNo}
                </span>
                <button
                  type="button"
                  onClick={() => onNavigateTab('homework')}
                  className="px-2 py-0.5 rounded-md text-xs font-bold bg-amber-50 hover:bg-amber-100 text-amber-800 border border-amber-200 cursor-pointer transition-colors flex items-center gap-1"
                >
                  <BookOpen className="w-3 h-3 text-amber-600" />
                  <span>Today's Homework</span>
                </button>
              </div>

              <p className="text-xs text-slate-500 mt-1">
                <span className="font-semibold text-slate-700">{isHindi ? 'प्रवेश क्रमांक' : 'Admission No'}:</span> {student.admissionNo} •{' '}
                <span className="font-semibold text-slate-700">{isHindi ? 'सत्र' : 'Session'}:</span> {student.academicYear}
              </p>

              <div className="flex flex-wrap items-center gap-y-1 gap-x-4 mt-2.5 text-xs text-slate-600">
                <span className="flex items-center gap-1">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>DOB: {student.dob}</span>
                </span>
                <span className="flex items-center gap-1">
                  <Heart className="w-3.5 h-3.5 text-rose-500" />
                  <span>Blood Group: {student.bloodGroup}</span>
                </span>
                <span className="flex items-center gap-1">
                  <User className="w-3.5 h-3.5 text-slate-400" />
                  <span>Gender: {student.gender}</span>
                </span>
              </div>
            </div>
          </div>

          {/* Key KPI Quick Metrics */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full md:w-auto">
            
            {/* Attendance KPI */}
            <div 
              onClick={() => onNavigateTab('attendance')}
              className="bg-emerald-50/70 border border-emerald-200/80 rounded-xl p-3 text-center cursor-pointer hover:bg-emerald-100/70 transition-colors"
            >
              <div className="flex items-center justify-center gap-1 text-emerald-700 text-xs font-semibold mb-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>{isHindi ? 'उपस्थिति' : 'Attendance'}</span>
              </div>
              <div className="text-xl font-black text-emerald-800">
                {student.attendancePercentage}%
              </div>
              <span className="text-[10px] text-emerald-600 font-medium">
                {isHindi ? 'संतोषजनक' : 'Eligible for Finals'}
              </span>
            </div>

            {/* Results KPI */}
            <div 
              onClick={() => onNavigateTab('results')}
              className="bg-purple-50/70 border border-purple-200/80 rounded-xl p-3 text-center cursor-pointer hover:bg-purple-100/70 transition-colors"
            >
              <div className="flex items-center justify-center gap-1 text-purple-700 text-xs font-semibold mb-1">
                <Award className="w-3.5 h-3.5" />
                <span>{isHindi ? 'वार्षिक रैंक' : 'Class Rank'}</span>
              </div>
              <div className="text-xl font-black text-purple-800">
                #2
              </div>
              <span className="text-[10px] text-purple-600 font-medium">
                94.67% A1
              </span>
            </div>

            {/* Fees KPI */}
            <div 
              onClick={() => onNavigateTab('fees')}
              className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3 text-center cursor-pointer hover:bg-amber-100/70 transition-colors"
            >
              <div className="flex items-center justify-center gap-1 text-amber-700 text-xs font-semibold mb-1">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>{isHindi ? 'बकाया शुल्क' : 'Due Fees'}</span>
              </div>
              <div className="text-xl font-black text-amber-800">
                ₹11.2k
              </div>
              <span className="text-[10px] text-amber-700 font-medium">
                Due 15 Jan
              </span>
            </div>
          </div>
        </div>

        {/* Contact & Route Details Strip */}
        <div className="mt-5 pt-4 border-t border-slate-100 grid grid-cols-1 md:grid-cols-3 gap-4 text-xs text-slate-600">
          <div className="flex items-start gap-2">
            <User className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-slate-700">{isHindi ? 'अभिभावक' : 'Parent'}: </span>
              {student.parentName} ({student.parentRelation})
              <div className="text-slate-500 font-mono text-[11px] mt-0.5">{student.parentPhone}</div>
            </div>
          </div>

          <button
            type="button"
            onClick={() => onNavigateTab('bus')}
            className="flex items-start gap-2 text-left p-1.5 -m-1.5 rounded-xl hover:bg-slate-50 transition-colors cursor-pointer group"
            title="Click to track student live bus location"
          >
            <Bus className="w-4 h-4 text-amber-600 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-slate-700">{isHindi ? 'परिवहन रूट' : 'Transport'}: </span>
              <span className="group-hover:text-indigo-600 font-medium transition-colors">{student.busRoute}</span>
              <span className="text-[10px] text-amber-700 font-bold block">● Live GPS Tracking Available ↗</span>
            </div>
          </button>

          <div className="flex items-start gap-2">
            <MapPin className="w-4 h-4 text-slate-400 mt-0.5 flex-shrink-0" />
            <div>
              <span className="font-semibold text-slate-700">{isHindi ? 'आवासीय पता' : 'Address'}: </span>
              <span className="line-clamp-1">{student.address}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Class Teacher & Subjects Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        {/* Class Teacher Mentor Info */}
        <div className="bg-white rounded-2xl border border-slate-200 p-5 shadow-xs flex flex-col justify-between">
          <div>
            <div className="flex items-center gap-2 mb-3">
              <GraduationCap className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">
                {isHindi ? 'कक्षा अध्यापक (Class Mentor)' : 'Assigned Class Teacher'}
              </h3>
            </div>

            <div className="flex items-center gap-3 bg-slate-50 p-3 rounded-xl border border-slate-200/60">
              <img
                src={student.classTeacher.avatar}
                alt={student.classTeacher.name}
                className="w-12 h-12 rounded-xl object-cover border border-slate-200"
              />
              <div>
                <h4 className="font-bold text-sm text-slate-900">
                  {student.classTeacher.name}
                </h4>
                <p className="text-xs text-indigo-600 font-medium">
                  {student.classTeacher.subject}
                </p>
                <p className="text-[11px] text-slate-400 mt-0.5">
                  {student.classTeacher.email}
                </p>
              </div>
            </div>

            <div className="mt-4 space-y-2 text-xs text-slate-600">
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>{isHindi ? 'शिक्षक संपर्क' : 'Teacher Helpline'}:</span>
                <span className="font-mono font-medium text-slate-800">{student.classTeacher.phone}</span>
              </div>
              <div className="flex items-center justify-between py-1 border-b border-slate-100">
                <span>{isHindi ? 'परामर्श समय' : 'Counseling Hours'}:</span>
                <span className="font-medium text-slate-800">02:30 PM - 03:30 PM</span>
              </div>
              <div className="flex items-center justify-between py-1">
                <span>{isHindi ? 'आचरण रेटिंग' : 'Conduct Rating'}:</span>
                <span className="font-bold text-emerald-600">Exemplary (A+)</span>
              </div>
            </div>
          </div>

          <div className="mt-4 pt-3 border-t border-slate-100 flex gap-2">
            <button 
              onClick={() => onNavigateTab('parent-updates')}
              className="flex-1 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 font-semibold text-xs rounded-lg transition-colors flex items-center justify-center gap-1"
            >
              <Phone className="w-3.5 h-3.5" />
              <span>{isHindi ? 'संदेश भेजें' : 'Send Teacher Note'}</span>
            </button>
          </div>
        </div>

        {/* Enrolled Subjects & Syllabus Coverage Progress */}
        <div className="lg:col-span-2 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-2">
              <BookOpen className="w-5 h-5 text-indigo-600" />
              <h3 className="font-bold text-sm text-slate-900">
                {isHindi ? 'नामांकित विषय एवं पाठ्यक्रम प्रगति' : 'Enrolled Subjects & Syllabus Tracking'}
              </h3>
            </div>
            <span className="text-xs text-slate-500">
              {student.subjects.length} {isHindi ? 'विषय' : 'Subjects'}
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {student.subjects.map((sub) => (
              <div
                key={sub.id}
                className="p-3.5 rounded-xl border border-slate-200/90 bg-slate-50/40 hover:bg-white hover:shadow-xs transition-all"
              >
                <div className="flex items-center justify-between">
                  <div>
                    <h4 className="text-xs font-bold text-slate-900">
                      {sub.name}
                    </h4>
                    <span className="text-[11px] text-slate-500">
                      {sub.code} • {sub.teacher}
                    </span>
                  </div>
                  <span className="px-2 py-0.5 rounded-md text-[11px] font-bold bg-indigo-50 text-indigo-700 border border-indigo-200">
                    Grade {sub.grade}
                  </span>
                </div>

                {/* Progress bar */}
                <div className="mt-3">
                  <div className="flex justify-between text-[11px] text-slate-600 mb-1">
                    <span>{isHindi ? 'पाठ्यक्रम पूरा' : 'Syllabus Covered'}</span>
                    <span className="font-bold text-slate-900">{sub.syllabusCoverage}%</span>
                  </div>
                  <div className="w-full bg-slate-200 h-1.5 rounded-full overflow-hidden">
                    <div
                      className="h-full bg-indigo-600 rounded-full transition-all duration-500"
                      style={{ width: `${sub.syllabusCoverage}%` }}
                    />
                  </div>
                </div>

                <div className="flex justify-between items-center mt-2 text-[10px] text-slate-500">
                  <span>{sub.periodsPerWeek} {isHindi ? 'कक्षाएं/सप्ताह' : 'periods/week'}</span>
                  <span className="text-emerald-600 font-semibold">● Active Term</span>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

    </div>
  );
};
