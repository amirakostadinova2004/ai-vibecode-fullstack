"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminDashboard() {
  const [user, setUser] = useState(null);
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalTools: 0,
    totalReviews: 0,
    pendingTools: 0,
    pendingReviews: 0
  });
  const [loading, setLoading] = useState(true);
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    fetchStats();
  }, []);

  const fetchUser = async () => {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        router.push('/login');
        return;
      }

      const response = await fetch('http://localhost:8201/api/me', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const userData = await response.json();
        setUser(userData);
        
        // Redirect non-admin users to regular dashboard
        if (userData.role !== 'admin') {
          router.push('/dashboard');
        }
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      router.push('/login');
    }
  };

  const fetchStats = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8201/api/admin/stats', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setStats(data);
      }
    } catch (error) {
      console.error('Error fetching stats:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleLogout = () => {
    localStorage.removeItem('token');
    router.push('/login');
  };

  const getRoleDisplayName = (role) => {
    const roleNames = {
      owner: 'Owner',
      admin: 'Administrator',
      frontend: 'Frontend Developer',
      backend: 'Backend Developer',
      user: 'User'
    };
    return roleNames[role] || role;
  };

  const getRoleColor = (role) => {
    const colors = {
      owner: 'text-red-400 bg-red-900/20',
      admin: 'text-blue-400 bg-blue-900/20',
      frontend: 'text-green-400 bg-green-900/20',
      backend: 'text-purple-400 bg-purple-900/20',
      user: 'text-gray-400 bg-gray-900/20'
    };
    return colors[role] || colors.user;
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-slate-300">Loading admin dashboard...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Header */}
      <header className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-white">Admin Dashboard</h1>
              <span className="ml-3 px-2 py-1 text-xs font-semibold rounded-full bg-purple-900/20 text-purple-400">
                {getRoleDisplayName(user?.role)}
              </span>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">Welcome, {user?.name}</span>
              <button
                onClick={handleLogout}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-blue-900/20 text-blue-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197m13.5-9a2.5 2.5 0 11-5 0 2.5 2.5 0 015 0z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Total Users</p>
                <p className="text-2xl font-semibold text-white">{stats.totalUsers}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-green-900/20 text-green-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">AI Tools</p>
                <p className="text-2xl font-semibold text-white">{stats.totalTools}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-yellow-900/20 text-yellow-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11.049 2.927c.3-.921 1.603-.921 1.902 0l1.519 4.674a1 1 0 00.95.69h4.915c.969 0 1.371 1.24.588 1.81l-3.976 2.888a1 1 0 00-.363 1.118l1.518 4.674c.3.922-.755 1.688-1.538 1.118l-3.976-2.888a1 1 0 00-1.176 0l-3.976 2.888c-.783.57-1.838-.197-1.538-1.118l1.518-4.674a1 1 0 00-.363-1.118l-3.976-2.888c-.784-.57-.38-1.81.588-1.81h4.914a1 1 0 00.951-.69l1.519-4.674z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Total Reviews</p>
                <p className="text-2xl font-semibold text-white">{stats.totalReviews}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-orange-900/20 text-orange-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Pending Tools</p>
                <p className="text-2xl font-semibold text-white">{stats.pendingTools}</p>
              </div>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <div className="flex items-center">
              <div className="p-3 rounded-full bg-red-900/20 text-red-400">
                <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-2.5L13.732 4c-.77-.833-1.732-.833-2.5 0L3.732 16.5c-.77.833.192 2.5 1.732 2.5z" />
                </svg>
              </div>
              <div className="ml-4">
                <p className="text-sm font-medium text-slate-400">Pending Reviews</p>
                <p className="text-2xl font-semibold text-white">{stats.pendingReviews}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Quick Actions */}
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">Quick Actions</h3>
            <div className="space-y-3">
              <button
                onClick={() => router.push('/admin/users')}
                className="w-full p-3 text-left bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <div className="flex items-center">
                  <span className="text-blue-400 mr-3">👥</span>
                  <div>
                    <p className="text-white font-medium">Manage Users</p>
                    <p className="text-sm text-slate-400">View, edit, and manage user accounts</p>
                  </div>
                </div>
              </button>
              
              <button
                onClick={() => router.push('/admin/content')}
                className="w-full p-3 text-left bg-slate-700 hover:bg-slate-600 rounded-lg transition-colors"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <span className="text-orange-400 mr-3">📝</span>
                    <div>
                      <p className="text-white font-medium">Content Management</p>
                      <p className="text-sm text-slate-400">Review and approve AI tools</p>
                    </div>
                  </div>
                  {stats.pendingTools > 0 && (
                    <span className="px-2 py-1 text-xs font-semibold rounded-full bg-orange-900/20 text-orange-400 border border-orange-700">
                      {stats.pendingTools}
                    </span>
                  )}
                </div>
              </button>
            </div>
          </div>

          <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
            <h3 className="text-lg font-semibold text-white mb-4">System Status</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Database</span>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-900/20 text-green-400">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">API Server</span>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-900/20 text-green-400">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">Frontend</span>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-900/20 text-green-400">
                  Online
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-300">2FA Service</span>
                <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-900/20 text-green-400">
                  Active
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
          <h3 className="text-lg font-semibold text-white mb-4">Recent Activity</h3>
          <div className="space-y-3">
            <div className="flex items-center text-sm">
              <span className="text-blue-400 mr-3">👤</span>
              <span className="text-slate-300">New user registration: {user?.name}</span>
              <span className="ml-auto text-slate-500">Just now</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-green-400 mr-3">🤖</span>
              <span className="text-slate-300">AI tool added: ChatGPT</span>
              <span className="ml-auto text-slate-500">2 hours ago</span>
            </div>
            <div className="flex items-center text-sm">
              <span className="text-yellow-400 mr-3">⭐</span>
              <span className="text-slate-300">New review submitted</span>
              <span className="ml-auto text-slate-500">4 hours ago</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
