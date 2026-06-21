'use client';

import { useState, useEffect, useCallback } from 'react';
import { use } from 'react';
import { useRouter } from 'next/navigation';
import UpgradePrompt from '@/app/components/UpgradePrompt';
import BannerAd from '@/app/components/BannerAd';
import LanguageSwitcher from '@/app/components/LanguageSwitcher';
import { useLanguage } from '@/lib/LanguageContext';

interface Category {
  id: string;
  name: string;
  position: number;
  active: boolean;
  is_custom?: boolean;
}

interface MenuItem {
  id: string;
  name: string;
  description?: string;
  price: string;
  category_id: string;
  active: boolean;
}

interface Table {
  id: string;
  location_id: string;
  number: string;
  tenant_id: string;
  location_name?: string;
}

interface Location {
  id: string;
  name: string;
  tenant_id: string;
}

export default function BackofficePage({ params }: { params: Promise<{ tenant: string }> }) {
  const { tenant } = use(params);
  const tenantId = tenant;
  const router = useRouter();
  const { t, locale } = useLanguage();

  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [tables, setTables] = useState<Table[]>([]);
  const [locations, setLocations] = useState<Location[]>([]);
  const [tenantName, setTenantName] = useState<string>('');
  const [tenantAdFree, setTenantAdFree] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [view, setView] = useState<'categories' | 'items' | 'variants' | 'tables'>('items');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Form states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showTableForm, setShowTableForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', position: 0 });
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category_id: '' });
  const [newTable, setNewTable] = useState({ location_id: '', number: '' });

  // Edit modal state
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', category_id: '' });

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`/api/categories?tenant_id=${tenantId}`);
      const data = await res.json();
      if (data.ok) setCategories(data.categories);
    } catch (error) {
      console.error('Error fetching categories:', error);
    }
  }, [tenantId]);

  const fetchLocations = useCallback(async () => {
    try {
      const res = await fetch(`/api/tenants/${tenantId}/locations`);
      const data = await res.json();
      if (data.ok) setLocations(data.locations);
    } catch (error) {
      console.error('Error fetching locations:', error);
    }
  }, [tenantId]);

  const fetchTables = useCallback(async () => {
    try {
      const locationParam = user?.role === 'manager' && user?.location_id ? `?location_id=${user.location_id}` : '';
      const res = await fetch(`/api/tenants/${tenantId}/tables${locationParam}`);
      const data = await res.json();
      if (data.ok) setTables(data.tables);
    } catch (error) {
      console.error('Error fetching tables:', error);
    }
  }, [tenantId, user]);

  const fetchItems = useCallback(async () => {
    try {
      const locationParam = user?.role === 'manager' && user?.location_id ? `&location_id=${user.location_id}` : '';
      const res = await fetch(`/api/backoffice/items?tenant_id=${tenantId}${locationParam}`);
      const data = await res.json();
      if (data.ok) setItems(data.items);
    } catch (error) {
      console.error('Error fetching items:', error);
    }
  }, [tenantId, user]);

  const handleLogout = () => {
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    router.push('/backoffice/login');
  };

  useEffect(() => {
    const token = localStorage.getItem('auth_token');
    const userStr = localStorage.getItem('user');
    if (!token || !userStr) { router.push('/backoffice/login'); return; }
    try {
      const userData = JSON.parse(userStr);
      if (userData.tenant_tax_id !== tenantId) {
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

  useEffect(() => {
    if (isAuthenticated) {
      fetchCategories();
      fetchItems();
      fetchLocations();
      fetchTables();
      const fetchTenantInfo = async () => {
        try {
          const res = await fetch(`/api/admin/tenants/${tenantId}`);
          const data = await res.json();
          if (data.ok) { setTenantName(data.tenant.name); setTenantAdFree(!!data.tenant.ad_free); }
        } catch (error) { console.error('Error fetching tenant info:', error); }
      };
      fetchTenantInfo();
    }
  }, [isAuthenticated, fetchCategories, fetchItems, fetchLocations, fetchTables]);

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-600">Loading...</div></div>;
  if (!isAuthenticated) return null;

  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/categories', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: tenantId, ...newCategory, is_custom: true }),
      });
      const data = await res.json();
      if (data.ok) { fetchCategories(); setNewCategory({ name: '', position: 0 }); setShowCategoryForm(false); }
      else if (res.status === 403) alert(t('categories.customLimitMessage').replace('{limit}', data.limit || '0'));
      else alert(data.error || 'Error creating category');
    } catch (error) { alert('Error creating category'); }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/items', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: tenantId, ...newItem, price: parseFloat(newItem.price) }),
      });
      const data = await res.json();
      if (data.ok) { fetchItems(); setNewItem({ name: '', description: '', price: '', category_id: '' }); setShowItemForm(false); }
      else alert(data.error || 'Error creating item');
    } catch (error) { console.error('Error creating item:', error); }
  };

  const handleEditItem = (item: MenuItem) => {
    setEditingItem(item);
    setEditForm({ name: item.name, description: item.description || '', price: item.price, category_id: item.category_id });
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const res = await fetch(`/api/items/${editingItem.id}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: tenantId, ...editForm, price: parseFloat(editForm.price) }),
      });
      const data = await res.json();
      if (data.ok) { fetchItems(); setEditingItem(null); }
      else alert(data.error || 'Error updating item');
    } catch (error) { console.error('Error updating item:', error); }
  };

  const handleDeleteItem = async (itemId: string, itemName: string) => {
    if (!confirm(locale === 'es' ? `¿Eliminar "${itemName}"?` : `Delete "${itemName}"?`)) return;
    try {
      const res = await fetch(`/api/items/${itemId}?tenant_id=${tenantId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.ok) fetchItems();
      else alert(data.error || 'Error deleting item');
    } catch (error) { console.error('Error deleting item:', error); }
  };

  const toggleItemActive = async (itemId: string, currentActive: boolean) => {
    try {
      setItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, active: !currentActive } : item));
      const res = await fetch(`/api/items/${itemId}/active`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: tenantId, active: !currentActive }),
      });
      const data = await res.json();
      if (!res.ok) {
        setItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, active: currentActive } : item));
        alert(`Error: ${data.error || 'Failed to toggle item'}`);
      }
    } catch (error) {
      setItems(prevItems => prevItems.map(item => item.id === itemId ? { ...item, active: currentActive } : item));
    }
  };

  const filteredItems = selectedCategory ? items.filter(item => item.category_id === selectedCategory) : items;

  const getCategoryName = (cat: Category) => cat.is_custom ? cat.name : (t(`categories.names.${cat.name}`) || cat.name);

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {user?.product_tier === 'light' && !tenantAdFree && <BannerAd text="Upgrade to remove ads and unlock more features!" linkUrl="/subscription" marquee />}

      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between w-full gap-2 min-w-0">
            <div className="flex items-center gap-2 min-w-0 flex-shrink-0">
              <img src="/logo-tuordenya-orange.png" alt="TuOrdenYa Logo" width={36} height={36} className="h-9 w-auto flex-shrink-0" />
              <span className="font-bold text-gray-700 text-base md:text-lg leading-tight min-w-0 block truncate">{t('nav.backoffice')}</span>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-2 items-center justify-end w-full md:w-auto min-w-0">
              <span className="font-bold text-gray-700 text-sm md:text-lg leading-tight min-w-0 block truncate">
                {tenantName && <span className="font-bold">{tenantName}</span>}
                {tenantName && ' • '}
                <span className="font-bold">{user?.full_name}</span> • <span className="font-bold">{user?.role}</span>
                {user?.location_name && ` • ${user.location_name}`}
                {user?.product_tier && <> • <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-orange-50 text-orange-700 border border-orange-200">
                  {user.product_tier === 'light' && `✨ ${t('tiers.light')}`}
                  {user.product_tier === 'plus' && `⚡ ${t('tiers.plus')}`}
                  {user.product_tier === 'pro' && `🚀 ${t('tiers.pro')}`}
                </span></>}
              </span>
              <LanguageSwitcher />
              {user?.role === 'admin' && <a href="/subscription" className="px-3 py-2 bg-gradient-to-r from-orange-600 to-purple-600 text-white rounded-lg font-semibold text-xs md:text-base hover:from-blue-700 hover:to-purple-700 transition whitespace-nowrap">📊 {t('nav.mySubscription')}</a>}
              <button onClick={handleLogout} className="px-3 py-2 bg-red-600 text-white rounded-lg text-xs md:text-base font-semibold hover:bg-red-700 whitespace-nowrap">{t('nav.logout')}</button>
            </div>
          </div>
        </div>
      </header>

      {user?.product_tier === 'light' && !tenantAdFree && <BannerAd text="Try our partner services for restaurants!" linkUrl="https://partner.example.com" />}

      <div className="bg-white border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <nav className="flex space-x-8">
            <button onClick={() => setView('items')} className={`py-4 px-1 border-b-2 font-bold text-sm ${view === 'items' ? 'border-blue-500 text-blue-600' : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'}`}>{t('tabs.menuItems')}</button>
            {user?.role === 'admin' && <>
              <button onClick={() => setView('categories')} className={`py-4 px-1 border-b-2 font-bold text-sm ${view === 'categories' ? 'border-blue-500 text-blue-600' : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'}`}>{t('tabs.categories')}</button>
              <button onClick={() => setView('tables')} className={`py-4 px-1 border-b-2 font-bold text-sm relative ${view === 'tables' ? 'border-blue-500 text-blue-600' : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'}`}>{t('tabs.tables')}{user?.product_tier !== 'pro' && <span className="ml-1 text-xs">🔒</span>}</button>
              <button onClick={() => setView('variants')} className={`py-4 px-1 border-b-2 font-bold text-sm relative ${view === 'variants' ? 'border-blue-500 text-blue-600' : 'border-transparent text-black hover:text-gray-700 hover:border-gray-300'}`}>{t('tabs.variants')}{user?.product_tier !== 'pro' && <span className="ml-1 text-xs">🔒</span>}</button>
            </>}
          </nav>
        </div>
      </div>

      {/* Edit Item Modal */}
      {editingItem && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-black mb-4">{locale === 'es' ? 'Editar Item' : 'Edit Item'}</h3>
            <form onSubmit={handleUpdateItem} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-2">{t('menuItems.name')} *</label>
                <input type="text" value={editForm.name} onChange={(e) => setEditForm({ ...editForm, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">{t('menuItems.category')} *</label>
                <select value={editForm.category_id} onChange={(e) => setEditForm({ ...editForm, category_id: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" required>
                  <option value="">{locale === 'es' ? 'Seleccionar categoría' : 'Select category'}</option>
                  {categories.map((cat) => <option key={cat.id} value={cat.id}>{getCategoryName(cat)}</option>)}
                </select>
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">{t('menuItems.description')}</label>
                <textarea value={editForm.description} onChange={(e) => setEditForm({ ...editForm, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" rows={3} />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">{t('menuItems.price')} *</label>
                <input type="number" step="0.01" value={editForm.price} onChange={(e) => setEditForm({ ...editForm, price: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" required />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">{locale === 'es' ? 'Guardar' : 'Save'}</button>
                <button type="button" onClick={() => setEditingItem(null)} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">{t('common.cancel')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {view === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">{t('categories.title')}</h2>
              {user?.role === 'admin' && <button onClick={() => setShowCategoryForm(!showCategoryForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ {t('categories.addCategory')}</button>}
            </div>
            {showCategoryForm && user?.role === 'admin' && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-bold text-black mb-4">New Category</h3>
                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Name</label>
                    <input type="text" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">Position</label>
                    <input type="number" value={newCategory.position} onChange={(e) => setNewCategory({ ...newCategory, position: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">Create</button>
                    <button type="button" onClick={() => setShowCategoryForm(false)} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">Cancel</button>
                  </div>
                </form>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-black">{getCategoryName(category)}</h3>
                    {category.is_custom ? <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded">{t('categories.custom')}</span> : <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded">{t('categories.predefined')}</span>}
                  </div>
                  <p className="text-sm text-black">{t('categories.position')}: {category.position}</p>
                  <p className="text-sm text-black">{t('menuItems.status')}: <span className={category.active ? 'text-green-600' : 'text-red-600'}>{category.active ? t('common.active') : t('common.inactive')}</span></p>
                </div>
              ))}
            </div>
          </div>
        )}

        {view === 'tables' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">Tables Management</h2>
              {user?.role === 'admin' && <button onClick={() => setShowTableForm(!showTableForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ Add Table</button>}
            </div>
            {showTableForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <h3 className="text-lg font-bold text-black mb-4">Create New Table</h3>
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await fetch(`/api/tenants/${tenantId}/tables`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTable) });
                    const data = await res.json();
                    if (data.ok) { alert('Table created!'); setNewTable({ location_id: '', number: '' }); setShowTableForm(false); fetchTables(); } else alert(data.error);
                  } catch (error) { alert('Failed to create table'); }
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Location *</label>
                      <select value={newTable.location_id} onChange={(e) => setNewTable({ ...newTable, location_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold" required>
                        <option value="">Select location...</option>
                        {locations.map((loc) => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">Table Number *</label>
                      <input type="text" value={newTable.number} onChange={(e) => setNewTable({ ...newTable, number: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded focus:ring-2 focus:ring-blue-500 text-black font-semibold" placeholder="e.g., 1, 2, A1, B5" required />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700">Create Table</button>
                </form>
              </div>
            )}
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
                      <td className="px-6 py-4 text-sm"><code className="bg-gray-100 px-2 py-1 rounded text-xs text-blue-600">/menu?table={table.id}</code></td>
                      <td className="px-6 py-4 text-sm">
                        <button onClick={async () => { if (confirm(`Delete table ${table.number}?`)) { const res = await fetch(`/api/tenants/${tenantId}/tables/${table.id}`, { method: 'DELETE' }); const data = await res.json(); if (data.ok) { fetchTables(); } else alert(data.error); }}} className="text-red-600 hover:text-red-800 font-semibold">Delete</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {tables.length === 0 && <div className="text-center py-8 text-gray-500">No tables found. Create one to get started.</div>}
            </div>
          </div>
        )}

        {view === 'items' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">{t('menuItems.title')}</h2>
              {user?.role === 'admin' && <button onClick={() => setShowItemForm(!showItemForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700">+ {t('menuItems.addItem')}</button>}
            </div>

            <div className="mb-6 flex gap-2 flex-wrap">
              <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 rounded-lg ${selectedCategory === null ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{t('menuItems.all')}</button>
              {categories.map((cat) => (
                <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-2 rounded-lg ${selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{getCategoryName(cat)}</button>
              ))}
            </div>

            {showItemForm && user?.role === 'admin' && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-bold text-black mb-4">{t('menuItems.addItem')}</h3>
                <form onSubmit={handleCreateItem} className="space-y-4">
                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">{t('menuItems.name')} *</label>
                      <input type="text" value={newItem.name} onChange={(e) => setNewItem({ ...newItem, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">{t('menuItems.category')} *</label>
                      <select value={newItem.category_id} onChange={(e) => setNewItem({ ...newItem, category_id: e.target.value as any })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" required>
                        <option value="">{locale === 'es' ? 'Seleccionar categoría' : 'Select category'}</option>
                        {categories.map((cat) => <option key={cat.id} value={cat.id}>{getCategoryName(cat)}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">{t('menuItems.description')}</label>
                    <textarea value={newItem.description} onChange={(e) => setNewItem({ ...newItem, description: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" rows={3} />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">{t('menuItems.price')} *</label>
                    <input type="number" step="0.01" value={newItem.price} onChange={(e) => setNewItem({ ...newItem, price: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" required />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700">{locale === 'es' ? 'Crear Item' : 'Create Item'}</button>
                    <button type="button" onClick={() => setShowItemForm(false)} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400">{t('common.cancel')}</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredItems.map((item) => (
                <div key={item.id} className="bg-white rounded-lg shadow overflow-hidden">
                  <div className="p-6">
                    <div className="flex justify-between items-start mb-2">
                      <h3 className="text-lg font-bold text-black">{item.name}</h3>
                      <button onClick={() => user?.role === 'admin' && toggleItemActive(item.id, item.active)} disabled={user?.role !== 'admin'} className={`px-3 py-1 rounded text-sm font-medium cursor-pointer ${item.active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'} ${user?.role !== 'admin' ? 'opacity-50 cursor-not-allowed' : ''}`}>
                        {item.active ? t('common.active') : t('common.inactive')}
                      </button>
                    </div>
                    {item.description && <p className="text-black text-sm mb-3">{item.description}</p>}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-bold text-black">${item.price}</span>
                      <span className="text-sm text-black">{(() => { const category = categories.find(c => c.id === item.category_id); if (!category) return ''; return getCategoryName(category); })()}</span>
                    </div>
                    {user?.role === 'admin' && (
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <button onClick={() => handleEditItem(item)} className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm font-medium">
                          ✏️ {locale === 'es' ? 'Editar' : 'Edit'}
                        </button>
                        <button onClick={() => handleDeleteItem(item.id, item.name)} className="flex-1 px-3 py-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100 text-sm font-medium">
                          🗑️ {locale === 'es' ? 'Eliminar' : 'Delete'}
                        </button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {filteredItems.length === 0 && <p className="text-center text-black py-16">{locale === 'es' ? 'No se encontraron items. ¡Crea uno arriba!' : 'No items found. Create one above!'}</p>}
          </div>
        )}

        {view === 'variants' && (
          <div className="max-w-4xl mx-auto mt-8">
            {user?.product_tier === 'pro' ? (
              <div className="bg-white rounded-lg shadow p-6"><h2 className="text-2xl font-bold text-black mb-4">Variants Management</h2><p className="text-black">Variants configuration coming soon...</p></div>
            ) : (
              <UpgradePrompt feature="Product Variants" currentTier={user?.product_tier || 'light'} requiredTier="pro" message="Product Variants allow you to create options like size, add-ons, and customizations. This feature requires the Pro tier." />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
