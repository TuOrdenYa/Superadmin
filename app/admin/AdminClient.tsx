'use client';

import { useState, useEffect } from 'react';
import UserManagement from './UserManagement';

interface Tenant {
  id: number;
  name: string;
  slug?: string;
  product_tier?: string;
  subscription_status?: string;
  created_at?: string;
}

interface Location {
  id: number;
  tenant_id: number;
  name: string;
}

interface RateLimit {
  tenant_id: number;
  tenant_name: string;
  product_tier: string;
  window_start: string;
  request_count: number;
  rate_limit: number;
  is_limited: boolean;
}

export default function AdminClient() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [rateLimits, setRateLimits] = useState<RateLimit[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Form states
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantSlug, setNewTenantSlug] = useState('');
  const [newTenantId, setNewTenantId] = useState('');
  const [newTenantTier, setNewTenantTier] = useState<'light' | 'plus' | 'pro'>('light');
  const [newLocationName, setNewLocationName] = useState('');
  
  // Tier editing
  const [editingTenantId, setEditingTenantId] = useState<number | null>(null);
  const [editTier, setEditTier] = useState<'light' | 'plus' | 'pro'>('light');

  // Check if already authenticated
  useEffect(() => {
    const authenticated = sessionStorage.getItem('admin_authenticated');
    if (authenticated === 'true') {
      setIsAuthenticated(true);
    }
  }, []);

  // Handle admin login
  const handleAdminLogin = (e: React.FormEvent) => {
    e.preventDefault();
    if (password === 'SuperAdmin2024!') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid password');
    }
  };

  // Logout
  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    setIsAuthenticated(false);
  };

  // Fetch tenants
  const fetchTenants = async () => {
    try {
      const res = await fetch('/api/admin/tenants');
      const data = await res.json();
      if (data.ok) {
        setTenants(data.tenants);
      }
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  // Fetch locations for selected tenant
  const fetchLocations = async (tenantId: number) => {
    try {
      const res = await fetch(`/api/tenants/${tenantId}/locations`);
      const data = await res.json();
      if (data.ok) {
        setLocations(data.locations);
      }
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  };

  // Fetch rate limits
  const fetchRateLimits = async () => {
    try {
      const res = await fetch('/api/admin/rate-limits');
      const data = await res.json();
      if (data.ok) {
        setRateLimits(data.rate_limits);
      }
    } catch (error) {
      console.error('Error fetching rate limits:', error);
    }
  };

  // Load tenants on auth
  useEffect(() => {
    if (isAuthenticated) {
      fetchTenants();
      fetchRateLimits();
      // Refresh rate limits every 30 seconds
      const interval = setInterval(fetchRateLimits, 30000);
      return () => clearInterval(interval);
    }
  }, [isAuthenticated]);

  // Load locations when tenant selected
  useEffect(() => {
    if (selectedTenant) {
      fetchLocations(selectedTenant);
    } else {
      setLocations([]);
    }
  }, [selectedTenant]);

  // Auto-generate slug from tenant name
  const handleTenantNameChange = (name: string) => {
    setNewTenantName(name);
    const slug = name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
    setNewTenantSlug(slug);
  };

  // Create tenant
  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          id: newTenantId ? parseInt(newTenantId) : undefined,
          name: newTenantName,
          slug: newTenantSlug,
          product_tier: newTenantTier,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        alert('Tenant created successfully!');
        setNewTenantName('');
        setNewTenantSlug('');
        setNewTenantId('');
        setNewTenantTier('light');
        fetchTenants();
      }
    } catch (error) {
      console.error('Error creating tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  // Create location
  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!selectedTenant) return;
    setLoading(true);
    try {
      const res = await fetch(`/api/tenants/${selectedTenant}/locations`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name: newLocationName }),
      });
      const data = await res.json();
      if (data.ok) {
        alert('Location created!');
        setNewLocationName('');
        fetchLocations(selectedTenant);
      }
    } catch (error) {
      console.error('Error creating location:', error);
    } finally {
      setLoading(false);
    }
  };

  // Update tenant tier
  const handleUpdateTier = async (tenantId: number, newTier: string) => {
    setLoading(true);
    try {
      const res = await fetch(`/api/admin/tenants/${tenantId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          product_tier: newTier,
          subscription_status: 'active'
        }),
      });
      const data = await res.json();
      if (data.ok) {
        alert(`Tier updated to ${newTier.toUpperCase()} successfully!`);
        setEditingTenantId(null);
        fetchTenants();
      } else {
        alert('Error updating tier: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating tier:', error);
      alert('Error updating tier');
    } finally {
      setLoading(false);
    }
  };

  // Start editing tier
  const startEditingTier = (tenant: Tenant) => {
    setEditingTenantId(tenant.id);
    setEditTier((tenant.product_tier as 'light' | 'plus' | 'pro') || 'light');
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-black mb-2">Super Admin</h1>
          <p className="text-black mb-6">Enter password to access admin panel</p>
          
          {authError && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
              {authError}
            </div>
          )}
          
          <form onSubmit={handleAdminLogin}>
            <div className="mb-4">
              <label className="block text-sm font-bold text-black mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 text-black font-semibold"
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition"
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-orange-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-gradient-to-r from-orange-600 to-indigo-700 rounded-lg shadow-lg p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-white">Super Admin Panel</h1>
            <p className="text-blue-100 mt-1">Manage tenants and locations</p>
          </div>
          <button
            onClick={handleLogout}
            className="px-4 py-2 bg-red-600 text-white rounded hover:bg-red-700"
          >
            Logout
          </button>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Create Tenant */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-black mb-4">Create Tenant (Restaurant)</h2>
            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Tenant ID (Optional - Tax ID/RUC)
                </label>
                <input
                  type="number"
                  value={newTenantId}
                  onChange={(e) => setNewTenantId(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold"
                  placeholder="e.g., 20601234567 (leave empty for auto-increment)"
                />
                <p className="text-xs text-gray-600 mt-1">Use client's tax ID for accounting alignment</p>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={newTenantName}
                  onChange={(e) => handleTenantNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold"
                  placeholder="e.g., Pizza Roma"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Subdomain Slug
                </label>
                <input
                  type="text"
                  value={newTenantSlug}
                  onChange={(e) => setNewTenantSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold"
                  placeholder="e.g., pizza-roma"
                  pattern="[a-z0-9-]+"
                  required
                />
                <p className="text-xs text-gray-900 font-semibold mt-1">
                  Preview: {newTenantSlug || 'your-slug'}.tuordenya.com
                </p>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Product Tier
                </label>
                <select
                  value={newTenantTier}
                  onChange={(e) => setNewTenantTier(e.target.value as 'light' | 'plus' | 'pro')}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold"
                >
                  <option value="light">Light - Menu + QR Code only</option>
                  <option value="plus">Plus - Orders + Reports (no tables/variants)</option>
                  <option value="pro">Pro - Full features (tables + variants)</option>
                </select>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-orange-600 text-white py-2 rounded hover:bg-orange-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Tenant'}
              </button>
            </form>
          </div>

          {/* Create Location */}
          <div className="bg-white rounded-lg shadow-md p-6">
            <h2 className="text-xl font-bold text-black mb-4">Create Location</h2>
            <form onSubmit={handleCreateLocation} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Select Tenant
                </label>
                <select
                  value={selectedTenant || ''}
                  onChange={(e) => setSelectedTenant(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold"
                  required
                >
                  <option value="">Choose a tenant...</option>
                  {tenants.map((t) => (
                    <option key={t.id} value={t.id}>
                      {t.name} ({t.slug}.tuordenya.com)
                    </option>
                  ))}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">
                  Location Name
                </label>
                <input
                  type="text"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold"
                  placeholder="e.g., Main Branch"
                  required
                />
              </div>
              <button
                type="submit"
                disabled={loading || !selectedTenant}
                className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Location'}
              </button>
            </form>

            {/* Locations List */}
            {selectedTenant && locations.length > 0 && (
              <div className="mt-4 pt-4 border-t">
                <h3 className="font-bold text-black mb-2">Locations:</h3>
                <ul className="space-y-1">
                  {locations.map((loc) => (
                    <li key={loc.id} className="text-sm text-black">
                      • {loc.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* User Management Section */}
        <div className="mt-6">
          <UserManagement tenants={tenants} />
        </div>

        {/* Rate Limit Monitoring */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <div className="flex justify-between items-center mb-4">
            <h2 className="text-xl font-bold text-black">API Rate Limit Monitoring</h2>
            <button
              onClick={fetchRateLimits}
              className="px-3 py-1 bg-orange-600 text-white text-sm rounded hover:bg-orange-700"
            >
              🔄 Refresh
            </button>
          </div>
          
          {rateLimits.length === 0 ? (
            <p className="text-gray-500 text-center py-8">No active rate limit data (refreshes every 30s)</p>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 text-left text-black font-bold">Tenant</th>
                    <th className="px-4 py-2 text-left text-black font-bold">Tier</th>
                    <th className="px-4 py-2 text-right text-black font-bold">Requests</th>
                    <th className="px-4 py-2 text-right text-black font-bold">Limit</th>
                    <th className="px-4 py-2 text-right text-black font-bold">Usage %</th>
                    <th className="px-4 py-2 text-center text-black font-bold">Status</th>
                    <th className="px-4 py-2 text-left text-black font-bold">Window Start</th>
                  </tr>
                </thead>
                <tbody>
                  {rateLimits.map((rl) => {
                    const usagePercent = (rl.request_count / rl.rate_limit) * 100;
                    return (
                      <tr key={`${rl.tenant_id}-${rl.window_start}`} className="border-b hover:bg-gray-50">
                        <td className="px-4 py-2 text-black font-semibold">{rl.tenant_name}</td>
                        <td className="px-4 py-2">
                          <span className={`px-2 py-1 text-xs font-bold rounded ${
                            rl.product_tier === 'pro' ? 'bg-purple-100 text-purple-700' :
                            rl.product_tier === 'plus' ? 'bg-orange-100 text-orange-700' :
                            'bg-gray-100 text-gray-700'
                          }`}>
                            {rl.product_tier.toUpperCase()}
                          </span>
                        </td>
                        <td className="px-4 py-2 text-right text-black font-semibold">{rl.request_count}</td>
                        <td className="px-4 py-2 text-right text-gray-600">{rl.rate_limit === 999999 ? '∞' : rl.rate_limit}</td>
                        <td className="px-4 py-2 text-right">
                          <span className={`font-bold ${
                            usagePercent >= 100 ? 'text-red-600' :
                            usagePercent >= 80 ? 'text-orange-600' :
                            usagePercent >= 50 ? 'text-yellow-600' :
                            'text-green-600'
                          }`}>
                            {usagePercent.toFixed(1)}%
                          </span>
                        </td>
                        <td className="px-4 py-2 text-center">
                          {rl.is_limited ? (
                            <span className="px-2 py-1 bg-red-100 text-red-700 text-xs font-bold rounded">
                              🚫 LIMITED
                            </span>
                          ) : usagePercent >= 80 ? (
                            <span className="px-2 py-1 bg-orange-100 text-orange-700 text-xs font-bold rounded">
                              ⚠️ WARNING
                            </span>
                          ) : (
                            <span className="px-2 py-1 bg-green-100 text-green-700 text-xs font-bold rounded">
                              ✓ OK
                            </span>
                          )}
                        </td>
                        <td className="px-4 py-2 text-xs text-gray-600">
                          {new Date(rl.window_start).toLocaleTimeString()}
                        </td>
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Tenants List */}
        <div className="bg-white rounded-lg shadow-md p-6 mt-6">
          <h2 className="text-xl font-bold text-black mb-4">All Tenants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenants.map((tenant) => (
              <div
                key={tenant.id}
                className="border-2 border-gray-200 rounded-lg p-4 hover:border-orange-600 hover:shadow-md transition-all"
              >
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-lg text-black">{tenant.name}</h3>
                  {editingTenantId === tenant.id ? (
                    <select
                      value={editTier}
                      onChange={(e) => setEditTier(e.target.value as 'light' | 'plus' | 'pro')}
                      className="px-2 py-1 text-xs font-bold rounded border-2 border-blue-500 bg-white text-black focus:ring-2 focus:ring-blue-500"
                      onClick={(e) => e.stopPropagation()}
                    >
                      <option value="light">LIGHT</option>
                      <option value="plus">PLUS</option>
                      <option value="pro">PRO</option>
                    </select>
                  ) : (
                    tenant.product_tier && (
                      <span className={`px-2 py-1 text-xs font-bold rounded ${
                        tenant.product_tier === 'pro' ? 'bg-purple-100 text-purple-700' :
                        tenant.product_tier === 'plus' ? 'bg-orange-100 text-orange-700' :
                        'bg-gray-100 text-gray-700'
                      }`}>
                        {tenant.product_tier.toUpperCase()}
                      </span>
                    )
                  )}
                </div>
                <p className="text-sm text-black">ID: {tenant.id}</p>
                <p className="text-sm text-blue-800 font-bold">{tenant.slug}.tuordenya.com</p>
                {tenant.subscription_status && (
                  <p className={`text-xs mt-2 ${
                    tenant.subscription_status === 'active' ? 'text-green-600' : 'text-red-600'
                  }`}>
                    {tenant.subscription_status === 'active' ? '✓ Active' : '⚠ Inactive'}
                  </p>
                )}
                
                {/* Tier Management Buttons */}
                <div className="mt-3 flex gap-2">
                  {editingTenantId === tenant.id ? (
                    <>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          handleUpdateTier(tenant.id, editTier);
                        }}
                        disabled={loading}
                        className="flex-1 bg-green-600 text-white text-xs py-1 px-2 rounded hover:bg-green-700 disabled:opacity-50"
                      >
                        Save
                      </button>
                      <button
                        onClick={(e) => {
                          e.stopPropagation();
                          setEditingTenantId(null);
                        }}
                        className="flex-1 bg-gray-500 text-white text-xs py-1 px-2 rounded hover:bg-gray-600"
                      >
                        Cancel
                      </button>
                    </>
                  ) : (
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        startEditingTier(tenant);
                      }}
                      className="flex-1 bg-orange-600 text-white text-xs py-1 px-2 rounded hover:bg-orange-700"
                    >
                      Change Tier
                    </button>
                  )}
                  <button
                    onClick={() => setSelectedTenant(tenant.id)}
                    className="flex-1 bg-orange-700 text-white text-xs py-1 px-2 rounded hover:bg-indigo-700"
                  >
                    View
                  </button>
                </div>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
