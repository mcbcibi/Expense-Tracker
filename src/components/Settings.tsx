import React, { useState, useEffect } from 'react';
import { Download, Settings as SettingsIcon, Globe, Tag, Plus, X, Edit2, Save, Trash2 } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { Category } from '../types';
import { currencies } from '../utils/currencies';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

// Available icons for categories
const availableIcons = [
  'Utensils', 'Car', 'ShoppingBag', 'Receipt', 'Film', 'Heart', 'GraduationCap',
  'Sparkles', 'Home', 'MoreHorizontal', 'Briefcase', 'Laptop', 'TrendingUp',
  'Gift', 'PlusCircle', 'Coffee', 'Phone', 'Plane', 'Hotel', 'Book', 'Music',
  'Gamepad2', 'Palette', 'Bike', 'Bus', 'Train', 'Ship', 'Camera', 'Headphones'
];

const colorOptions = [
  '#ef4444', '#f97316', '#f59e0b', '#eab308', '#84cc16', '#22c55e',
  '#10b981', '#14b8a6', '#06b6d4', '#0ea5e9', '#3b82f6', '#6366f1',
  '#8b5cf6', '#a855f7', '#d946ef', '#ec4899', '#f43f5e', '#64748b'
];

const getIconComponent = (iconName: string) => {
  return React.createElement('span', { className: 'w-5 h-5 inline-block text-center' }, iconName.substring(0,1));
};

