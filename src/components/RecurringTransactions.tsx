import React, { useState } from 'react';
import { Plus, X, Repeat, Play, Pause } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currencies';
import { Frequency, TransactionType } from '../types';
import * as Icons from 'lucide-react';

export const RecurringTransactions: React.FC = () => {
  const {
    recurringTransactions,
    categories,
    currency,
    addRecurringTransaction,
    updateRecurringTransaction,
    deleteRecurringTransaction,
  } = useApp();

  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    type: 'expense' as TransactionType,
    amount: '',
    categoryId: '',
    description: '',
    paymentMethod: 'cash',
    frequency: 'monthly' as Frequency,
    startDate: new Date().toISOString().split('T')[0],
    endDate: '',
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId) return;

    const calculateNextOccurrence = (startDate: string, frequency: Frequency): string => {
      const date = new Date(startDate);
      switch (frequency) {
        case 'daily':
          date.setDate(date.getDate() + 1);
          break;
        case 'weekly':
          date.setDate(date.getDate() + 7);
          break;
        case 'monthly':
          date.setMonth(date.getMonth() + 1);
          break;
        case 'yearly':
          date.setFullYear(date.getFullYear() + 1);
          break;
      }
      return date.toISOString().split('T')[0];
    };

    addRecurringTransaction({
      type: formData.type,
      amount: parseFloat(formData.amount),
      categoryId: formData.categoryId,
      description: formData.description,
      paymentMethod: formData.paymentMethod,
      frequency: formData.frequency,
      startDate: formData.startDate,
      endDate: formData.endDate || undefined,
      nextOccurrence: calculateNextOccurrence(formData.startDate, formData.frequency),
      isActive: true,
      currency,
    });

    setFormData({
      type: 'expense',
      amount: '',
      categoryId: '',
      description: '',
      paymentMethod: 'cash',
      frequency: 'monthly',
      startDate: new Date().toISOString().split('T')[0],
      endDate: '',
    });
    setShowForm(false);
  };

  const toggleActive = (id: string, isActive: boolean) => {
    updateRecurringTransaction(id, { isActive: !isActive });
  };

  const getIconComponent = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon || Icons.DollarSign;
  };

  const filteredCategories = categories.filter(c => c.type === formData.type);

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Recurring Transactions</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Recurring
        </button>
      </div>

      {recurringTransactions.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <Repeat className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No recurring transactions</p>
          <p className="text-gray-400 text-sm">Set up automatic bills or income</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {recurringTransactions.map(recurring => {
            const category = categories.find(c => c.id === recurring.categoryId);
            if (!category) return null;

            const Icon = getIconComponent(category.icon);

            return (
              <div
                key={recurring.id}
                className={`bg-white rounded-2xl p-6 shadow-sm border hover:shadow-md transition-shadow ${
                  recurring.isActive ? 'border-gray-100' : 'border-gray-200 opacity-60'
                }`}
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3 flex-1">
                    <div
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: category.color }} />
                    </div>
                    <div className="min-w-0 flex-1">
                      <h3 className="font-semibold text-gray-900 truncate">{category.name}</h3>
                      <p className="text-sm text-gray-500 truncate">{recurring.description}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Delete this recurring transaction?')) {
                        deleteRecurringTransaction(recurring.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Amount</span>
                    <span
                      className={`font-semibold ${
                        recurring.type === 'income' ? 'text-green-600' : 'text-red-600'
                      }`}
                    >
                      {recurring.type === 'income' ? '+' : '-'}
                      {formatCurrency(recurring.amount, currency)}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Frequency</span>
                    <span className="text-sm font-medium text-gray-900 capitalize">
                      {recurring.frequency}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Next Date</span>
                    <span className="text-sm font-medium text-gray-900">
                      {new Date(recurring.nextOccurrence).toLocaleDateString()}
                    </span>
                  </div>

                  {recurring.endDate && (
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Ends</span>
                      <span className="text-sm font-medium text-gray-900">
                        {new Date(recurring.endDate).toLocaleDateString()}
                      </span>
                    </div>
                  )}

                  <div className="pt-3 border-t border-gray-100">
                    <button
                      onClick={() => toggleActive(recurring.id, recurring.isActive)}
                      className={`w-full py-2 px-4 rounded-xl font-medium transition-all flex items-center justify-center gap-2 ${
                        recurring.isActive
                          ? 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                          : 'bg-green-50 text-green-600 hover:bg-green-100'
                      }`}
                    >
                      {recurring.isActive ? (
                        <>
                          <Pause className="w-4 h-4" />
                          Pause
                        </>
                      ) : (
                        <>
                          <Play className="w-4 h-4" />
                          Resume
                        </>
                      )}
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
            <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Add Recurring Transaction</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-3">Type</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'expense', categoryId: '' })}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      formData.type === 'expense'
                        ? 'bg-red-50 text-red-600 border-2 border-red-200'
                        : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    Expense
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, type: 'income', categoryId: '' })}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      formData.type === 'income'
                        ? 'bg-green-50 text-green-600 border-2 border-green-200'
                        : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    Income
                  </button>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Amount</label>
                <input
                  type="number"
                  step="0.01"
                  required
                  value={formData.amount}
                  onChange={(e) => setFormData({ ...formData, amount: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                  placeholder="0.00"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select a category</option>
                  {filteredCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Frequency</label>
                <select
                  value={formData.frequency}
                  onChange={(e) => setFormData({ ...formData, frequency: e.target.value as Frequency })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="daily">Daily</option>
                  <option value="weekly">Weekly</option>
                  <option value="monthly">Monthly</option>
                  <option value="yearly">Yearly</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Start Date</label>
                <input
                  type="date"
                  required
                  value={formData.startDate}
                  onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">End Date (Optional)</label>
                <input
                  type="date"
                  value={formData.endDate}
                  onChange={(e) => setFormData({ ...formData, endDate: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Payment Method</label>
                <select
                  value={formData.paymentMethod}
                  onChange={(e) => setFormData({ ...formData, paymentMethod: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="cash">Cash</option>
                  <option value="credit-card">Credit Card</option>
                  <option value="debit-card">Debit Card</option>
                  <option value="bank-transfer">Bank Transfer</option>
                  <option value="digital-wallet">Digital Wallet</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Description</label>
                <textarea
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all resize-none"
                  rows={3}
                  placeholder="Add a note..."
                />
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Add Recurring Transaction
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
