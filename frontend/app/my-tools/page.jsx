"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function MyToolsPage() {
  const [user, setUser] = useState(null);
  const [myTools, setMyTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    fetchMyTools();
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
      } else {
        router.push('/login');
      }
    } catch (error) {
      console.error('Error fetching user:', error);
      router.push('/login');
    }
  };

  const fetchMyTools = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8201/api/my-tools', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setMyTools(data.data || data);
      } else {
        setError('Failed to fetch your tools');
      }
    } catch (error) {
      console.error('Error fetching tools:', error);
      setError('Failed to fetch your tools');
    } finally {
      setLoading(false);
    }
  };

  const formatDate = (dateString) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'approved':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-green-900/20 text-green-400 border border-green-700">
            Approved
          </span>
        );
      case 'pending':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-900/20 text-yellow-400 border border-yellow-700">
            Pending Review
          </span>
        );
      case 'rejected':
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-red-900/20 text-red-400 border border-red-700">
            Rejected
          </span>
        );
      default:
        return (
          <span className="px-2 py-1 text-xs font-semibold rounded-full bg-gray-900/20 text-gray-400 border border-gray-700">
            Unknown
          </span>
        );
    }
  };

  const getPriceTierName = (tier) => {
    switch (tier) {
      case 1: return 'Free';
      case 2: return 'Freemium';
      case 3: return 'Paid';
      default: return 'Unknown';
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-slate-300">Loading your tools...</p>
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
              <button
                onClick={() => router.push('/dashboard')}
                className="mr-4 p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-xl font-bold text-white">My AI Tools</h1>
            </div>
            <div className="flex items-center space-x-4">
              <span className="text-slate-300">Welcome, {user?.name}</span>
              <button
                onClick={() => {
                  localStorage.removeItem('token');
                  router.push('/login');
                }}
                className="px-4 py-2 text-sm font-medium text-slate-300 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}

        {/* Tools Grid */}
        {myTools.length === 0 ? (
          <div className="text-center py-12">
            <div className="text-slate-400 text-6xl mb-4">🛠️</div>
            <h2 className="text-2xl font-bold text-white mb-2">No Tools Submitted Yet</h2>
            <p className="text-slate-400 mb-6">You haven't submitted any AI tools yet.</p>
            <button
              onClick={() => router.push('/dashboard')}
              className="px-6 py-3 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
            >
              Browse Available Tools
            </button>
          </div>
        ) : (
          <>
            {/* Summary Stats */}
            <div className="grid grid-cols-1 md:grid-cols-4 gap-6 mb-8">
              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-blue-900/20 text-blue-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Total Tools</p>
                    <p className="text-2xl font-semibold text-white">{myTools.length}</p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-green-900/20 text-green-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Approved</p>
                    <p className="text-2xl font-semibold text-white">
                      {myTools.filter(tool => tool.status === 'approved').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-yellow-900/20 text-yellow-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4l3 3m6-3a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Pending</p>
                    <p className="text-2xl font-semibold text-white">
                      {myTools.filter(tool => tool.status === 'pending').length}
                    </p>
                  </div>
                </div>
              </div>

              <div className="bg-slate-800 rounded-lg p-6 border border-slate-700">
                <div className="flex items-center">
                  <div className="p-3 rounded-full bg-red-900/20 text-red-400">
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14l2-2m0 0l2-2m-2 2l-2-2m2 2l2 2m7-2a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </div>
                  <div className="ml-4">
                    <p className="text-sm font-medium text-slate-400">Rejected</p>
                    <p className="text-2xl font-semibold text-white">
                      {myTools.filter(tool => tool.status === 'rejected').length}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            {/* Tools List */}
            <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
              <div className="px-6 py-4 border-b border-slate-700">
                <h2 className="text-lg font-semibold text-white">Your Submitted Tools ({myTools.length})</h2>
                <p className="text-sm text-slate-400 mt-1">Track the status of your AI tool submissions</p>
              </div>
              
              <div className="divide-y divide-slate-700">
                {myTools.map((tool) => (
                  <div key={tool.id} className="p-6 hover:bg-slate-700/50 transition-colors">
                    <div className="flex justify-between items-start">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                          {getStatusBadge(tool.status)}
                          {tool.is_featured && (
                            <span className="px-2 py-1 text-xs font-semibold rounded-full bg-purple-900/20 text-purple-400 border border-purple-700">
                              Featured
                            </span>
                          )}
                        </div>
                        
                        <p className="text-slate-300 mb-3">{tool.description}</p>
                        
                        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                          <div>
                            <span className="text-slate-400">Category:</span>
                            <span className="text-white ml-2">{tool.category}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Price:</span>
                            <span className="text-white ml-2">{getPriceTierName(tool.price_tier)}</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Rating:</span>
                            <span className="text-white ml-2">{tool.rating}/5.0</span>
                          </div>
                          <div>
                            <span className="text-slate-400">Submitted:</span>
                            <span className="text-white ml-2">{formatDate(tool.created_at)}</span>
                          </div>
                        </div>
                        
                        {tool.approved_at && (
                          <div className="mt-3">
                            <span className="text-slate-400">Approved:</span>
                            <span className="text-white ml-2">{formatDate(tool.approved_at)}</span>
                          </div>
                        )}
                        
                        {tool.url && (
                          <div className="mt-3">
                            <a 
                              href={tool.url} 
                              target="_blank" 
                              rel="noopener noreferrer"
                              className="text-purple-400 hover:text-purple-300 text-sm"
                            >
                              Visit Tool Website →
                            </a>
                          </div>
                        )}
                      </div>
                      
                      <div className="ml-6">
                        <button
                          onClick={() => router.push(`/tool/${tool.id}`)}
                          className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors text-sm"
                        >
                          View Details
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}
