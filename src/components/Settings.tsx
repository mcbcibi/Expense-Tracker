import React from 'react';
import { Download, Settings as SettingsIcon, Globe } from 'lucide-react';
import { useApp } from '../context/AppContext';
import { currencies } from '../utils/currencies';
import { exportToCSV, exportToPDF } from '../utils/exportUtils';

export const Settings: React.FC = () => {
  const { transactions, categories, currency, setCurrency } = useApp();

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

          <select
            value={currency}
            onChange={(e) => setCurrency(e.target.value)}
            className="w-full px-4 py-3 border border-gray-200 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-transparent outline-none transition-all"
          >
            {currencies.map(curr => (
              <option key={curr.code} value={curr.code}>
                {curr.symbol} - {curr.name} ({curr.code})
              </option>
            ))}
          </select>
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
            Data is stored locally in your browser.
          </p>
        </div>
      </div>
    </div>
  );
};
