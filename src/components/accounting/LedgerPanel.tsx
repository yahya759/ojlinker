import React, { useEffect, useMemo, useState } from 'react';
import { Plus, Trash2, TrendingUp, TrendingDown, Loader2 } from 'lucide-react';
import { supabase } from '../../lib/supabase';
import type { LedgerEntry, LedgerKind } from '../../types/accounting';

interface LedgerPanelProps {
  kind: LedgerKind;
  accentColor: string; // tailwind color hex used for totals/buttons
  categorySuggestions: string[];
}

function todayISO(): string {
  return new Date().toISOString().slice(0, 10);
}

function monthKeyOf(dateISO: string): string {
  return dateISO.slice(0, 7); // YYYY-MM
}

function formatMonthLabel(monthKey: string): string {
  const [year, month] = monthKey.split('-').map(Number);
  const d = new Date(year, month - 1, 1);
  return new Intl.DateTimeFormat('ar-SA', { month: 'long', year: 'numeric' }).format(d);
}

function formatSAR(amount: number): string {
  return new Intl.NumberFormat('ar-SA', {
    style: 'currency',
    currency: 'SAR',
    maximumFractionDigits: 2,
  }).format(amount);
}

export function LedgerPanel({ kind, accentColor, categorySuggestions }: LedgerPanelProps) {
  const [entries, setEntries] = useState<LedgerEntry[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  const [selectedMonth, setSelectedMonth] = useState(() => todayISO().slice(0, 7));

  const [amount, setAmount] = useState('');
  const [description, setDescription] = useState('');
  const [category, setCategory] = useState('');
  const [entryDate, setEntryDate] = useState(todayISO());

  const label = kind === 'revenues' ? 'إيراد' : 'مصروف';

  async function fetchEntries() {
    setLoading(true);
    setError(null);
    const { data, error: fetchError } = await supabase
      .from(kind)
      .select('*')
      .order('entry_date', { ascending: false });

    if (fetchError) {
      setError('في مشكلة بجلب البيانات. تأكد من ربط Supabase والجدول.');
      setEntries([]);
    } else {
      setEntries(data ?? []);
    }
    setLoading(false);
  }

  useEffect(() => {
    fetchEntries();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [kind]);

  const months = useMemo(() => {
    const set = new Set<string>();
    set.add(todayISO().slice(0, 7));
    entries.forEach((e) => set.add(monthKeyOf(e.entry_date)));
    return Array.from(set).sort((a, b) => (a < b ? 1 : -1));
  }, [entries]);

  const monthEntries = useMemo(
    () => entries.filter((e) => monthKeyOf(e.entry_date) === selectedMonth),
    [entries, selectedMonth]
  );

  const monthTotal = useMemo(
    () => monthEntries.reduce((sum, e) => sum + Number(e.amount), 0),
    [monthEntries]
  );

  async function handleAdd(e: React.FormEvent) {
    e.preventDefault();
    const numericAmount = Number(amount);
    if (!numericAmount || numericAmount <= 0) return;

    setSubmitting(true);
    const { error: insertError } = await supabase.from(kind).insert({
      amount: numericAmount,
      description: description.trim() || null,
      category: category.trim() || null,
      entry_date: entryDate,
    });
    setSubmitting(false);

    if (insertError) {
      setError('ما قدرنا نضيف العملية. جرب كمان مرة.');
      return;
    }

    setAmount('');
    setDescription('');
    setCategory('');
    setEntryDate(todayISO());
    fetchEntries();
  }

  async function handleDelete(id: string) {
    const { error: deleteError } = await supabase.from(kind).delete().eq('id', id);
    if (deleteError) {
      setError('ما قدرنا نحذف العملية.');
      return;
    }
    setEntries((prev) => prev.filter((entry) => entry.id !== id));
  }

  return (
    <div className="w-full flex flex-col gap-5">
      {/* Month selector + big total */}
      <div
        className="w-full rounded-[22px] p-6 sm:p-7 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border"
        style={{ backgroundColor: `${accentColor}10`, borderColor: `${accentColor}30` }}
      >
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-2xl flex items-center justify-center shrink-0"
            style={{ backgroundColor: `${accentColor}20`, color: accentColor }}
          >
            {kind === 'revenues' ? <TrendingUp className="w-5 h-5" /> : <TrendingDown className="w-5 h-5" />}
          </div>
          <div>
            <p className="text-[12px] font-medium text-[#6B7280]">
              إجمالي {label === 'إيراد' ? 'الإيرادات' : 'المصروفات'} لشهر {formatMonthLabel(selectedMonth)}
            </p>
            <p className="text-[26px] sm:text-[30px] font-extrabold tracking-tight" style={{ color: accentColor }}>
              {formatSAR(monthTotal)}
            </p>
          </div>
        </div>

        <select
          value={selectedMonth}
          onChange={(ev) => setSelectedMonth(ev.target.value)}
          className="bg-white border border-[#EEF6F1] rounded-xl px-4 py-2.5 text-[13px] font-medium text-[#1A1A1A] shadow-sm cursor-pointer"
        >
          {months.map((m) => (
            <option key={m} value={m}>
              {formatMonthLabel(m)}
            </option>
          ))}
        </select>
      </div>

      {/* Add entry form */}
      <form
        onSubmit={handleAdd}
        className="w-full rounded-[22px] p-5 sm:p-6 border border-[#EEF6F1] bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 items-end"
      >
        <div className="flex flex-col gap-1.5 lg:col-span-1">
          <label className="text-[11.5px] font-semibold text-[#6B7280]">المبلغ (ر.س)</label>
          <input
            type="number"
            min="0"
            step="0.01"
            required
            value={amount}
            onChange={(ev) => setAmount(ev.target.value)}
            placeholder="0.00"
            className="border border-[#EEF6F1] rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0E9F6E]/30"
          />
        </div>

        <div className="flex flex-col gap-1.5 lg:col-span-1">
          <label className="text-[11.5px] font-semibold text-[#6B7280]">التاريخ</label>
          <input
            type="date"
            required
            value={entryDate}
            onChange={(ev) => setEntryDate(ev.target.value)}
            className="border border-[#EEF6F1] rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0E9F6E]/30"
          />
        </div>

        <div className="flex flex-col gap-1.5 lg:col-span-1">
          <label className="text-[11.5px] font-semibold text-[#6B7280]">الفئة</label>
          <input
            list={`${kind}-categories`}
            value={category}
            onChange={(ev) => setCategory(ev.target.value)}
            placeholder="اختر أو اكتب"
            className="border border-[#EEF6F1] rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0E9F6E]/30"
          />
          <datalist id={`${kind}-categories`}>
            {categorySuggestions.map((c) => (
              <option key={c} value={c} />
            ))}
          </datalist>
        </div>

        <div className="flex flex-col gap-1.5 lg:col-span-1">
          <label className="text-[11.5px] font-semibold text-[#6B7280]">الوصف</label>
          <input
            value={description}
            onChange={(ev) => setDescription(ev.target.value)}
            placeholder="اختياري"
            className="border border-[#EEF6F1] rounded-xl px-3.5 py-2.5 text-[13px] focus:outline-none focus:ring-2 focus:ring-[#0E9F6E]/30"
          />
        </div>

        <button
          type="submit"
          disabled={submitting}
          className="lg:col-span-1 flex items-center justify-center gap-1.5 text-white font-semibold text-[13px] rounded-xl px-4 py-2.5 shadow-sm transition-all disabled:opacity-60 cursor-pointer"
          style={{ backgroundColor: accentColor }}
        >
          {submitting ? <Loader2 className="w-4 h-4 animate-spin" /> : <Plus className="w-4 h-4" />}
          إضافة {label}
        </button>
      </form>

      {error && (
        <div className="w-full rounded-xl bg-red-50 border border-red-200 text-red-700 text-[12.5px] px-4 py-3">
          {error}
        </div>
      )}

      {/* Entries list for selected month */}
      <div className="w-full rounded-[22px] border border-[#EEF6F1] bg-white shadow-[0_4px_20px_-4px_rgba(0,0,0,0.04)] overflow-hidden">
        {loading ? (
          <div className="flex items-center justify-center py-10 text-[#6B7280] text-[13px] gap-2">
            <Loader2 className="w-4 h-4 animate-spin" /> عم نجيب البيانات...
          </div>
        ) : monthEntries.length === 0 ? (
          <div className="flex items-center justify-center py-10 text-[#6B7280] text-[13px]">
            ما في عمليات مسجلة بهاد الشهر
          </div>
        ) : (
          <table className="w-full text-[13px]">
            <thead>
              <tr className="bg-[#EEF6F1]/50 text-[#6B7280] text-[11.5px] font-semibold">
                <th className="text-right px-5 py-3">التاريخ</th>
                <th className="text-right px-5 py-3">الوصف</th>
                <th className="text-right px-5 py-3">الفئة</th>
                <th className="text-right px-5 py-3">المبلغ</th>
                <th className="px-5 py-3"></th>
              </tr>
            </thead>
            <tbody>
              {monthEntries.map((entry) => (
                <tr key={entry.id} className="border-t border-[#EEF6F1] hover:bg-[#EEF6F1]/30">
                  <td className="px-5 py-3 text-[#1A1A1A] whitespace-nowrap">{entry.entry_date}</td>
                  <td className="px-5 py-3 text-[#1A1A1A]">{entry.description || '—'}</td>
                  <td className="px-5 py-3 text-[#6B7280]">{entry.category || '—'}</td>
                  <td className="px-5 py-3 font-semibold whitespace-nowrap" style={{ color: accentColor }}>
                    {formatSAR(Number(entry.amount))}
                  </td>
                  <td className="px-5 py-3 text-left">
                    <button
                      type="button"
                      onClick={() => handleDelete(entry.id)}
                      title="حذف"
                      className="w-7 h-7 rounded-full bg-[#EEF6F1] hover:bg-red-500 text-[#6B7280] hover:text-white flex items-center justify-center transition-colors cursor-pointer"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        )}
      </div>
    </div>
  );
}
