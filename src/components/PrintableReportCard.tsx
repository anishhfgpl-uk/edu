import React from 'react';
import { Student, ExamReport } from '../types';
import { Printer, X, Award, CheckCircle2, Shield } from 'lucide-react';

interface PrintableReportCardProps {
  student: Student;
  report: ExamReport;
  onClose: () => void;
  isHindi: boolean;
}

export const PrintableReportCard: React.FC<PrintableReportCardProps> = ({
  student,
  report,
  onClose,
  isHindi,
}) => {
  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
        
        {/* Modal Top Bar (Hidden on print) */}
        <div className="p-4 bg-slate-800 text-white flex items-center justify-between print:hidden">
          <div className="flex items-center gap-2">
            <Award className="w-5 h-5 text-amber-400" />
            <h3 className="font-bold text-sm sm:text-base">
              {isHindi ? 'अधिकारिक अंकतालिका / रिपोर्ट कार्ड' : 'Official Academic Marksheet & Report Card'}
            </h3>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-indigo-600 hover:bg-indigo-700 text-white rounded-lg text-xs font-bold shadow-xs transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
              <span>{isHindi ? 'प्रिंट करें / पीडीएफ सेव करें' : 'Print / Save PDF'}</span>
            </button>
            <button
              onClick={onClose}
              className="p-1.5 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>
        </div>

        {/* Printable Marksheet Sheet Body */}
        <div className="flex-1 overflow-y-auto p-6 sm:p-10 print:p-0 bg-white">
          <div className="border-4 border-double border-indigo-900/40 p-6 sm:p-8 rounded-xl bg-gradient-to-b from-slate-50/40 to-white">
            
            {/* School Header */}
            <div className="text-center border-b-2 border-indigo-900 pb-5">
              <div className="inline-flex items-center justify-center w-14 h-14 rounded-full bg-indigo-900 text-amber-400 mb-2 shadow-md">
                <Shield className="w-8 h-8" />
              </div>
              <h1 className="text-2xl sm:text-3xl font-black uppercase tracking-wider text-indigo-950">
                Educate Model Senior Secondary School
              </h1>
              <p className="text-xs font-semibold text-slate-600 tracking-wide mt-0.5">
                Affiliated to Central Board of Secondary Education (CBSE Reg #2130894)
              </p>
              <p className="text-[11px] text-slate-500">
                Sector 62, Institutional Area, Noida - 201301 • Phone: (0120) 2400192 • info@educateschool.edu
              </p>
              <div className="mt-3 inline-block bg-indigo-900 text-white font-extrabold text-xs uppercase px-4 py-1 rounded-full tracking-widest">
                {report.examName}
              </div>
            </div>

            {/* Student & Academic Info Details */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 py-5 border-b border-slate-200 text-xs text-slate-700">
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Student Name</span>
                <span className="font-extrabold text-slate-900 text-sm">{student.name}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Class & Section</span>
                <span className="font-bold text-slate-900">{student.class} - {student.section}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Roll Number</span>
                <span className="font-bold text-slate-900">{student.rollNo}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Admission Number</span>
                <span className="font-mono font-bold text-slate-900">{student.admissionNo}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Father's Name</span>
                <span className="font-medium text-slate-800">{student.parentName}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Date of Birth</span>
                <span className="font-medium text-slate-800">{student.dob}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Academic Session</span>
                <span className="font-bold text-indigo-900">{student.academicYear}</span>
              </div>
              <div>
                <span className="text-slate-400 block text-[10px] uppercase font-bold">Term Attendance</span>
                <span className="font-bold text-emerald-700">{report.attendanceAtExamTime}%</span>
              </div>
            </div>

            {/* Scholastic Performance Subject Table */}
            <div className="mt-5 overflow-x-auto">
              <table className="w-full text-xs text-left border-collapse border border-slate-300">
                <thead>
                  <tr className="bg-indigo-900 text-white font-bold text-center">
                    <th className="border border-slate-400 p-2 text-left">Subject Code & Title</th>
                    <th className="border border-slate-400 p-2">Theory (Max)</th>
                    <th className="border border-slate-400 p-2">Theory (Obt)</th>
                    <th className="border border-slate-400 p-2">Prac/Int (Max)</th>
                    <th className="border border-slate-400 p-2">Prac/Int (Obt)</th>
                    <th className="border border-slate-400 p-2">Total (100)</th>
                    <th className="border border-slate-400 p-2">Grade</th>
                    <th className="border border-slate-400 p-2">Grade Pt</th>
                  </tr>
                </thead>
                <tbody>
                  {report.subjects.map((sub, idx) => (
                    <tr key={idx} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/70'}>
                      <td className="border border-slate-300 p-2 font-bold text-slate-900">
                        <span className="text-slate-400 font-mono text-[10px] mr-1">[{sub.code}]</span>
                        {sub.subjectName}
                      </td>
                      <td className="border border-slate-300 p-2 text-center text-slate-600">{sub.maxTheory}</td>
                      <td className="border border-slate-300 p-2 text-center font-semibold text-slate-800">{sub.marksTheory}</td>
                      <td className="border border-slate-300 p-2 text-center text-slate-600">{sub.maxPractical}</td>
                      <td className="border border-slate-300 p-2 text-center font-semibold text-slate-800">{sub.marksPractical}</td>
                      <td className="border border-slate-300 p-2 text-center font-black text-indigo-900 text-sm">
                        {sub.totalObtained}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-bold text-emerald-700">
                        {sub.grade}
                      </td>
                      <td className="border border-slate-300 p-2 text-center font-semibold text-slate-700">
                        {sub.gradePoint}.0
                      </td>
                    </tr>
                  ))}
                  
                  {/* Grand Totals */}
                  <tr className="bg-indigo-50/80 font-black text-slate-900">
                    <td className="border border-slate-400 p-2 uppercase text-right" colSpan={5}>
                      Grand Total Aggregate
                    </td>
                    <td className="border border-slate-400 p-2 text-center text-indigo-900 text-base">
                      {report.totalObtainedMarks} / {report.totalMaxMarks}
                    </td>
                    <td className="border border-slate-400 p-2 text-center text-emerald-800" colSpan={2}>
                      {report.percentage}% (A1)
                    </td>
                  </tr>
                </tbody>
              </table>
            </div>

            {/* Performance Summary Banner */}
            <div className="mt-5 grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50 p-4 rounded-xl border border-slate-200 text-center">
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Class Rank</span>
                <span className="text-lg font-black text-indigo-900">Rank #{report.classRank}</span>
                <span className="text-[10px] text-slate-500 block">Out of {report.totalStudentsInClass} students</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Overall Percentage</span>
                <span className="text-lg font-black text-emerald-700">{report.percentage}%</span>
                <span className="text-[10px] text-emerald-600 block font-medium">9.6 CGPA Equivalent</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Division Awarded</span>
                <span className="text-xs font-bold text-slate-900 block mt-1">{report.division}</span>
              </div>
              <div>
                <span className="text-[10px] uppercase font-bold text-slate-500 block">Result Status</span>
                <span className="inline-block mt-1 px-2.5 py-0.5 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                  {report.resultStatus}
                </span>
              </div>
            </div>

            {/* Faculty Remarks */}
            <div className="mt-4 p-3.5 rounded-xl border border-indigo-100 bg-indigo-50/40 text-xs">
              <span className="font-bold text-indigo-950 uppercase text-[10px] tracking-wider block mb-1">
                Class Mentor's Scholastic & Behavioral Appraisal:
              </span>
              <p className="text-slate-800 italic">
                "{report.teacherRemarks}"
              </p>
            </div>

            {/* Grading Scale Legend */}
            <div className="mt-4 pt-3 border-t border-slate-200 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[10px] text-slate-500">
              <div>A1: 91 - 100 (Outstanding)</div>
              <div>A2: 81 - 90 (Excellent)</div>
              <div>B1: 71 - 80 (Very Good)</div>
              <div>B2: 61 - 70 (Good)</div>
            </div>

            {/* Signatures & Seal */}
            <div className="mt-10 pt-6 border-t border-slate-300 flex items-end justify-between text-center text-xs">
              <div>
                <div className="w-32 h-10 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center font-serif italic text-indigo-800">
                  Sunita Verma
                </div>
                <span className="font-bold text-slate-800">Class Teacher</span>
              </div>

              <div className="flex flex-col items-center">
                <div className="w-16 h-16 rounded-full border-2 border-dashed border-indigo-900/40 flex items-center justify-center text-[9px] font-bold text-indigo-900 uppercase text-center p-1 leading-tight">
                  Educate School Official Seal
                </div>
                <span className="text-[10px] text-slate-400 mt-1">Date: {report.issueDate}</span>
              </div>

              <div>
                <div className="w-32 h-10 border-b border-dashed border-slate-400 mb-1 flex items-end justify-center font-serif italic text-indigo-800">
                  K. S. Murthy
                </div>
                <span className="font-bold text-slate-800">Director / Principal</span>
              </div>
            </div>

          </div>
        </div>

      </div>
    </div>
  );
};
