export type LedgerKind = 'revenues' | 'expenses';

export interface LedgerEntry {
  id: string;
  amount: number;
  description: string | null;
  category: string | null;
  entry_date: string; // YYYY-MM-DD
  created_at: string;
}

export interface LedgerEntryInput {
  amount: number;
  description: string;
  category: string;
  entry_date: string;
}
