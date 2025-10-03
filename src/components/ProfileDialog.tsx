import React, { useState } from 'react';
import { useAuth } from '../context/AuthContext';
import { User, LogOut } from 'lucide-react';

interface ProfileDialogProps {
  isOpen: boolean;
  onClose: () => void;
}

export const ProfileDialog: React.FC<ProfileDialogProps> = ({ isOpen, onClose }) => {
  const { user, signOut } = useAuth();
  const [loading, setLoading] = useState(false);

  if (!isOpen || !user) return null;

  const handleSignOut = async () => {
    setLoading(true);
    try {
      await signOut();
      onClose();
    } catch (error) {
      console.error('Error signing out:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="absolute right-0 top-12 z-50">
      <div className="bg-white rounded-xl shadow-lg border border-gray-200 min-w-48 py-2">
        <div className="px-4 py-3 border-b border-gray-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
              <User className="w-5 h-5 text-white" />
            </div>
            <div className="min-w-0 flex-1">
              <p className="text-sm font-medium text-gray-900 truncate">
                {user.user_metadata?.full_name || 'User'}
              </p>
              <p className="text-xs text-gray-500 truncate">{user.email}</p>
            </div>
          </div>
        </div>

        <div className="py-2">
          <button
            onClick={handleSignOut}
            disabled={loading}
            className="w-full px-4 py-2 text-red-600 hover:bg-red-50 hover:text-red-700 text-sm font-medium flex items-center gap-2 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? (
              <div className="w-4 h-4 border-2 border-red-600 border-t-transparent rounded-full animate-spin" />
            ) : (
              <LogOut className="w-4 h-4" />
            )}
            Sign Out
          </button>
        </div>
      </div>
    </div>
  );
};
