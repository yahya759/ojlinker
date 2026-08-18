import React, { useEffect, useState, useCallback } from 'react';
import { Loader2, Plus, Trash2, CheckCircle2, Clock } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Employee, Payroll, Allowance } from '../../types/hr';
import { formatSAR, currentMonth, monthOptions, formatMonthLabel } from '../../lib/utils';

const ALLOWANCE_TYPES = ['مكافأة', 'بدل نقل', 'بدل سكن', 'بدل طعام', 'عمل إضافي', 'أخرى'];

export function PayrollPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [payrolls, setPayrolls] = useState<Payroll[]>([]);
  const [allowances, setAllowances] = useState<Allowance[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedMonth, setSelectedMonth] = useState(currentMonth());
  const [generating, setGenerating] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [newAllowance, setNewAllowance] = useState({ type: 'مكافأة', amount: '', notes: '' });
  const [savingAllowance, setSavingAllowance] = useState(false);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    const [empsRes, payRes, allowRes] = await Promise.all([
      supabase.from('employees').select('*').eq('is_active', true).order('full_name'),
      supabase.from('payroll').select('*').eq('month', selectedMonth),
      supabase.from('allowances').select('*').eq('month', selectedMonth),
    ]);
    setEmployees(empsRes.data ?? []);
    setPayrolls(payRes.data ?? []);
    setAllowances(allowRes.data ?? []);
    setLoading(false);
  }, [selectedMonth]);

  useEffect(() => { fetchAll(); }, [fetchAll]);

  function getPayroll(empId: string) {
    return payrolls.find(p => p.employee_id === empId);
  }
  function getEmployeeAllowances(empId: string) {
    return allowances.filter(a => a.employee_id === empId);
  }

  async function generatePayroll() {
    setGenerating(true);
    for (const emp of employees) {
      const existing = getPayroll(emp.id);
      if (existing) continue;

      // count absences this month
      const { count } = await supabase
        .from('attendance')
        .select('*', { count: 'exact', head: true })
        .eq('employee_id', emp.id)
        .eq('status', 'absent')
        .gte('attendance_date', selectedMonth + '-01')
        .lte('attendance_date', selectedMonth + '-31');

      const absentDays = count ?? 0;
      const workingDays = 26;
      const dailyRate = emp.base_salary / workingDays;
      const deduction = Math.round(dailyRate * absentDays * 100) / 100;
      const empAllowances = getEmployeeAllowances(emp.id);
      const totalAllowances = empAllowances.reduce((s, a) => s + Number(a.amount), 0);
      const netSalary = Math.max(0, emp.base_salary - deduction + totalAllowances);

      await supabase.from('payroll').insert({
        employee_id: emp.id,
        month: selectedMonth,
        base_salary: emp.base_salary,
        absent_days: absentDays,
        deduction,
        total_allowances: totalAllowances,
        net_salary: netSalary,
        is_paid: false,
      });
    }
    setGenerating(false);
    fetchAll();
  }

  async function togglePaid(payroll: Payroll) {
    const update = { is_paid: !payroll.is_paid, paid_at: !payroll.is_paid ? new Date().toISOString() : null };
    await supabase.from('payroll').update(update).eq('id', payroll.id);
    fetchAll();
  }

  async function addAllowance(empId: string) {
    if (!newAllowance.amount || Number(newAllowance.amount) <= 0) return;
    setSavingAllowance(true);
    await supabase.from('allowances').insert({
      employee_id: empId,
      month: selectedMonth,
      type: newAllowance.type,
      amount: Number(newAllowance.amount),
      notes: newAllowance.notes || null,
    });
    setNewAllowance({ type: 'مكافأة', amount: '', notes: '' });
    setSavingAllowance(false);
    fetchAll();
  }

  async function deleteAllowance(id: string) {
    await supabase.from('allowances').delete().eq('id', id);
    fetchAll();
  }

  const totalPayroll = payrolls.reduce((s, p) => s + p.net_salary, 0);
  const paidCount = payrolls.filter(p => p.is_paid).length;

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-3">
        <div>
          <h2 className="text-[18px] font-bold text-[#1A1A1A]">الرواتب</h2>
          <p className="text-[12.5px] text-[#6B7280] mt-0.5">
            {formatMonthLabel(selectedMonth)} — إجمالي: {formatSAR(totalPayroll)} — {paidCount}/{payrolls.length} مصروف
          </p>
        </div>
        <div className="flex items-center gap-2">
          <select value={selectedMonth} onChange={e => setSelectedMonth(e.target.value)}
            className="border border-[#EEF6F1] rounded-xl px-3 py-2 text-[12.5px] cursor-pointer">
            {monthOptions(6).map(m => <option key={m} value={m}>{formatMonthLabel(m)}</option>)}
          </select>
          <button onClick={generatePayroll} disabled={generating}
            className="flex items-center gap-1.5 bg-[#0E9F6E] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl shadow-sm disabled:opacity-60 cursor-pointer">
            {generating ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            توليد الرواتب
          </button>
        </div>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-10 text-[#6B7280] text-[13px] gap-2"><Loader2 className="w-4 h-4 animate-spin" />جاري التحميل...</div>
      ) : (
        <div className="flex flex-col gap-3">
          {employees.map(emp => {
            const payroll = getPayroll(emp.id);
            const empAllowances = getEmployeeAllowances(emp.id);
            const isExpanded = expanded === emp.id;

            return (
              <div key={emp.id} className="bg-white rounded-2xl border border-[#EEF6F1] shadow-sm overflow-hidden">
                {/* Employee row */}
                <div className="flex flex-col sm:flex-row sm:items-center justify-between px-5 py-4 gap-3 cursor-pointer"
                  onClick={() => setExpanded(isExpanded ? null : emp.id)}>
                  <div>
                    <p className="font-semibold text-[14px] text-[#1A1A1A]">{emp.full_name}</p>
                    <p className="text-[12px] text-[#6B7280]">{emp.position || '—'}</p>
                  </div>
                  {payroll ? (
                    <div className="flex flex-wrap items-center gap-3">
                      <div className="text-center">
                        <p className="text-[10px] text-[#6B7280]">الأساسي</p>
                        <p className="text-[13px] font-semibold text-[#1A1A1A]">{formatSAR(payroll.base_salary)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-[#6B7280]">حسم غياب</p>
                        <p className="text-[13px] font-semibold text-red-600">−{formatSAR(payroll.deduction)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-[#6B7280]">بدلات</p>
                        <p className="text-[13px] font-semibold text-blue-600">+{formatSAR(payroll.total_allowances)}</p>
                      </div>
                      <div className="text-center">
                        <p className="text-[10px] text-[#6B7280]">الصافي</p>
                        <p className="text-[15px] font-extrabold text-[#0E9F6E]">{formatSAR(payroll.net_salary)}</p>
                      </div>
                      <button onClick={e => { e.stopPropagation(); togglePaid(payroll); }}
                        className={`flex items-center gap-1 text-[11.5px] font-semibold px-3 py-1.5 rounded-full border transition-all cursor-pointer ${payroll.is_paid ? 'bg-green-50 text-green-700 border-green-200' : 'bg-white text-[#6B7280] border-[#EEF6F1] hover:border-[#0E9F6E]/40'}`}>
                        {payroll.is_paid ? <><CheckCircle2 className="w-3.5 h-3.5" />مصروف</> : <><Clock className="w-3.5 h-3.5" />معلّق</>}
                      </button>
                    </div>
                  ) : (
                    <span className="text-[12px] text-[#6B7280] bg-[#F3F4F6] px-3 py-1.5 rounded-full">لم يُولَّد بعد</span>
                  )}
                </div>

                {/* Expanded: allowances */}
                {isExpanded && (
                  <div className="border-t border-[#EEF6F1] px-5 py-4 bg-[#EEF6F1]/20">
                    <p className="text-[12px] font-bold text-[#1A1A1A] mb-3">البدلات والمكافآت</p>
                    {empAllowances.length > 0 ? (
                      <div className="flex flex-col gap-2 mb-3">
                        {empAllowances.map(a => (
                          <div key={a.id} className="flex items-center justify-between bg-white rounded-xl px-4 py-2.5 border border-[#EEF6F1]">
                            <div>
                              <span className="text-[12.5px] font-semibold text-[#1A1A1A]">{a.type}</span>
                              {a.notes && <span className="text-[11px] text-[#6B7280] mr-2">— {a.notes}</span>}
                            </div>
                            <div className="flex items-center gap-2">
                              <span className="text-[13px] font-bold text-blue-600">{formatSAR(Number(a.amount))}</span>
                              <button onClick={() => deleteAllowance(a.id)} className="w-6 h-6 rounded-full bg-[#EEF6F1] hover:bg-red-500 text-[#6B7280] hover:text-white flex items-center justify-center transition-colors cursor-pointer">
                                <Trash2 className="w-3 h-3" />
                              </button>
                            </div>
                          </div>
                        ))}
                      </div>
                    ) : <p className="text-[12px] text-[#6B7280] mb-3">لا توجد بدلات لهذا الشهر</p>}

                    {/* Add allowance */}
                    <div className="flex flex-wrap gap-2 items-end">
                      <select value={newAllowance.type} onChange={e => setNewAllowance(n => ({ ...n, type: e.target.value }))}
                        className="border border-[#EEF6F1] rounded-xl px-3 py-2 text-[12px] cursor-pointer bg-white">
                        {ALLOWANCE_TYPES.map(t => <option key={t} value={t}>{t}</option>)}
                      </select>
                      <input type="number" min="0" step="0.01" placeholder="المبلغ (ر.س)"
                        value={newAllowance.amount} onChange={e => setNewAllowance(n => ({ ...n, amount: e.target.value }))}
                        className="border border-[#EEF6F1] rounded-xl px-3 py-2 text-[12px] w-32 focus:outline-none focus:ring-2 focus:ring-[#0E9F6E]/30" />
                      <input placeholder="ملاحظة (اختياري)" value={newAllowance.notes}
                        onChange={e => setNewAllowance(n => ({ ...n, notes: e.target.value }))}
                        className="border border-[#EEF6F1] rounded-xl px-3 py-2 text-[12px] w-40 focus:outline-none focus:ring-2 focus:ring-[#0E9F6E]/30" />
                      <button onClick={() => addAllowance(emp.id)} disabled={savingAllowance}
                        className="flex items-center gap-1 bg-[#0E9F6E] text-white text-[12px] font-semibold px-3 py-2 rounded-xl cursor-pointer disabled:opacity-60">
                        {savingAllowance ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Plus className="w-3.5 h-3.5" />}
                        إضافة
                      </button>
                    </div>
                  </div>
                )}
              </div>
            );
          })}
          {employees.length === 0 && (
            <div className="text-center py-10 text-[#6B7280] text-[13px]">ما في موظفين نشطين. أضف موظفين أولاً من صفحة الموظفين.</div>
          )}
        </div>
      )}
    </div>
  );
}
