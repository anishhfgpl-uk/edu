export type Role = 'student' | 'parent' | 'teacher';

export type AttendanceStatus = 'present' | 'absent' | 'leave' | 'holiday';

export interface SubjectProgress {
  id: string;
  name: string;
  code: string;
  teacher: string;
  syllabusCoverage: number; // 0 to 100%
  periodsPerWeek: number;
  grade: string;
  color: string;
}

export interface Student {
  id: string;
  name: string;
  rollNo: string;
  admissionNo: string;
  class: string;
  section: string;
  academicYear: string;
  avatar: string;
  dob: string;
  gender: string;
  bloodGroup: string;
  attendancePercentage: number;
  parentName: string;
  parentRelation: string;
  parentPhone: string;
  parentEmail: string;
  address: string;
  busRoute: string;
  emergencyContact: string;
  classTeacher: {
    name: string;
    subject: string;
    phone: string;
    email: string;
    avatar: string;
  };
  subjects: SubjectProgress[];
}

export interface AttendanceRecord {
  id: string;
  studentId: string;
  date: string; // YYYY-MM-DD
  status: AttendanceStatus;
  timeIn?: string;
  remarks?: string;
}

export interface LeaveApplication {
  id: string;
  studentId: string;
  studentName: string;
  startDate: string;
  endDate: string;
  daysCount: number;
  reason: string;
  status: 'pending' | 'approved' | 'rejected';
  appliedAt: string;
  appliedBy: string;
}

export interface SubjectResult {
  subjectName: string;
  code: string;
  maxTheory: number;
  marksTheory: number;
  maxPractical: number;
  marksPractical: number;
  totalMax: number;
  totalObtained: number;
  grade: string;
  gradePoint: number;
  subjectRank: number;
  remarks: string;
}

export interface ExamReport {
  id: string;
  studentId: string;
  examName: string;
  examTerm: 'UT1' | 'MID_TERM' | 'UT2' | 'FINAL_EXAM';
  examDate: string;
  totalMaxMarks: number;
  totalObtainedMarks: number;
  percentage: number;
  classRank: number;
  totalStudentsInClass: number;
  division: 'First Division with Distinction' | 'First Division' | 'Second Division' | 'Needs Improvement';
  resultStatus: 'Passed' | 'Passed with Distinction' | 'Promoted' | 'Compartment';
  subjects: SubjectResult[];
  teacherRemarks: string;
  principalSignature: string;
  attendanceAtExamTime: number; // e.g. 92.4%
  issueDate: string;
}

export interface FeeHead {
  id: string;
  title: string;
  category: 'Tuition Fee' | 'Laboratory & Science' | 'Transport & Commute' | 'Library & Digital' | 'Activity & Sports' | 'Annual Examination';
  quarter: string; // Q1 (Apr-Jun), Q2 (Jul-Sep), Q3 (Oct-Dec), Q4 (Jan-Mar)
  totalAmount: number;
  paidAmount: number;
  dueAmount: number;
  dueDate: string;
  status: 'paid' | 'partial' | 'pending' | 'overdue';
}

export interface FeeTransaction {
  id: string;
  receiptNo: string;
  date: string;
  time: string;
  studentId: string;
  studentName: string;
  className: string;
  amount: number;
  feeHead: string;
  paymentMode: 'UPI' | 'Net Banking' | 'Debit Card' | 'Cash Voucher';
  transactionRef: string;
  status: 'Success' | 'Processing';
  receivedBy: string;
  remarks: string;
}

export type NotificationCategory = 'attendance' | 'result' | 'fee' | 'academic' | 'notice' | 'homework' | 'bus';

export interface NotificationItem {
  id: string;
  title: string;
  titleHi?: string;
  message: string;
  messageHi?: string;
  category: NotificationCategory;
  timestamp: string;
  read: boolean;
  priority: 'normal' | 'high' | 'urgent';
  targetRoles: Role[];
  badgeText?: string;
  amount?: number;
  examName?: string;
}

export interface ParentTeacherNote {
  id: string;
  date: string;
  author: 'Teacher' | 'Parent';
  authorName: string;
  message: string;
  replyTo?: string;
}

export interface HomeworkItem {
  id: string;
  class: string;
  section: string;
  subject: string;
  teacherName: string;
  assignedDate: string; // e.g. "18 Sep 2026"
  dueDate: string; // e.g. "19 Sep 2026"
  title: string;
  titleHi?: string;
  description: string;
  descriptionHi?: string;
  chapterOrTopic: string;
  estimatedMinutes: number;
  attachmentName?: string;
  type: 'homework' | 'classwork' | 'project' | 'revision';
  isCompleted: boolean;
  completedAt?: string;
  parentAcknowledged?: boolean;
}

export interface BusStop {
  id: string;
  name: string;
  nameHi?: string;
  pickupTime: string;
  dropTime: string;
  isPassed: boolean;
  isStudentStop?: boolean;
  landmark: string;
}

export interface BusRouteInfo {
  routeId: string;
  routeNumber: string;
  routeName: string;
  busNumber: string;
  capacity: number;
  speedKmh: number;
  currentLocation: string;
  currentLocationHi?: string;
  nextStop: string;
  etaNextStop: string;
  driverName: string;
  driverPhone: string;
  driverPhoto: string;
  conductorName: string;
  conductorPhone: string;
  status: 'on_route' | 'delayed' | 'reached_school' | 'reached_home' | 'idle';
  morningTripStatus: 'boarding' | 'in_transit' | 'completed';
  eveningTripStatus: 'scheduled' | 'boarding' | 'in_transit' | 'completed';
  lastUpdated: string;
  stops: BusStop[];
}

export interface ClassPeriod {
  periodNo: number;
  time: string;
  subject: string;
  teacher: string;
  room: string;
}

export interface SchoolClass {
  id: string;
  className: string; // e.g. "Class 10"
  section: string; // e.g. "A"
  roomNo: string;
  classTeacherName: string;
  classTeacherSubject: string;
  classTeacherAvatar?: string;
  totalStudents: number;
  capacity: number;
  wing: 'Primary' | 'Middle' | 'Secondary' | 'Senior Secondary';
  schedule: ClassPeriod[];
}

