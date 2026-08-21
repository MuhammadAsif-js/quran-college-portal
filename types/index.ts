// ──────────────────────────────────────────────────────────────────
// Centralised TypeScript types for the Quran College Portal
// ──────────────────────────────────────────────────────────────────

/** Full student record as stored in Supabase `students` table */
export interface Student {
  id: string;
  created_at: string;
  name: string;
  full_name_urdu: string;
  father_name: string;
  email: string;
  phone: string;
  course: string;
  date_of_birth: string;
  cnic: string;
  city: string;
  country: string;
  islamic_qualification: string;
  education: string;
  assigned_teacher: string;
  payment_status: 'Confirmed' | 'Pending' | null;
}

/** Admission form payload — mirrors every <input> in apply/page.tsx */
export interface AdmissionFormData {
  email: string;
  name: string;
  full_name_urdu: string;
  father_name: string;
  phone: string;
  course: string;
  date_of_birth: string;
  cnic: string;
  city: string;
  country: string;
  islamic_qualification: string;
  education: string;
  assigned_teacher: string;
}

/** Single row in the `attendance` Supabase table */
export interface AttendanceRecord {
  id: string;
  student_id: string;
  date: string;
  status: 'Present' | 'Absent';
}

/** Attendance keyed by student_id for O(1) lookup in the attendance page */
export type AttendanceMap = Record<string, AttendanceRecord>;

/** UI state machine for the check-in flow */
export type CheckInStatus = 'idle' | 'loading' | 'success' | 'blocked' | 'error';

/** Supabase generic error shape */
export interface SupabaseError {
  message: string;
  code?: string;
  details?: string;
  hint?: string;
}
