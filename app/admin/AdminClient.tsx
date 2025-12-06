'use client';

import { useState, useEffect } from 'react';

interface Tenant {
  id: number;
  name: string;
  slug?: string;
  created_at?: string;
}

interface Location {
  id: number;
  tenant_id: number;
  name: string;
}

export default function AdminClient() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [selectedTenant, setSelectedTenant] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  
  // Auth state
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [authError, setAuthError] = useState('');
  
  // Form states
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantSlug, setNewTenantSlug] = useState('');
  const [newLocationName, setNewLocationName] = useState('');

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

  // Load tenants on auth
  useEffect(() => {
    if (isAuthenticated) {
      fetchTenants();
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
        body: JSON.stringify({ name: newTenantName, slug: newTenantSlug }),
      });
      const data = await res.json();
      if (data.ok) {
        alert(`Tenant created! Access at: ${newTenantSlug}.tuordenya.com`);
        setNewTenantName('');
        setNewTenantSlug('');
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

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Super Admin</h1>
          <p className="text-gray-600 mb-6">Enter password to access admin panel</p>
          
          {authError && (
            <div className="bg-red-50 text-red-600 p-3 rounded mb-4">
              {authError}
            </div>
          )}
          
          <form onSubmit={handleAdminLogin}>
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter admin password"
                required
              />
            </div>
            <button
              type="submit"
              className="w-full bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition"
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-6">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow p-6 mb-6 flex justify-between items-center">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Super Admin Panel</h1>
            <p className="text-gray-600 mt-1">Manage tenants and locations</p>
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
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Create Tenant (Restaurant)</h2>
            <form onSubmit={handleCreateTenant} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Restaurant Name
                </label>
                <input
                  type="text"
                  value={newTenantName}
                  onChange={(e) => handleTenantNameChange(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., Pizza Roma"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Subdomain Slug
                </label>
                <input
                  type="text"
                  value={newTenantSlug}
                  onChange={(e) => setNewTenantSlug(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
                  placeholder="e.g., pizza-roma"
                  pattern="[a-z0-9-]+"
                  required
                />
                <p className="text-xs text-gray-500 mt-1">
                  Preview: {newTenantSlug || 'your-slug'}.tuordenya.com
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full bg-blue-600 text-white py-2 rounded hover:bg-blue-700 disabled:opacity-50"
              >
                {loading ? 'Creating...' : 'Create Tenant'}
              </button>
            </form>
          </div>

          {/* Create Location */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-xl font-bold mb-4">Create Location</h2>
            <form onSubmit={handleCreateLocation} className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Select Tenant
                </label>
                <select
                  value={selectedTenant || ''}
                  onChange={(e) => setSelectedTenant(Number(e.target.value))}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  Location Name
                </label>
                <input
                  type="text"
                  value={newLocationName}
                  onChange={(e) => setNewLocationName(e.target.value)}
                  className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500"
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
                <h3 className="font-semibold mb-2">Locations:</h3>
                <ul className="space-y-1">
                  {locations.map((loc) => (
                    <li key={loc.id} className="text-sm text-gray-700">
                      • {loc.name}
                    </li>
                  ))}
                </ul>
              </div>
            )}
          </div>
        </div>

        {/* Tenants List */}
        <div className="bg-white rounded-lg shadow p-6 mt-6">
          <h2 className="text-xl font-bold mb-4">All Tenants</h2>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {tenants.map((tenant) => (
              <div
                key={tenant.id}
                className="border border-gray-200 rounded-lg p-4 hover:border-blue-500 cursor-pointer"
                onClick={() => setSelectedTenant(tenant.id)}
              >
                <h3 className="font-semibold text-lg">{tenant.name}</h3>
                <p className="text-sm text-gray-600">ID: {tenant.id}</p>
                <p className="text-sm text-blue-600">{tenant.slug}.tuordenya.com</p>
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}
