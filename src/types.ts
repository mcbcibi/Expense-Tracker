export type TransactionType = 'expense' | 'income';

export type Frequency = 'daily' | 'weekly' | 'monthly' | 'yearly';

export type BudgetPeriod = 'weekly' | 'monthly';

export interface Category {
  id: string;
  name: string;
  type: TransactionType;
  icon: string;
  color: string;
  isDefault?: boolean;
}

export interface Transaction {
  id: string;
  categoryId: string;
  amount: number;
  currency: string;
  type: TransactionType;
  description: string;
  paymentMethod: string;
  transactionDate: string;
  recurringId?: string;
  createdAt: string;
}

export interface RecurringTransaction {
  id: string;
  categoryId: string;
  amount: number;
  currency: string;
  type: TransactionType;
  description: string;
  paymentMethod: string;
  frequency: Frequency;
  startDate: string;
  endDate?: string;
  nextOccurrence: string;
  isActive: boolean;
}

export interface Budget {
  id: string;
  categoryId: string;
  amount: number;
  period: BudgetPeriod;
  startDate: string;
  endDate: string;
  currency: string;
}

export interface UserProfile {
  email?: string;
  full_name?: string;
  default_currency: string;
}
