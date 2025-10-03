import React, { useState } from 'react';
import { AppProvider } from './context/AppContext';
import { AuthProvider, useAuth } from './context/AuthContext';
import { Auth } from './components/Auth';
import { ProfileDialog } from './components/ProfileDialog';
import { Dashboard } from './components/Dashboard';
import { TransactionForm } from './components/TransactionForm';
import { TransactionList } from './components/TransactionList';
import { Charts } from './components/Charts';
import { BudgetManager } from './components/BudgetManager';
import { RecurringTransactions } from './components/RecurringTransactions';
import { Settings } from './components/Settings';
import {
  Plus,
  LayoutDashboard,
  List,
  BarChart3,
  Target,
  Repeat,
  Settings as SettingsIcon,
  Wallet,
  User,
  LogOut
} from 'lucide-react';

type Tab = 'dashboard' | 'transactions' | 'analytics' | 'budgets' | 'recurring' | 'settings';

function AppContent() {
  const [activeTab, setActiveTab] = useState<Tab>('dashboard');
  const [showTransactionForm, setShowTransactionForm] = useState(false);
  const [showProfileDropdown, setShowProfileDropdown] = useState(false);
  const { user, signOut } = useAuth();

  const tabs = [
    { id: 'dashboard' as Tab, label: 'Dashboard', icon: LayoutDashboard },
    { id: 'transactions' as Tab, label: 'Transactions', icon: List },
    { id: 'analytics' as Tab, label: 'Analytics', icon: BarChart3 },
    { id: 'budgets' as Tab, label: 'Budgets', icon: Target },
    { id: 'recurring' as Tab, label: 'Recurring', icon: Repeat },
    { id: 'settings' as Tab, label: 'Settings', icon: SettingsIcon },
  ];

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <header className="mb-8">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-3 bg-gradient-to-br from-blue-600 to-blue-700 rounded-2xl shadow-lg">
                <Wallet className="w-8 h-8 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900">Expense Tracker</h1>
                <p className="text-gray-500">Manage your finances with ease</p>
              </div>
            </div>

            <div className="relative">
              <button
                onClick={() => setShowProfileDropdown(true)}
                className="p-2 rounded-xl hover:bg-gray-100 transition-colors"
              >
                <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                  <User className="w-5 h-5 text-white" />
                </div>
              </button>

              {showProfileDropdown && (
                <div className="absolute right-0 top-12 z-50">
                  <div className="bg-white rounded-xl shadow-lg border border-gray-200 min-w-48 p-2">
                    <div className="px-3 py-3 border-b border-gray-100">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                          <User className="w-5 h-5 text-white" />
                        </div>
                        <div className="min-w-0 flex-1">
                          <p className="text-sm font-medium text-gray-900 truncate">
                            {user?.user_metadata?.full_name || 'User'}
                          </p>
                          <p className="text-xs text-gray-500 truncate">{user?.email}</p>
                        </div>
                      </div>
                    </div>

                    <div className="px-2 py-2">
                      <button
                        onClick={async () => {
                          try {
                            await signOut();
                            setShowProfileDropdown(false);
                          } catch (error) {
                            console.error('Error signing out:', error);
                          }
                        }}
                        className="w-full px-3 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 text-sm font-medium flex items-center gap-2 transition-colors rounded-lg"
                      >
                        <LogOut className="w-4 h-4" />
                        Sign Out
                      </button>
                    </div>
                  </div>

                  {/* Click outside to close */}
                  <div
                    className="fixed inset-0 z-40"
                    onClick={() => setShowProfileDropdown(false)}
                  />
                </div>
              )}
            </div>
          </div>

          <div className="flex justify-end mt-4">
            <button
              onClick={() => setShowTransactionForm(true)}
              className="bg-blue-600 text-white px-6 py-3 rounded-xl font-medium hover:bg-blue-700 transition-all shadow-lg hover:shadow-xl flex items-center gap-2"
            >
              <Plus className="w-5 h-5" />
              <span className="hidden sm:inline">Add Transaction</span>
            </button>
          </div>
        </header>

        <nav className="mb-8">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  className={`flex flex-col items-center gap-3 p-6 rounded-2xl shadow-sm border transition-all hover:shadow-md ${
                    activeTab === tab.id
                      ? 'bg-blue-600 text-white border-blue-600 shadow-lg ring-2 ring-blue-200'
                      : 'bg-white border-gray-200 text-gray-700 hover:bg-gray-50 hover:border-gray-300 hover:shadow-md'
                  }`}
                >
                  <Icon className={`w-8 h-8 ${activeTab === tab.id ? 'text-white' : 'text-gray-600'}`} />
                  <span className={`text-sm font-medium text-center ${activeTab === tab.id ? 'text-white' : 'text-gray-700'}`}>{tab.label}</span>
                </button>
              );
            })}
          </div>
        </nav>

        <main>
          {activeTab === 'dashboard' && <Dashboard />}
          {activeTab === 'transactions' && <TransactionList />}
          {activeTab === 'analytics' && <Charts />}
          {activeTab === 'budgets' && <BudgetManager />}
          {activeTab === 'recurring' && <RecurringTransactions />}
          {activeTab === 'settings' && <Settings />}
        </main>

        {showTransactionForm && (
          <TransactionForm onClose={() => setShowTransactionForm(false)} />
        )}


      </div>
    </div>
  );
}

function AuthenticatedApp() {
  return (
    <AppProvider>
      <AppContent />
    </AppProvider>
  );
}

function App() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading...</p>
        </div>
      </div>
    );
  }

  return user ? <AuthenticatedApp /> : <Auth />;
}

function AppWithAuth() {
  return (
    <AuthProvider>
      <App />
    </AuthProvider>
  );
}

export default AppWithAuth;
