import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { Users, DollarSign, LogOut, LayoutDashboard, Menu, RefreshCw, ChevronLeft } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import UsersList from './UsersList';

interface RevenueData {
  totalRevenue: number;
  totalUsers: number;
  monthlyRevenue: Array<{
    month: string;
    totalRevenue: number;
  }>;
}

function Dashboard() {
  const [revenueData, setRevenueData] = useState<RevenueData | null>(null);
  const [activeTab, setActiveTab] = useState<'dashboard' | 'users'>('dashboard');
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [refreshTooltip, setRefreshTooltip] = useState(false);
  const { token, userName, logout } = useAuth();
  const navigate = useNavigate();

  const fetchRevenueData = async () => {
    setIsRefreshing(true);
    try {
      const response = await fetch('https://api.leadtech.solutions/api/data/admin/revenue-summary', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ adminToken: token }),
      });

      if (!response.ok) {
        throw new Error('Failed to fetch revenue data');
      }

      const data = await response.json();
      setRevenueData(data);
      
      // Show success feedback
      setRefreshTooltip(true);
      setTimeout(() => setRefreshTooltip(false), 2000);
      
    } catch (error) {
      console.error('Error fetching revenue data:', error);
    } finally {
      setIsRefreshing(false);
    }
  };

  useEffect(() => {
    fetchRevenueData();
  }, [token]);

  const handleRefresh = () => {
    fetchRevenueData();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const toggleSidebar = () => {
    setSidebarOpen(!sidebarOpen);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      <div className="flex-1 flex">
        {/* Sidebar */}
        <div className={`${sidebarOpen ? 'w-64' : 'w-0'} bg-white shadow-md transition-all duration-300 overflow-hidden fixed h-full z-10`}>
          <div className="p-4 flex justify-between items-center">
            <h1 className="text-xl font-bold text-sky-600">Leads Solution</h1>
            <button
              onClick={toggleSidebar}
              className="text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors"
              aria-label="Close sidebar"
            >
              <ChevronLeft size={24} />
            </button>
          </div>
          <nav className="mt-4">
            <button
              onClick={() => setActiveTab('dashboard')}
              className={`w-full flex items-center space-x-2 px-4 py-3 ${
                activeTab === 'dashboard' ? 'bg-sky-50 text-sky-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <LayoutDashboard size={20} />
              <span>Dashboard</span>
            </button>
            <button
              onClick={() => setActiveTab('users')}
              className={`w-full flex items-center space-x-2 px-4 py-3 ${
                activeTab === 'users' ? 'bg-sky-50 text-sky-600' : 'text-gray-600 hover:bg-gray-50'
              }`}
            >
              <Users size={20} />
              <span>Users</span>
            </button>
          </nav>
        </div>

        {/* Main Content */}
        <div className={`flex-1 transition-all duration-300 ${sidebarOpen ? 'ml-64' : 'ml-0'}`}>
          <nav className="bg-white shadow-sm sticky top-0 z-10">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
              <div className="flex justify-between items-center h-16">
                <div>
                  {!sidebarOpen && (
                    <button
                      onClick={toggleSidebar}
                      className="text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors"
                      aria-label="Open sidebar"
                    >
                      <Menu size={24} />
                    </button>
                  )}
                </div>
                <div className="flex items-center space-x-4">
                  <span className="text-gray-700">Welcome, {userName}</span>
                  <button
                    onClick={handleLogout}
                    className="flex items-center space-x-2 text-gray-600 hover:text-gray-900 p-2 rounded-md hover:bg-gray-100 transition-colors"
                  >
                    <LogOut size={20} />
                    <span>Logout</span>
                  </button>
                </div>
              </div>
            </div>
          </nav>

          <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
            {activeTab === 'dashboard' ? (
              <>
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-2xl font-bold text-gray-900">Dashboard Overview</h2>
                  <div className="relative">
                    <button 
                      onClick={handleRefresh}
                      disabled={isRefreshing}
                      className="p-2 bg-sky-600 text-white rounded-full hover:bg-sky-700 transition-all focus:outline-none focus:ring-2 focus:ring-sky-500 focus:ring-offset-2 shadow-md hover:shadow-lg transform hover:scale-105 active:scale-95"
                      aria-label="Refresh data"
                    >
                      <RefreshCw size={16} className={`${isRefreshing ? 'animate-spin' : ''}`} />
                    </button>
                    {refreshTooltip && (
                      <div className="absolute right-0 mt-2 bg-green-100 text-green-800 text-xs px-2 py-1 rounded shadow-md whitespace-nowrap">
                        Data refreshed!
                      </div>
                    )}
                  </div>
                </div>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
                  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-sky-100 rounded-full">
                        <DollarSign className="h-8 w-8 text-sky-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Total Revenue</p>
                        <h2 className="text-3xl font-bold text-gray-900">
                          ₹{revenueData?.totalRevenue || 0}
                        </h2>
                      </div>
                    </div>
                  </div>

                  <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                    <div className="flex items-center space-x-4">
                      <div className="p-3 bg-sky-100 rounded-full">
                        <Users className="h-8 w-8 text-sky-600" />
                      </div>
                      <div>
                        <p className="text-gray-500 text-sm">Total Users</p>
                        <h2 className="text-3xl font-bold text-gray-900">
                          {revenueData?.totalUsers || 0}
                        </h2>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="bg-white rounded-xl shadow-md p-6 hover:shadow-lg transition-shadow">
                  <div className="flex justify-between items-center mb-6">
                    <h3 className="text-xl font-semibold text-gray-800">Monthly Revenue</h3>
                  </div>
                  <div className="h-80">
                    <ResponsiveContainer width="100%" height="100%">
                      <BarChart data={revenueData?.monthlyRevenue || []}>
                        <CartesianGrid strokeDasharray="3 3" opacity={0.3} />
                        <XAxis dataKey="month" />
                        <YAxis />
                        <Tooltip formatter={(value) => `₹${value}`} />
                        <Bar dataKey="totalRevenue" fill="#0EA5E9" radius={[4, 4, 0, 0]} />
                      </BarChart>
                    </ResponsiveContainer>
                  </div>
                </div>
              </>
            ) : (
              <UsersList token={token || ''} />
            )}
          </main>
        </div>
      </div>

      {/* Footer */}
      <footer className="bg-white shadow-md mt-auto">
        <div className="max-w-7xl mx-auto py-4 px-4 sm:px-6 lg:px-8">
          <p className="text-center text-gray-600">
            © {new Date().getFullYear()} Leads Solution. All rights reserved.
          </p>
        </div>
      </footer>
    </div>
  );
}

export default Dashboard;