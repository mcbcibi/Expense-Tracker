import React, { useMemo } from 'react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currencies';
import * as Icons from 'lucide-react';

export const Charts: React.FC = () => {
  const { transactions, categories, currency } = useApp();

  const monthlyData = useMemo(() => {
    const months = Array.from({ length: 6 }, (_, i) => {
      const date = new Date();
      date.setMonth(date.getMonth() - i);
      return date;
    }).reverse();

    return months.map(month => {
      const monthTransactions = transactions.filter(t => {
        const tDate = new Date(t.transactionDate);
        return tDate.getMonth() === month.getMonth() && tDate.getFullYear() === month.getFullYear();
      });

      const income = monthTransactions.filter(t => t.type === 'income').reduce((sum, t) => sum + t.amount, 0);
      const expenses = monthTransactions.filter(t => t.type === 'expense').reduce((sum, t) => sum + t.amount, 0);

      return {
        month: month.toLocaleDateString('en-US', { month: 'short' }),
        income,
        expenses,
      };
    });
  }, [transactions]);

  const categoryData = useMemo(() => {
    const expensesByCategory = categories
      .filter(c => c.type === 'expense')
      .map(category => {
        const amount = transactions
          .filter(t => t.categoryId === category.id && t.type === 'expense')
          .reduce((sum, t) => sum + t.amount, 0);

        return { category, amount };
      })
      .filter(item => item.amount > 0)
      .sort((a, b) => b.amount - a.amount);

    const total = expensesByCategory.reduce((sum, item) => sum + item.amount, 0);

    return expensesByCategory.map(item => ({
      ...item,
      percentage: total > 0 ? (item.amount / total) * 100 : 0,
    }));
  }, [transactions, categories]);

  const maxAmount = useMemo(() => {
    return Math.max(
      ...monthlyData.map(d => Math.max(d.income, d.expenses)),
      1
    );
  }, [monthlyData]);

  const getIconComponent = (iconName: string) => {
    const Icon = (Icons as any)[iconName];
    return Icon || Icons.DollarSign;
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Income vs Expenses (Last 6 Months)</h2>

        <div className="space-y-4">
          {monthlyData.map((data, index) => (
            <div key={index} className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="font-medium text-gray-700">{data.month}</span>
                <div className="flex gap-4">
                  <span className="text-green-600">{formatCurrency(data.income, currency)}</span>
                  <span className="text-red-600">{formatCurrency(data.expenses, currency)}</span>
                </div>
              </div>

              <div className="flex gap-2 h-8">
                <div className="flex-1 flex gap-1">
                  <div
                    className="bg-green-500 rounded-lg transition-all hover:bg-green-600"
                    style={{ width: `${(data.income / maxAmount) * 100}%` }}
                  />
                  <div
                    className="bg-red-500 rounded-lg transition-all hover:bg-red-600"
                    style={{ width: `${(data.expenses / maxAmount) * 100}%` }}
                  />
                </div>
              </div>
            </div>
          ))}
        </div>

        <div className="flex items-center justify-center gap-6 mt-6 pt-6 border-t border-gray-100">
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-green-500 rounded-full" />
            <span className="text-sm text-gray-600">Income</span>
          </div>
          <div className="flex items-center gap-2">
            <div className="w-3 h-3 bg-red-500 rounded-full" />
            <span className="text-sm text-gray-600">Expenses</span>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <h2 className="text-xl font-bold text-gray-900 mb-6">Expense by Category</h2>

        {categoryData.length === 0 ? (
          <div className="text-center py-12">
            <p className="text-gray-500">No expense data available</p>
          </div>
        ) : (
          <div className="space-y-4">
            {categoryData.map(({ category, amount, percentage }) => {
              const Icon = getIconComponent(category.icon);

              return (
                <div key={category.id} className="space-y-2">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div
                        className="p-2 rounded-lg"
                        style={{ backgroundColor: `${category.color}20` }}
                      >
                        <Icon className="w-4 h-4" style={{ color: category.color }} />
                      </div>
                      <span className="font-medium text-gray-700">{category.name}</span>
                    </div>
                    <div className="text-right">
                      <p className="font-semibold text-gray-900">{formatCurrency(amount, currency)}</p>
                      <p className="text-xs text-gray-500">{percentage.toFixed(1)}%</p>
                    </div>
                  </div>

                  <div className="relative h-2 bg-gray-100 rounded-full overflow-hidden">
                    <div
                      className="absolute top-0 left-0 h-full rounded-full transition-all"
                      style={{
                        width: `${percentage}%`,
                        backgroundColor: category.color,
                      }}
                    />
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
};
