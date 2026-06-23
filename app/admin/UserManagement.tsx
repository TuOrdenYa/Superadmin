'use client';

import { useState, useEffect } from 'react';

interface User {
  id: number;
  tenant_id: number;
  location_id: number | null;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  created_at: string;
  tenant_name?: string;
  location_name?: string;
}

interface Tenant {
  id: string;
  name: string;
  slug?: string;
}

interface Location {
  id: number;
  tenant_id: number;
  name: string;
}

interface UserManagementProps {
  tenants: Tenant[];
  adminFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

export default function UserManagement({ tenants, adminFetch }: UserManagementProps) {
  const [users, setUsers] = useState<User[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [loading, setLoading] = useState(false);
  const [showForm, setShowForm] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);

  const [filterTenant, setFilterTenant] = useState<string>('');
  const [filterRole, setFilterRole] = useState<string>('');
  const [filterStatus, setFilterStatus] = useState<string>('');
  const [searchText, setSearchText] = useState<string>('');

  const [formData, setFormData] = useState({
    tenant_id: '',
    location_id: '',
    email: '',
    full_name: '',
    role: 'admin',
  });

  const fetchUsers = async (tenantId?: number) => {
    try {
      const url = tenantId
        ? `/api/admin/users?tenant_id=${tenantId}`
        : '/api/admin/users';
      const res = await adminFetch(url);
      const data = await res.json();
      if (data.ok) setUsers(data.users);
    } catch (error) {
      console.error('Error fetching users:', error);
    }
  };

  const fetchLocations = async (tenantId: number) => {
    try {
      const res = await fetch(`/api/tenants/${tenantId}/locations`);
      const data = await res.json();
      if (data.ok) setLocations(data.locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  useEffect(() => {
    if (formData.tenant_id) {
      fetchLocations(parseInt(formData.tenant_id));
    } else {
      setLocations([]);
      setFormData(prev => ({ ...prev, location_id: '' }));
    }
  }, [formData.tenant_id]);

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setGeneratedPassword(null);
    try {
      const res = await adminFetch('/api/admin/users', {
        method: 'POST',
        body: JSON.stringify({
          ...formData,
          tenant_id: parseInt(formData.tenant_id),
          location_id: formData.location_id ? parseInt(formData.location_id) : null,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setGeneratedPassword(data.password);
        alert(`User created! Password: ${data.password}\n\nSave this password - it won't be shown again!`);
        setFormData({ tenant_id: '', location_id: '', email: '', full_name: '', role: 'admin' });
        fetchUsers();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating user:', error);
      alert('Failed to create user');
    } finally {
      setLoading(false);
    }
  };

  const handleResetPassword = async (userId: number, userName: string) => {
    if (!confirm(`Reset password for ${userName}?`)) return;
    try {
      const res = await adminFetch(`/api/admin/users/${userId}`, {
        method: 'PUT',
        body: JSON.stringify({ reset_password: true }),
      });
      const data = await res.json();
      if (data.ok) {
        alert(`New password for ${userName}:\n\n${data.password}\n\nSave this password - it won't be shown again!`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error resetting password:', error);
      alert('Failed to reset password');
    }
  };

  const handleToggleActive = async (user: User) => {
    try {
      const res = await adminFetch(`/api/admin/users/${user.id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_active: !user.is_active }),
      });
      const data = await res.json();
      if (data.ok) {
        fetchUsers();
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error updating user:', error);
      alert('Failed to update user');
    }
  };

  const filteredUsers = users.filter(user => {
    if (filterTenant && String(user.tenant_id) !== filterTenant) return false;
    if (filterRole && user.role !== filterRole) return false;
    if (filterStatus === 'active' && !user.is_active) return false;
    if (filterStatus === 'inactive' && user.is_active) return false;
    if (searchText) {
      const search = searchText.toLowerCase();
      if (!user.full_name.toLowerCase().includes(search) && !user.email.toLowerCase().includes(search)) return false;
    }
    return true;
  });

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h2 className="text-2xl font-bold text-black">User Management</h2>
        <button
          onClick={() => setShowForm(!showForm)}
          className="px-4 py-2 bg-orange-600 text-white rounded-lg hover:bg-orange-700"
        >
          {showForm ? 'Cancel' : '+ Create User'}
        </button>
      </div>

      <div className="bg-white rounded-lg shadow-md p-4">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-4">
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Search Name/Email</label>
            <input
              type="text"
              value={searchText}
              onChange={(e) => setSearchText(e.target.value)}
              placeholder="Type to search..."
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 text-black"
            />
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Filter by Tenant</label>
            <select
              value={filterTenant}
              onChange={(e) => setFilterTenant(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 text-black font-semibold"
            >
              <option value="">All Tenants</option>
              {tenants.map(t => (
                <option key={t.id} value={t.id}>{t.name}</option>
              ))}
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Filter by Role</label>
            <select
              value={filterRole}
              onChange={(e) => setFilterRole(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 text-black font-semibold"
            >
              <option value="">All Roles</option>
              <option value="admin">Admin</option>
              <option value="manager">Manager</option>
              <option value="waiter">Waiter</option>
            </select>
          </div>
          <div>
            <label className="block text-xs font-bold text-gray-700 mb-1">Filter by Status</label>
            <select
              value={filterStatus}
              onChange={(e) => setFilterStatus(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded text-sm focus:ring-2 focus:ring-blue-500 text-black font-semibold"
            >
              <option value="">All Status</option>
              <option value="active">Active Only</option>
              <option value="inactive">Inactive Only</option>
            </select>
          </div>
          <div className="flex items-end">
            <button
              onClick={() => { setSearchText(''); setFilterTenant(''); setFilterRole(''); setFilterStatus(''); }}
              className="w-full px-3 py-2 bg-gray-500 text-white rounded text-sm hover:bg-gray-600 font-semibold"
            >
              Clear Filters
            </button>
          </div>
        </div>
        <div className="mt-2 text-sm text-gray-600">
          Showing {filteredUsers.length} of {users.length} users
        </div>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg shadow-md p-6">
          <h3 className="text-lg font-bold text-black mb-4">Create New User</h3>
          <form onSubmit={handleCreateUser} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">Tenant *</label>
                <select
                  value={formData.tenant_id}
                  onChange={(e) => setFormData({ ...formData, tenant_id: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold"
                  required
                >
                  <option value="">Select tenant...</option>
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>{t.name} (ID: {t.id})</option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Role *</label>
                <select
                  value={formData.role}
                  onChange={(e) => setFormData({ ...formData, role: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold"
                  required
                >
                  <option value="admin">Admin (Full Access)</option>
                  <option value="manager">Manager (Single Location)</option>
                  <option value="waiter">Waiter (Orders Only)</option>
                </select>
              </div>
              {(formData.role === 'manager' || formData.role === 'waiter') && (
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Location *</label>
                  <select
                    value={formData.location_id}
                    onChange={(e) => setFormData({ ...formData, location_id: e.target.value })}
                    className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold"
                    required={formData.role === 'manager' || formData.role === 'waiter'}
                    disabled={!formData.tenant_id}
                  >
                    <option value="">Select location...</option>
                    {locations.map((loc) => (
                      <option key={loc.id} value={loc.id}>{loc.name}</option>
                    ))}
                  </select>
                </div>
              )}
              <div>
                <label className="block text-sm font-bold text-black mb-1">Full Name *</label>
                <input
                  type="text"
                  value={formData.full_name}
                  onChange={(e) => setFormData({ ...formData, full_name: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold"
                  placeholder="John Doe"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">Email *</label>
                <input
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold"
                  placeholder="user@example.com"
                  required
                />
              </div>
            </div>
            <div className="bg-yellow-50 border border-yellow-200 rounded p-3">
              <p className="text-sm text-yellow-800 font-semibold">
                Se generará una contraseña aleatoria automáticamente. ¡Guárdala cuando aparezca!
              </p>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
            >
              {loading ? 'Creating User...' : 'Create User'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-md overflow-hidden">
        <div className="overflow-x-auto">
          <table className="min-w-full divide-y divide-gray-200">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Name</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Email</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Tenant</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Role</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Location</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Status</th>
                <th className="px-4 py-3 text-left text-xs font-bold text-black uppercase">Actions</th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {filteredUsers.length === 0 ? (
                <tr>
                  <td colSpan={7} className="px-4 py-8 text-center text-gray-500">
                    No users found matching the filters
                  </td>
                </tr>
              ) : (
                filteredUsers.map((user) => (
                  <tr key={user.id} className={!user.is_active ? 'opacity-50' : ''}>
                    <td className="px-4 py-3 text-sm text-black font-semibold">{user.full_name}</td>
                    <td className="px-4 py-3 text-sm text-black">{user.email}</td>
                    <td className="px-4 py-3 text-sm text-black">{user.tenant_name || `ID: ${user.tenant_id}`}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        user.role === 'admin' ? 'bg-purple-100 text-purple-800' :
                        user.role === 'manager' ? 'bg-orange-100 text-blue-800' :
                        'bg-green-100 text-green-800'
                      }`}>
                        {user.role}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm text-black">{user.location_name || '-'}</td>
                    <td className="px-4 py-3 text-sm">
                      <span className={`px-2 py-1 rounded text-xs font-bold ${
                        user.is_active ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
                      }`}>
                        {user.is_active ? 'Active' : 'Inactive'}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-sm space-x-2">
                      <button
                        onClick={() => handleResetPassword(user.id, user.full_name)}
                        className="text-orange-600 hover:text-orange-800 font-semibold"
                      >
                        Reset Pwd
                      </button>
                      <button
                        onClick={() => handleToggleActive(user)}
                        className={`font-semibold ${
                          user.is_active ? 'text-red-600 hover:text-red-800' : 'text-green-600 hover:text-green-800'
                        }`}
                      >
                        {user.is_active ? 'Deactivate' : 'Activate'}
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}