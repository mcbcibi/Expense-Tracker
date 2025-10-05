import { supabase } from './supabase';
import { Transaction, Category, Budget, RecurringTransaction, UserProfile } from '../types';

// Note: These functions assume the following Supabase table names:
// - transactions
// - categories
// - budgets
// - recurring_transactions
// - user_profiles

export const dbService = {
  // Transactions
  async getTransactions(): Promise<Transaction[]> {
    const { data, error } = await supabase
      .from('transactions')
      .select('id, category_id, amount, currency, type, description, payment_method, transaction_date, recurring_id, created_at')
      .order('created_at', { ascending: false });

    if (error) throw error;
    // Map snake_case to camelCase for the frontend
    return (data || []).map(item => ({
      id: item.id,
      categoryId: item.category_id,
      amount: item.amount,
      currency: item.currency,
      type: item.type,
      description: item.description,
      paymentMethod: item.payment_method,
      transactionDate: item.transaction_date,
      recurringId: item.recurring_id,
      createdAt: item.created_at
    }));
  },

  async addTransaction(transaction: Omit<Transaction, 'id'>): Promise<Transaction> {
    // Generate ID if not provided (fallback, though AppContext typically provides it)
    const transactionId = `txn-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Map camelCase to snake_case for the database
    const dbTransaction = {
      id: transactionId,
      category_id: transaction.categoryId,
      amount: transaction.amount,
      currency: transaction.currency,
      type: transaction.type,
      description: transaction.description,
      payment_method: transaction.paymentMethod,
      transaction_date: transaction.transactionDate,
      recurring_id: transaction.recurringId,
      created_at: new Date().toISOString()
    };

    const { data, error } = await supabase
      .from('transactions')
      .insert(dbTransaction)
      .select()
      .single();

    if (error) throw error;
    // Return camelCase format
    return {
      id: data.id,
      categoryId: data.category_id,
      amount: data.amount,
      currency: data.currency,
      type: data.type,
      description: data.description,
      paymentMethod: data.payment_method,
      transactionDate: data.transaction_date,
      recurringId: data.recurring_id,
      createdAt: data.created_at
    };
  },

  async updateTransaction(id: string, updates: Partial<Transaction>): Promise<Transaction> {
    // Map camelCase to snake_case for the database
    const dbUpdates: any = {};

    if (updates.categoryId !== undefined) dbUpdates.category_id = updates.categoryId;
    if (updates.amount !== undefined) dbUpdates.amount = updates.amount;
    if (updates.currency !== undefined) dbUpdates.currency = updates.currency;
    if (updates.type !== undefined) dbUpdates.type = updates.type;
    if (updates.description !== undefined) dbUpdates.description = updates.description;
    if (updates.paymentMethod !== undefined) dbUpdates.payment_method = updates.paymentMethod;
    if (updates.transactionDate !== undefined) dbUpdates.transaction_date = updates.transactionDate;
    if (updates.recurringId !== undefined) dbUpdates.recurring_id = updates.recurringId;
    if (updates.createdAt !== undefined) dbUpdates.created_at = updates.createdAt;

    const { data, error } = await supabase
      .from('transactions')
      .update(dbUpdates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;

    // Return in camelCase format
    return {
      id: data.id,
      categoryId: data.category_id,
      amount: data.amount,
      currency: data.currency,
      type: data.type,
      description: data.description,
      paymentMethod: data.payment_method,
      transactionDate: data.transaction_date,
      recurringId: data.recurring_id,
      createdAt: data.created_at
    };
  },

  async deleteTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Categories
  async getCategories(): Promise<Category[]> {
    const { data, error } = await supabase
      .from('categories')
      .select('*')
      .order('name');

    if (error) throw error;
    // Categories table uses camelCase, so no mapping needed
    return data || [];
  },

  async addCategory(category: Omit<Category, 'id'>): Promise<Category> {
    const categoryId = `cat-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    const { data, error } = await supabase
      .from('categories')
      .insert({ ...category, id: categoryId })
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async updateCategory(id: string, updates: Partial<Category>): Promise<Category> {
    const { data, error } = await supabase
      .from('categories')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteCategory(id: string): Promise<void> {
    const { error } = await supabase
      .from('categories')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Budgets
  async getBudgets(): Promise<Budget[]> {
    const { data, error } = await supabase
      .from('budgets')
      .select('id, category_id, amount, period, start_date, end_date, currency')
      .order('start_date', { ascending: false });

    if (error) throw error;
    // Map snake_case to camelCase for the frontend
    return (data || []).map(item => ({
      id: item.id,
      categoryId: item.category_id,
      amount: item.amount,
      period: item.period,
      startDate: item.start_date,
      endDate: item.end_date,
      currency: item.currency
    }));
  },

  async addBudget(budget: Omit<Budget, 'id'>): Promise<Budget> {
    const budgetId = `bdg-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Map camelCase to snake_case for the database
    const dbBudget = {
      id: budgetId,
      category_id: budget.categoryId,
      amount: budget.amount,
      period: budget.period,
      start_date: budget.startDate,
      end_date: budget.endDate,
      currency: budget.currency
    };

    const { data, error } = await supabase
      .from('budgets')
      .insert(dbBudget)
      .select()
      .single();

    if (error) throw error;
    // Return camelCase format
    return {
      id: data.id,
      categoryId: data.category_id,
      amount: data.amount,
      period: data.period,
      startDate: data.start_date,
      endDate: data.end_date,
      currency: data.currency
    };
  },

  async updateBudget(id: string, updates: Partial<Budget>): Promise<Budget> {
    const { data, error } = await supabase
      .from('budgets')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteBudget(id: string): Promise<void> {
    const { error } = await supabase
      .from('budgets')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // Recurring Transactions
  async getRecurringTransactions(): Promise<RecurringTransaction[]> {
    const { data, error } = await supabase
      .from('recurring_transactions')
      .select('id, category_id, amount, currency, type, description, payment_method, frequency, start_date, end_date, next_occurrence, is_active')
      .order('next_occurrence');

    if (error) throw error;
    // Map snake_case to camelCase for the frontend
    return (data || []).map(item => ({
      id: item.id,
      categoryId: item.category_id,
      amount: item.amount,
      currency: item.currency,
      type: item.type,
      description: item.description,
      paymentMethod: item.payment_method,
      frequency: item.frequency,
      startDate: item.start_date,
      endDate: item.end_date,
      nextOccurrence: item.next_occurrence,
      isActive: item.is_active
    }));
  },

  async addRecurringTransaction(recurring: Omit<RecurringTransaction, 'id'>): Promise<RecurringTransaction> {
    const recurringId = `rec-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;

    // Map camelCase to snake_case for the database
    const dbRecurring = {
      id: recurringId,
      category_id: recurring.categoryId,
      amount: recurring.amount,
      currency: recurring.currency,
      type: recurring.type,
      description: recurring.description,
      payment_method: recurring.paymentMethod,
      frequency: recurring.frequency,
      start_date: recurring.startDate,
      end_date: recurring.endDate,
      next_occurrence: recurring.nextOccurrence,
      is_active: recurring.isActive
    };

    const { data, error } = await supabase
      .from('recurring_transactions')
      .insert(dbRecurring)
      .select()
      .single();

    if (error) throw error;
    // Return camelCase format
    return {
      id: data.id,
      categoryId: data.category_id,
      amount: data.amount,
      currency: data.currency,
      type: data.type,
      description: data.description,
      paymentMethod: data.payment_method,
      frequency: data.frequency,
      startDate: data.start_date,
      endDate: data.end_date,
      nextOccurrence: data.next_occurrence,
      isActive: data.is_active
    };
  },

  async updateRecurringTransaction(id: string, updates: Partial<RecurringTransaction>): Promise<RecurringTransaction> {
    const { data, error } = await supabase
      .from('recurring_transactions')
      .update(updates)
      .eq('id', id)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async deleteRecurringTransaction(id: string): Promise<void> {
    const { error } = await supabase
      .from('recurring_transactions')
      .delete()
      .eq('id', id);

    if (error) throw error;
  },

  // User Profile
  async getUserProfile(): Promise<UserProfile | null> {
    const { data, error } = await supabase
      .from('user_profiles')
      .select('email, full_name, default_currency')
      .maybeSingle(); // Use maybeSingle instead of single to avoid PGRST116 error

    if (error) throw error;
    return data;
  },

  async updateUserProfile(updates: Partial<UserProfile>): Promise<UserProfile> {
    // For single user apps, we can just insert/upsert without constraints
    // This will create the profile if it doesn't exist, or update if it does
    const { data, error } = await supabase
      .from('user_profiles')
      .upsert(updates)
      .select()
      .single();

    if (error) throw error;
    return data;
  },

  async getCurrency(): Promise<string> {
    const profile = await this.getUserProfile();
    return profile?.default_currency || 'USD';
  },

  async setCurrency(currency: string): Promise<void> {
    const profile = await this.getUserProfile();
    if (profile) {
      await this.updateUserProfile({ ...profile, default_currency: currency });
    } else {
      await this.updateUserProfile({ default_currency: currency });
    }
  }
};
