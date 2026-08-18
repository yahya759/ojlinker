export interface Employee {
  id: string;
  full_name: string;
  position: string | null;
  base_salary: number;
  joined_date: string;
  is_active: boolean;
  created_at: string;
}

export type AttendanceStatus = 'present' | 'absent' | 'leave';

export interface Attendance {
  id: string;
  employee_id: string;
  attendance_date: string;
  status: AttendanceStatus;
  notes: string | null;
  created_at: string;
}

export interface Payroll {
  id: string;
  employee_id: string;
  month: string; // YYYY-MM
  base_salary: number;
  absent_days: number;
  deduction: number;
  total_allowances: number;
  net_salary: number;
  is_paid: boolean;
  paid_at: string | null;
  notes: string | null;
  created_at: string;
}

export interface Allowance {
  id: string;
  employee_id: string;
  month: string;
  type: string;
  amount: number;
  notes: string | null;
  created_at: string;
}
