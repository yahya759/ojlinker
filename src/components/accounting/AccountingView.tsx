import React, { useState } from 'react';
import { TrendingUp, TrendingDown } from 'lucide-react';
import { LedgerPanel } from './LedgerPanel';

const REVENUE_COLOR = '#0E9F6E';
const EXPENSE_COLOR = '#DC2626';

const REVENUE_CATEGORIES = ['اشتراكات', 'خدمات', 'مبيعات', 'أخرى'];
const EXPENSE_CATEGORIES = ['رواتب', 'تسويق', 'أدوات واشتراكات', 'استضافة وسيرفرات', 'أخرى'];

export function AccountingView() {
  const [tab, setTab] = useState<'revenues' | 'expenses'>('revenues');

  return (
    <div className="w-full flex flex-col gap-5 pb-10">
      {/* Tabs */}
      <div className="w-full flex items-center gap-2 bg-[#EEF6F1]/60 rounded-2xl p-1.5 max-w-md">
        <button
          type="button"
          onClick={() => setTab('revenues')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
            tab === 'revenues' ? 'bg-white shadow-sm text-[#0E9F6E]' : 'text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
        >
          <TrendingUp className="w-4 h-4" />
          الإيرادات
        </button>
        <button
          type="button"
          onClick={() => setTab('expenses')}
          className={`flex-1 flex items-center justify-center gap-1.5 py-2.5 rounded-xl text-[13px] font-semibold transition-all cursor-pointer ${
            tab === 'expenses' ? 'bg-white shadow-sm text-red-600' : 'text-[#6B7280] hover:text-[#1A1A1A]'
          }`}
        >
          <TrendingDown className="w-4 h-4" />
          المصروفات
        </button>
      </div>

      {tab === 'revenues' ? (
        <LedgerPanel kind="revenues" accentColor={REVENUE_COLOR} categorySuggestions={REVENUE_CATEGORIES} />
      ) : (
        <LedgerPanel kind="expenses" accentColor={EXPENSE_COLOR} categorySuggestions={EXPENSE_CATEGORIES} />
      )}
    </div>
  );
}
