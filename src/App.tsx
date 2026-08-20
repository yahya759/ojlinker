/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState } from 'react';
import {
  LayoutDashboard, Users, CalendarCheck, Banknote, TrendingUp,
  Settings, HelpCircle, LogOut, Menu, X, ChevronRight
} from 'lucide-react';
import { DashboardPage } from './components/dashboard/DashboardPage';
import { EmployeesPage } from './components/hr/EmployeesPage';
import { AttendancePage } from './components/hr/AttendancePage';
import { PayrollPage } from './components/hr/PayrollPage';
import { AccountingView } from './components/accounting/AccountingView';

type Page = 'dashboard' | 'employees' | 'attendance' | 'payroll' | 'accounting';

interface NavItem { id: Page; label: string; icon: React.ReactNode }

const MAIN_NAV: NavItem[] = [
  { id: 'dashboard',  label: 'الداشبورد',           icon: <LayoutDashboard className="w-[18px] h-[18px]" /> },
  { id: 'employees',  label: 'الموظفين',            icon: <Users className="w-[18px] h-[18px]" /> },
  { id: 'attendance', label: 'الحضور والغياب',      icon: <CalendarCheck className="w-[18px] h-[18px]" /> },
  { id: 'payroll',    label: 'الرواتب',              icon: <Banknote className="w-[18px] h-[18px]" /> },
  { id: 'accounting', label: 'الإيرادات والمصروفات', icon: <TrendingUp className="w-[18px] h-[18px]" /> },
];

