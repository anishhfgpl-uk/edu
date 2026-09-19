import React, { useState, useEffect } from 'react';
import { 
  Role, 
  Student, 
  AttendanceRecord, 
  ExamReport, 
  FeeHead, 
  FeeTransaction, 
  NotificationItem, 
  ParentTeacherNote,
  SchoolClass,
  BusRouteInfo,
  HomeworkItem
} from './types';
import { 
  INITIAL_STUDENTS, 
  generateInitialAttendance, 
  INITIAL_EXAM_RESULTS, 
  INITIAL_FEE_HEADS, 
  INITIAL_TRANSACTIONS, 
  INITIAL_NOTIFICATIONS, 
  INITIAL_PARENT_NOTES,
  INITIAL_CLASSES,
  INITIAL_BUS_ROUTES,
  INITIAL_HOMEWORK
} from './data/mockData';
import { playNotificationChime } from './utils/audioAlert';
import { Header } from './components/Header';
import { SchoolProfile, Account, PermissionKey } from './components/LoginGate';
import { AccessManager } from './components/AccessManager';
import { NotificationDrawer } from './components/NotificationDrawer';
import { ToastAlert } from './components/ToastAlert';
import { StudentProfileCard } from './components/StudentProfileCard';
import { AttendanceTracker } from './components/AttendanceTracker';
import { ResultsPortal } from './components/ResultsPortal';
import { FeesLedger } from './components/FeesLedger';
import { ParentUpdates } from './components/ParentUpdates';
import { TeacherAdminModal } from './components/TeacherAdminModal';
import { HomeworkBoard } from './components/HomeworkBoard';
import { BusTracker } from './components/BusTracker';
import { ClassSectionManager } from './components/ClassSectionManager';
import { 
  UserCheck, 
  Calendar, 
  Award, 
  CreditCard, 
  Users, 
  Sparkles, 
  Info, 
  ShieldCheck, 
  GraduationCap,
  BookOpen,
  Bus,
  Building2
} from 'lucide-react';

