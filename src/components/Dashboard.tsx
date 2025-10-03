import React, { useMemo, useState } from 'react';
import {
  TrendingUp,
  TrendingDown,
  Wallet,
  ArrowUpRight,
  ArrowDownRight,
  PieChart,
  Target,
  CreditCard,
  Plus,
  Activity,
  GripVertical
} from 'lucide-react';
import { useApp } from '../context/AppContext';
import { formatCurrency } from '../utils/currencies';

type DashboardCardType =
  | 'balance'
  | 'income'
  | 'expenses'
  | 'budget-progress'
  | 'spending-by-category'
  | 'monthly-comparison'
  | 'recent-transactions'
  | 'savings-goal';

interface DashboardCard {
  id: DashboardCardType;
  title: string;
  description: string;
  icon: React.ComponentType<any>;
  color: string;
  bgColor: string;
  defaultEnabled: boolean;
}

const availableCards: DashboardCard[] = [
  {
    id: 'balance',
    title: 'Total Balance',
    description: 'Current account balance overview',
    icon: Wallet,
    color: 'text-blue-600',
    bgColor: 'bg-blue-50',
    defaultEnabled: true,
  },
  {
    id: 'income',
    title: 'Total Income',
    description: 'Total earnings and monthly income',
    icon: TrendingUp,
    color: 'text-green-600',
    bgColor: 'bg-green-50',
    defaultEnabled: true,
  },
  {
    id: 'expenses',
    title: 'Total Expenses',
    description: 'Total spending and monthly expenses',
    icon: TrendingDown,
    color: 'text-red-600',
    bgColor: 'bg-red-50',
    defaultEnabled: true,
  },
  {
    id: 'budget-progress',
    title: 'Budget Progress',
    description: 'Track spending against budgets',
    icon: Target,
    color: 'text-purple-600',
    bgColor: 'bg-purple-50',
    defaultEnabled: false,
  },
  {
    id: 'spending-by-category',
    title: 'Spending by Category',
    description: 'Visual breakdown of expenses',
    icon: PieChart,
    color: 'text-orange-600',
    bgColor: 'bg-orange-50',
    defaultEnabled: false,
  },
  {
    id: 'monthly-comparison',
    title: 'Monthly Comparison',
    description: 'Income vs expenses over time',
    icon: Activity,
    color: 'text-indigo-600',
    bgColor: 'bg-indigo-50',
    defaultEnabled: false,
  },
  {
    id: 'recent-transactions',
    title: 'Recent Transactions',
    description: 'Latest financial activity',
    icon: CreditCard,
    color: 'text-gray-600',
    bgColor: 'bg-gray-50',
    defaultEnabled: false,
  },
];