function Sidebar({ page, setPage, collapsed, setCollapsed }: {
  page: Page; setPage: (p: Page) => void;
  collapsed: boolean; setCollapsed: (v: boolean) => void;
}) {
  return (
    <aside className={`hidden md:flex flex-col bg-[#1A2B1F] text-white transition-all duration-300 ${collapsed ? 'w-[70px]' : 'w-[240px]'} min-h-screen shrink-0`}>
      {/* Logo area */}
      <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
        {!collapsed && (
          <img src="/assets/ojlinker-logo.png" alt="OJlinker" className="h-9 object-contain" />
        )}
        {collapsed && (
          <img src="/assets/ojlinker-logo.png" alt="OJlinker" className="w-9 h-9 object-contain mx-auto" />
        )}
        {!collapsed && (
          <button onClick={() => setCollapsed(true)} className="text-white/40 hover:text-white cursor-pointer transition-colors">
            <ChevronRight className="w-4 h-4" />
          </button>
        )}
      </div>

      {/* Main nav */}
      <div className="flex flex-col gap-1 px-2 pt-5 flex-1">
        {!collapsed && <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-3 mb-1">القائمة</p>}
        {MAIN_NAV.map(item => {
          const active = page === item.id;
          return (
            <button key={item.id} onClick={() => setPage(item.id)}
              title={collapsed ? item.label : undefined}
              className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer w-full ${
                active ? 'bg-[#0E9F6E] text-white shadow-lg shadow-[#0E9F6E]/30' : 'text-white/60 hover:bg-white/8 hover:text-white'
              } ${collapsed ? 'justify-center' : ''}`}>
              {item.icon}
              {!collapsed && <span>{item.label}</span>}
              {active && !collapsed && <span className="mr-auto w-1.5 h-1.5 rounded-full bg-white/60" />}
            </button>
          );
        })}
      </div>

      {/* Bottom */}
      <div className="flex flex-col gap-1 px-2 pb-4 border-t border-white/10 pt-3">
        {!collapsed && <p className="text-[10px] font-semibold text-white/30 uppercase tracking-widest px-3 mb-1">عام</p>}
        {[
          { icon: <Settings className="w-[18px] h-[18px]" />, label: 'الإعدادات' },
          { icon: <HelpCircle className="w-[18px] h-[18px]" />, label: 'المساعدة' },
          { icon: <LogOut className="w-[18px] h-[18px]" />, label: 'خروج' },
        ].map(item => (
          <button key={item.label}
            title={collapsed ? item.label : undefined}
            className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium text-white/50 hover:bg-white/8 hover:text-white transition-all cursor-pointer w-full ${collapsed ? 'justify-center' : ''}`}>
            {item.icon}
            {!collapsed && <span>{item.label}</span>}
          </button>
        ))}
        {/* User chip */}
        {!collapsed && (
          <div className="mt-2 flex items-center gap-2.5 bg-white/8 rounded-xl px-3 py-2.5">
            <div className="w-8 h-8 rounded-full bg-[#0E9F6E] flex items-center justify-center text-[12px] font-bold shrink-0">أ</div>
            <div className="flex flex-col min-w-0">
              <span className="text-[12px] font-semibold truncate">ابو فراس</span>
              <span className="text-[10px] text-white/40 truncate">مدير النظام</span>
            </div>
          </div>
        )}
        {collapsed && (
          <button onClick={() => setCollapsed(false)} className="flex items-center justify-center px-3 py-2.5 text-white/40 hover:text-white cursor-pointer">
            <Menu className="w-[18px] h-[18px]" />
          </button>
        )}
      </div>
    </aside>
  );
}

function MobileNav({ page, setPage, open, setOpen }: {
  page: Page; setPage: (p: Page) => void; open: boolean; setOpen: (v: boolean) => void;
}) {
  return (
    <>
      {/* Overlay */}
      {open && <div className="fixed inset-0 bg-black/40 z-40 md:hidden" onClick={() => setOpen(false)} />}
      {/* Drawer */}
      <div className={`fixed top-0 right-0 h-full w-64 bg-[#1A2B1F] text-white z-50 flex flex-col transform transition-transform duration-300 md:hidden ${open ? 'translate-x-0' : 'translate-x-full'}`}>
        <div className="flex items-center justify-between px-4 py-5 border-b border-white/10">
          <img src="/assets/ojlinker-logo.png" alt="OJlinker" className="h-9 object-contain" />
          <button onClick={() => setOpen(false)} className="text-white/40 hover:text-white cursor-pointer"><X className="w-5 h-5" /></button>
        </div>
        <div className="flex flex-col gap-1 px-2 pt-4 flex-1">
          {MAIN_NAV.map(item => {
            const active = page === item.id;
            return (
              <button key={item.id} onClick={() => { setPage(item.id); setOpen(false); }}
                className={`flex items-center gap-3 px-3 py-2.5 rounded-xl text-[13px] font-medium transition-all cursor-pointer w-full ${
                  active ? 'bg-[#0E9F6E] text-white' : 'text-white/60 hover:bg-white/8 hover:text-white'
                }`}>
                {item.icon}<span>{item.label}</span>
              </button>
            );
          })}
        </div>
      </div>
    </>
  );
}

const PAGE_TITLES: Record<Page, string> = {
  dashboard: 'الداشبورد',
  employees: 'الموظفين',
  attendance: 'الحضور والغياب',
  payroll: 'الرواتب',
  accounting: 'الإيرادات والمصروفات',
};
const PAGE_SUBTITLES: Record<Page, string> = {
  dashboard: 'نظرة عامة على الشركة',
  employees: 'إدارة فريق العمل',
  attendance: 'متابعة الحضور اليومي',
  payroll: 'صرف الرواتب والمكافآت',
  accounting: 'متابعة الإيرادات والمصروفات',
};

export default function App() {
  const [page, setPage] = useState<Page>('dashboard');
  const [collapsed, setCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex min-h-screen bg-[#F4F6F5] font-sans" dir="rtl">
      <Sidebar page={page} setPage={setPage} collapsed={collapsed} setCollapsed={setCollapsed} />
      <MobileNav page={page} setPage={setPage} open={mobileOpen} setOpen={setMobileOpen} />

      {/* Main content */}
      <div className="flex-1 flex flex-col min-w-0">
        {/* Topbar */}
        <header className="sticky top-0 z-30 bg-white border-b border-[#E8EFEA] px-5 sm:px-8 h-14 flex items-center justify-between shadow-[0_1px_8px_-2px_rgba(0,0,0,0.05)]">
          <div className="flex items-center gap-3">
            {/* Mobile hamburger */}
            <button className="md:hidden text-[#1A1A1A] cursor-pointer" onClick={() => setMobileOpen(true)}>
              <Menu className="w-5 h-5" />
            </button>
            <div>
              <h1 className="text-[15px] font-bold text-[#1A1A1A] leading-tight">{PAGE_TITLES[page]}</h1>
              <p className="text-[11px] text-[#6B7280] leading-tight hidden sm:block">{PAGE_SUBTITLES[page]}</p>
            </div>
          </div>
          {/* Right side: avatar */}
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-full bg-[#0E9F6E] flex items-center justify-center text-white text-[13px] font-bold cursor-pointer">ي</div>
          </div>
        </header>

        {/* Page */}
        <main className="flex-1 px-5 sm:px-8 py-6">
          {page === 'dashboard'  && <DashboardPage />}
          {page === 'employees'  && <EmployeesPage />}
          {page === 'attendance' && <AttendancePage />}
          {page === 'payroll'    && <PayrollPage />}
          {page === 'accounting' && <AccountingView />}
        </main>
      </div>
    </div>
  );
}
