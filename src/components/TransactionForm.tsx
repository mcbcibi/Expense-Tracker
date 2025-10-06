import React, { useState, useEffect } from 'react';
import { X, Plus, Tag, X as Close, Edit2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { TransactionType, Category, Transaction } from '../types';

interface TransactionFormProps {
  onClose: () => void;
  transaction?: Transaction;
  isEdit?: boolean;
}

export const TransactionForm: React.FC<TransactionFormProps> = ({ onClose, transaction, isEdit = false }) => {
  const { addTransaction, updateTransaction, categories, currency, addCategory } = useApp();
  const [formData, setFormData] = useState({
    type: 'expense' as TransactionType,
    amount: '',
    categoryId: '',
    description: '',
    paymentMethod: 'cash',
    transactionDate: new Date().toISOString().split('T')[0],
  });

  useEffect(() => {
    if (isEdit && transaction) {
      setFormData({
        type: transaction.type,
        amount: transaction.amount.toString(),
        categoryId: transaction.categoryId,
        description: transaction.description || '',
        paymentMethod: transaction.paymentMethod || 'cash',
        transactionDate: transaction.transactionDate,
      });
    }
  }, [isEdit, transaction]);

  const [showCustomCategoryForm, setShowCustomCategoryForm] = useState(false);
  const [customCategoryData, setCustomCategoryData] = useState({
    name: '',
    type: 'expense' as 'expense' | 'income',
    icon: 'MoreHorizontal',
    color: '#64748b'
  });

  const colorOptions = [
    '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
    '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
    '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b'
  ];

  const averageIconOptions = [
    'Utensils', 'Car', 'ShoppingBag', 'Receipt', 'Film', 'Heart', 'GraduationCap',
    'Sparkles', 'Home', 'MoreHorizontal', 'Briefcase', 'Laptop', 'TrendingUp',
    'Gift', 'PlusCircle', 'Coffee', 'Phone', 'Plane', 'Hotel', 'Book', 'Music',
    'Gamepad2', 'Palette', 'Bike', 'Bus', 'Train', 'Ship', 'Camera', 'Headphones'
  ];

  const getIconComponent = (iconName: string) => {
    return React.createElement('span', { className: 'w-5 h-5 inline-block text-center' }, iconName.substring(0,1));
  };

  const handleSaveCustomCategory = async () => {
    if (!customCategoryData.name.trim()) return;

    try {
      await addCategory({
        name: customCategoryData.name,
        type: customCategoryData.type,
        icon: customCategoryData.icon,
        color: customCategoryData.color
      });

      // Refresh categories and select the newly created one
      const refreshedCategories = categories.filter(c => c.type === customCategoryData.type);
      const newCategory = refreshedCategories[refreshedCategories.length - 1]; // Get the last added category

      // Select the newly created category
      setFormData({
        ...formData,
        categoryId: newCategory?.id || '',
        type: customCategoryData.type as TransactionType
      });

      // Reset custom category form
      setCustomCategoryData({
        name: '',
        type: 'expense',
        icon: 'MoreHorizontal',
        color: '#64748b'
      });

      setShowCustomCategoryForm(false);
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  const filteredCategories = categories.filter(c => c.type === formData.type);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.amount || !formData.categoryId) return;

    if (isEdit && transaction) {
      updateTransaction(transaction.id, {
        type: formData.type,
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId,
        description: formData.description,
        paymentMethod: formData.paymentMethod,
        transactionDate: formData.transactionDate,
      });
    } else {
      addTransaction({
        type: formData.type,
        amount: parseFloat(formData.amount),
        categoryId: formData.categoryId,
        description: formData.description,
        paymentMethod: formData.paymentMethod,
        transactionDate: formData.transactionDate,
        createdAt: new Date().toISOString(),
        currency: 'INR',
      });
    }

    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-md w-full max-h-[90vh] overflow-y-auto">
        <div className="sticky top-0 bg-white border-b border-gray-100 p-6 flex items-center justify-between">
          <h2 className="text-2xl font-bold text-gray-900">{isEdit ? 'Edit Transaction' : 'Add Transaction'}</h2>
          <button
            onClick={onClose}
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
            <div className="flex gap-2 mt-2">
              {[10, 100, 500, 1000].map(amount => (
                <button
                  key={amount}
                  type="button"
                  onClick={() => setFormData({
                    ...formData,
                    amount: String((parseFloat(formData.amount) || 0) + amount)
                  })}
                  className="px-3 py-1 text-sm bg-gray-100 hover:bg-gray-200 text-gray-700 rounded-lg transition-colors"
                >
                  +{amount}
                </button>
              ))}
              <button
                type="button"
                onClick={() => setFormData({ ...formData, amount: '' })}
                className="px-3 py-1 text-sm bg-red-100 hover:bg-red-200 text-red-700 rounded-lg transition-colors"
              >
                Clear
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Category</label>
            <select
              required
              value={formData.categoryId}
              onChange={(e) => {
                if (e.target.value === 'custom') {
                  setShowCustomCategoryForm(true);
                  setFormData({ ...formData, categoryId: '' });
                } else {
                  setFormData({ ...formData, categoryId: e.target.value });
                }
              }}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              <option value="">Select a category</option>
              {filteredCategories.map(cat => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
              <option value="custom" className="font-semibold">+ Custom Payment Category</option>
            </select>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">Date</label>
            <input
              type="date"
              required
              value={formData.transactionDate}
              onChange={(e) => setFormData({ ...formData, transactionDate: e.target.value })}
              className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            />
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
            {isEdit ? <Edit2 className="w-5 h-5" /> : <Plus className="w-5 h-5" />}
            {isEdit ? 'Update Transaction' : 'Add Transaction'}
          </button>
        </form>
      </div>

      {/* Custom Category Form Modal */}
      {showCustomCategoryForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  Create Custom Category
                </h3>
                <button
                  onClick={() => setShowCustomCategoryForm(false)}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <Close className="w-5 h-5" />
                </button>
              </div>
            </div>

            <div className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={customCategoryData.name}
                  onChange={(e) => setCustomCategoryData({ ...customCategoryData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  placeholder="Enter category name"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Type
                </label>
                <div className="flex gap-2">
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="customType"
                      value="expense"
                      checked={customCategoryData.type === 'expense'}
                      onChange={(e) => setCustomCategoryData({ ...customCategoryData, type: e.target.value as 'expense' })}
                      className="mr-1"
                    />
                    Expense
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="customType"
                      value="income"
                      checked={customCategoryData.type === 'income'}
                      onChange={(e) => setCustomCategoryData({ ...customCategoryData, type: e.target.value as 'income' })}
                      className="mr-1"
                    />
                    Income
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon (Preview: {getIconComponent(customCategoryData.icon)})
                </label>
                <select
                  value={customCategoryData.icon}
                  onChange={(e) => setCustomCategoryData({ ...customCategoryData, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                >
                  {averageIconOptions.map((icon) => (
                    <option key={icon} value={icon}>{icon}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Color
                </label>
                <div className="grid grid-cols-6 gap-1">
                  {colorOptions.slice(0, 12).map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setCustomCategoryData({ ...customCategoryData, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        customCategoryData.color === color ? 'border-gray-900' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="button"
                  onClick={handleSaveCustomCategory}
                  disabled={!customCategoryData.name.trim()}
                  className="flex-1 bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
                >
                  <Plus className="w-4 h-4" />
                  Save & Select Category
                </button>
                <button
                  type="button"
                  onClick={() => setShowCustomCategoryForm(false)}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
