import React, { useEffect, useState } from 'react';
import { Plus, Pencil, Trash2, Loader2, UserCheck, UserX } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { Employee } from '../../types/hr';
import { formatSAR, todayISO } from '../../lib/utils';

const EMPTY: Omit<Employee, 'id' | 'created_at'> = {
  full_name: '',
  position: '',
  base_salary: 0,
  joined_date: todayISO(),
  is_active: true,
};

export function EmployeesPage() {
  const [employees, setEmployees] = useState<Employee[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [editing, setEditing] = useState<Employee | null>(null);
  const [form, setForm] = useState({ ...EMPTY });
  const [submitting, setSubmitting] = useState(false);

  async function fetch() {
    setLoading(true);
    const { data, error: e } = await supabase
      .from('employees')
      .select('*')
      .order('created_at', { ascending: false });
    setEmployees(data ?? []);
    if (e) setError('تعذّر جلب بيانات الموظفين');
    setLoading(false);
  }

  useEffect(() => { fetch(); }, []);

  function openAdd() { setForm({ ...EMPTY }); setEditing(null); setShowForm(true); }
  function openEdit(emp: Employee) {
    setForm({ full_name: emp.full_name, position: emp.position ?? '', base_salary: emp.base_salary, joined_date: emp.joined_date, is_active: emp.is_active });
    setEditing(emp);
    setShowForm(true);
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setSubmitting(true);
    const payload = { ...form, base_salary: Number(form.base_salary) };
    if (editing) {
      await supabase.from('employees').update(payload).eq('id', editing.id);
    } else {
      await supabase.from('employees').insert(payload);
    }
    setSubmitting(false);
    setShowForm(false);
    fetch();
  }

  async function handleDelete(id: string) {
    if (!confirm('تأكيد حذف الموظف؟')) return;
    await supabase.from('employees').delete().eq('id', id);
    fetch();
  }

  const active = employees.filter(e => e.is_active);
  const inactive = employees.filter(e => !e.is_active);

  return (
    <div className="flex flex-col gap-5">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-[18px] font-bold text-[#1A1A1A]">الموظفين</h2>
          <p className="text-[12.5px] text-[#6B7280] mt-0.5">{active.length} موظف نشط — {inactive.length} غير نشط</p>
        </div>
        <button onClick={openAdd} className="flex items-center gap-1.5 bg-[#0E9F6E] text-white text-[13px] font-semibold px-4 py-2.5 rounded-xl shadow-sm cursor-pointer">
          <Plus className="w-4 h-4" /> إضافة موظف
        </button>
      </div>

      {error && <div className="bg-red-50 border border-red-200 text-red-700 text-[12.5px] px-4 py-3 rounded-xl">{error}</div>}

      {/* Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/30 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl shadow-xl p-6 w-full max-w-md">
            <h3 className="text-[16px] font-bold text-[#1A1A1A] mb-4">{editing ? 'تعديل موظف' : 'إضافة موظف جديد'}</h3>
            <form onSubmit={handleSubmit} className="flex flex-col gap-3">
              <div className="flex flex-col gap-1">
                <label className="text-[11.5px] font-semibold text-[#6B7280]">الاسم الكامل *</label>
                <input required value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))}
                  className="border border-[#EEF6F1] rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0E9F6E]/30" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11.5px] font-semibold text-[#6B7280]">المنصب الوظيفي</label>
                <input value={form.position ?? ''} onChange={e => setForm(f => ({ ...f, position: e.target.value }))}
                  className="border border-[#EEF6F1] rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0E9F6E]/30" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11.5px] font-semibold text-[#6B7280]">الراتب الأساسي (ر.س) *</label>
                <input required type="number" min="0" step="0.01" value={form.base_salary}
                  onChange={e => setForm(f => ({ ...f, base_salary: Number(e.target.value) }))}
                  className="border border-[#EEF6F1] rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0E9F6E]/30" />
              </div>
              <div className="flex flex-col gap-1">
                <label className="text-[11.5px] font-semibold text-[#6B7280]">تاريخ الالتحاق</label>
                <input type="date" value={form.joined_date} onChange={e => setForm(f => ({ ...f, joined_date: e.target.value }))}
                  className="border border-[#EEF6F1] rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0E9F6E]/30" />
              </div>
              <div className="flex items-center gap-2 mt-1">
                <input type="checkbox" id="is_active" checked={form.is_active} onChange={e => setForm(f => ({ ...f, is_active: e.target.checked }))} className="w-4 h-4 accent-[#0E9F6E]" />
                <label htmlFor="is_active" className="text-[13px] font-medium text-[#1A1A1A]">موظف نشط</label>
              </div>
              <div className="flex gap-2 mt-2">
                <button type="submit" disabled={submitting}
                  className="flex-1 flex items-center justify-center gap-1.5 bg-[#0E9F6E] text-white font-semibold text-[13px] rounded-xl px-4 py-2.5 disabled:opacity-60 cursor-pointer">
                  {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
                  {editing ? 'حفظ التعديل' : 'إضافة'}
                </button>
                <button type="button" onClick={() => setShowForm(false)}
                  className="px-4 py-2.5 rounded-xl border border-[#EEF6F1] text-[13px] font-medium text-[#6B7280] cursor-pointer">إلغاء</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Table */}
      {loading ? (
        <div className="flex items-center justify-center py-10 text-[#6B7280] text-[13px] gap-2"><Loader2 className="w-4 h-4 animate-spin" /> جاري التحميل...</div>
      ) : (
        <div className="bg-white rounded-2xl border border-[#EEF6F1] shadow-sm overflow-hidden">
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#EEF6F1]/60 text-[#6B7280] text-[11.5px] font-semibold">
                <th className="text-right px-5 py-3">الموظف</th>
                <th className="text-right px-5 py-3">المنصب</th>
                <th className="text-right px-5 py-3">الراتب الأساسي</th>
                <th className="text-right px-5 py-3">تاريخ الالتحاق</th>
                <th className="text-right px-5 py-3">الحالة</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {employees.map(emp => (
                <tr key={emp.id} className="border-t border-[#EEF6F1] hover:bg-[#EEF6F1]/20">
                  <td className="px-5 py-3 font-semibold text-[#1A1A1A]">{emp.full_name}</td>
                  <td className="px-5 py-3 text-[#6B7280]">{emp.position || '—'}</td>
                  <td className="px-5 py-3 font-semibold text-[#0E9F6E]">{formatSAR(emp.base_salary)}</td>
                  <td className="px-5 py-3 text-[#6B7280]">{emp.joined_date}</td>
                  <td className="px-5 py-3">
                    {emp.is_active
                      ? <span className="inline-flex items-center gap-1 bg-green-50 text-green-700 text-[11px] font-semibold px-2.5 py-1 rounded-full"><UserCheck className="w-3 h-3" />نشط</span>
                      : <span className="inline-flex items-center gap-1 bg-gray-100 text-gray-500 text-[11px] font-semibold px-2.5 py-1 rounded-full"><UserX className="w-3 h-3" />غير نشط</span>}
                  </td>
                  <td className="px-5 py-3">
                    <div className="flex items-center gap-1.5 justify-end">
                      <button onClick={() => openEdit(emp)} className="w-7 h-7 rounded-full bg-[#EEF6F1] hover:bg-[#0E9F6E] text-[#6B7280] hover:text-white flex items-center justify-center transition-colors cursor-pointer">
                        <Pencil className="w-3.5 h-3.5" />
                      </button>
                      <button onClick={() => handleDelete(emp.id)} className="w-7 h-7 rounded-full bg-[#EEF6F1] hover:bg-red-500 text-[#6B7280] hover:text-white flex items-center justify-center transition-colors cursor-pointer">
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {employees.length === 0 && (
                <tr><td colSpan={6} className="text-center py-10 text-[#6B7280] text-[13px]">ما في موظفين مسجلين بعد</td></tr>
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
