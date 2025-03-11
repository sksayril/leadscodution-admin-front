import React, { useEffect, useState } from 'react';
import { Eye, RefreshCw } from 'lucide-react';
import UserDetailsModal from './UserDetailsModal';

interface User {
  userId: string;
  email: string;
}

interface UserDetails {
  userId: string;
  name: string;
  email: string;
  credits: number;
  totalPayments: number;
  payments: Payment[];
}

interface Payment {
  _id: string;
  userId: string;
  orderId: string;
  paymentId: string;
  amount: number;
  createdAt: string;
}

interface UsersListProps {
  token: string;
}

function UsersList({ token }: UsersListProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [selectedUser, setSelectedUser] = useState<UserDetails | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [loading, setLoading] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTooltip, setRefreshTooltip] = useState(false);

  useEffect(() => {
    fetchUsers();
  }, []);

  const fetchUsers = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('https://api.leadtech.solutions/api/data/admin/getusers', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminToken: token }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch users');
      }

      const data = await response.json();
      setUsers(data.users);
      
      // Show success feedback
      if (!loading) {
        setRefreshTooltip(true);
        setTimeout(() => setRefreshTooltip(false), 2000);
      }
      
    } catch (error) {
      console.error('Error fetching users:', error);
    } finally {
      setLoading(false);
      setIsRefreshing(false);
    }
  };

  const handleRefresh = () => {
    fetchUsers();
  };

  const fetchUserDetails = async (userId: string) => {
    try {
      const response = await fetch('https://api.leadtech.solutions/api/data/admin/user-details', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminToken: token, userId }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch user details');
      }

      const data = await response.json();
      setSelectedUser(data);
      setIsModalOpen(true);
    } catch (error) {
      console.error('Error fetching user details:', error);
    }
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-10 w-10 border-b-2 border-sky-600"></div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-md hover:shadow-lg transition-shadow">
      <div className="p-6">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-xl font-semibold text-gray-800">Users List</h2>
          <div className="relative">
            <button 
              onClick={handleRefresh}
              disabled={isRefreshing}
              className="p-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
              aria-label="Refresh users"
            >
              <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin' : ''}`} />
            </button>
            {refreshTooltip && (
              <div className="absolute right-0 mt-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
                Users refreshed!
              </div>
            )}
          </div>
        </div>
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead>
              <tr>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tl-lg">
                  User ID
                </th>
                <th className="px-6 py-3 bg-gray-50 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Email
                </th>
                <th className="px-6 py-3 bg-gray-50 text-right text-xs font-medium text-gray-500 uppercase tracking-wider rounded-tr-lg">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {users.map((user, index) => (
                <tr key={user.userId} className="hover:bg-gray-50 transition-colors">
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.userId}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900">
                    {user.email}
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                    <button
                      onClick={() => fetchUserDetails(user.userId)}
                      className="text-sky-600 hover:text-sky-800 flex items-center space-x-1 ml-auto transition-colors p-1 rounded hover:bg-sky-50"
                    >
                      <Eye size={16} />
                      <span>View Details</span>
                    </button>
                  </td>
                </tr>
              ))}
              {users.length === 0 && (
                <tr>
                  <td colSpan={3} className="px-6 py-8 text-center text-gray-500">
                    No users found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      {selectedUser && (
        <UserDetailsModal
          isOpen={isModalOpen}
          onClose={() => setIsModalOpen(false)}
          userDetails={selectedUser}
        />
      )}
    </div>
  );
}

export default UsersList;