export default function App({ account, schoolProfile, onLogout }: { account?: Account; schoolProfile?: SchoolProfile; onLogout?: () => void }) {
  // Navigation & Role States
  const [currentRole, setCurrentRole] = useState<Role>(account?.role === 'parent' ? 'parent' : account?.role === 'student' ? 'student' : 'teacher');
  const isAdmin = account?.role === 'admin';
  const permissions = account?.permissions || [];
  const can = (key: PermissionKey) => isAdmin || permissions.includes(key);
  const [activeTab, setActiveTab] = useState<
    'overview' | 'attendance' | 'homework' | 'classes' | 'bus' | 'results' | 'fees' | 'parent-updates'
  >('overview');
  
  // Data States
  const [students] = useState<Student[]>(INITIAL_STUDENTS);
  const [selectedStudent, setSelectedStudent] = useState<Student>(INITIAL_STUDENTS[0]);
  const [attendanceRecords, setAttendanceRecords] = useState<AttendanceRecord[]>(() => {
    return generateInitialAttendance(INITIAL_STUDENTS[0].id);
  });
  const [examResults, setExamResults] = useState<ExamReport[]>(INITIAL_EXAM_RESULTS);
  const [feeHeads, setFeeHeads] = useState<FeeHead[]>(INITIAL_FEE_HEADS);
  const [transactions, setTransactions] = useState<FeeTransaction[]>(INITIAL_TRANSACTIONS);
  const [notifications, setNotifications] = useState<NotificationItem[]>(INITIAL_NOTIFICATIONS);
  const [parentNotes, setParentNotes] = useState<ParentTeacherNote[]>(INITIAL_PARENT_NOTES);
  const [classes, setClasses] = useState<SchoolClass[]>(INITIAL_CLASSES);
  const [busRoutes, setBusRoutes] = useState<BusRouteInfo[]>(INITIAL_BUS_ROUTES);
  const [homework, setHomework] = useState<HomeworkItem[]>(INITIAL_HOMEWORK);

  // Settings & Overlays
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [isHindi, setIsHindi] = useState(false);
  const [activeToast, setActiveToast] = useState<NotificationItem | null>(null);
  const [isNotificationDrawerOpen, setIsNotificationDrawerOpen] = useState(false);
  const [isAdminModalOpen, setIsAdminModalOpen] = useState(false);
  const [isAccessManagerOpen, setIsAccessManagerOpen] = useState(false);
  const [liveProfile, setLiveProfile] = useState<SchoolProfile>(schoolProfile || { name:'Educate Portal School', address:'', phone:'', email:'', website:'', affiliation:'', session:'' });

  // When student changes, update student-specific attendance
  const handleStudentChange = (student: Student) => {
    setSelectedStudent(student);
    setAttendanceRecords(generateInitialAttendance(student.id));
  };

  // Helper to dispatch alert notification
  const dispatchAlert = (newNotif: Omit<NotificationItem, 'id' | 'timestamp' | 'read'>) => {
    const id = `notif-${Date.now()}`;
    const timestamp = 'Just now';
    const notification: NotificationItem = {
      ...newNotif,
      id,
      timestamp,
      read: false,
    };

    setNotifications((prev) => [notification, ...prev]);
    setActiveToast(notification);

    if (soundEnabled) {
      if (notification.category === 'fee') {
        playNotificationChime('success');
      } else if (notification.category === 'result') {
        playNotificationChime('success');
      } else if (notification.priority === 'urgent') {
        playNotificationChime('alert');
      } else {
        playNotificationChime('chime');
      }
    }
  };

  // 1. Mark Today's Attendance
  const handleRecordAttendanceToday = (studentId: string, status: 'present' | 'absent', remarks = 'Today 08:04 AM') => {
    const today = '2026-09-18';
    const targetStudent = students.find((s) => s.id === studentId) || selectedStudent;

    setAttendanceRecords((prev) => {
      const filtered = prev.filter((r) => r.date !== today);
      return [
        {
          id: `att-today-${Date.now()}`,
          studentId,
          date: today,
          status,
          timeIn: status === 'present' ? '08:04 AM' : undefined,
          remarks,
        },
        ...filtered,
      ];
    });

    dispatchAlert({
      title: status === 'present' 
        ? `Attendance Alert: ${targetStudent.name} is Present` 
        : `Attendance Alert: ${targetStudent.name} is Absent`,
      titleHi: status === 'present'
        ? `उपस्थिति सूचना: ${targetStudent.name} उपस्थित हैं`
        : `अनुपस्थिति चेतावनी: ${targetStudent.name} अनुपस्थित हैं`,
      message: status === 'present'
        ? `${targetStudent.name} entered campus at 08:04 AM via Gate 2 RFID scanner.`
        : `${targetStudent.name} was marked absent during roll call. Please contact class teacher if unverified.`,
      messageHi: status === 'present'
        ? `${targetStudent.name} सुबह 08:04 बजे विद्यालय परिसर में उपस्थित हुए। गेट 2 आरएफआईडी सत्यापित।`
        : `${targetStudent.name} आज अनुपस्थित दर्ज किए गए हैं। कृपया आवश्यकतानुसार कक्षा अध्यापक से संपर्क करें।`,
      category: 'attendance',
      priority: status === 'present' ? 'normal' : 'urgent',
      targetRoles: ['student', 'parent', 'teacher'],
      badgeText: status === 'present' ? 'Gate Entry' : 'Absence Warning',
    });
  };

  // 2. Apply for Leave
  const handleApplyLeave = (reason: string, fromDate: string, toDate: string) => {
    setAttendanceRecords((prev) => [
      {
        id: `att-leave-${Date.now()}`,
        studentId: selectedStudent.id,
        date: fromDate,
        status: 'leave',
        remarks: `Leave approved: ${reason}`,
      },
      ...prev,
    ]);

    dispatchAlert({
      title: `Leave Application Submitted: ${selectedStudent.name}`,
      titleHi: `अवकाश आवेदन प्रस्तुत: ${selectedStudent.name}`,
      message: `Leave application for ${fromDate} to ${toDate} ("${reason}") submitted and forwarded to mentor Mrs. Sunita Verma.`,
      messageHi: `${fromDate} से ${toDate} तक का अवकाश आवेदन ("${reason}") कक्षा अध्यापक को प्रेषित किया गया।`,
      category: 'attendance',
      priority: 'normal',
      targetRoles: ['student', 'parent', 'teacher'],
      badgeText: 'Leave Pending',
    });
  };

  // 3. Trigger Exam Marks Update
  const handleTriggerMarksAlert = (examTerm: string, subject: string, marks: number, maxMarks: number) => {
    setExamResults((prev) => {
      return prev.map((exam) => {
        if (exam.examName.includes(examTerm) || examTerm === 'Final Board Examination') {
          const updatedSubs = exam.subjects.map((sub) => {
            if (sub.subjectName.toLowerCase().includes(subject.toLowerCase())) {
              return {
                ...sub,
                marksTheory: marks,
                totalObtained: marks,
                grade: marks >= 90 ? 'A1' : marks >= 80 ? 'A2' : 'B1',
              };
            }
            return sub;
          });
          const newTotal = updatedSubs.reduce((a, b) => a + b.totalObtained, 0);
          const newPercentage = Math.round((newTotal / exam.totalMaxMarks) * 100 * 10) / 10;
          return {
            ...exam,
            subjects: updatedSubs,
            totalObtainedMarks: newTotal,
            percentage: newPercentage,
          };
        }
        return exam;
      });
    });

    dispatchAlert({
      title: `Result Alert: ${subject} Marks Updated (${marks}/${maxMarks})`,
      titleHi: `परीक्षा परिणाम अपडेट: ${subject} प्राप्तांक (${marks}/${maxMarks})`,
      message: `${selectedStudent.name}'s evaluated score for ${subject} in ${examTerm} has been verified and updated to the report card.`,
      messageHi: `${selectedStudent.name} के ${examTerm} में ${subject} के अंक सत्यापित कर अंकतालिका में अपडेट कर दिए गए हैं।`,
      category: 'result',
      priority: 'high',
      targetRoles: ['student', 'parent', 'teacher'],
      badgeText: `${marks}/${maxMarks} Marks`,
    });
  };

  // 4. Pay Fee & Generate Receipt
  const handlePayFee = (headId: string, amount: number, paymentMode: 'UPI' | 'Net Banking' | 'Debit Card' | 'Cash Voucher') => {
    const head = feeHeads.find((f) => f.id === headId);
    const headTitle = head ? head.title : 'Tuition & School Fee';

    setFeeHeads((prev) =>
      prev.map((f) => {
        if (f.id === headId) {
          const newPaid = f.paidAmount + amount;
          const newDue = Math.max(0, f.totalAmount - newPaid);
          return {
            ...f,
            paidAmount: newPaid,
            dueAmount: newDue,
            status: newDue === 0 ? 'paid' : 'partial',
          };
        }
        return f;
      })
    );

    const receiptNumber = `REC/EDU/2026/${Math.floor(1000 + Math.random() * 9000)}`;
    const newTx: FeeTransaction = {
      id: `tx-${Date.now()}`,
      receiptNo: receiptNumber,
      date: '18 Sep 2026',
      time: '10:15 AM',
      studentId: selectedStudent.id,
      studentName: selectedStudent.name,
      className: `${selectedStudent.class}-${selectedStudent.section}`,
      amount,
      feeHead: headTitle,
      paymentMode,
      transactionRef: `${paymentMode.replace(/\s+/g, '')}/EDU/${Math.floor(1000000000 + Math.random() * 9000000000)}`,
      status: 'Success',
      receivedBy: 'Central Accounts Desk (Online Auto-Clear)',
      remarks: 'Full payment verified and ledger settled.',
    };

    setTransactions((prev) => [newTx, ...prev]);

    dispatchAlert({
      title: `Fee Payment Successful: ₹${amount.toLocaleString('en-IN')}`,
      titleHi: `फीस भुगतान सफल: ₹${amount.toLocaleString('en-IN')}`,
      message: `Payment of ₹${amount.toLocaleString('en-IN')} received for ${headTitle}. Receipt #${receiptNumber} generated.`,
      messageHi: `${headTitle} हेतु ₹${amount.toLocaleString('en-IN')} का भुगतान प्राप्त हुआ। रसीद क्रमांक #${receiptNumber} जारी।`,
      category: 'fee',
      priority: 'high',
      targetRoles: ['student', 'parent'],
      amount,
      badgeText: `Receipt #${receiptNumber.slice(-4)}`,
    });
  };

  // 5. Add Note from Parent to Teacher
  const handleAddParentNote = (message: string) => {
    const newNote: ParentTeacherNote = {
      id: `pn-${Date.now()}`,
      date: 'Today',
      author: 'Parent',
      authorName: `${selectedStudent.parentName} (${selectedStudent.parentRelation})`,
      message,
    };

    setParentNotes((prev) => [...prev, newNote]);

    dispatchAlert({
      title: `Parent Note Received from ${selectedStudent.parentName}`,
      titleHi: `अभिभावक संदेश प्राप्त: ${selectedStudent.parentName}`,
      message: `"${message}" forwarded to class mentor Mrs. Sunita Verma.`,
      messageHi: `अभिभावक का संदेश कक्षा अध्यापक को प्रेषित किया गया।`,
      category: 'academic',
      priority: 'normal',
      targetRoles: ['teacher', 'parent'],
      badgeText: 'Teacher Note',
    });
  };

  // 6. Broadcast Notice / Circular
  const handleBroadcastNotice = (title: string, message: string, category: 'academic' | 'notice') => {
    dispatchAlert({
      title: `School Circular: ${title}`,
      titleHi: `विद्यालय परिपत्र: ${title}`,
      message,
      category,
      priority: 'high',
      targetRoles: ['student', 'parent', 'teacher'],
      badgeText: 'Official Circular',
    });
  };

  // 7. Homework Handlers
  const handleToggleHomework = (id: string) => {
    setHomework((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          const newStatus = !item.isCompleted;
          const completedAt = newStatus ? 'Today 04:30 PM' : undefined;

          if (newStatus) {
            dispatchAlert({
              title: `Homework Completed: ${item.subject}`,
              titleHi: `गृहकार्य पूर्ण हुआ: ${item.subject}`,
              message: `${selectedStudent.name} marked "${item.title}" as completed.`,
              messageHi: `${selectedStudent.name} ने "${item.titleHi || item.title}" को पूर्ण चिन्हित किया।`,
              category: 'homework',
              priority: 'normal',
              targetRoles: ['parent', 'teacher'],
              badgeText: 'Task Completed',
            });
          }

          return { ...item, isCompleted: newStatus, completedAt };
        }
        return item;
      })
    );
  };

  const handleAcknowledgeHomeworkParent = (id: string) => {
    setHomework((prev) =>
      prev.map((item) => {
        if (item.id === id) {
          dispatchAlert({
            title: `Parent Signature Recorded`,
            titleHi: `अभिभावक हस्ताक्षर दर्ज`,
            message: `${selectedStudent.parentName} verified homework completion for ${item.subject}.`,
            messageHi: `${selectedStudent.parentName} द्वारा ${item.subject} गृहकार्य सत्यापन पूर्ण किया गया।`,
            category: 'homework',
            priority: 'normal',
            targetRoles: ['teacher', 'student'],
            badgeText: 'Parent Verified',
          });
          return { ...item, parentAcknowledged: true };
        }
        return item;
      })
    );
  };

  const handleSendHomework = (newHw: Omit<HomeworkItem, 'id' | 'isCompleted' | 'parentAcknowledged'>) => {
    const createdHw: HomeworkItem = {
      ...newHw,
      id: `hw-${Date.now()}`,
      isCompleted: false,
      parentAcknowledged: false,
    };

    setHomework((prev) => [createdHw, ...prev]);

    dispatchAlert({
      title: `Daily Homework Assigned: ${newHw.subject}`,
      titleHi: `दैनिक गृहकार्य प्रेषित: ${newHw.subject}`,
      message: `New task for ${newHw.class}-${newHw.section}: "${newHw.title}". Due date: ${newHw.dueDate}.`,
      messageHi: `${newHw.class}-${newHw.section} के लिए नया कार्य: "${newHw.titleHi || newHw.title}"। जमा करने की तिथि: ${newHw.dueDate}`,
      category: 'homework',
      priority: 'urgent',
      targetRoles: ['student', 'parent'],
      badgeText: `${newHw.class}-${newHw.section}`,
    });
  };

  // 8. Bus Alert Handler
  const handleSendBusAlert = (routeNumber: string, message: string, priority: 'normal' | 'urgent') => {
    dispatchAlert({
      title: `Bus Transit Alert: ${routeNumber}`,
      titleHi: `स्कूल बस अलर्ट: ${routeNumber}`,
      message,
      category: 'bus',
      priority,
      targetRoles: ['student', 'parent'],
      badgeText: routeNumber,
    });
  };

  // 9. Class Section Handler
  const handleAddNewSection = (newClass: SchoolClass) => {
    setClasses((prev) => [...prev, newClass]);
    dispatchAlert({
      title: `New Section Configured: ${newClass.className}-${newClass.section}`,
      titleHi: `नया सेक्शन निर्मित: ${newClass.className}-${newClass.section}`,
      message: `Assigned room ${newClass.roomNo} under mentor ${newClass.classTeacherName}.`,
      category: 'academic',
      priority: 'normal',
      targetRoles: ['teacher', 'student'],
      badgeText: 'Academic Update',
    });
  };

  // Handle clicking notification item in drawer or toast
  const handleNotificationClick = (item: NotificationItem) => {
    if (item.category === 'attendance') {
      setActiveTab('attendance');
    } else if (item.category === 'result') {
      setActiveTab('results');
    } else if (item.category === 'fee') {
      setActiveTab('fees');
    } else if (item.category === 'homework') {
      setActiveTab('homework');
    } else if (item.category === 'bus') {
      setActiveTab('bus');
    } else {
      setActiveTab('overview');
    }
    setIsNotificationDrawerOpen(false);
    setActiveToast(null);
  };

  const navItems = [
    { id: 'overview', label: isHindi ? 'अकादमिक विवरण' : 'Academic Profile', icon: GraduationCap },
    { id: 'attendance', label: isHindi ? 'दैनिक उपस्थिति' : 'Attendance Tracker', icon: Calendar },
    { id: 'homework', label: isHindi ? 'दैनिक गृहकार्य' : 'Daily Homework & Tasks', icon: BookOpen },
    { id: 'classes', label: isHindi ? 'कक्षा व सेक्शन' : 'Class & Sections', icon: Building2 },
    { id: 'bus', label: isHindi ? 'बस ट्रैकिंग' : 'Bus Transport GPS', icon: Bus },
    { id: 'results', label: isHindi ? 'परीक्षा परिणाम' : 'Exam Results & Marksheet', icon: Award },
    { id: 'fees', label: isHindi ? 'फीस लेज़र' : 'Fees Ledger & Receipts', icon: CreditCard },
    { id: 'parent-updates', label: isHindi ? 'अभिभावक पोर्टल' : 'Parent Portal & Updates', icon: Users },
  ].filter(item => can(item.id as PermissionKey));

  return (
    <div className="min-h-screen bg-slate-100/70 text-slate-900 flex flex-col antialiased">
      
      {/* App Header */}
      {liveProfile && (
        <div className="bg-indigo-950 text-white px-4 py-2 text-xs">
          <div className="max-w-7xl mx-auto flex flex-wrap items-center justify-between gap-2">
            <span className="font-black">{liveProfile.name}</span>
            <span>{liveProfile.address} • {liveProfile.phone} • {liveProfile.email}</span>
          </div>
        </div>
      )}
      <Header
        currentRole={currentRole}
        onRoleChange={(role) => {
          if (!isAdmin && role !== currentRole) return;
          setCurrentRole(role);
          if (role === 'parent') {
            setActiveTab('parent-updates');
          }
        }}
        students={students}
        selectedStudent={selectedStudent}
        onStudentChange={handleStudentChange}
        notifications={notifications}
        onOpenNotifications={() => setIsNotificationDrawerOpen(true)}
        soundEnabled={soundEnabled}
        onToggleSound={() => setSoundEnabled(!soundEnabled)}
        isHindi={isHindi}
        onToggleLanguage={() => setIsHindi(!isHindi)}
        onOpenAdminModal={() => can('alerts') && setIsAdminModalOpen(true)}
        onOpenAccessManager={() => isAdmin && setIsAccessManagerOpen(true)}
        isAdmin={isAdmin}
      />

      {/* Primary Role Indicator Banner */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-2.5 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
          
          <div className="flex items-center gap-2">
            <span className="text-slate-500 font-medium">
              {isHindi ? 'वर्तमान दृश्य मोड:' : 'Current Perspective:'}
            </span>
            <span className={`inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full font-bold ${
              currentRole === 'student'
                ? 'bg-indigo-50 text-indigo-700 border border-indigo-200'
                : currentRole === 'parent'
                ? 'bg-emerald-50 text-emerald-700 border border-emerald-200'
                : 'bg-purple-50 text-purple-700 border border-purple-200'
            }`}>
              {currentRole === 'student' && <UserCheck className="w-3.5 h-3.5" />}
              {currentRole === 'parent' && <Users className="w-3.5 h-3.5" />}
              {currentRole === 'teacher' && <ShieldCheck className="w-3.5 h-3.5" />}
              <span className="capitalize">{currentRole} View</span>
            </span>

            <span className="text-slate-400 hidden sm:inline">•</span>
            <span className="text-slate-600 hidden sm:inline">
              Student: <strong>{selectedStudent.name}</strong> ({selectedStudent.class}-{selectedStudent.section})
            </span>
          </div>

          <div className="flex items-center gap-2">
            <div className="flex items-center gap-1 text-slate-500">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              <span>Real-Time Alert Dispatch Active</span>
            </div>
          </div>
        </div>
      </div>

      {/* Main Tab Navigation Bar */}
      <div className="bg-white border-b border-slate-200 shadow-xs">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-1 sm:space-x-4 overflow-x-auto py-2">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id as typeof activeTab)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-xl text-xs sm:text-sm font-bold whitespace-nowrap transition-all cursor-pointer ${
                    isActive
                      ? 'bg-indigo-600 text-white shadow-xs'
                      : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                  }`}
                >
                  <Icon className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>
        </div>
      </div>

      {/* Main Content Area */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-6">
        {activeTab === 'overview' && (
          <StudentProfileCard
            student={selectedStudent}
            isHindi={isHindi}
            onNavigateTab={(tab) => setActiveTab(tab as typeof activeTab)}
          />
        )}

        {activeTab === 'attendance' && (
          <AttendanceTracker
            student={selectedStudent}
            attendanceRecords={attendanceRecords}
            currentRole={currentRole}
            onRecordAttendanceToday={handleRecordAttendanceToday}
            onApplyLeave={handleApplyLeave}
            isHindi={isHindi}
          />
        )}

        {activeTab === 'homework' && (
          <HomeworkBoard
            homework={homework}
            selectedStudent={selectedStudent}
            currentRole={currentRole}
            isHindi={isHindi}
            onToggleComplete={handleToggleHomework}
            onAcknowledgeParent={handleAcknowledgeHomeworkParent}
            onSendHomework={handleSendHomework}
          />
        )}

        {activeTab === 'classes' && (
          <ClassSectionManager
            classes={classes}
            students={students}
            selectedStudent={selectedStudent}
            currentRole={currentRole}
            isHindi={isHindi}
            onSelectStudent={(st) => handleStudentChange(st)}
            onAddNewSection={handleAddNewSection}
            onNavigateToTab={(tab) => setActiveTab(tab as typeof activeTab)}
          />
        )}

        {activeTab === 'bus' && (
          <BusTracker
            busRoutes={busRoutes}
            selectedStudent={selectedStudent}
            currentRole={currentRole}
            isHindi={isHindi}
            onSendBusAlert={handleSendBusAlert}
          />
        )}

        {activeTab === 'results' && (
          <ResultsPortal
            student={selectedStudent}
            examResults={examResults}
            currentRole={currentRole}
            onOpenAddMarksModal={() => setIsAdminModalOpen(true)}
            isHindi={isHindi}
          />
        )}

        {activeTab === 'fees' && (
          <FeesLedger
            student={selectedStudent}
            feeHeads={feeHeads}
            transactions={transactions}
            currentRole={currentRole}
            onPayFee={handlePayFee}
            isHindi={isHindi}
          />
        )}

        {activeTab === 'parent-updates' && (
          <ParentUpdates
            student={selectedStudent}
            parentNotes={parentNotes}
            onAddParentNote={handleAddParentNote}
            isHindi={isHindi}
            onNavigateTab={(tab) => setActiveTab(tab as typeof activeTab)}
          />
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t border-slate-200 py-6 text-center text-xs text-slate-500 mt-auto">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <GraduationCap className="w-4 h-4 text-indigo-600" />
            <span className="font-bold text-slate-800">Educate Portal</span>
            <span>• Integrated Academic, Attendance, Examination & Fee Ecosystem</span>
          </div>
          <p className="text-slate-400">
            Affiliated to CBSE • Institutional Session 2025–2026
          </p>
        </div>
      </footer>

      {/* Floating Live Toast Notification */}
      <ToastAlert
        notification={activeToast}
        onDismiss={() => setActiveToast(null)}
        onClick={handleNotificationClick}
      />

      {/* Notification Center Drawer */}
      <NotificationDrawer
        isOpen={isNotificationDrawerOpen}
        onClose={() => setIsNotificationDrawerOpen(false)}
        notifications={notifications}
        onMarkAllRead={() => {
          setNotifications((prev) => prev.map((n) => ({ ...n, read: true })));
        }}
        onMarkAsRead={(id) => {
          setNotifications((prev) =>
            prev.map((n) => (n.id === id ? { ...n, read: true } : n))
          );
        }}
        onClearAll={() => setNotifications([])}
        onSelectNotification={handleNotificationClick}
        isHindi={isHindi}
      />

      {/* Admin Access Manager */}
      <AccessManager
        isOpen={isAccessManagerOpen}
        onClose={() => setIsAccessManagerOpen(false)}
        profile={liveProfile}
        onProfileChange={setLiveProfile}
      />

      {/* Teacher / Admin Action Console Modal */}
      <TeacherAdminModal
        isOpen={isAdminModalOpen && can('alerts')}
        onClose={() => setIsAdminModalOpen(false)}
        students={students}
        selectedStudent={selectedStudent}
        feeHeads={feeHeads}
        onTriggerAttendanceAlert={handleRecordAttendanceToday}
        onTriggerMarksAlert={handleTriggerMarksAlert}
        onTriggerFeeAlert={(headId, amount) => handlePayFee(headId, amount, 'Cash Voucher')}
        onBroadcastNotice={handleBroadcastNotice}
        onTriggerHomeworkAlert={(title, subject, targetClass, targetSection) => {
          handleSendHomework({
            class: targetClass,
            section: targetSection,
            subject,
            teacherName: 'Mrs. Sunita Verma',
            assignedDate: '18 Sep 2026',
            dueDate: '19 Sep 2026',
            title,
            description: `Complete all questions in homework register. Follow standard solution steps.`,
            chapterOrTopic: `${subject} - Practice Set`,
            estimatedMinutes: 35,
            type: 'homework',
          });
        }}
        onTriggerBusAlert={(routeNumber, message) => {
          handleSendBusAlert(routeNumber, message, 'urgent');
        }}
        isHindi={isHindi}
      />

    </div>
  );
}
