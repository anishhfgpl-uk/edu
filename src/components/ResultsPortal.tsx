import React, { useState } from 'react';
import { Student, ExamReport, Role } from '../types';
import { PrintableReportCard } from './PrintableReportCard';
import { 
  Award, 
  TrendingUp, 
  FileText, 
  Printer, 
  CheckCircle2, 
  BookOpen, 
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';

interface ResultsPortalProps {
  student: Student;
  examResults: ExamReport[];
  currentRole: Role;
  onOpenAddMarksModal: () => void;
  isHindi: boolean;
}

export const ResultsPortal: React.FC<ResultsPortalProps> = ({
  student,
  examResults,
  currentRole,
  onOpenAddMarksModal,
  isHindi,
}) => {
  const [selectedExamId, setSelectedExamId] = useState<string>(
    examResults[0]?.id || 'exam-final-2026'
  );
  const [showReportCardModal, setShowReportCardModal] = useState(false);

  const currentExam = examResults.find((e) => e.id === selectedExamId) || examResults[0];

  if (!currentExam) {
    return (
      <div className="p-12 text-center text-slate-400 bg-white rounded-2xl border border-slate-200">
        <Award className="w-12 h-12 mx-auto opacity-40 mb-2" />
        <p className="text-slate-600 font-medium">No examination records found</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      
      {/* Top Banner: Term Growth Progression */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 mb-5">
          <div className="flex items-center gap-2">
            <TrendingUp className="w-5 h-5 text-indigo-600" />
            <h3 className="font-bold text-base text-slate-900">
              {isHindi ? 'सत्र परीक्षा प्रगति व वृद्धि विश्लेषण' : 'Academic Growth & Term Progression'}
            </h3>
          </div>
          <span className="text-xs text-emerald-700 bg-emerald-50 border border-emerald-200 px-3 py-1 rounded-full font-bold">
            +7.34% {isHindi ? 'कुल सुधार (UT1 से फाइनल)' : 'Overall Improvement'}
          </span>
        </div>

        {/* Growth Bar Chart */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          {examResults.slice().reverse().map((exam, index) => {
            const isSelected = exam.id === selectedExamId;
            return (
              <div
                key={exam.id}
                onClick={() => setSelectedExamId(exam.id)}
                className={`p-3.5 rounded-xl border transition-all cursor-pointer ${
                  isSelected
                    ? 'border-indigo-600 bg-indigo-50/60 ring-2 ring-indigo-600/20 shadow-xs'
                    : 'border-slate-200 bg-slate-50/50 hover:bg-slate-100/70'
                }`}
              >
                <div className="flex items-center justify-between text-xs font-semibold text-slate-600 mb-1">
                  <span className="truncate">{exam.examTerm.replace('_', ' ')}</span>
                  <span className="text-[10px] text-slate-400">#{examResults.length - index}</span>
                </div>

                <div className="text-xl font-black text-slate-900">
                  {exam.percentage}%
                </div>

                <div className="w-full bg-slate-200 h-2 rounded-full overflow-hidden mt-2">
                  <div
                    className={`h-full rounded-full ${
                      isSelected ? 'bg-indigo-600' : 'bg-slate-400'
                    }`}
                    style={{ width: `${exam.percentage}%` }}
                  />
                </div>

                <div className="flex justify-between items-center text-[10px] text-slate-500 mt-1.5 font-medium">
                  <span>Rank #{exam.classRank}</span>
                  <span className="text-emerald-700 font-bold">{exam.resultStatus.split(' ')[0]}</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Exam Navigation Tabs & Action Bar */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
        
        {/* Exam selector buttons */}
        <div className="flex items-center gap-1.5 overflow-x-auto w-full sm:w-auto pb-1 sm:pb-0">
          {examResults.map((exam) => (
            <button
              key={exam.id}
              onClick={() => setSelectedExamId(exam.id)}
              className={`px-3.5 py-2 rounded-xl text-xs font-bold whitespace-nowrap transition-all flex items-center gap-1.5 cursor-pointer ${
                exam.id === selectedExamId
                  ? 'bg-indigo-600 text-white shadow-sm'
                  : 'bg-white border border-slate-200 text-slate-700 hover:bg-slate-50'
              }`}
            >
              {exam.examTerm === 'FINAL_EXAM' && <Sparkles className="w-3.5 h-3.5 text-amber-300" />}
              <span>{exam.examName.split('(')[0]}</span>
            </button>
          ))}
        </div>

        {/* Action buttons */}
        <div className="flex items-center gap-2 w-full sm:w-auto">
          {currentRole === 'teacher' && (
            <button
              onClick={onOpenAddMarksModal}
              className="flex-1 sm:flex-none px-3.5 py-2 bg-purple-600 hover:bg-purple-700 text-white text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-1.5 cursor-pointer"
            >
              <Award className="w-4 h-4" />
              <span>{isHindi ? 'नया अंक दर्ज करें' : 'Publish / Update Marks'}</span>
            </button>
          )}

          <button
            id="print-report-card-btn"
            onClick={() => setShowReportCardModal(true)}
            className="flex-1 sm:flex-none px-4 py-2 bg-indigo-50 hover:bg-indigo-100 text-indigo-700 border border-indigo-200 text-xs font-bold rounded-xl shadow-xs transition-colors flex items-center justify-center gap-2 cursor-pointer"
          >
            <Printer className="w-4 h-4" />
            <span>{isHindi ? 'अंकतालिका देखें / प्रिंट' : 'Print Official Marksheet'}</span>
          </button>
        </div>

      </div>

      {/* Selected Exam Overview Card */}
      <div className="bg-white rounded-2xl border border-slate-200 p-5 sm:p-6 shadow-xs">
        
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-6 pb-6 border-b border-slate-100">
          <div>
            <div className="flex items-center gap-2">
              <span className="px-2.5 py-0.5 rounded-full text-xs font-bold bg-indigo-100 text-indigo-800">
                {currentExam.examTerm === 'FINAL_EXAM' ? 'Final Board Examination' : currentExam.examTerm}
              </span>
              <span className="text-xs text-slate-500 font-medium">
                {currentExam.examDate}
              </span>
            </div>
            
            <h2 className="text-xl sm:text-2xl font-black text-slate-900 mt-1">
              {currentExam.examName}
            </h2>
            
            <p className="text-xs text-slate-500 mt-1">
              {isHindi ? 'परिणाम स्थिति' : 'Result Status'}:{' '}
              <span className="font-bold text-emerald-700">{currentExam.resultStatus}</span> •{' '}
              <span className="font-semibold text-slate-700">{currentExam.division}</span>
            </p>
          </div>

          {/* Quick Metrics Badges */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            
            <div className="bg-slate-50 p-3 rounded-xl border border-slate-200 text-center">
              <span className="text-[10px] uppercase font-bold text-slate-500 block">Total Marks</span>
              <span className="text-lg font-black text-slate-900">
                {currentExam.totalObtainedMarks} <span className="text-xs text-slate-400 font-normal">/ {currentExam.totalMaxMarks}</span>
              </span>
            </div>

            <div className="bg-emerald-50 p-3 rounded-xl border border-emerald-200 text-center">
              <span className="text-[10px] uppercase font-bold text-emerald-700 block">Percentage</span>
              <span className="text-lg font-black text-emerald-800">
                {currentExam.percentage}%
              </span>
            </div>

            <div className="bg-purple-50 p-3 rounded-xl border border-purple-200 text-center">
              <span className="text-[10px] uppercase font-bold text-purple-700 block">Class Rank</span>
              <span className="text-lg font-black text-purple-800">
                #{currentExam.classRank} <span className="text-xs text-purple-500 font-normal">/ {currentExam.totalStudentsInClass}</span>
              </span>
            </div>

            <div className="bg-blue-50 p-3 rounded-xl border border-blue-200 text-center">
              <span className="text-[10px] uppercase font-bold text-blue-700 block">Attendance</span>
              <span className="text-lg font-black text-blue-800">
                {currentExam.attendanceAtExamTime}%
              </span>
            </div>

          </div>
        </div>

        {/* Subject-Wise Marks Breakdown Table */}
        <div className="mt-6">
          <div className="flex items-center justify-between mb-3">
            <h4 className="text-sm font-bold text-slate-900 flex items-center gap-1.5">
              <BookOpen className="w-4 h-4 text-indigo-600" />
              <span>{isHindi ? 'विषयवार प्राप्तांक एवं शिक्षक समीक्षा' : 'Subject-Wise Marks & Teacher Appraisal'}</span>
            </h4>
            <span className="text-xs text-slate-500">
              CBSE Grading Norms (A1 to D2)
            </span>
          </div>

          <div className="overflow-x-auto rounded-xl border border-slate-200">
            <table className="w-full text-xs text-left">
              <thead>
                <tr className="bg-slate-50 text-slate-700 font-bold border-b border-slate-200">
                  <th className="p-3">Subject</th>
                  <th className="p-3 text-center">Theory</th>
                  <th className="p-3 text-center">Prac / Int</th>
                  <th className="p-3 text-center">Total Marks</th>
                  <th className="p-3 text-center">Grade</th>
                  <th className="p-3 text-center">Subject Rank</th>
                  <th className="p-3">Teacher Remarks & Feedback</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {currentExam.subjects.map((sub, idx) => (
                  <tr key={idx} className="hover:bg-slate-50/60 transition-colors">
                    <td className="p-3">
                      <div className="font-bold text-slate-900">{sub.subjectName}</div>
                      <div className="text-[10px] text-slate-400 font-mono">Code: {sub.code}</div>
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-semibold text-slate-800">{sub.marksTheory}</span>
                      <span className="text-[10px] text-slate-400 block">/ {sub.maxTheory}</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="font-semibold text-slate-800">{sub.marksPractical}</span>
                      <span className="text-[10px] text-slate-400 block">/ {sub.maxPractical}</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="text-sm font-black text-indigo-900">{sub.totalObtained}</span>
                      <span className="text-[10px] text-slate-400 block">/ {sub.totalMax}</span>
                    </td>
                    <td className="p-3 text-center">
                      <span className="px-2 py-0.5 rounded-md text-xs font-bold bg-emerald-50 text-emerald-800 border border-emerald-200">
                        {sub.grade}
                      </span>
                    </td>
                    <td className="p-3 text-center font-bold text-slate-700">
                      #{sub.subjectRank}
                    </td>
                    <td className="p-3 text-slate-600 italic">
                      "{sub.remarks}"
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Teacher's Master Remark */}
        <div className="mt-5 p-4 rounded-xl bg-indigo-50/50 border border-indigo-100 flex items-start gap-3">
          <ShieldCheck className="w-5 h-5 text-indigo-600 flex-shrink-0 mt-0.5" />
          <div className="text-xs">
            <span className="font-bold text-indigo-950 uppercase tracking-wider block">
              {isHindi ? 'कक्षा अध्यापक की टिप्पणी' : 'Mentor\'s Comprehensive Term Evaluation'}
            </span>
            <p className="text-slate-700 mt-1 italic leading-relaxed">
              "{currentExam.teacherRemarks}"
            </p>
          </div>
        </div>

      </div>

      {/* Report Card Modal */}
      {showReportCardModal && (
        <PrintableReportCard
          student={student}
          report={currentExam}
          onClose={() => setShowReportCardModal(false)}
          isHindi={isHindi}
        />
      )}

    </div>
  );
};
