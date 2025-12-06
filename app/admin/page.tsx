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

export default function SuperAdminPage() {
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
    if (password === process.env.NEXT_PUBLIC_ADMIN_PASSWORD || password === 'SuperAdmin2024!') {
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      setAuthError('');
    } else {
      setAuthError('Invalid password');
    }
  };

  // Show login form if not authenticated
  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gray-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-gray-900 mb-2">Super Admin</h1>
          <p className="text-gray-600 mb-6">Enter password to access admin panel</p>
          
          <form onSubmit={handleAdminLogin} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                placeholder="Enter admin password"
                autoFocus
              />
            </div>
            {authError && (
              <p className="text-red-600 text-sm">{authError}</p>
            )}
            <button
              type="submit"
              className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-medium"
            >
              Access Admin Panel
            </button>
          </form>
        </div>
      </div>
    );
  }


  // Fetch tenants
  const fetchTenants = async () => {
    try {
      const res = await fetch('/api/admin/tenants');
      const data = await res.json();
      if (data.ok) setTenants(data.tenants);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  };

  // Fetch locations for selected tenant
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
    fetchTenants();
  }, []);

  useEffect(() => {
    if (selectedTenant) {
      fetchLocations(selectedTenant);
    }
  }, [selectedTenant]);

  // Create tenant
  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await fetch('/api/admin/tenants', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ 
          name: newTenantName,
          slug: newTenantSlug 
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setTenants([...tenants, data.tenant]);
        setNewTenantName('');
        setNewTenantSlug('');
        alert(`Tenant created! Subdomain: ${data.tenant.slug}.tuordenya.com`);
      } else {
        alert(`Error: ${data.error}`);
      }
    } catch (error) {
      console.error('Error creating tenant:', error);
    }
    setLoading(false);
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
        body: JSON.stringify({
          name: newLocationName,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        fetchLocations(selectedTenant);
        setNewLocationName('');
        alert('Location created!');
      }
    } catch (error) {
      console.error('Error creating location:', error);
    }
    setLoading(false);
  };

  return (
    <div className="min-h-screen bg-gray-100 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="bg-white rounded-lg shadow-lg p-6 mb-6">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 mb-2">Super Admin Panel</h1>
              <p className="text-gray-600">Manage tenants, locations, and system configuration</p>
            </div>
            <button
              onClick={() => {
                sessionStorage.removeItem('admin_authenticated');
                setIsAuthenticated(false);
              }}
              className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
            >
              Logout
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Tenants Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Tenants</h2>
            
            <form onSubmit={handleCreateTenant} className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Create New Tenant
              </label>
              <div className="space-y-2 mb-2">
                <input
                  type="text"
                  value={newTenantName}
                  onChange={(e) => {
                    setNewTenantName(e.target.value);
                    // Auto-generate slug
                    setNewTenantSlug(e.target.value.toLowerCase().replace(/[^a-z0-9]+/g, '-'));
                  }}
                  placeholder="Restaurant name (e.g., Pizza Roma)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <input
                  type="text"
                  value={newTenantSlug}
                  onChange={(e) => setNewTenantSlug(e.target.value.toLowerCase().replace(/[^a-z0-9-]/g, ''))}
                  placeholder="Subdomain (e.g., pizza-roma)"
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                  required
                />
                <p className="text-xs text-gray-500">
                  Will be: {newTenantSlug || 'subdomain'}.tuordenya.com
                </p>
              </div>
              <button
                type="submit"
                disabled={loading}
                className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 disabled:opacity-50"
              >
                Create
              </button>
            </form>

            <div className="space-y-2">
              {tenants.map((tenant) => (
                <div
                  key={tenant.id}
                  onClick={() => setSelectedTenant(tenant.id)}
                  className={`p-4 rounded-lg cursor-pointer transition-colors ${
                    selectedTenant === tenant.id
                      ? 'bg-blue-100 border-2 border-blue-500'
                      : 'bg-gray-50 hover:bg-gray-100 border-2 border-transparent'
                  }`}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h3 className="font-semibold text-gray-900">{tenant.name}</h3>
                      <p className="text-sm text-gray-600">ID: {tenant.id}</p>
                      {tenant.slug && (
                        <p className="text-sm text-blue-600">{tenant.slug}.tuordenya.com</p>
                      )}
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedTenant === tenant.id && '✓ Selected'}
                    </div>
                  </div>
                </div>
              ))}
              {tenants.length === 0 && (
                <p className="text-gray-500 text-center py-8">No tenants yet. Create one above!</p>
              )}
            </div>
          </div>

          {/* Locations Section */}
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-gray-900 mb-4">Locations</h2>
            
            {selectedTenant ? (
              <>
                <form onSubmit={handleCreateLocation} className="mb-6">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Add Location for {tenants.find(t => t.id === selectedTenant)?.name}
                  </label>
                  <div className="flex gap-2">
                    <input
                      type="text"
                      value={newLocationName}
                      onChange={(e) => setNewLocationName(e.target.value)}
                      placeholder="Location name (e.g., Main Street)"
                      className="flex-1 px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-green-500 focus:border-transparent"
                      required
                    />
                    <button
                      type="submit"
                      disabled={loading}
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 disabled:opacity-50"
                    >
                      Add
                    </button>
                  </div>
                </form>

                <div className="space-y-2">
                  {locations.map((location) => (
                    <div
                      key={location.id}
                      className="p-4 bg-gray-50 rounded-lg border border-gray-200"
                    >
                      <h3 className="font-semibold text-gray-900">{location.name}</h3>
                      <p className="text-sm text-gray-600">Location ID: {location.id}</p>
                      <a
                        href={`/backoffice/${selectedTenant}?location=${location.id}`}
                        className="text-sm text-blue-600 hover:underline mt-2 inline-block"
                      >
                        → Manage Menu
                      </a>
                    </div>
                  ))}
                  {locations.length === 0 && (
                    <p className="text-gray-500 text-center py-8">No locations yet. Add one above!</p>
                  )}
                </div>
              </>
            ) : (
              <p className="text-gray-500 text-center py-16">
                Select a tenant to manage locations
              </p>
            )}
          </div>
        </div>

        {/* Quick Links */}
        {selectedTenant && (
          <div className="bg-white rounded-lg shadow p-6 mt-6">
            <h2 className="text-xl font-bold text-gray-900 mb-4">Quick Links</h2>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <a
                href={`/backoffice/${selectedTenant}`}
                className="p-4 bg-orange-50 rounded-lg border-2 border-orange-200 hover:bg-orange-100 transition-colors"
              >
                <h3 className="font-semibold text-orange-900">Backoffice</h3>
                <p className="text-sm text-orange-700">Manage menu & settings</p>
              </a>
              <a
                href={`/${selectedTenant}`}
                className="p-4 bg-blue-50 rounded-lg border-2 border-blue-200 hover:bg-blue-100 transition-colors"
              >
                <h3 className="font-semibold text-blue-900">Customer Menu</h3>
                <p className="text-sm text-blue-700">View as customer</p>
              </a>
              <a
                href={`/kds/${selectedTenant}`}
                className="p-4 bg-purple-50 rounded-lg border-2 border-purple-200 hover:bg-purple-100 transition-colors"
              >
                <h3 className="font-semibold text-purple-900">Kitchen Display</h3>
                <p className="text-sm text-purple-700">View orders</p>
              </a>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
