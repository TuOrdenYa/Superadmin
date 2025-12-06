'use client';

import { useState, useEffect, useCallback } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';

interface Category {
  id: number;
  name: string;
  position: number;
  active: boolean;
}

interface MenuItem {
  id: number;
  name: string;
  description?: string;
  price: string;
  category_id: number;
  active: boolean;
  price_override?: string;
  location_active?: boolean;
}

interface Table {
  id: number;
  location_id: number;
  number: string;
  tenant_id: number;
  location_name?: string;
}

interface Location {
  id: number;
  name: string;
  tenant_id: number;
}

export default function BackofficePage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = use(params);
  const tenantId = parseInt(tenant);
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [tenantName, setTenantName] = useState<string>('');
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [view, setView] = useState<'categories' | 'items' | 'variants' | 'tables'>('items');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<{
    id: number;
    full_name: string;
    email: string;
    tenant_id: number;
    role: string;
    location_id: number | null;
    location_name?: string;
  } | null>(null);
  
  // Form states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showTableForm, setShowTableForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', position: 0 });
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category_id: 0,
  });
  const [newTable, setNewTable] = useState({
    location_id: 0,
    number: '',
  });

  // Fetch categories
  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`/api/categories?tenant_id=${tenantId}`);
      const data = await res.json();
      if (data.ok) setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [tenantId]);

  // Fetch locations
  const fetchLocations = useCallback(async () => {
    try {
      const res = await fetch(`/api/tenants/${tenantId}/locations`);
      const data = await res.json();
      if (data.ok) setLocations(data.locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  }, [tenantId]);

  // Fetch tables
  const fetchTables = useCallback(async () => {
    try {
      const locationParam = user?.role === 'manager' && user?.location_id 
        ? `?location_id=${user.location_id}` 
        : '';
      const res = await fetch(`/api/tenants/${tenantId}/tables${locationParam}`);
      const data = await res.json();
      if (data.ok) setTables(data.tables);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  }, [tenantId, user]);

  // Fetch items
  const fetchItems = useCallback(async () => {
    try {
      // For managers, filter by their location. For admins, show all.
      const locationParam = user?.role === 'manager' && user?.location_id 
        ? `&location_id=${user.location_id}` 
        : '';
      const res = await fetch(`/api/backoffice/items?tenant_id=${tenantId}${locationParam}`);
      const data = await res.json();
      if (data.ok) setItems(data.items);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }, [tenantId, user]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/backoffice/login');
  };

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      router.push('/backoffice/login');
      return;
    }

    try {
      const userData = JSON.parse(userStr);
      // Verify user belongs to this tenant
      if (userData.tenant_id !== tenantId) {
        alert('Access denied to this tenant');
        router.push('/backoffice/login');
        return;
      }
      setUser(userData);
      setIsAuthenticated(true);
    } catch {
      router.push('/backoffice/login');
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, router]);

  // Fetch data when authenticated
  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
      fetchItems();
      fetchLocations();
      fetchTables();
      
      // Fetch tenant name
      const fetchTenantName = async () => {
        try {
          const res = await fetch(`/api/admin/tenants/${tenantId}`);
          const data = await res.json();
          if (data.ok) {
            setTenantName(data.tenant.name);
          }
        } catch (error) {
          console.error('Error fetching tenant name:', error);
        }
      };
      fetchTenantName();
    }
  }, [isAuthenticated, fetchCategories, fetchItems, fetchLocations, fetchTables]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-gray-600">Loading...</div>
      </div>
    );
  }

  if (!isAuthenticated) {
    return null;
  }

  // Create category
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          ...newCategory,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        fetchCategories();
        setNewCategory({ name: '', position: 0 });
        setShowCategoryForm(false);
      }
    } catch (error) {
      console.error('Error creating category:', error);
    }
  };

  // Create item
  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          ...newItem,
          price: parseFloat(newItem.price),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        fetchItems();
        setNewItem({ name: '', description: '', price: '', category_id: 0 });
        setShowItemForm(false);
      }
    } catch (error) {
      console.error('Error creating item:', error);
    }
  };

  // Toggle item active
  const toggleItemActive = async (itemId: number, currentActive: boolean) => {
    try {
      console.log('Toggling item:', itemId, 'from', currentActive, 'to', !currentActive);
      const res = await fetch(`/api/items/${itemId}/active`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          active: !currentActive,
        }),
      });
      
      const data = await res.json();
      console.log('Toggle response:', data);
      
      if (res.ok) {
        alert(`Item ${!currentActive ? 'activated' : 'deactivated'} successfully!`);
        fetchItems();
      } else {
        alert(`Error: ${data.error || 'Failed to toggle item'}`);
      }
    } catch (error) {
      console.error('Error toggling item:', error);
      alert('Network error - check console');
    }
  };

  const filteredItems = selectedCategory
    ? items.filter(item => item.category_id === selectedCategory)
    : items;

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div>
              <h1 className="text-3xl font-bold text-white">Backoffice</h1>
              <p className="text-blue-100">
                {tenantName && <span className="font-semibold">{tenantName}</span>}
                {tenantName && ' • '}
                {user?.full_name} • {user?.role === 'tenant_admin' ? 'Admin' : user?.role === 'manager' ? 'Manager' : 'Waiter'}
                {user?.location_name && ` • ${user.location_name}`}
              </p>
            </div>
            <div className="flex gap-2">
              {user?.role === 'tenant_admin' && (
                <a
                  href="/admin"
                  className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
                >
                  ← Back to Admin
                </a>
              )}
              <button
                onClick={handleLogout}
                className="px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700"
              >
                Logout
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button
              onClick={() => setView('items')}
              className={`py-4 px-1 border-b-2 font-bold text-sm ${
                view === 'items'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Menu Items
            </button>
            {user?.role === 'tenant_admin' && (
              <>
                <button
                  onClick={() => setView('categories')}
                  className={`py-4 px-1 border-b-2 font-bold text-sm ${
                    view === 'categories'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Categories
                </button>
                <button
                  onClick={() => setView('tables')}
                  className={`py-4 px-1 border-b-2 font-bold text-sm ${
                    view === 'tables'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Tables
                </button>
                <button
                  onClick={() => setView('variants')}
                  className={`py-4 px-1 border-b-2 font-bold text-sm ${
                    view === 'variants'
                      ? 'border-blue-500 text-blue-600'
                      : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
                  }`}
                >
                  Variants
                </button>
              </>
            )}
          </nav>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* CATEGORIES VIEW */}
        {view === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Categories</h2>
              {user?.role === 'tenant_admin' && (
                <button
                  onClick={() => setShowCategoryForm(!showCategoryForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Add Category
                </button>
              )}
            </div>

            {showCategoryForm && user?.role === 'tenant_admin' && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-bold text-black mb-4">New Category</h3>
                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Name
                    </label>
                    <input
                      type="text"
                      value={newCategory.name}
                      onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold"
                      required
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Position
                    </label>
                    <input
                      type="number"
                      value={newCategory.position}
                      onChange={(e) => setNewCategory({ ...newCategory, position: parseInt(e.target.value) })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold"
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Create
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowCategoryForm(false)}
                      className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow p-6">
                  <h3 className="text-lg font-bold text-black">{category.name}</h3>
                  <p className="text-sm text-black">Position: {category.position}</p>
                  <p className="text-sm text-black">
                    Status: <span className={category.active ? 'text-green-600' : 'text-red-600'}>
                      {category.active ? 'Active' : 'Inactive'}
                    </span>
                  </p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TABLES VIEW */}
        {view === 'tables' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Tables Management</h2>
              {user?.role === 'tenant_admin' && (
                <button
                  onClick={() => setShowTableForm(!showTableForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Add Table
                </button>
              )}
            </div>

            {/* Create Table Form */}
            {showTableForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-bold text-black mb-4">Create New Table</h3>
                <form
                  onSubmit={async (e) => {
                    e.preventDefault();
                    try {
                      const res = await fetch(`/api/tenants/${tenantId}/tables`, {
                        method: 'POST',
                        headers: { 'Content-Type': 'application/json' },
                        body: JSON.stringify(newTable),
                      });
                      const data = await res.json();
                      if (data.ok) {
                        alert('Table created!');
                        setNewTable({ location_id: 0, number: '' });
                        setShowTableForm(false);
                        fetchTables();
                      } else {
                        alert(data.error);
                      }
                    } catch (error) {
                      console.error('Error:', error);
                      alert('Failed to create table');
                    }
                  }}
                  className="space-y-4"
                >
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Location *</label>
                      <select
                        value={newTable.location_id}
                        onChange={(e) => setNewTable({ ...newTable, location_id: parseInt(e.target.value) })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold"
                        required
                      >
                        <option value="">Select location...</option>
                        {locations.map((loc) => (
                          <option key={loc.id} value={loc.id}>
                            {loc.name}
                          </option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Table Number *</label>
                      <input
                        type="text"
                        value={newTable.number}
                        onChange={(e) => setNewTable({ ...newTable, number: e.target.value })}
                        className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold"
                        placeholder="e.g., 1, 2, A1, B5"
                        required
                      />
                    </div>
                  </div>
                  <button
                    type="submit"
                    className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700"
                  >
                    Create Table
                  </button>
                </form>
              </div>
            )}

            {/* Tables List */}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">Table #</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">Location</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">QR Code URL</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tables.map((table) => (
                    <tr key={table.id}>
                      <td className="px-6 py-4 text-sm font-bold text-black">{table.number}</td>
                      <td className="px-6 py-4 text-sm text-black">{table.location_name || `Location ${table.location_id}`}</td>
                      <td className="px-6 py-4 text-sm">
                        <code className="bg-gray-100 px-2 py-1 rounded text-xs text-blue-600">
                          /menu?table={table.id}
                        </code>
                      </td>
                      <td className="px-6 py-4 text-sm space-x-2">
                        <button
                          onClick={async () => {
                            if (confirm(`Delete table ${table.number}?`)) {
                              try {
                                const res = await fetch(`/api/tenants/${tenantId}/tables/${table.id}`, {
                                  method: 'DELETE',
                                });
                                const data = await res.json();
                                if (data.ok) {
                                  alert('Table deleted!');
                                  fetchTables();
                                } else {
                                  alert(data.error);
                                }
                              } catch (error) {
                                alert('Failed to delete table');
                              }
                            }
                          }}
                          className="text-red-600 hover:text-red-800 font-semibold"
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {tables.length === 0 && (
                <div className="text-center py-8 text-gray-500">
                  No tables found. Create one to get started.
                </div>
              )}
            </div>
          </div>
        )}

        {/* ITEMS VIEW */}
        {view === 'items' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Menu Items</h2>
              {user?.role === 'tenant_admin' && (
                <button
                  onClick={() => setShowItemForm(!showItemForm)}
                  className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
                >
                  + Add Item
                </button>
              )}
            </div>

            {/* Category Filter */}
            <div className="mb-6 flex gap-2 flex-wrap">
              <button
                onClick={() => setSelectedCategory(null)}
                className={`px-4 py-2 rounded-lg ${
                  selectedCategory === null
                    ? 'bg-blue-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
              >
                All
              </button>
              {categories.map((cat) => (
                <button
                  key={cat.id}
                  onClick={() => setSelectedCategory(cat.id)}
                  className={`px-4 py-2 rounded-lg ${
                    selectedCategory === cat.id
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                  }`}
                >
                  {cat.name}
                </button>
              ))}
            </div>

            {showItemForm && user?.role === 'tenant_admin' && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-bold text-black mb-4">New Menu Item</h3>
                <form onSubmit={handleCreateItem} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Name *
                      </label>
                      <input
                        type="text"
                        value={newItem.name}
                        onChange={(e) => setNewItem({ ...newItem, name: e.target.value })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold"
                        required
                      />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">
                        Category *
                      </label>
                      <select
                        value={newItem.category_id}
                        onChange={(e) => setNewItem({ ...newItem, category_id: parseInt(e.target.value) })}
                        className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold"
                        required
                      >
                        <option value={0}>Select category</option>
                        {categories.map((cat) => (
                          <option key={cat.id} value={cat.id}>
                            {cat.name}
                          </option>
                        ))}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Description
                    </label>
                    <textarea
                      value={newItem.description}
                      onChange={(e) => setNewItem({ ...newItem, description: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold"
                      rows={3}
                    />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">
                      Price *
                    </label>
                    <input
                      type="number"
                      step="0.01"
                      value={newItem.price}
                      onChange={(e) => setNewItem({ ...newItem, price: e.target.value })}
                      className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold"
                      required
                    />
                  </div>
                  <div className="flex gap-2">
                    <button
                      type="submit"
                      className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                    >
                      Create Item
                    </button>
                    <button
                      type="button"
                      onClick={() => setShowItemForm(false)}
                      className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400"
                    >
                      Cancel
                    </button>
                  </div>
                </form>
              </div>
            )}

            {/* Items Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-black">{item.name}</h3>
                      <button
                        onClick={() => user?.role === 'tenant_admin' && toggleItemActive(item.id, item.active)}
                        disabled={user?.role !== 'tenant_admin'}
                        className={`px-3 py-1 rounded text-sm font-medium cursor-pointer ${
                          item.active
                            ? 'bg-green-100 text-green-800 hover:bg-green-200'
                            : 'bg-red-100 text-red-800 hover:bg-red-200'
                        } ${user?.role !== 'tenant_admin' ? 'opacity-50 cursor-not-allowed' : ''}`}
                        title={user?.role !== 'tenant_admin' ? 'Only admins can toggle item status' : 'Click to toggle'}
                      >
                        {item.active ? 'Active' : 'Inactive'}
                      </button>
                    </div>
                    {item.description && (
                      <p className="text-black text-sm mb-3">{item.description}</p>
                    )}
                    <div className="flex justify-between items-center">
                      <span className="text-2xl font-bold text-black">${item.price}</span>
                      <span className="text-sm text-black">
                        {categories.find(c => c.id === item.category_id)?.name}
                      </span>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && (
              <p className="text-center text-black py-16">
                No items found. Create one above!
              </p>
            )}
          </div>
        )}

        {/* VARIANTS VIEW */}
        {view === 'variants' && (
          <div className="bg-white rounded-lg shadow p-6">
            <h2 className="text-2xl font-bold text-black mb-4">Variants Management</h2>
            <p className="text-black">Variants configuration coming soon...</p>
          </div>
        )}
      </div>
    </div>
  );
}
