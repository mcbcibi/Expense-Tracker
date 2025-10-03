import { Category } from '../types';

export const defaultCategories: Category[] = [
  { id: 'cat-1', name: 'Food & Dining', type: 'expense', icon: 'Utensils', color: '#ef4444', isDefault: true },
  { id: 'cat-2', name: 'Transportation', type: 'expense', icon: 'Car', color: '#f97316', isDefault: true },
  { id: 'cat-3', name: 'Shopping', type: 'expense', icon: 'ShoppingBag', color: '#f59e0b', isDefault: true },
  { id: 'cat-4', name: 'Bills & Utilities', type: 'expense', icon: 'Receipt', color: '#eab308', isDefault: true },
  { id: 'cat-5', name: 'Entertainment', type: 'expense', icon: 'Film', color: '#84cc16', isDefault: true },
  { id: 'cat-6', name: 'Healthcare', type: 'expense', icon: 'Heart', color: '#22c55e', isDefault: true },
  { id: 'cat-7', name: 'Education', type: 'expense', icon: 'GraduationCap', color: '#10b981', isDefault: true },
  { id: 'cat-8', name: 'Personal Care', type: 'expense', icon: 'Sparkles', color: '#14b8a6', isDefault: true },
  { id: 'cat-9', name: 'Housing', type: 'expense', icon: 'Home', color: '#06b6d4', isDefault: true },
  { id: 'cat-10', name: 'Other Expenses', type: 'expense', icon: 'MoreHorizontal', color: '#64748b', isDefault: true },
  { id: 'cat-11', name: 'Salary', type: 'income', icon: 'Briefcase', color: '#0ea5e9', isDefault: true },
  { id: 'cat-12', name: 'Freelance', type: 'income', icon: 'Laptop', color: '#3b82f6', isDefault: true },
  { id: 'cat-13', name: 'Investments', type: 'income', icon: 'TrendingUp', color: '#6366f1', isDefault: true },
  { id: 'cat-14', name: 'Gifts', type: 'income', icon: 'Gift', color: '#8b5cf6', isDefault: true },
  { id: 'cat-15', name: 'Other Income', type: 'income', icon: 'PlusCircle', color: '#a855f7', isDefault: true },
];
