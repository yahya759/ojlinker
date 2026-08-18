import React, { useEffect, useState } from 'react';
import { Users, TrendingUp, TrendingDown, UserCheck, UserX, Clock, Banknote, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatSAR, todayISO, currentMonth, formatMonthLabel } from '../../lib/utils';

interface Stats {
  totalEmployees: number;
  presentToday: number;
  absentToday: number;
  leaveToday: number;
  monthRevenue: number;
  monthExpense: number;
  monthPayroll: number;
  unpaidPayroll: number;
}

export function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [loading, setLoading] = useState(true);
  const today = todayISO();
  const month = currentMonth();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [empsRes, attRes, revRes, expRes, payRes] = await Promise.all([
        supabase.from('employees').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('attendance').select('status').eq('attendance_date', today),
        supabase.from('revenues').select('amount').gte('entry_date', month + '-01').lte('entry_date', month + '-31'),
        supabase.from('expenses').select('amount').gte('entry_date', month + '-01').lte('entry_date', month + '-31'),
        supabase.from('payroll').select('net_salary, is_paid').eq('month', month),
      ]);

      const att = attRes.data ?? [];
      const revs = revRes.data ?? [];
      const exps = expRes.data ?? [];
      const pays = payRes.data ?? [];

      setStats({
        totalEmployees: empsRes.count ?? 0,
        presentToday: att.filter(a => a.status === 'present').length,
        absentToday: att.filter(a => a.status === 'absent').length,
        leaveToday: att.filter(a => a.status === 'leave').length,
        monthRevenue: revs.reduce((s, r) => s + Number(r.amount), 0),
        monthExpense: exps.reduce((s, e) => s + Number(e.amount), 0),
        monthPayroll: pays.reduce((s, p) => s + Number(p.net_salary), 0),
        unpaidPayroll: pays.filter(p => !p.is_paid).reduce((s, p) => s + Number(p.net_salary), 0),
      });
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-16 text-[#6B7280] text-[13px] gap-2">
      <Loader2 className="w-5 h-5 animate-spin" /> جاري تحميل البيانات...
    </div>
  );
  if (!stats) return null;

  const netBalance = stats.monthRevenue - stats.monthExpense;

  const cards = [
    { label: 'الموظفون النشطون', value: `${stats.totalEmployees} موظف`, icon: <Users className="w-5 h-5" />, color: '#6366F1', bg: '#6366F110' },
    { label: 'حاضرون اليوم', value: `${stats.presentToday} / ${stats.totalEmployees}`, icon: <UserCheck className="w-5 h-5" />, color: '#0E9F6E', bg: '#0E9F6E10' },
    { label: 'غائبون اليوم', value: `${stats.absentToday} موظف`, icon: <UserX className="w-5 h-5" />, color: '#DC2626', bg: '#DC262610' },
    { label: 'إجازة اليوم', value: `${stats.leaveToday} موظف`, icon: <Clock className="w-5 h-5" />, color: '#D97706', bg: '#D9770610' },
    { label: `إيرادات ${formatMonthLabel(month)}`, value: formatSAR(stats.monthRevenue), icon: <TrendingUp className="w-5 h-5" />, color: '#0E9F6E', bg: '#0E9F6E10' },
    { label: `مصروفات ${formatMonthLabel(month)}`, value: formatSAR(stats.monthExpense), icon: <TrendingDown className="w-5 h-5" />, color: '#DC2626', bg: '#DC262610' },
    { label: 'صافي الشهر', value: formatSAR(netBalance), icon: <Banknote className="w-5 h-5" />, color: netBalance >= 0 ? '#0E9F6E' : '#DC2626', bg: netBalance >= 0 ? '#0E9F6E10' : '#DC262610' },
    { label: 'رواتب لم تُصرف', value: formatSAR(stats.unpaidPayroll), icon: <Banknote className="w-5 h-5" />, color: '#D97706', bg: '#D9770610' },
  ];

  return (
    <div className="flex flex-col gap-6">
      <div>
        <h2 className="text-[18px] font-bold text-[#1A1A1A]">لوحة التحكم</h2>
        <p className="text-[12.5px] text-[#6B7280] mt-0.5">{today} — نظرة عامة على الشركة</p>
      </div>

      {/* KPI Cards */}
      <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        {cards.map((card, i) => (
          <div key={i} className="bg-white rounded-2xl border border-[#EEF6F1] shadow-sm p-5 flex flex-col gap-3">
            <div className="w-10 h-10 rounded-xl flex items-center justify-center" style={{ backgroundColor: card.bg, color: card.color }}>
              {card.icon}
            </div>
            <div>
              <p className="text-[11.5px] text-[#6B7280] font-medium">{card.label}</p>
              <p className="text-[18px] font-extrabold mt-0.5" style={{ color: card.color }}>{card.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Summary bar */}
      <div className="bg-white rounded-2xl border border-[#EEF6F1] shadow-sm p-5">
        <p className="text-[13px] font-bold text-[#1A1A1A] mb-3">ملخص الحضور اليوم</p>
        {stats.totalEmployees === 0 ? (
          <p className="text-[12.5px] text-[#6B7280]">أضف موظفين أولاً من صفحة الموظفين</p>
        ) : (
          <div className="flex items-center gap-2 h-6 rounded-full overflow-hidden bg-[#F3F4F6]">
            {stats.presentToday > 0 && <div className="h-full bg-[#0E9F6E] transition-all" style={{ width: `${(stats.presentToday / stats.totalEmployees) * 100}%` }} />}
            {stats.absentToday > 0 && <div className="h-full bg-[#DC2626] transition-all" style={{ width: `${(stats.absentToday / stats.totalEmployees) * 100}%` }} />}
            {stats.leaveToday > 0 && <div className="h-full bg-[#D97706] transition-all" style={{ width: `${(stats.leaveToday / stats.totalEmployees) * 100}%` }} />}
          </div>
        )}
        <div className="flex items-center gap-4 mt-2 text-[11.5px] font-medium text-[#6B7280]">
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#0E9F6E] inline-block" />حاضر</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#DC2626] inline-block" />غائب</span>
          <span className="flex items-center gap-1"><span className="w-2.5 h-2.5 rounded-full bg-[#D97706] inline-block" />إجازة</span>
        </div>
      </div>
    </div>
  );
}
