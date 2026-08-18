/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import { LayoutDashboard, Users, CalendarCheck, Banknote, TrendingUp } from 'lucide-react';
import { Logo } from './components/Logo';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { EmployeesPage } from './components/hr/EmployeesPage';
import { AttendancePage } from './components/hr/AttendancePage';
import { PayrollPage } from './components/hr/PayrollPage';
import { AccountingView } from './components/accounting/AccountingView';

type Page = 'dashboard' | 'employees' | 'attendance' | 'payroll' | 'accounting';

interface NavItem { id: Page; label: string; icon: React.ReactNode }

const NAV: NavItem[] = [
  { id: 'dashboard',  label: 'الداشبورد',          icon: <LayoutDashboard className="w-4 h-4" /> },
  { id: 'employees',  label: 'الموظفين',           icon: <Users className="w-4 h-4" /> },
  { id: 'attendance', label: 'الحضور والغياب',     icon: <CalendarCheck className="w-4 h-4" /> },
  { id: 'payroll',    label: 'الرواتب',             icon: <Banknote className="w-4 h-4" /> },
  { id: 'accounting', label: 'الإيرادات والمصروفات', icon: <TrendingUp className="w-4 h-4" /> },
];

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="min-h-screen w-full bg-[#F9FAFB] font-sans" dir="rtl">
      {/* Top Navbar */}
      <header className="sticky top-0 z-40 w-full bg-white border-b border-[#EEF6F1] shadow-[0_2px_12px_-4px_rgba(0,0,0,0.06)]">
        <div className="max-w-[1600px] mx-auto px-4 sm:px-8 h-14 flex items-center justify-between">
          <Logo height={34} />

          {/* Desktop nav */}
          <nav className="hidden md:flex items-center gap-1">
            {NAV.map(item => (
              <button key={item.id} onClick={() => setPage(item.id)}
                className={`flex items-center gap-1.5 px-3.5 py-2 rounded-xl text-[13px] font-medium transition-all cursor-pointer ${
                  page === item.id
                    ? 'bg-[#0E9F6E]/10 text-[#0E9F6E] font-semibold'
                    : 'text-[#6B7280] hover:bg-[#F3F4F6] hover:text-[#1A1A1A]'
                }`}>
                {item.icon}{item.label}
              </button>
            ))}
          </nav>

          {/* Mobile hamburger */}
          <button className="md:hidden flex flex-col gap-1 p-2 cursor-pointer" onClick={() => setMobileOpen(o => !o)}>
            <span className="w-5 h-0.5 bg-[#1A1A1A] rounded" />
            <span className="w-5 h-0.5 bg-[#1A1A1A] rounded" />
            <span className="w-5 h-0.5 bg-[#1A1A1A] rounded" />
          </button>
        </div>

        {/* Mobile menu */}
        {mobileOpen && (
          <div className="md:hidden border-t border-[#EEF6F1] bg-white px-4 py-2 flex flex-col gap-1">
            {NAV.map(item => (
              <button key={item.id} onClick={() => { setPage(item.id); setMobileOpen(false); }}
                className={`flex items-center gap-2 px-3 py-2.5 rounded-xl text-[13px] font-medium cursor-pointer ${
                  page === item.id ? 'bg-[#0E9F6E]/10 text-[#0E9F6E] font-semibold' : 'text-[#6B7280] hover:bg-[#F3F4F6]'
                }`}>
                {item.icon}{item.label}
              </button>
            ))}
          </div>
        )}
      </header>

      {/* Page content */}
      <main className="max-w-[1600px] mx-auto px-4 sm:px-8 py-6">
        {page === 'dashboard'  && <DashboardPage />}
        {page === 'employees'  && <EmployeesPage />}
        {page === 'attendance' && <AttendancePage />}
        {page === 'payroll'    && <PayrollPage />}
        {page === 'accounting' && <AccountingView />}
      </main>
    </div>
  );
}
