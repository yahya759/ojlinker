import React, { useEffect, useState } from 'react';
import { Loader2, CheckCircle2, XCircle, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Employee, Attendance, AttendanceStatus } from '../../types/hr';
import { todayISO, monthOptions, formatMonthLabel } from '../../lib/utils';

const STATUS_CONFIG: Record<AttendanceStatus, { label: string; color: string; bg: string; icon: React.ReactNode }> = {
  present: { label: 'حاضر', color: 'text-green-700', bg: 'bg-green-50 border-green-200', icon: <CheckCircle2 className="w-3.5 h-3.5" /> },
  absent:  { label: 'غائب', color: 'text-red-700',   bg: 'bg-red-50 border-red-200',     icon: <XCircle className="w-3.5 h-3.5" /> },
  leave:   { label: 'إجازة', color: 'text-yellow-700', bg: 'bg-yellow-50 border-yellow-200', icon: <Clock className="w-3.5 h-3.5" /> },
};

export function AttendancePage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [attendance, setAttendance] = useState<Attendance[]>([]);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState<string | null>(null);
  const [selectedDate, setSelectedDate] = useState(todayISO());
  const [viewMode, setViewMode] = useState<'day' | 'month'>('day');
  const [selectedMonth, setSelectedMonth] = useState(todayISO().slice(0, 7));

  async function fetchAll() {
    setLoading(true);
    const [empsRes, attRes] = await Promise.all([
      supabase.from('employees').select('*').eq('is_active', true).order('full_name'),
      supabase.from('attendance').select('*').gte('attendance_date', selectedMonth + '-01')
        .lte('attendance_date', selectedMonth + '-31'),
    ]);
    setEmployees(empsRes.data ?? []);
    setAttendance(attRes.data ?? []);
    setLoading(false);
  }

  useEffect(() => { fetchAll(); }, [selectedMonth]);

  function getRecord(empId: string, date: string) {
    return attendance.find(a => a.employee_id === empId && a.attendance_date === date);
  }

  async function setStatus(empId: string, date: string, status: AttendanceStatus) {
    setSaving(empId + date);
    const existing = getRecord(empId, date);
    if (existing) {
      await supabase.from('attendance').update({ status }).eq('id', existing.id);
      setAttendance(prev => prev.map(a => a.id === existing.id ? { ...a, status } : a));
    } else {
      const { data } = await supabase.from('attendance').insert({ employee_id: empId, attendance_date: date, status }).select().single();
      if (data) setAttendance(prev => [...prev, data]);
    }
    setSaving(null);
  }

  // build days array for month view
  const daysInMonth = (() => {
    const [y, m] = selectedMonth.split('-').map(Number);
    const days: string[] = [];
    const d = new Date(y, m - 1, 1);
    while (d.getMonth() === m - 1) {
      days.push(d.toISOString().slice(0, 10));
      d.setDate(d.getDate() + 1);
    }
    return days;
  })();

  const todayDateStr = selectedDate;

  return (
    <div className="flex flex-col gap-5">
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-[#1A1A1A]">الحضور والغياب</h2>
          <p className="text-[12.5px] text-[#6B7280] mt-0.5">تسجيل يدوي — {employees.length} موظف نشط</p>
        </div>
        <div className="flex items-center gap-2">
          <button onClick={() => setViewMode('day')} className={`text-[12.5px] font-semibold px-3.5 py-2 rounded-xl border cursor-pointer transition-colors ${viewMode === 'day' ? 'bg-[#0E9F6E] text-white border-[#0E9F6E]' : 'bg-white text-[#6B7280] border-[#EEF6F1]'}`}>يومي</button>
          <button onClick={() => setViewMode('month')} className={`text-[12.5px] font-semibold px-3.5 py-2 rounded-xl border cursor-pointer transition-colors ${viewMode === 'month' ? 'bg-[#0E9F6E] text-white border-[#0E9F6E]' : 'bg-white text-[#6B7280] border-[#EEF6F1]'}`}>شهري</button>
          {viewMode === 'day' ? (
            <input type="date" value={selectedDate} onChange={e => setSelectedDate(e.target.value)}
              className="border border-[#EEF6F1] rounded-xl px-3 py-2 text-[12.5px] focus:outline-none focus:ring-2 focus:ring-[#0E9F6E]/30" />
          ) : (
            <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
              className="border border-[#EEF6F1] rounded-xl px-3 py-2 text-[12.5px] cursor-pointer">
              {monthOptions(6).map(m => <option key={m} value={m}>{formatMonthLabel(m)}</option>)}
            </select>
          )}
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-[#6B7280] text-[13px] gap-2"><Loader2 className="w-4 h-4 animate-spin" />جاري التحميل...</div>
      ) : viewMode === 'day' ? (
        /* ── Day view ── */
        <div className="bg-white rounded-2xl border border-[#EEF6F1] shadow-sm overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#EEF6F1]/60 text-[#6B7280] text-[11.5px] font-semibold">
                <th className="text-right px-5 py-3">الموظف</th>
                <th className="text-right px-5 py-3">المنصب</th>
                <th className="text-center px-5 py-3">الحالة</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => {
                const rec = getRecord(emp.id, todayDateStr);
                const isSaving = saving === emp.id + todayDateStr;
                return (
                  <tr key={emp.id} className="border-t border-[#EEF6F1]">
                    <td className="px-5 py-3 font-semibold text-[#1A1A1A]">{emp.full_name}</td>
                    <td className="px-5 py-3 text-[#6B7280]">{emp.position || '—'}</td>
                    <td className="px-5 py-3">
                      <div className="flex items-center justify-center gap-2">
                        {isSaving ? <Loader2 className="w-4 h-4 animate-spin text-[#0E9F6E]" /> :
                          (['present', 'absent', 'leave'] as AttendanceStatus[]).map(s => {
                            const cfg = STATUS_CONFIG[s];
                            const active = rec?.status === s;
                            return (
                              <button key={s} onClick={() => setStatus(emp.id, todayDateStr, s)}
                                className={`inline-flex items-center gap-1 text-[11.5px] font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${active ? cfg.bg + ' ' + cfg.color : 'bg-white text-[#6B7280] border-[#EEF6F1] hover:border-[#0E9F6E]/40'}`}>
                                {cfg.icon}{cfg.label}
                              </button>
                            );
                          })}
                      </div>
                    </td>
                  </tr>
                );
              })}
              {employees.length === 0 && <tr><td colSpan={3} className="text-center py-10 text-[#6B7280]">ما في موظفين نشطين</td></tr>}
            </tbody>
          </table>
        </div>
      ) : (
        /* ── Month view ── */
        <div className="bg-white rounded-2xl border border-[#EEF6F1] shadow-sm overflow-x-auto">
          <table className="text-[11px] min-w-max w-full">
            <thead>
              <tr className="bg-[#EEF6F1]/60 text-[#6B7280] font-semibold">
                <th className="text-right px-4 py-2.5 sticky left-0 bg-[#EEF6F1]/60 min-w-[130px]">الموظف</th>
                {daysInMonth.map(d => (
                  <th key={d} className="px-1.5 py-2.5 text-center min-w-[32px]">{d.slice(8)}</th>
                ))}
                <th className="px-3 py-2.5 text-center">غياب</th>
                <th className="px-3 py-2.5 text-center">حضور</th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => {
                const empRecords = attendance.filter(a => a.employee_id === emp.id);
                const absentCount = empRecords.filter(a => a.status === 'absent').length;
                const presentCount = empRecords.filter(a => a.status === 'present').length;
                return (
                  <tr key={emp.id} className="border-t border-[#EEF6F1]">
                    <td className="px-4 py-2 font-semibold text-[#1A1A1A] sticky left-0 bg-white">{emp.full_name}</td>
                    {daysInMonth.map(d => {
                      const rec = getRecord(emp.id, d);
                      const cfg = rec ? STATUS_CONFIG[rec.status] : null;
                      return (
                        <td key={d} className="px-1 py-2 text-center">
                          {cfg ? (
                            <span className={`inline-block w-5 h-5 rounded-full text-[9px] font-bold leading-5 ${cfg.color} ${cfg.bg} border`}>
                              {rec!.status === 'present' ? '✓' : rec!.status === 'absent' ? '✗' : 'إ'}
                            </span>
                          ) : <span className="inline-block w-5 h-5 rounded-full bg-[#F3F4F6]" />}
                        </td>
                      );
                    })}
                    <td className="px-3 py-2 text-center font-bold text-red-600">{absentCount}</td>
                    <td className="px-3 py-2 text-center font-bold text-green-600">{presentCount}</td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
