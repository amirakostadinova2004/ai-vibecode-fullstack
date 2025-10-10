"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation";

export default function AdminUsers() {
  const [user, setUser] = useState(null);
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [editingUser, setEditingUser] = useState(null);
  const [addingUser, setAddingUser] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const router = useRouter();

  useEffect(() => {
    fetchUser();
    fetchUsers();
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

  const fetchUsers = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8201/api/admin/users', {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        const data = await response.json();
        setUsers(data.data || data);
      }
    } catch (error) {
      console.error('Error fetching users:', error);
      setError('Failed to fetch users');
    } finally {
      setLoading(false);
    }
  };

  const handleEditUser = (userToEdit) => {
    setEditingUser({
      ...userToEdit,
      name: userToEdit.name,
      email: userToEdit.email,
      role: userToEdit.role
    });
  };

  const handleUpdateUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8201/api/admin/users/${editingUser.id}`, {
        method: 'PUT',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: editingUser.name,
          email: editingUser.email,
          role: editingUser.role
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('User updated successfully');
        setEditingUser(null);
        fetchUsers();
      } else {
        setError(data.error || 'Failed to update user');
      }
    } catch (error) {
      console.error('Error updating user:', error);
      setError('Failed to update user');
    }
  };

  const handleAddUser = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");

    try {
      const token = localStorage.getItem('token');
      const response = await fetch('http://localhost:8201/api/admin/users', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
          'Accept': 'application/json'
        },
        body: JSON.stringify({
          name: addingUser.name,
          email: addingUser.email,
          password: addingUser.password,
          role: addingUser.role
        })
      });

      const data = await response.json();

      if (response.ok) {
        setSuccess('User created successfully');
        setAddingUser(false);
        fetchUsers();
      } else {
        setError(data.message || data.error || 'Failed to create user');
      }
    } catch (error) {
      console.error('Error creating user:', error);
      setError('Failed to create user');
    }
  };

  const handleDeleteUser = async (userId, userName) => {
    if (!confirm(`Are you sure you want to delete user "${userName}"? This action cannot be undone.`)) {
      return;
    }

    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`http://localhost:8201/api/admin/users/${userId}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json'
        }
      });

      if (response.ok) {
        setSuccess('User deleted successfully');
        fetchUsers();
      } else {
        const data = await response.json();
        setError(data.error || 'Failed to delete user');
      }
    } catch (error) {
      console.error('Error deleting user:', error);
      setError('Failed to delete user');
    }
  };

  const getRoleColor = (role) => {
    const colors = {
      owner: 'bg-red-900/20 text-red-400 border-red-700',
      admin: 'bg-blue-900/20 text-blue-400 border-blue-700',
      frontend: 'bg-green-900/20 text-green-400 border-green-700',
      backend: 'bg-purple-900/20 text-purple-400 border-purple-700',
      user: 'bg-gray-900/20 text-gray-400 border-gray-700'
    };
    return colors[role] || colors.user;
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
          <p className="mt-4 text-slate-300">Loading users...</p>
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
              <h1 className="text-xl font-bold text-white">User Management</h1>
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

        {/* Users Table */}
        <div className="bg-slate-800 rounded-lg border border-slate-700 overflow-hidden">
          <div className="px-6 py-4 border-b border-slate-700 flex justify-between items-center">
            <h2 className="text-lg font-semibold text-white">All Users ({users.length})</h2>
            <button
              onClick={() => setAddingUser({
                name: '',
                email: '',
                password: '',
                role: 'user'
              })}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors flex items-center gap-2"
            >
              <span>+</span>
              Add User
            </button>
          </div>
          
          <div className="overflow-x-auto">
            <table className="w-full">
              <thead className="bg-slate-700">
                <tr>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">User</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Role</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Created</th>
                  <th className="px-6 py-3 text-left text-xs font-medium text-slate-300 uppercase tracking-wider">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-700">
                {users.map((userItem) => (
                  <tr key={userItem.id} className="hover:bg-slate-700/50">
                    <td className="px-6 py-4 whitespace-nowrap">
                      <div>
                        <div className="text-sm font-medium text-white">{userItem.name}</div>
                        <div className="text-sm text-slate-400">{userItem.email}</div>
                      </div>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap">
                      <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full border ${getRoleColor(userItem.role)}`}>
                        {userItem.role}
                      </span>
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm text-slate-300">
                      {formatDate(userItem.created_at)}
                    </td>
                    <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                      <button
                        onClick={() => handleEditUser(userItem)}
                        className="text-blue-400 hover:text-blue-300 transition-colors"
                      >
                        Edit
                      </button>
                      {userItem.id !== user?.id && (
                        <button
                          onClick={() => handleDeleteUser(userItem.id, userItem.name)}
                          className="text-red-400 hover:text-red-300 transition-colors"
                        >
                          Delete
                        </button>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Edit User Modal */}
      {editingUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl w-11/12 max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Edit User</h3>
            <form onSubmit={handleUpdateUser} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  value={editingUser.name}
                  onChange={(e) => setEditingUser({...editingUser, name: e.target.value})}
                  required
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={editingUser.email}
                  onChange={(e) => setEditingUser({...editingUser, email: e.target.value})}
                  required
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <select
                  value={editingUser.role}
                  onChange={(e) => setEditingUser({...editingUser, role: e.target.value})}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="user">User</option>
                  <option value="frontend">Frontend Developer</option>
                  <option value="backend">Backend Developer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setEditingUser(null)}
                  className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Update User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Add User Modal */}
      {addingUser && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm flex justify-center items-center z-50">
          <div className="bg-slate-800 border border-slate-700 p-8 rounded-xl w-11/12 max-w-md shadow-2xl">
            <h3 className="text-xl font-bold text-white mb-6">Add New User</h3>
            <form onSubmit={handleAddUser} className="space-y-6">
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Name</label>
                <input
                  type="text"
                  value={addingUser.name}
                  onChange={(e) => setAddingUser({...addingUser, name: e.target.value})}
                  required
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter full name"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Email</label>
                <input
                  type="email"
                  value={addingUser.email}
                  onChange={(e) => setAddingUser({...addingUser, email: e.target.value})}
                  required
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter email address"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Password</label>
                <input
                  type="password"
                  value={addingUser.password}
                  onChange={(e) => setAddingUser({...addingUser, password: e.target.value})}
                  required
                  minLength={6}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                  placeholder="Enter password (min 6 characters)"
                />
              </div>
              
              <div>
                <label className="block text-sm font-medium text-slate-300 mb-2">Role</label>
                <select
                  value={addingUser.role}
                  onChange={(e) => setAddingUser({...addingUser, role: e.target.value})}
                  className="w-full p-3 bg-slate-700 border border-slate-600 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent"
                >
                  <option value="user">User</option>
                  <option value="frontend">Frontend Developer</option>
                  <option value="backend">Backend Developer</option>
                  <option value="admin">Admin</option>
                </select>
              </div>
              
              <div className="flex gap-3 justify-end">
                <button
                  type="button"
                  onClick={() => setAddingUser(false)}
                  className="px-6 py-2 bg-slate-600 hover:bg-slate-700 text-white rounded-lg transition-colors"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg transition-colors"
                >
                  Create User
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