export const Settings: React.FC = () => {
  const { transactions, categories, currency, setCurrency, addCategory, updateCategory, deleteCategory } = useApp();
  const [showForm, setShowForm] = useState(false);
  const [editingId, setEditingId] = useState<string | null>(null);
  const [formData, setFormData] = useState({
    name: '',
    type: 'expense' as 'expense' | 'income',
    icon: 'MoreHorizontal',
    color: '#64748b'
  });

  const resetForm = () => {
    setFormData({ name: '', type: 'expense', icon: 'MoreHorizontal', color: '#64748b' });
    setEditingId(null);
    setShowForm(false);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!formData.name.trim()) return;

    try {
      if (editingId) {
        await updateCategory(editingId, formData);
      } else {
        await addCategory(formData);
      }
      resetForm();
    } catch (error) {
      console.error('Error saving category:', error);
    }
  };

  const handleEdit = (category: Category) => {
    setEditingId(category.id);
    setFormData({
      name: category.name,
      type: category.type as 'expense' | 'income',
      icon: category.icon,
      color: category.color
    });
    setShowForm(true);
  };

  const handleDelete = async (id: string) => {
    if (confirm('Are you sure you want to delete this category?')) {
      try {
        await deleteCategory(id);
      } catch (error) {
        console.error('Error deleting category:', error);
      }
    }
  };

  const handleExportCSV = () => {
    exportToCSV(transactions, categories);
  };

  const handleExportPDF = () => {
    exportToPDF(transactions, categories, currency);
  };

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold text-gray-900">Settings</h2>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-50 rounded-lg">
              <Globe className="w-5 h-5 text-blue-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Currency</h3>
              <p className="text-sm text-gray-500">Select your default currency</p>
            </div>
          </div>

          <div className="flex gap-3">
            <select
              value={currency}
              onChange={(e) => setCurrency(e.target.value)}
              className="flex-1 px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
            >
              {currencies.map(curr => (
                <option key={curr.code} value={curr.code}>
                  {curr.symbol} - {curr.name} ({curr.code})
                </option>
              ))}
            </select>
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        <div>
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-green-50 rounded-lg">
              <Download className="w-5 h-5 text-green-600" />
            </div>
            <div>
              <h3 className="font-semibold text-gray-900">Export Data</h3>
              <p className="text-sm text-gray-500">Download your transaction history</p>
            </div>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <button
              onClick={handleExportCSV}
              disabled={transactions.length === 0}
              className="px-4 py-3 bg-green-50 text-green-600 rounded-xl font-medium hover:bg-green-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export as CSV
            </button>
            <button
              onClick={handleExportPDF}
              disabled={transactions.length === 0}
              className="px-4 py-3 bg-blue-50 text-blue-600 rounded-xl font-medium hover:bg-blue-100 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
            >
              Export as PDF
            </button>
          </div>

          {transactions.length === 0 && (
            <p className="text-sm text-gray-400 mt-2 text-center">
              No transactions to export
            </p>
          )}
        </div>
      </div>

      {/* Category Manager Section */}
      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 space-y-6">
        <div>
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-purple-50 rounded-lg">
                <Tag className="w-5 h-5 text-purple-600" />
              </div>
              <div>
                <h3 className="font-semibold text-gray-900">Categories</h3>
                <p className="text-sm text-gray-500">Manage your expense and income categories</p>
              </div>
            </div>
            <button
              onClick={() => setShowForm(true)}
              className="bg-purple-600 text-white px-4 py-2 rounded-lg hover:bg-purple-700 transition-colors flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Add Category
            </button>
          </div>

          {/* Categories Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mb-6">
            {categories.map((category) => (
              <div key={category.id} className="bg-gray-50 rounded-lg p-4 border border-gray-200 hover:shadow-sm transition-shadow">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div
                      className="w-8 h-8 rounded-full flex items-center justify-center text-white text-sm font-medium"
                      style={{ backgroundColor: category.color }}
                    >
                      {getIconComponent(category.icon)}
                    </div>
                    <div>
                      <h3 className="font-medium text-gray-900">{category.name}</h3>
                      <p className="text-sm text-gray-500 capitalize">{category.type}</p>
                    </div>
                  </div>
                  {!category.isDefault && (
                    <div className="flex gap-2">
                      <button
                        onClick={() => handleEdit(category)}
                        className="p-1 text-gray-400 hover:text-blue-500 transition-colors"
                      >
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button
                        onClick={() => handleDelete(category.id)}
                        className="p-1 text-gray-400 hover:text-red-500 transition-colors"
                      >
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </div>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>

      <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100">
        <div className="flex items-center gap-3 mb-4">
          <div className="p-2 bg-gray-50 rounded-lg">
            <SettingsIcon className="w-5 h-5 text-gray-600" />
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">About</h3>
            <p className="text-sm text-gray-500">Expense Tracker v1.0</p>
          </div>
        </div>

        <div className="text-sm text-gray-600 space-y-2">
          <p>A modern expense tracking application with budgeting and analytics.</p>
          <p className="text-xs text-gray-400 mt-4">
            Data is stored in Supabase cloud database.
          </p>
        </div>
      </div>

      {/* Custom Category Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-2xl max-w-sm w-full">
            <div className="p-6 border-b border-gray-100">
              <div className="flex items-center justify-between">
                <h3 className="text-lg font-bold text-gray-900 flex items-center gap-2">
                  <Tag className="w-5 h-5" />
                  {editingId ? 'Edit Category' : 'Create Custom Category'}
                </h3>
                <button
                  onClick={resetForm}
                  className="text-gray-400 hover:text-gray-600"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="p-6 space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Category Name
                </label>
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
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
                      checked={formData.type === 'expense'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'expense' })}
                      className="mr-1"
                    />
                    Expense
                  </label>
                  <label className="flex items-center">
                    <input
                      type="radio"
                      name="customType"
                      value="income"
                      checked={formData.type === 'income'}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as 'income' })}
                      className="mr-1"
                    />
                    Income
                  </label>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Icon (Preview: {getIconComponent(formData.icon)})
                </label>
                <select
                  value={formData.icon}
                  onChange={(e) => setFormData({ ...formData, icon: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  {availableIcons.map((icon) => (
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
                      onClick={() => setFormData({ ...formData, color })}
                      className={`w-8 h-8 rounded-full border-2 transition-all ${
                        formData.color === color ? 'border-gray-900' : 'border-gray-200'
                      }`}
                      style={{ backgroundColor: color }}
                    />
                  ))}
                </div>
              </div>

              <div className="flex gap-3 pt-4">
                <button
                  type="submit"
                  disabled={!formData.name.trim()}
                  className="flex-1 bg-purple-600 text-white py-2 px-4 rounded-lg hover:bg-purple-700 transition-colors flex items-center justify-center gap-2 disabled:bg-gray-400"
                >
                  <Save className="w-4 h-4" />
                  {editingId ? 'Update' : 'Save'} Category
                </button>
                <button
                  type="button"
                  onClick={resetForm}
                  className="px-4 py-2 border border-gray-300 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors"
                >
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
};
