"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function ContentManagement() {
  const [user, setUser] = useState(null);
  const [pendingTools, setPendingTools] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    fetchPendingTools();
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

  const fetchPendingTools = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8201/api/admin/content', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setPendingTools(data.data || data);
      }
    } catch (error) {
      console.error('Error fetching pending tools:', error);
      setError('Failed to fetch pending tools');
    } finally {
      setLoading(false);
    }
  };

  const handleApproveTool = async (toolId, toolName) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8201/api/admin/content/tools/${toolId}/approve`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSuccess(`Tool "${toolName}" approved successfully`);
        fetchPendingTools(); // Refresh the list
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to approve tool');
        // Clear error message after 5 seconds
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error('Error approving tool:', error);
      setError('Failed to approve tool');
    }
  };

  const handleRejectTool = async (toolId, toolName) => {
    if (!confirm(`Are you sure you want to reject "${toolName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8201/api/admin/content/tools/${toolId}/reject`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSuccess(`Tool "${toolName}" rejected successfully`);
        fetchPendingTools(); // Refresh the list
        // Clear success message after 3 seconds
        setTimeout(() => setSuccess(""), 3000);
      } else {
        const data = await response.json();
        setError(data.message || 'Failed to reject tool');
        // Clear error message after 5 seconds
        setTimeout(() => setError(""), 5000);
      }
    } catch (error) {
      console.error('Error rejecting tool:', error);
      setError('Failed to reject tool');
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

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-purple-500 mx-auto"></div>
          <p className="mt-4 text-slate-300">Loading content management...</p>
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
                onClick={() => router.push('/admin/dashboard')}
                className="mr-4 p-2 text-slate-400 hover:text-white hover:bg-slate-700 rounded-lg transition-colors"
              >
                ← Back
              </button>
              <h1 className="text-xl font-bold text-white">Content Management</h1>
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
        {/* Messages */}
        {error && (
          <div className="mb-6 p-4 bg-red-900/50 border border-red-700 rounded-lg text-red-200">
            {error}
          </div>
        )}
        {success && (
          <div className="mb-6 p-4 bg-green-900/50 border border-green-700 rounded-lg text-green-200">
            {success}
          </div>
        )}

        {/* Pending Tools */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700">
            <h2 className="text-lg font-semibold text-white">Pending AI Tools ({pendingTools.length})</h2>
            <p className="text-sm text-slate-400 mt-1">Review and approve new AI tools submitted by users</p>
          </div>
          
          {pendingTools.length === 0 ? (
            <div className="p-8 text-center">
              <div className="text-slate-400 text-lg mb-2">🎉</div>
              <p className="text-slate-300">No pending tools to review</p>
              <p className="text-slate-400 text-sm">All submitted tools have been processed</p>
            </div>
          ) : (
            <div className="divide-y divide-slate-700">
              {pendingTools.map((tool) => (
                <div key={tool.id} className="p-6 hover:bg-slate-700/50 transition-colors">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <h3 className="text-lg font-semibold text-white">{tool.name}</h3>
                        <span className="px-2 py-1 text-xs font-semibold rounded-full bg-yellow-900/20 text-yellow-400 border border-yellow-700">
                          Pending
                        </span>
                      </div>
                      
                      <p className="text-slate-300 mb-3">{tool.description}</p>
                      
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-slate-400">Category:</span>
                          <span className="text-white ml-2">{tool.category}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Price:</span>
                          <span className="text-white ml-2">
                            {tool.price_tier === 1 ? 'Free' : tool.price_tier === 2 ? 'Freemium' : 'Paid'}
                          </span>
                        </div>
                        <div>
                          <span className="text-slate-400">Submitted by:</span>
                          <span className="text-white ml-2">{tool.user?.name || 'Unknown'}</span>
                        </div>
                        <div>
                          <span className="text-slate-400">Submitted:</span>
                          <span className="text-white ml-2">{formatDate(tool.created_at)}</span>
                        </div>
                      </div>
                      
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
                    
                    <div className="flex gap-2 ml-6">
                      <button
                        onClick={() => handleApproveTool(tool.id, tool.name)}
                        className="px-4 py-2 bg-green-600 hover:bg-green-700 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <span>✓</span>
                        Approve
                      </button>
                      <button
                        onClick={() => handleRejectTool(tool.id, tool.name)}
                        className="px-4 py-2 bg-red-600 hover:bg-red-700 text-white rounded-lg transition-colors flex items-center gap-2"
                      >
                        <span>✗</span>
                        Reject
                      </button>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
