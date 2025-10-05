import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { Transaction, Category, Budget, RecurringTransaction } from '../types';
import { dbService } from '../utils/database';
import { defaultCategories } from '../utils/defaultCategories';

interface AppContextType {
  transactions: Transaction[];
  categories: Category[];
  budgets: Budget[];
  recurringTransactions: RecurringTransaction[];
  currency: string;
  loading: boolean;
  error: string | null;
  addTransaction: (transaction: Omit<Transaction, 'id'>) => Promise<void>;
  updateTransaction: (id: string, transaction: Partial<Transaction>) => Promise<void>;
  deleteTransaction: (id: string) => Promise<void>;
  addCategory: (category: Omit<Category, 'id'>) => Promise<void>;
  updateCategory: (id: string, category: Partial<Category>) => Promise<void>;
  deleteCategory: (id: string) => Promise<void>;
  addBudget: (budget: Omit<Budget, 'id'>) => Promise<void>;
  updateBudget: (id: string, budget: Partial<Budget>) => Promise<void>;
  deleteBudget: (id: string) => Promise<void>;
  addRecurringTransaction: (recurring: Omit<RecurringTransaction, 'id'>) => Promise<void>;
  updateRecurringTransaction: (id: string, recurring: Partial<RecurringTransaction>) => Promise<void>;
  deleteRecurringTransaction: (id: string) => Promise<void>;
}

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [transactions, setTransactions] = useState<Transaction[]>([]);
  const [categories, setCategories] = useState<Category[]>(defaultCategories);
  const [budgets, setBudgets] = useState<Budget[]>([]);
  const [recurringTransactions, setRecurringTransactions] = useState<RecurringTransaction[]>([]);
  const [currency, setCurrency] = useState<string>('INR');
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const loadData = async () => {
      try {
        setLoading(true);
        setError(null);

        // Load all data in parallel
        const [
          transactionsData,
          categoriesData,
          budgetsData,
          recurringData,
          currencyData
        ] = await Promise.all([
          dbService.getTransactions(),
          dbService.getCategories(),
          dbService.getBudgets(),
          dbService.getRecurringTransactions(),
          dbService.getCurrency()
        ]);

        const transformedTransactions = transactionsData;

        setTransactions(transformedTransactions);
        setCategories(categoriesData.length > 0 ? categoriesData : defaultCategories);
        setBudgets(budgetsData);
        setRecurringTransactions(recurringData);
        setCurrency(currencyData);
      } catch (err) {
        console.error('Error loading data:', err);
        setError('Failed to load data from Supabase');
        // Fallback to defaults if Supabase fails initially
        setCategories(defaultCategories);
      } finally {
        setLoading(false);
      }
    };

    loadData();
  }, []);

  const addTransaction = async (transaction: Omit<Transaction, 'id'>) => {
    try {
      setError(null);
      const newTransaction = await dbService.addTransaction(transaction);
      setTransactions(prev => [newTransaction, ...prev]);
    } catch (err) {
      console.error('Error adding transaction:', err);
      setError('Failed to add transaction');
    }
  };

  const updateTransaction = async (id: string, updates: Partial<Transaction>) => {
    try {
      setError(null);
      const updatedTransaction = await dbService.updateTransaction(id, updates);
      setTransactions(prev => prev.map(t => t.id === id ? updatedTransaction : t));
    } catch (err) {
      console.error('Error updating transaction:', err);
      setError('Failed to update transaction');
    }
  };

  const deleteTransaction = async (id: string) => {
    try {
      setError(null);
      await dbService.deleteTransaction(id);
      setTransactions(prev => prev.filter(t => t.id !== id));
    } catch (err) {
      console.error('Error deleting transaction:', err);
      setError('Failed to delete transaction');
    }
  };

  const addCategory = async (category: Omit<Category, 'id'>) => {
    try {
      setError(null);
      const newCategory = await dbService.addCategory(category);
      setCategories(prev => [...prev, newCategory]);
    } catch (err) {
      console.error('Error adding category:', err);
      setError('Failed to add category');
    }
  };

  const updateCategory = async (id: string, updates: Partial<Category>) => {
    try {
      setError(null);
      const updatedCategory = await dbService.updateCategory(id, updates);
      setCategories(prev => prev.map(c => c.id === id ? updatedCategory : c));
    } catch (err) {
      console.error('Error updating category:', err);
      setError('Failed to update category');
    }
  };

  const deleteCategory = async (id: string) => {
    try {
      setError(null);
      await dbService.deleteCategory(id);
      setCategories(prev => prev.filter(c => c.id !== id));
    } catch (err) {
      console.error('Error deleting category:', err);
      setError('Failed to delete category');
    }
  };

  const addBudget = async (budget: Omit<Budget, 'id'>) => {
    try {
      setError(null);
      const newBudget = await dbService.addBudget(budget);
      setBudgets(prev => [...prev, newBudget]);
    } catch (err) {
      console.error('Error adding budget:', err);
      setError('Failed to add budget');
    }
  };

  const updateBudget = async (id: string, updates: Partial<Budget>) => {
    try {
      setError(null);
      const updatedBudget = await dbService.updateBudget(id, updates);
      setBudgets(prev => prev.map(b => b.id === id ? updatedBudget : b));
    } catch (err) {
      console.error('Error updating budget:', err);
      setError('Failed to update budget');
    }
  };

  const deleteBudget = async (id: string) => {
    try {
      setError(null);
      await dbService.deleteBudget(id);
      setBudgets(prev => prev.filter(b => b.id !== id));
    } catch (err) {
      console.error('Error deleting budget:', err);
      setError('Failed to delete budget');
    }
  };

  const addRecurringTransaction = async (recurring: Omit<RecurringTransaction, 'id'>) => {
    try {
      setError(null);
      const newRecurring = await dbService.addRecurringTransaction(recurring);
      setRecurringTransactions(prev => [...prev, newRecurring]);
    } catch (err) {
      console.error('Error adding recurring transaction:', err);
      setError('Failed to add recurring transaction');
    }
  };

  const updateRecurringTransaction = async (id: string, updates: Partial<RecurringTransaction>) => {
    try {
      setError(null);
      const updatedRecurring = await dbService.updateRecurringTransaction(id, updates);
      setRecurringTransactions(prev => prev.map(r => r.id === id ? updatedRecurring : r));
    } catch (err) {
      console.error('Error updating recurring transaction:', err);
      setError('Failed to update recurring transaction');
    }
  };

  const deleteRecurringTransaction = async (id: string) => {
    try {
      setError(null);
      await dbService.deleteRecurringTransaction(id);
      setRecurringTransactions(prev => prev.filter(r => r.id !== id));
    } catch (err) {
      console.error('Error deleting recurring transaction:', err);
      setError('Failed to delete recurring transaction');
    }
  };



  return (
    <AppContext.Provider
      value={{
        transactions,
        categories,
        budgets,
        recurringTransactions,
        currency,
        loading,
        error,
        addTransaction,
        updateTransaction,
        deleteTransaction,
        addCategory,
        updateCategory,
        deleteCategory,
        addBudget,
        updateBudget,
        deleteBudget,
        addRecurringTransaction,
        updateRecurringTransaction,
        deleteRecurringTransaction,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error('useApp must be used within AppProvider');
  }
  return context;
};