const DashboardCardComponent: React.FC<{ card: DashboardCard; data: any }> = ({ card, data }) => {
  const { currency } = useApp();

  switch (card.id) {
    case 'balance':
      return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`${card.bgColor} p-3 rounded-xl`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <span className="text-sm font-medium text-gray-500">{card.title}</span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-gray-900">
              {formatCurrency(data.balance, currency)}
            </p>
            <p className="text-sm text-gray-500">
              {data.balance >= 0 ? 'Positive' : 'Negative'} balance
            </p>
          </div>
        </div>
      );

    case 'income':
      return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`${card.bgColor} p-3 rounded-xl`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <span className="text-sm font-medium text-gray-500">{card.title}</span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-green-600">
              {formatCurrency(data.income, currency)}
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <ArrowUpRight className="w-4 h-4 text-green-600" />
              {formatCurrency(data.monthlyIncome, currency)} this month
            </div>
          </div>
        </div>
      );

    case 'expenses':
      return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`${card.bgColor} p-3 rounded-xl`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <span className="text-sm font-medium text-gray-500">{card.title}</span>
          </div>
          <div className="space-y-1">
            <p className="text-3xl font-bold text-red-600">
              {formatCurrency(data.expenses, currency)}
            </p>
            <div className="flex items-center gap-1 text-sm text-gray-500">
              <ArrowDownRight className="w-4 h-4 text-red-600" />
              {formatCurrency(data.monthlyExpenses, currency)} this month
            </div>
          </div>
        </div>
      );

    case 'recent-transactions':
      const { transactions: recentTxns } = data;
      return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`${card.bgColor} p-3 rounded-xl`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <span className="text-sm font-medium text-gray-500">{card.title}</span>
          </div>
          <div className="space-y-3">
            {recentTxns.length === 0 ? (
              <p className="text-center text-gray-500 text-sm">No recent transactions</p>
            ) : (
              recentTxns.map((txn: any) => {
                const category = data.categories.find((cat: any) => cat.id === txn.categoryId);
                return (
                  <div key={txn.id} className="flex items-center justify-between py-2 border-b border-gray-50 last:border-0">
                    <div className="flex-1">
                      <p className="text-sm font-medium text-gray-900">{txn.description || category?.name || 'Untitled'}</p>
                      <p className="text-xs text-gray-500">
                        {new Date(txn.transactionDate).toLocaleDateString('en-US', {
                          month: 'short',
                          day: 'numeric',
                          year: 'numeric'
                        })}
                      </p>
                    </div>
                    <div className="text-right">
                      <p className={`text-sm font-semibold ${txn.type === 'income' ? 'text-green-600' : 'text-red-600'}`}>
                        {txn.type === 'income' ? '+' : '-'}{formatCurrency(txn.amount, currency)}
                      </p>
                      <p className="text-xs text-gray-500 capitalize">{category?.name || 'N/A'}</p>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </div>
      );

    default:
      return (
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-gray-100 hover:shadow-md transition-shadow">
          <div className="flex items-center justify-between mb-4">
            <div className={`${card.bgColor} p-3 rounded-xl`}>
              <card.icon className={`w-6 h-6 ${card.color}`} />
            </div>
            <span className="text-sm font-medium text-gray-500">{card.title}</span>
          </div>
          <div className="text-center text-gray-500">
            <p>Coming Soon</p>
            <p className="text-sm mt-1">{card.description}</p>
          </div>
        </div>
      );
  }
};

const AddCardModal: React.FC<{
  isOpen: boolean;
  onClose: () => void;
  onAddCard: (cardId: DashboardCardType) => void;
  enabledCards: DashboardCardType[];
}> = ({ isOpen, onClose, onAddCard, enabledCards }) => {
  if (!isOpen) return null;

  const availableToAdd = availableCards.filter(card => !enabledCards.includes(card.id));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[80vh] overflow-y-auto m-2">
        <div className="p-6 border-b border-gray-100">
          <div className="flex items-center justify-between">
            <h2 className="text-xl font-semibold text-gray-900">Add Dashboard Cards</h2>
            <button
              onClick={onClose}
              className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
            >
              <Plus className="w-5 h-5 text-gray-500 rotate-45" />
            </button>
          </div>
        </div>

        <div className="p-0">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-0 max-h-96 overflow-y-auto">
            {availableToAdd.map((card) => {
              const Icon = card.icon;
              return (
                <button
                  key={card.id}
                  onClick={() => onAddCard(card.id)}
                  className="flex items-center gap-4 p-6 border border-gray-200 hover:border-blue-300 hover:bg-blue-50 transition-all text-left border-l-0 border-r-0 border-t-0 last:border-b-0"
                >
                  <div className={`${card.bgColor} p-3 rounded-xl`}>
                    <Icon className={`w-6 h-6 ${card.color}`} />
                  </div>
                  <div className="flex-1">
                    <h3 className="font-medium text-gray-900">{card.title}</h3>
                    <p className="text-sm text-gray-500 line-clamp-2">{card.description}</p>
                  </div>
                </button>
              );
            })}
          </div>

          {availableToAdd.length === 0 && (
            <div className="text-center py-12 text-gray-500">
              <div className="mb-4">
                <PieChart className="w-12 h-12 text-gray-300 mx-auto" />
              </div>
              <p className="font-medium">All cards added!</p>
              <p className="text-sm mt-1">You've added all available dashboard cards.</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export const Dashboard: React.FC = () => {
  const { transactions, categories, currency } = useApp();
  const [enabledOptionalCards, setEnabledOptionalCards] = useState<DashboardCardType[]>([]);
  const [showAddCardModal, setShowAddCardModal] = useState(false);
  const [draggedCard, setDraggedCard] = useState<string | null>(null);

  // Fixed cards that are always shown
  const fixedCards: DashboardCardType[] = ['balance', 'income', 'expenses'];

  const summary = useMemo(() => {
    const income = transactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = transactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    const balance = income - expenses;

    return { income, expenses, balance };
  }, [transactions]);

  const currentMonth = new Date().getMonth();
  const currentYear = new Date().getFullYear();

  const monthlyData = useMemo(() => {
    const monthlyTransactions = transactions.filter(t => {
      const date = new Date(t.transactionDate);
      return date.getMonth() === currentMonth && date.getFullYear() === currentYear;
    });

    const income = monthlyTransactions
      .filter(t => t.type === 'income')
      .reduce((sum, t) => sum + t.amount, 0);

    const expenses = monthlyTransactions
      .filter(t => t.type === 'expense')
      .reduce((sum, t) => sum + t.amount, 0);

    return { income, expenses };
  }, [transactions, currentMonth, currentYear]);

  const recentTransactions = useMemo(() => {
    return [...transactions]
      .sort((a, b) => new Date(b.transactionDate).getTime() - new Date(a.transactionDate).getTime())
      .slice(0, 5);
  }, [transactions]);

  const cardData = {
    balance: summary.balance,
    income: summary.income,
    expenses: summary.expenses,
    monthlyIncome: monthlyData.income,
    monthlyExpenses: monthlyData.expenses,
    transactions: recentTransactions,
    categories: categories,
  };

  const handleAddCard = (cardId: DashboardCardType) => {
    setEnabledOptionalCards(prev => [...prev, cardId]);
    setShowAddCardModal(false);
  };

  const handleRemoveCard = (cardId: DashboardCardType) => {
    setEnabledOptionalCards(prev => prev.filter(id => id !== cardId));
  };

  const handleDragStart = (e: React.DragEvent, cardId: string) => {
    setDraggedCard(cardId);
    e.dataTransfer.effectAllowed = 'move';
    e.dataTransfer.setData('text/plain', cardId);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.dataTransfer.dropEffect = 'move';
  };

  const handleDrop = (e: React.DragEvent, targetCardId: string) => {
    e.preventDefault();

    const draggedCardId = e.dataTransfer.getData('text/plain');

    if (draggedCardId === targetCardId) {
      setDraggedCard(null);
      return;
    }

    const newCards = [...enabledOptionalCards];
    const draggedIndex = newCards.indexOf(draggedCardId as DashboardCardType);
    const targetIndex = newCards.indexOf(targetCardId as DashboardCardType);

    // Remove dragged item and insert at new position
    const [removed] = newCards.splice(draggedIndex, 1);
    newCards.splice(targetIndex, 0, removed);

    setEnabledOptionalCards(newCards);
    setDraggedCard(null);
  };

  const handleDragEnd = () => {
    setDraggedCard(null);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
        <button
          onClick={() => setShowAddCardModal(true)}
          className="bg-blue-600 text-white px-4 py-2 rounded-xl font-medium hover:bg-blue-700 transition-all flex items-center gap-2"
        >
          <Plus className="w-4 h-4" />
          Add Card
        </button>
      </div>

      {/* Fixed Essential Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {fixedCards.map(cardId => {
          const card = availableCards.find(c => c.id === cardId);
          if (!card) return null;

          return (
            <DashboardCardComponent key={cardId} card={card} data={cardData} />
          );
        })}
      </div>

      {/* Optional Cards Section */}
      {enabledOptionalCards.length > 0 && (
        <div className="space-y-4">
          <div className="border-t border-gray-200 pt-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Additional Insights</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {enabledOptionalCards.map(cardId => {
                const card = availableCards.find(c => c.id === cardId);
                if (!card) return null;

                const isBeingDragged = draggedCard === cardId;

                return (
                  <div
                    key={cardId}
                    draggable={enabledOptionalCards.length > 1}
                    onDragStart={(e) => handleDragStart(e, cardId)}
                    onDragOver={handleDragOver}
                    onDrop={(e) => handleDrop(e, cardId)}
                    onDragEnd={handleDragEnd}
                    className={`
                      relative group cursor-move
                      ${isBeingDragged ? 'opacity-50 scale-105' : ''}
                      ${enabledOptionalCards.length > 1 ? '' : 'cursor-default'}
                    `}
                  >
                    {/* Drag Handle */}
                    {enabledOptionalCards.length > 1 && (
                      <div className="absolute top-2 left-2 bg-white border border-gray-200 rounded-md p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-gray-50 z-10">
                        <GripVertical className="w-4 h-4 text-gray-500" />
                      </div>
                    )}

                    <DashboardCardComponent card={card} data={cardData} />

                    {/* Remove Button */}
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveCard(cardId);
                      }}
                      className="absolute top-2 right-2 bg-white border border-gray-200 rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm hover:bg-gray-50 z-10"
                      title="Remove card"
                    >
                      <Plus className="w-3 h-3 text-gray-500 rotate-45" />
                    </button>

                    {/* Drop Zone Indicator */}
                    {draggedCard && draggedCard !== cardId && (
                      <div className="absolute inset-0 border-2 border-dashed border-blue-300 rounded-2xl bg-blue-50 bg-opacity-50 pointer-events-none opacity-0 group-hover:opacity-100 transition-opacity" />
                    )}
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      )}

      <AddCardModal
        isOpen={showAddCardModal}
        onClose={() => setShowAddCardModal(false)}
        onAddCard={handleAddCard}
        enabledCards={[...fixedCards, ...enabledOptionalCards]}
      />
    </div>
  );
};
