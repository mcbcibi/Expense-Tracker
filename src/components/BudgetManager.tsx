import React, { useState, useMemo } from 'react';
import { Plus, X, Target, TrendingUp, AlertTriangle } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currencies';
import { Budget, BudgetPeriod } from '../types';
import * as Icons from 'lucide-react';

export const BudgetManager: React.FC = () => {
  const { budgets, categories, transactions, currency, addBudget, deleteBudget } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [formData, setFormData] = useState({
    categoryId: '',
    amount: '',
    period: 'monthly' as BudgetPeriod,
  });

  const budgetProgress = useMemo(() => {
    return budgets.map(budget => {
      const category = categories.find(c => c.id === budget.categoryId);
      const startDate = new Date(budget.startDate);
      const endDate = new Date(budget.endDate);

      const spent = transactions
        .filter(t => {
          const tDate = new Date(t.transactionDate);
          return (
            t.categoryId === budget.categoryId &&
            t.type === 'expense' &&
            tDate >= startDate &&
            tDate <= endDate
          );
        })
        .reduce((sum, t) => sum + t.amount, 0);

      const percentage = (spent / budget.amount) * 100;
      const remaining = budget.amount - spent;

      let status: 'good' | 'warning' | 'exceeded';
      if (percentage < 75) {
        status = 'good';
      } else if (percentage < 100) {
        status = 'warning';
      } else {
        status = 'exceeded';
      }

      return {
        budget,
        category,
        spent,
        percentage,
        remaining,
        status,
      };
    });
  }, [budgets, categories, transactions]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.categoryId || !formData.amount) return;

    const today = new Date();
    let endDate = new Date(today);

    if (formData.period === 'weekly') {
      endDate.setDate(endDate.getDate() + 7);
    } else {
      endDate.setMonth(endDate.getMonth() + 1);
    }

    addBudget({
      categoryId: formData.categoryId,
      amount: parseFloat(formData.amount),
      period: formData.period,
      startDate: today.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      currency,
    });

    setFormData({ categoryId: '', amount: '', period: 'monthly' });
    setShowForm(false);
  };

  const getIconComponent = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon || Icons.DollarSign;
  };

  const expenseCategories = categories.filter(c => c.type === 'expense');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold text-gray-900">Budget Management</h2>
        <button
          onClick={() => setShowForm(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Budget
        </button>
      </div>

      {budgetProgress.length === 0 ? (
        <div className="bg-white rounded-2xl p-12 shadow-sm border border-gray-100 text-center">
          <Target className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <p className="text-gray-500 text-lg mb-2">No budgets set yet</p>
          <p className="text-gray-400 text-sm">Create budgets to track your spending</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {budgetProgress.map(({ budget, category, spent, percentage, remaining, status }) => {
            if (!category) return null;

            const Icon = getIconComponent(category.icon);
            const statusColors = {
              good: { bg: 'bg-green-50', text: 'text-green-600', bar: 'bg-green-500', icon: TrendingUp },
              warning: { bg: 'bg-yellow-50', text: 'text-yellow-600', bar: 'bg-yellow-500', icon: AlertTriangle },
              exceeded: { bg: 'bg-red-50', text: 'text-red-600', bar: 'bg-red-500', icon: AlertTriangle },
            };

            const colors = statusColors[status];
            const StatusIcon = colors.icon;

            return (
              <div
                key={budget.id}
                className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow"
              >
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div
                      className="p-3 rounded-xl"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <Icon className="w-5 h-5" style={{ color: category.color }} />
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{budget.period}</p>
                    </div>
                  </div>

                  <button
                    onClick={() => {
                      if (confirm('Delete this budget?')) {
                        deleteBudget(budget.id);
                      }
                    }}
                    className="p-2 text-gray-400 hover:text-red-500 hover:bg-red-50 rounded-lg transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-gray-600">Spent</span>
                    <span className="font-semibold text-gray-900">
                      {formatCurrency(spent, currency)}
                    </span>
                  </div>

                  <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className={`absolute top-0 left-0 h-full ${colors.bar} transition-all`}
                      style={{ width: `${Math.min(percentage, 100)}%` }}
                    />
                  </div>

                  <div className="flex items-center justify-between">
                    <div className={`flex items-center gap-2 px-3 py-1 rounded-lg ${colors.bg}`}>
                      <StatusIcon className={`w-4 h-4 ${colors.text}`} />
                      <span className={`text-sm font-medium ${colors.text}`}>
                        {percentage.toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-right">
                      <p className="text-sm text-gray-600">
                        {remaining >= 0 ? 'Remaining' : 'Over budget'}
                      </p>
                      <p className={`font-semibold ${remaining >= 0 ? 'text-gray-900' : 'text-red-600'}`}>
                        {formatCurrency(Math.abs(remaining), currency)}
                      </p>
                    </div>
                  </div>

                  <div className="pt-3 border-t border-gray-100 text-sm text-gray-500">
                    Budget: {formatCurrency(budget.amount, currency)}
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}

      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-md w-full">
            <div className="border-b border-gray-100 p-6 flex items-center justify-between">
              <h2 className="text-2xl font-bold text-gray-900">Create Budget</h2>
              <button
                onClick={() => setShowForm(false)}
                className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
              >
                <X className="w-5 h-5 text-gray-500" />
              </button>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-6">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
                <select
                  required
                  value={formData.categoryId}
                  onChange={(e) => setFormData({ ...formData, categoryId: e.target.value })}
                  className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
                >
                  <option value="">Select a category</option>
                  {expenseCategories.map(cat => (
                    <option key={cat.id} value={cat.id}>
                      {cat.name}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">Budget Amount</label>
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
                <label className="block text-sm font-medium text-gray-700 mb-3">Period</label>
                <div className="grid grid-cols-2 gap-3">
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, period: 'weekly' })}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      formData.period === 'weekly'
                        ? 'bg-blue-50 text-blue-600 border-2 border-blue-200'
                        : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    Weekly
                  </button>
                  <button
                    type="button"
                    onClick={() => setFormData({ ...formData, period: 'monthly' })}
                    className={`py-3 px-4 rounded-xl font-medium transition-all ${
                      formData.period === 'monthly'
                        ? 'bg-blue-50 text-blue-600 border-2 border-blue-200'
                        : 'bg-gray-50 text-gray-600 border-2 border-transparent hover:bg-gray-100'
                    }`}
                  >
                    Monthly
                  </button>
                </div>
              </div>

              <button
                type="submit"
                className="w-full bg-blue-600 text-white py-3 px-4 rounded-xl font-medium hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
              >
                <Plus className="w-5 h-5" />
                Create Budget
              </button>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
