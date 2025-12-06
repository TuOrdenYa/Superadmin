'use client';

import { useState, useEffect } from 'react';
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

export default function BackofficePage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = use(params);
  const tenantId = parseInt(tenant);
  const router = useRouter();

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<number | null>(null);
  const [view, setView] = useState<'categories' | 'items' | 'variants'>('items');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  
  // Form states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', position: 0 });
  const [newItem, setNewItem] = useState({
    name: '',
    description: '',
    price: '',
    category_id: 0,
  });

  // Check authentication
  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    
    if (!token || !userStr) {
      router.push('/backoffice/login');
      return;
    }

    try {
      const user = JSON.parse(userStr);
      // Verify user belongs to this tenant
      if (user.tenant_id !== tenantId) {
        alert('Access denied to this tenant');
        router.push('/backoffice/login');
        return;
      }
      setIsAuthenticated(true);
    } catch {
      router.push('/backoffice/login');
    } finally {
      setIsLoading(false);
    }
  }, [tenantId, router]);

  // Logout function
  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/backoffice/login');
  };

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

  // Fetch categories
  const fetchCategories = async () => {
    try {
      const res = await fetch(`/api/categories?tenant_id=${tenantId}`);
      const data = await res.json();
      if (data.ok) setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  };

  // Fetch items
  const fetchItems = async () => {
    try {
      const res = await fetch(`/api/backoffice/items?tenant_id=${tenantId}&location_id=1`);
      const data = await res.json();
      if (data.ok) setItems(data.items);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  };

  useEffect(() => {
    fetchCategories();
    fetchItems();
  }, [tenantId]);

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
      const res = await fetch(`/api/items/${itemId}/active`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          active: !currentActive,
        }),
      });
      if (res.ok) fetchItems();
    } catch (error) {
      console.error('Error toggling item:', error);
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
              <p className="text-blue-100">Tenant ID: {tenantId}</p>
            </div>
            <div className="flex gap-2">
              <a
                href="/admin"
                className="px-4 py-2 bg-gray-600 text-white rounded-lg hover:bg-gray-700"
              >
                ← Back to Admin
              </a>
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
              onClick={() => setView('variants')}
              className={`py-4 px-1 border-b-2 font-bold text-sm ${
                view === 'variants'
                  ? 'border-blue-500 text-blue-600'
                  : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'
              }`}
            >
              Variants
            </button>
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
              <button
                onClick={() => setShowCategoryForm(!showCategoryForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Add Category
              </button>
            </div>

            {showCategoryForm && (
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

        {/* ITEMS VIEW */}
        {view === 'items' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Menu Items</h2>
              <button
                onClick={() => setShowItemForm(!showItemForm)}
                className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                + Add Item
              </button>
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

            {showItemForm && (
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
                        onClick={() => toggleItemActive(item.id, item.active)}
                        className={`px-3 py-1 rounded text-sm font-medium ${
                          item.active
                            ? 'bg-green-100 text-green-800'
                            : 'bg-red-100 text-red-800'
                        }`}
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
