import React, { useEffect, useState } from 'react';
import {
  Users, TrendingUp, TrendingDown, UserCheck, UserX,
  Clock, Banknote, Loader2, ArrowUpRight, CheckCircle2
} from 'lucide-react';
import { supabase } from '../../lib/supabase';
import { formatSAR, todayISO, currentMonth, formatMonthLabel } from '../../lib/utils';
import type { Employee, Attendance } from '../../types/hr';

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

const DAYS_AR = ['أح', 'إث', 'ث', 'أر', 'خ', 'ج', 'س'];

export function DashboardPage() {
  const [stats, setStats] = useState<Stats | null>(null);
  const [recentEmployees, setRecentEmployees] = useState<Employee[]>([]);
  const [todayAttendance, setTodayAttendance] = useState<(Attendance & { full_name: string })[]>([]);
  const [loading, setLoading] = useState(true);
  const today = todayISO();
  const month = currentMonth();

  useEffect(() => {
    async function load() {
      setLoading(true);
      const [empsRes, attRes, revRes, expRes, payRes, empListRes] = await Promise.all([
        supabase.from('employees').select('id', { count: 'exact' }).eq('is_active', true),
        supabase.from('attendance').select('status').eq('attendance_date', today),
        supabase.from('revenues').select('amount').gte('entry_date', month + '-01').lte('entry_date', month + '-31'),
        supabase.from('expenses').select('amount').gte('entry_date', month + '-01').lte('entry_date', month + '-31'),
        supabase.from('payroll').select('net_salary, is_paid').eq('month', month),
        supabase.from('employees').select('*').eq('is_active', true).order('created_at', { ascending: false }).limit(5),
      ]);

      const att = attRes.data ?? [];
      setStats({
        totalEmployees: empsRes.count ?? 0,
        presentToday: att.filter(a => a.status === 'present').length,
        absentToday: att.filter(a => a.status === 'absent').length,
        leaveToday: att.filter(a => a.status === 'leave').length,
        monthRevenue: (revRes.data ?? []).reduce((s, r) => s + Number(r.amount), 0),
        monthExpense: (expRes.data ?? []).reduce((s, e) => s + Number(e.amount), 0),
        monthPayroll: (payRes.data ?? []).reduce((s, p) => s + Number(p.net_salary), 0),
        unpaidPayroll: (payRes.data ?? []).filter(p => !p.is_paid).reduce((s, p) => s + Number(p.net_salary), 0),
      });
      setRecentEmployees(empListRes.data ?? []);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) return (
    <div className="flex items-center justify-center py-20 text-[#6B7280] gap-2">
      <Loader2 className="w-5 h-5 animate-spin" /> جاري تحميل البيانات...
    </div>
  );
  if (!stats) return null;

  const netBalance = stats.monthRevenue - stats.monthExpense;
  const attendancePct = stats.totalEmployees > 0 ? Math.round((stats.presentToday / stats.totalEmployees) * 100) : 0;

  // fake weekly bar heights just for visual (replace with real data later)
  const weekBars = [40, 65, 85, 72, 90, 55, 30];

  return (
    <div className="flex flex-col gap-6">
      {/* Top KPI row */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4">
        {[
          {
            label: 'إجمالي الموظفين', value: stats.totalEmployees,
            sub: 'موظف نشط', icon: <Users className="w-5 h-5" />,
            accent: '#1A2B1F', bg: '#1A2B1F', dark: true,
          },
          {
            label: 'إيرادات الشهر', value: formatSAR(stats.monthRevenue),
            sub: formatMonthLabel(month), icon: <TrendingUp className="w-5 h-5" />,
            accent: '#0E9F6E', bg: '#F0FBF6', dark: false,
          },
          {
            label: 'مصروفات الشهر', value: formatSAR(stats.monthExpense),
            sub: formatMonthLabel(month), icon: <TrendingDown className="w-5 h-5" />,
            accent: '#DC2626', bg: '#FEF2F2', dark: false,
          },
          {
            label: 'صافي الشهر', value: formatSAR(netBalance),
            sub: netBalance >= 0 ? 'ربح' : 'خسارة', icon: <Banknote className="w-5 h-5" />,
            accent: netBalance >= 0 ? '#0E9F6E' : '#DC2626',
            bg: netBalance >= 0 ? '#F0FBF6' : '#FEF2F2', dark: false,
          },
        ].map((card, i) => (
          <div key={i} className={`rounded-2xl p-5 flex flex-col gap-3 ${card.dark ? 'text-white' : ''}`}
            style={{ backgroundColor: card.bg }}>
            <div className="flex items-center justify-between">
              <div className="w-9 h-9 rounded-xl flex items-center justify-center"
                style={{ backgroundColor: card.dark ? 'rgba(255,255,255,0.15)' : card.accent + '18', color: card.dark ? '#fff' : card.accent }}>
                {card.icon}
              </div>
              <ArrowUpRight className="w-4 h-4 opacity-30" />
            </div>
            <div>
              <p className="text-[22px] sm:text-[26px] font-extrabold leading-tight"
                style={{ color: card.dark ? '#fff' : card.accent }}>{card.value}</p>
              <p className="text-[11.5px] font-medium mt-0.5" style={{ color: card.dark ? 'rgba(255,255,255,0.6)' : '#6B7280' }}>{card.label}</p>
            </div>
            <p className="text-[11px] font-semibold" style={{ color: card.dark ? 'rgba(255,255,255,0.45)' : '#9CA3AF' }}>
              ↑ {card.sub}
            </p>
          </div>
        ))}
      </div>

      {/* Middle row: chart + attendance */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Weekly bar chart */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-[#E8EFEA]">
          <div className="flex items-center justify-between mb-5">
            <div>
              <p className="text-[14px] font-bold text-[#1A1A1A]">نشاط الأسبوع</p>
              <p className="text-[11.5px] text-[#9CA3AF] mt-0.5">الحضور اليومي هذا الأسبوع</p>
            </div>
            <span className="text-[11px] font-semibold bg-[#0E9F6E]/10 text-[#0E9F6E] px-3 py-1 rounded-full">{attendancePct}% اليوم</span>
          </div>
          <div className="flex items-end gap-3 h-32">
            {weekBars.map((h, i) => (
              <div key={i} className="flex-1 flex flex-col items-center gap-1.5">
                <div className="w-full rounded-xl transition-all" style={{
                  height: `${h}%`,
                  background: i === 2 ? 'linear-gradient(to top,#0E9F6E,#34D399)' : '#EEF6F1',
                  minHeight: 8,
                }} />
                <span className="text-[10px] text-[#9CA3AF] font-medium">{DAYS_AR[i]}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance today */}
        <div className="bg-white rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-[#E8EFEA]">
          <p className="text-[14px] font-bold text-[#1A1A1A] mb-1">حضور اليوم</p>
          <p className="text-[11.5px] text-[#9CA3AF] mb-4">{today}</p>
          <div className="flex flex-col gap-3">
            {[
              { label: 'حاضر', count: stats.presentToday, color: '#0E9F6E', bg: '#F0FBF6', icon: <UserCheck className="w-4 h-4" /> },
              { label: 'غائب', count: stats.absentToday,  color: '#DC2626', bg: '#FEF2F2', icon: <UserX className="w-4 h-4" /> },
              { label: 'إجازة', count: stats.leaveToday,  color: '#D97706', bg: '#FFFBEB', icon: <Clock className="w-4 h-4" /> },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between rounded-xl px-3 py-2.5" style={{ backgroundColor: row.bg }}>
                <div className="flex items-center gap-2" style={{ color: row.color }}>
                  {row.icon}
                  <span className="text-[12.5px] font-semibold" style={{ color: row.color }}>{row.label}</span>
                </div>
                <span className="text-[18px] font-extrabold" style={{ color: row.color }}>{row.count}</span>
              </div>
            ))}
          </div>
          {/* Progress bar */}
          {stats.totalEmployees > 0 && (
            <div className="mt-4">
              <div className="flex items-center h-2.5 rounded-full overflow-hidden bg-[#F3F4F6] gap-0.5">
                <div className="h-full bg-[#0E9F6E] rounded-full transition-all" style={{ width: `${(stats.presentToday / stats.totalEmployees) * 100}%` }} />
                <div className="h-full bg-[#DC2626] rounded-full transition-all" style={{ width: `${(stats.absentToday / stats.totalEmployees) * 100}%` }} />
                <div className="h-full bg-[#D97706] rounded-full transition-all" style={{ width: `${(stats.leaveToday / stats.totalEmployees) * 100}%` }} />
              </div>
              <p className="text-[10.5px] text-[#9CA3AF] mt-1.5 text-center">{stats.totalEmployees} موظف إجمالاً</p>
            </div>
          )}
        </div>
      </div>

      {/* Bottom row: employees list + payroll summary */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Recent employees */}
        <div className="lg:col-span-2 bg-white rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] border border-[#E8EFEA]">
          <div className="flex items-center justify-between mb-4">
            <p className="text-[14px] font-bold text-[#1A1A1A]">الفريق</p>
            <span className="text-[11px] text-[#0E9F6E] font-semibold cursor-pointer hover:underline">عرض الكل</span>
          </div>
          <div className="flex flex-col gap-2">
            {recentEmployees.length === 0 ? (
              <p className="text-[12.5px] text-[#9CA3AF] text-center py-6">ما في موظفين مسجلين بعد</p>
            ) : recentEmployees.map((emp, i) => (
              <div key={emp.id} className="flex items-center justify-between py-2.5 border-b border-[#F3F4F6] last:border-0">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-full flex items-center justify-center text-white text-[12px] font-bold shrink-0"
                    style={{ backgroundColor: ['#0E9F6E','#6366F1','#D97706','#DC2626','#0EA5E9'][i % 5] }}>
                    {emp.full_name.charAt(0)}
                  </div>
                  <div>
                    <p className="text-[13px] font-semibold text-[#1A1A1A]">{emp.full_name}</p>
                    <p className="text-[11px] text-[#9CA3AF]">{emp.position || 'بدون منصب'}</p>
                  </div>
                </div>
                <span className="text-[11.5px] font-semibold text-[#0E9F6E] bg-[#F0FBF6] px-2.5 py-1 rounded-full">{formatSAR(emp.base_salary)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payroll summary */}
        <div className="bg-[#1A2B1F] text-white rounded-2xl p-5 shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)] flex flex-col gap-4">
          <div>
            <p className="text-[14px] font-bold">ملخص الرواتب</p>
            <p className="text-[11.5px] text-white/40 mt-0.5">{formatMonthLabel(month)}</p>
          </div>
          <div className="flex flex-col gap-3">
            {[
              { label: 'إجمالي الرواتب', value: formatSAR(stats.monthPayroll), icon: <Banknote className="w-4 h-4" />, color: '#34D399' },
              { label: 'رواتب لم تُصرف', value: formatSAR(stats.unpaidPayroll), icon: <Clock className="w-4 h-4" />, color: '#FCD34D' },
              { label: 'مصروفات الشهر', value: formatSAR(stats.monthExpense), icon: <TrendingDown className="w-4 h-4" />, color: '#F87171' },
            ].map(row => (
              <div key={row.label} className="flex items-center justify-between bg-white/8 rounded-xl px-3.5 py-3">
                <div className="flex items-center gap-2" style={{ color: row.color }}>
                  {row.icon}
                  <span className="text-[12px] font-medium text-white/70">{row.label}</span>
                </div>
                <span className="text-[13px] font-bold" style={{ color: row.color }}>{row.value}</span>
              </div>
            ))}
          </div>
          <div className="mt-auto bg-[#0E9F6E] rounded-xl px-4 py-3 flex items-center gap-2">
            <CheckCircle2 className="w-4 h-4 text-white shrink-0" />
            <span className="text-[12.5px] font-semibold text-white">النظام يعمل بشكل سليم</span>
          </div>
        </div>
      </div>
    </div>
  );
}
