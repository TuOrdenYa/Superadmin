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
  address?: string;
  phone?: string;
  tenant_id: string;
}

interface TeamUser {
  id: string;
  email: string;
  full_name: string;
  role: string;
  is_active: boolean;
  location_id: string | null;
  location_name?: string;
  created_at: string;
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
  const [teamUsers, setTeamUsers] = useState<TeamUser[]>([]);
  const [tenantName, setTenantName] = useState<string>('');
  const [tenantAdFree, setTenantAdFree] = useState<boolean>(false);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [view, setView] = useState<'items' | 'categories' | 'locations' | 'tables' | 'team' | 'variants'>('items');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<any>(null);

  // Form states
  const [showCategoryForm, setShowCategoryForm] = useState(false);
  const [showItemForm, setShowItemForm] = useState(false);
  const [showTableForm, setShowTableForm] = useState(false);
  const [showUserForm, setShowUserForm] = useState(false);
  const [showLocationForm, setShowLocationForm] = useState(false);
  const [newCategory, setNewCategory] = useState({ name: '', position: 0 });
  const [newItem, setNewItem] = useState({ name: '', description: '', price: '', category_id: '' });
  const [newTable, setNewTable] = useState({ location_id: '', number: '' });
  const [newUser, setNewUser] = useState({ full_name: '', email: '', role: 'waiter', location_id: '', password: '' });
  const [newLocation, setNewLocation] = useState({ name: '', address: '', phone: '' });

  // Edit states
  const [editingItem, setEditingItem] = useState<MenuItem | null>(null);
  const [editForm, setEditForm] = useState({ name: '', description: '', price: '', category_id: '' });
  const [editingLocation, setEditingLocation] = useState<Location | null>(null);
  const [editLocationForm, setEditLocationForm] = useState({ name: '', address: '', phone: '' });

  // Password modal
  const [createdPassword, setCreatedPassword] = useState<string | null>(null);
  const [createdUserEmail, setCreatedUserEmail] = useState<string>('');

  const fetchCategories = useCallback(async () => {
    try {
      const res = await fetch(`/api/categories?tenant_id=${tenantId}`);
      const data = await res.json();
      if (data.ok) setCategories(data.categories);
    } catch (error) { console.error('Error fetching categories:', error); }
  }, [tenantId]);

  const fetchLocations = useCallback(async () => {
    try {
      const res = await fetch(`/api/tenants/${tenantId}/locations`);
      const data = await res.json();
      if (data.ok) setLocations(data.locations);
    } catch (error) { console.error('Error fetching locations:', error); }
  }, [tenantId]);

  const fetchTables = useCallback(async () => {
    try {
      const locationParam = user?.role === 'manager' && user?.location_id ? `?location_id=${user.location_id}` : '';
      const res = await fetch(`/api/tenants/${tenantId}/tables${locationParam}`);
      const data = await res.json();
      if (data.ok) setTables(data.tables);
    } catch (error) { console.error('Error fetching tables:', error); }
  }, [tenantId, user]);

  const fetchItems = useCallback(async () => {
    try {
      const locationParam = user?.role === 'manager' && user?.location_id ? `&location_id=${user.location_id}` : '';
      const res = await fetch(`/api/backoffice/items?tenant_id=${tenantId}${locationParam}`);
      const data = await res.json();
      if (data.ok) setItems(data.items);
    } catch (error) { console.error('Error fetching items:', error); }
  }, [tenantId, user]);

  const fetchTeamUsers = useCallback(async () => {
    try {
      const res = await fetch(`/api/admin/users?tenant_id=${tenantId}`);
      const data = await res.json();
      if (data.ok) setTeamUsers(data.users);
    } catch (error) { console.error('Error fetching team users:', error); }
  }, [tenantId]);

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
      fetchTeamUsers();
      const fetchTenantInfo = async () => {
        try {
          const res = await fetch(`/api/admin/tenants/${tenantId}`);
          const data = await res.json();
          if (data.ok) { setTenantName(data.tenant.name); setTenantAdFree(!!data.tenant.ad_free); }
        } catch (error) { console.error('Error fetching tenant info:', error); }
      };
      fetchTenantInfo();
    }
  }, [isAuthenticated, fetchCategories, fetchItems, fetchLocations, fetchTables, fetchTeamUsers]);

  if (isLoading) return <div className="min-h-screen bg-gray-50 flex items-center justify-center"><div className="text-gray-600">Loading...</div></div>;
  if (!isAuthenticated) return null;

  // Handlers
  const handleCreateCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/categories', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tenant_id: tenantId, ...newCategory, is_custom: true }) });
      const data = await res.json();
      if (data.ok) { fetchCategories(); setNewCategory({ name: '', position: 0 }); setShowCategoryForm(false); }
      else if (res.status === 403) alert(t('categories.customLimitMessage').replace('{limit}', data.limit || '0'));
      else alert(data.error || 'Error creating category');
    } catch { alert('Error creating category'); }
  };

  const handleCreateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/items', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tenant_id: tenantId, ...newItem, price: parseFloat(newItem.price) }) });
      const data = await res.json();
      if (data.ok) { fetchItems(); setNewItem({ name: '', description: '', price: '', category_id: '' }); setShowItemForm(false); }
      else alert(data.error || 'Error creating item');
    } catch { console.error('Error creating item'); }
  };

  const handleUpdateItem = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingItem) return;
    try {
      const res = await fetch(`/api/items/${editingItem.id}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tenant_id: tenantId, ...editForm, price: parseFloat(editForm.price) }) });
      const data = await res.json();
      if (data.ok) { fetchItems(); setEditingItem(null); }
      else alert(data.error || 'Error updating item');
    } catch { console.error('Error updating item'); }
  };

  const handleDeleteItem = async (itemId: string, itemName: string) => {
    if (!confirm(locale === 'es' ? `¿Eliminar "${itemName}"?` : `Delete "${itemName}"?`)) return;
    try {
      const res = await fetch(`/api/items/${itemId}?tenant_id=${tenantId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.ok) fetchItems();
      else alert(data.error || 'Error deleting item');
    } catch { console.error('Error deleting item'); }
  };

  const toggleItemActive = async (itemId: string, currentActive: boolean) => {
    setItems(prev => prev.map(i => i.id === itemId ? { ...i, active: !currentActive } : i));
    try {
      const res = await fetch(`/api/items/${itemId}/active`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tenant_id: tenantId, active: !currentActive }) });
      if (!res.ok) setItems(prev => prev.map(i => i.id === itemId ? { ...i, active: currentActive } : i));
    } catch {
      setItems(prev => prev.map(i => i.id === itemId ? { ...i, active: currentActive } : i));
    }
  };

  const handleCreateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch(`/api/tenants/${tenantId}/locations`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newLocation) });
      const data = await res.json();
      if (data.ok) { fetchLocations(); setNewLocation({ name: '', address: '', phone: '' }); setShowLocationForm(false); }
      else alert(data.error || 'Error creating location');
    } catch { alert('Error creating location'); }
  };

  const handleUpdateLocation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!editingLocation) return;
    try {
      const res = await fetch(`/api/tenants/${tenantId}/locations`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ id: editingLocation.id, ...editLocationForm }) });
      const data = await res.json();
      if (data.ok) { fetchLocations(); setEditingLocation(null); }
      else alert(data.error || 'Error updating location');
    } catch { alert('Error updating location'); }
  };

  const handleDeleteLocation = async (locationId: string, locationName: string) => {
    if (!confirm(locale === 'es' ? `¿Eliminar local "${locationName}"?` : `Delete location "${locationName}"?`)) return;
    try {
      const res = await fetch(`/api/tenants/${tenantId}/locations?id=${locationId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.ok) fetchLocations();
      else alert(data.error || 'Error deleting location');
    } catch { alert('Error deleting location'); }
  };

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const res = await fetch('/api/admin/users', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tenant_id: tenantId, ...newUser }) });
      const data = await res.json();
      if (data.ok) {
        fetchTeamUsers();
        setNewUser({ full_name: '', email: '', role: 'waiter', location_id: '', password: '' });
        setShowUserForm(false);
        setCreatedPassword(data.password);
        setCreatedUserEmail(data.user.email);
      } else alert(data.error || 'Error creating user');
    } catch { console.error('Error creating user'); }
  };

  const handleToggleUserActive = async (userId: string, currentActive: boolean) => {
    try {
      const res = await fetch(`/api/admin/users/${userId}`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ tenant_id: tenantId, is_active: !currentActive }) });
      const data = await res.json();
      if (data.ok) fetchTeamUsers();
      else alert(data.error || 'Error updating user');
    } catch { console.error('Error toggling user'); }
  };

  const handleDeleteUser = async (userId: string, userName: string) => {
    if (!confirm(locale === 'es' ? `¿Eliminar usuario "${userName}"?` : `Delete user "${userName}"?`)) return;
    try {
      const res = await fetch(`/api/admin/users/${userId}?tenant_id=${tenantId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.ok) fetchTeamUsers();
      else alert(data.error || 'Error deleting user');
    } catch { console.error('Error deleting user'); }
  };

  const filteredItems = selectedCategory ? items.filter(i => i.category_id === selectedCategory) : items;
  const getCategoryName = (cat: Category) => cat.is_custom ? cat.name : (t(`categories.names.${cat.name}`) || cat.name);

  const roleColors: Record<string, string> = { admin: 'bg-purple-100 text-purple-700', manager: 'bg-blue-100 text-blue-700', waiter: 'bg-green-100 text-green-700', kitchen: 'bg-orange-100 text-orange-700' };
  const roleLabels: Record<string, string> = { admin: 'Admin', manager: locale === 'es' ? 'Gerente' : 'Manager', waiter: locale === 'es' ? 'Mesero' : 'Waiter', kitchen: locale === 'es' ? 'Cocina' : 'Kitchen' };

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 to-blue-50">
      {user?.product_tier === 'light' && !tenantAdFree && <BannerAd text="Upgrade to remove ads and unlock more features!" linkUrl="/subscription" marquee />}

      <header className="bg-white shadow-sm sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-2 sm:px-4 lg:px-8 py-2">
          <div className="flex flex-wrap md:flex-nowrap items-center justify-between w-full gap-2">
            <div className="flex items-center gap-2 flex-shrink-0">
              <img src="/logo-tuordenya-orange.png" alt="TuOrdenYa Logo" width={36} height={36} className="h-9 w-auto" />
              <span className="font-bold text-gray-700 text-base md:text-lg">{t('nav.backoffice')}</span>
            </div>
            <div className="flex flex-wrap md:flex-nowrap gap-2 items-center justify-end w-full md:w-auto">
              <span className="font-bold text-gray-700 text-sm md:text-lg truncate">
                {tenantName && <><span className="font-bold">{tenantName}</span> • </>}
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
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 overflow-x-auto">
          <nav className="flex space-x-6 min-w-max">
            <button onClick={() => setView('items')} className={`py-4 px-1 border-b-2 font-bold text-sm whitespace-nowrap ${view === 'items' ? 'border-blue-500 text-blue-600' : 'border-transparent text-black hover:text-gray-700'}`}>{t('tabs.menuItems')}</button>
            {user?.role === 'admin' && <>
              <button onClick={() => setView('categories')} className={`py-4 px-1 border-b-2 font-bold text-sm whitespace-nowrap ${view === 'categories' ? 'border-blue-500 text-blue-600' : 'border-transparent text-black hover:text-gray-700'}`}>{t('tabs.categories')}</button>
              <button onClick={() => setView('locations')} className={`py-4 px-1 border-b-2 font-bold text-sm whitespace-nowrap ${view === 'locations' ? 'border-blue-500 text-blue-600' : 'border-transparent text-black hover:text-gray-700'}`}>📍 {locale === 'es' ? 'Locales' : 'Locations'}</button>
              <button onClick={() => setView('tables')} className={`py-4 px-1 border-b-2 font-bold text-sm whitespace-nowrap ${view === 'tables' ? 'border-blue-500 text-blue-600' : 'border-transparent text-black hover:text-gray-700'}`}>{t('tabs.tables')}{user?.product_tier !== 'pro' && <span className="ml-1 text-xs">🔒</span>}</button>
              <button onClick={() => setView('variants')} className={`py-4 px-1 border-b-2 font-bold text-sm whitespace-nowrap ${view === 'variants' ? 'border-blue-500 text-blue-600' : 'border-transparent text-black hover:text-gray-700'}`}>{t('tabs.variants')}{user?.product_tier !== 'pro' && <span className="ml-1 text-xs">🔒</span>}</button>
              <button onClick={() => setView('team')} className={`py-4 px-1 border-b-2 font-bold text-sm whitespace-nowrap ${view === 'team' ? 'border-blue-500 text-blue-600' : 'border-transparent text-black hover:text-gray-700'}`}>👥 {locale === 'es' ? 'Equipo' : 'Team'}</button>
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
                  {categories.map(cat => <option key={cat.id} value={cat.id}>{getCategoryName(cat)}</option>)}
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
                <button type="submit" className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">{locale === 'es' ? 'Guardar' : 'Save'}</button>
                <button type="button" onClick={() => setEditingItem(null)} className="flex-1 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold">{t('common.cancel')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Edit Location Modal */}
      {editingLocation && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <h3 className="text-lg font-bold text-black mb-4">{locale === 'es' ? 'Editar Local' : 'Edit Location'}</h3>
            <form onSubmit={handleUpdateLocation} className="space-y-4">
              <div>
                <label className="block text-sm font-bold text-black mb-2">{locale === 'es' ? 'Nombre' : 'Name'} *</label>
                <input type="text" value={editLocationForm.name} onChange={(e) => setEditLocationForm({ ...editLocationForm, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" required />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">{locale === 'es' ? 'Dirección' : 'Address'}</label>
                <input type="text" value={editLocationForm.address} onChange={(e) => setEditLocationForm({ ...editLocationForm, address: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-2">{locale === 'es' ? 'Teléfono' : 'Phone'}</label>
                <input type="text" value={editLocationForm.phone} onChange={(e) => setEditLocationForm({ ...editLocationForm, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" />
              </div>
              <div className="flex gap-2">
                <button type="submit" className="flex-1 px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">{locale === 'es' ? 'Guardar' : 'Save'}</button>
                <button type="button" onClick={() => setEditingLocation(null)} className="flex-1 px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold">{t('common.cancel')}</button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* New User Password Modal */}
      {createdPassword && (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg shadow-xl p-6 w-full max-w-md">
            <div className="text-center mb-4">
              <div className="text-4xl mb-2">🔑</div>
              <h3 className="text-lg font-bold text-black">{locale === 'es' ? 'Usuario creado exitosamente' : 'User created successfully'}</h3>
              <p className="text-sm text-gray-600 mt-1">{locale === 'es' ? 'Guarda esta contraseña, no se mostrará de nuevo' : 'Save this password, it will not be shown again'}</p>
            </div>
            <div className="bg-gray-50 rounded-lg p-4 mb-4">
              <p className="text-sm text-gray-600 mb-1">Email:</p>
              <p className="font-bold text-black">{createdUserEmail}</p>
              <p className="text-sm text-gray-600 mt-3 mb-1">{locale === 'es' ? 'Contraseña temporal:' : 'Temporary password:'}</p>
              <p className="font-bold text-xl text-orange-600 font-mono tracking-wider">{createdPassword}</p>
            </div>
            <button onClick={() => { setCreatedPassword(null); setCreatedUserEmail(''); }} className="w-full px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
              {locale === 'es' ? 'Entendido, ya la guardé' : 'Got it, I saved it'}
            </button>
          </div>
        </div>
      )}

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">

        {/* LOCATIONS VIEW */}
        {view === 'locations' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">📍 {locale === 'es' ? 'Locales' : 'Locations'}</h2>
              <button onClick={() => setShowLocationForm(!showLocationForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">
                + {locale === 'es' ? 'Agregar Local' : 'Add Location'}
              </button>
            </div>

            {showLocationForm && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-bold text-black mb-4">{locale === 'es' ? 'Nuevo Local' : 'New Location'}</h3>
                <form onSubmit={handleCreateLocation} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">{locale === 'es' ? 'Nombre' : 'Name'} *</label>
                      <input type="text" value={newLocation.name} onChange={(e) => setNewLocation({ ...newLocation, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" placeholder={locale === 'es' ? 'Ej: Local Centro' : 'e.g. Downtown'} required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">{locale === 'es' ? 'Teléfono' : 'Phone'}</label>
                      <input type="text" value={newLocation.phone} onChange={(e) => setNewLocation({ ...newLocation, phone: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" placeholder="+57 300 000 0000" />
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">{locale === 'es' ? 'Dirección' : 'Address'}</label>
                    <input type="text" value={newLocation.address} onChange={(e) => setNewLocation({ ...newLocation, address: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" placeholder={locale === 'es' ? 'Calle 123 # 45-67' : '123 Main St'} />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">{locale === 'es' ? 'Crear Local' : 'Create Location'}</button>
                    <button type="button" onClick={() => setShowLocationForm(false)} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold">{t('common.cancel')}</button>
                  </div>
                </form>
              </div>
            )}

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {locations.map((loc) => (
                <div key={loc.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-3">
                    <h3 className="text-lg font-bold text-black">{loc.name}</h3>
                    <span className="text-xs px-2 py-1 bg-green-100 text-green-700 rounded font-semibold">{locale === 'es' ? 'Activo' : 'Active'}</span>
                  </div>
                  {loc.address && <p className="text-sm text-gray-600 mb-1">📍 {loc.address}</p>}
                  {loc.phone && <p className="text-sm text-gray-600 mb-3">📞 {loc.phone}</p>}
                  <div className="flex gap-2 pt-3 border-t border-gray-100">
                    <button onClick={() => { setEditingLocation(loc); setEditLocationForm({ name: loc.name, address: loc.address || '', phone: loc.phone || '' }); }} className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm font-semibold">✏️ {locale === 'es' ? 'Editar' : 'Edit'}</button>
                    <button onClick={() => handleDeleteLocation(loc.id, loc.name)} className="flex-1 px-3 py-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100 text-sm font-semibold">🗑️ {locale === 'es' ? 'Eliminar' : 'Delete'}</button>
                  </div>
                </div>
              ))}
            </div>

            {locations.length === 0 && (
              <div className="text-center py-12 text-gray-500">
                <div className="text-4xl mb-2">📍</div>
                <p>{locale === 'es' ? 'No hay locales. ¡Crea uno!' : 'No locations yet. Create one!'}</p>
              </div>
            )}
          </div>
        )}

        {/* TEAM VIEW */}
        {view === 'team' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">👥 {locale === 'es' ? 'Equipo' : 'Team'}</h2>
              <button onClick={() => setShowUserForm(!showUserForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">+ {locale === 'es' ? 'Agregar Usuario' : 'Add User'}</button>
            </div>

            {showUserForm && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <h3 className="text-lg font-bold text-black mb-4">{locale === 'es' ? 'Nuevo Usuario' : 'New User'}</h3>
                <form onSubmit={handleCreateUser} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">{locale === 'es' ? 'Nombre completo' : 'Full name'} *</label>
                      <input type="text" value={newUser.full_name} onChange={(e) => setNewUser({ ...newUser, full_name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">Email *</label>
                      <input type="email" value={newUser.email} onChange={(e) => setNewUser({ ...newUser, email: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" required />
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">Rol *</label>
                      <select value={newUser.role} onChange={(e) => setNewUser({ ...newUser, role: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" required>
                        <option value="waiter">{locale === 'es' ? 'Mesero' : 'Waiter'}</option>
                        <option value="kitchen">{locale === 'es' ? 'Cocina' : 'Kitchen'}</option>
                        <option value="manager">{locale === 'es' ? 'Gerente' : 'Manager'}</option>
                        </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-2">{locale === 'es' ? 'Local' : 'Location'} {newUser.role !== 'admin' ? '*' : ''}</label>
                      <select value={newUser.location_id} onChange={(e) => setNewUser({ ...newUser, location_id: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" required={newUser.role !== 'admin'}>
                        <option value="">{locale === 'es' ? 'Seleccionar local' : 'Select location'}</option>
                        {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                      </select>
                    </div>
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">{locale === 'es' ? 'Contraseña (opcional, se genera automáticamente)' : 'Password (optional, auto-generated)'}</label>
                    <input type="password" value={newUser.password} onChange={(e) => setNewUser({ ...newUser, password: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" placeholder={locale === 'es' ? 'Dejar vacío para generar automáticamente' : 'Leave empty to auto-generate'} />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">{locale === 'es' ? 'Crear Usuario' : 'Create User'}</button>
                    <button type="button" onClick={() => setShowUserForm(false)} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold">{t('common.cancel')}</button>
                  </div>
                </form>
              </div>
            )}

            <div className="bg-white rounded-lg shadow overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">{locale === 'es' ? 'Nombre' : 'Name'}</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">Rol</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">{locale === 'es' ? 'Local' : 'Location'}</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">{locale === 'es' ? 'Estado' : 'Status'}</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">{locale === 'es' ? 'Acciones' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {teamUsers.map((u) => (
                    <tr key={u.id} className={!u.is_active ? 'opacity-60' : ''}>
                      <td className="px-6 py-4 text-sm font-bold text-black">{u.full_name}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{u.email}</td>
                      <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${roleColors[u.role] || 'bg-gray-100 text-gray-700'}`}>{roleLabels[u.role] || u.role}</span></td>
                      <td className="px-6 py-4 text-sm text-gray-600">{u.location_name || (locale === 'es' ? 'Todos los locales' : 'All locations')}</td>
                      <td className="px-6 py-4"><span className={`px-2 py-1 rounded text-xs font-bold ${u.is_active ? 'bg-green-100 text-green-700' : 'bg-red-100 text-red-700'}`}>{u.is_active ? (locale === 'es' ? 'Activo' : 'Active') : (locale === 'es' ? 'Inactivo' : 'Inactive')}</span></td>
                      <td className="px-6 py-4">
                        <div className="flex gap-2">
                          {u.id !== user?.id && (
  <button onClick={() => handleToggleUserActive(u.id, u.is_active)} className={`px-3 py-1 rounded text-xs font-semibold ${u.is_active ? 'bg-yellow-100 text-yellow-700 hover:bg-yellow-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
    {u.is_active ? (locale === 'es' ? 'Desactivar' : 'Deactivate') : (locale === 'es' ? 'Activar' : 'Activate')}
  </button>
)}
                          {u.role !== 'admin' && <button onClick={() => handleDeleteUser(u.id, u.full_name)} className="px-3 py-1 rounded text-xs font-semibold bg-red-100 text-red-700 hover:bg-red-200">{locale === 'es' ? 'Eliminar' : 'Delete'}</button>}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {teamUsers.length === 0 && <div className="text-center py-12 text-gray-500"><div className="text-4xl mb-2">👥</div><p>{locale === 'es' ? 'No hay usuarios en el equipo.' : 'No team users yet.'}</p></div>}
            </div>
          </div>
        )}

        {/* CATEGORIES VIEW */}
        {view === 'categories' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">{t('categories.title')}</h2>
              {user?.role === 'admin' && <button onClick={() => setShowCategoryForm(!showCategoryForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">+ {t('categories.addCategory')}</button>}
            </div>
            {showCategoryForm && (
              <div className="bg-white rounded-lg shadow p-6 mb-6">
                <form onSubmit={handleCreateCategory} className="space-y-4">
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">{locale === 'es' ? 'Nombre' : 'Name'}</label>
                    <input type="text" value={newCategory.name} onChange={(e) => setNewCategory({ ...newCategory, name: e.target.value })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" required />
                  </div>
                  <div>
                    <label className="block text-sm font-bold text-black mb-2">{locale === 'es' ? 'Posición' : 'Position'}</label>
                    <input type="number" value={newCategory.position} onChange={(e) => setNewCategory({ ...newCategory, position: parseInt(e.target.value) })} className="w-full px-4 py-2 border border-gray-300 rounded-lg text-black font-semibold" />
                  </div>
                  <div className="flex gap-2">
                    <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">{locale === 'es' ? 'Crear' : 'Create'}</button>
                    <button type="button" onClick={() => setShowCategoryForm(false)} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold">{t('common.cancel')}</button>
                  </div>
                </form>
              </div>
            )}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {categories.map((category) => (
                <div key={category.id} className="bg-white rounded-lg shadow p-6">
                  <div className="flex items-start justify-between mb-2">
                    <h3 className="text-lg font-bold text-black">{getCategoryName(category)}</h3>
                    {category.is_custom ? <span className="text-xs px-2 py-1 bg-purple-100 text-purple-700 rounded font-semibold">{t('categories.custom')}</span> : <span className="text-xs px-2 py-1 bg-blue-100 text-blue-700 rounded font-semibold">{t('categories.predefined')}</span>}
                  </div>
                  <p className="text-sm text-black">{t('categories.position')}: {category.position}</p>
                  <p className="text-sm text-black">{t('menuItems.status')}: <span className={category.active ? 'text-green-600 font-semibold' : 'text-red-600 font-semibold'}>{category.active ? t('common.active') : t('common.inactive')}</span></p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* TABLES VIEW */}
        {view === 'tables' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">{t('tabs.tables')}</h2>
              {user?.role === 'admin' && <button onClick={() => setShowTableForm(!showTableForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">+ {locale === 'es' ? 'Agregar Mesa' : 'Add Table'}</button>}
            </div>
            {showTableForm && (
              <div className="bg-white rounded-lg shadow-md p-6 mb-6">
                <form onSubmit={async (e) => {
                  e.preventDefault();
                  try {
                    const res = await fetch(`/api/tenants/${tenantId}/tables`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(newTable) });
                    const data = await res.json();
                    if (data.ok) { setNewTable({ location_id: '', number: '' }); setShowTableForm(false); fetchTables(); }
                    else alert(data.error);
                  } catch { alert('Failed to create table'); }
                }} className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">{locale === 'es' ? 'Local' : 'Location'} *</label>
                      <select value={newTable.location_id} onChange={(e) => setNewTable({ ...newTable, location_id: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-black font-semibold" required>
                        <option value="">{locale === 'es' ? 'Seleccionar local' : 'Select location'}</option>
                        {locations.map(loc => <option key={loc.id} value={loc.id}>{loc.name}</option>)}
                      </select>
                    </div>
                    <div>
                      <label className="block text-sm font-bold text-black mb-1">{locale === 'es' ? 'Número de mesa' : 'Table number'} *</label>
                      <input type="text" value={newTable.number} onChange={(e) => setNewTable({ ...newTable, number: e.target.value })} className="w-full px-3 py-2 border border-gray-300 rounded text-black font-semibold" placeholder="1, 2, A1..." required />
                    </div>
                  </div>
                  <button type="submit" className="w-full bg-green-600 text-white py-2 rounded hover:bg-green-700 font-semibold">{locale === 'es' ? 'Crear Mesa' : 'Create Table'}</button>
                </form>
              </div>
            )}
            <div className="bg-white rounded-lg shadow-md overflow-hidden">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">Mesa #</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">{locale === 'es' ? 'Local' : 'Location'}</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">QR URL</th>
                    <th className="px-6 py-3 text-left text-xs font-bold text-black uppercase">{locale === 'es' ? 'Acciones' : 'Actions'}</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {tables.map((table) => (
                    <tr key={table.id}>
                      <td className="px-6 py-4 text-sm font-bold text-black">{table.number}</td>
                      <td className="px-6 py-4 text-sm text-gray-600">{table.location_name || `Location ${table.location_id}`}</td>
                      <td className="px-6 py-4 text-sm"><code className="bg-gray-100 px-2 py-1 rounded text-xs text-blue-600">/menu?table={table.id}</code></td>
                      <td className="px-6 py-4"><button onClick={async () => { if (confirm(`Delete table ${table.number}?`)) { const res = await fetch(`/api/tenants/${tenantId}/tables/${table.id}`, { method: 'DELETE' }); const data = await res.json(); if (data.ok) fetchTables(); else alert(data.error); }}} className="text-red-600 hover:text-red-800 font-semibold text-xs">{locale === 'es' ? 'Eliminar' : 'Delete'}</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {tables.length === 0 && <div className="text-center py-8 text-gray-500">{locale === 'es' ? 'No hay mesas.' : 'No tables found.'}</div>}
            </div>
          </div>
        )}

        {/* ITEMS VIEW */}
        {view === 'items' && (
          <div>
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-2xl font-bold text-black">{t('menuItems.title')}</h2>
              {user?.role === 'admin' && <button onClick={() => setShowItemForm(!showItemForm)} className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold">+ {t('menuItems.addItem')}</button>}
            </div>
            <div className="mb-6 flex gap-2 flex-wrap">
              <button onClick={() => setSelectedCategory(null)} className={`px-4 py-2 rounded-lg font-semibold text-sm ${selectedCategory === null ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{t('menuItems.all')}</button>
              {categories.map(cat => <button key={cat.id} onClick={() => setSelectedCategory(cat.id)} className={`px-4 py-2 rounded-lg font-semibold text-sm ${selectedCategory === cat.id ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-700 hover:bg-gray-300'}`}>{getCategoryName(cat)}</button>)}
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
                        {categories.map(cat => <option key={cat.id} value={cat.id}>{getCategoryName(cat)}</option>)}
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
                    <button type="submit" className="px-6 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold">{locale === 'es' ? 'Crear Item' : 'Create Item'}</button>
                    <button type="button" onClick={() => setShowItemForm(false)} className="px-6 py-2 bg-gray-300 text-gray-700 rounded-lg hover:bg-gray-400 font-semibold">{t('common.cancel')}</button>
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
                      <button onClick={() => user?.role === 'admin' && toggleItemActive(item.id, item.active)} disabled={user?.role !== 'admin'} className={`px-3 py-1 rounded text-sm font-semibold ${item.active ? 'bg-green-100 text-green-800 hover:bg-green-200' : 'bg-red-100 text-red-800 hover:bg-red-200'} ${user?.role !== 'admin' ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'}`}>
                        {item.active ? t('common.active') : t('common.inactive')}
                      </button>
                    </div>
                    {item.description && <p className="text-gray-600 text-sm mb-3">{item.description}</p>}
                    <div className="flex justify-between items-center mb-3">
                      <span className="text-2xl font-bold text-black">${item.price}</span>
                      <span className="text-sm text-gray-500">{(() => { const cat = categories.find(c => c.id === item.category_id); return cat ? getCategoryName(cat) : ''; })()}</span>
                    </div>
                    {user?.role === 'admin' && (
                      <div className="flex gap-2 pt-3 border-t border-gray-100">
                        <button onClick={() => { setEditingItem(item); setEditForm({ name: item.name, description: item.description || '', price: item.price, category_id: item.category_id }); }} className="flex-1 px-3 py-1.5 bg-blue-50 text-blue-700 rounded hover:bg-blue-100 text-sm font-semibold">✏️ {locale === 'es' ? 'Editar' : 'Edit'}</button>
                        <button onClick={() => handleDeleteItem(item.id, item.name)} className="flex-1 px-3 py-1.5 bg-red-50 text-red-700 rounded hover:bg-red-100 text-sm font-semibold">🗑️ {locale === 'es' ? 'Eliminar' : 'Delete'}</button>
                      </div>
                    )}
                  </div>
                </div>
              ))}
            </div>
            {filteredItems.length === 0 && <p className="text-center text-gray-500 py-16">{locale === 'es' ? 'No se encontraron items. ¡Crea uno arriba!' : 'No items found. Create one above!'}</p>}
          </div>
        )}

        {view === 'variants' && (
          <div className="max-w-4xl mx-auto mt-8">
            {user?.product_tier === 'pro' ? (
              <div className="bg-white rounded-lg shadow p-6"><h2 className="text-2xl font-bold text-black mb-4">Variants Management</h2><p className="text-gray-600">Coming soon...</p></div>
            ) : (
              <UpgradePrompt feature="Product Variants" currentTier={user?.product_tier || 'light'} requiredTier="pro" message="Product Variants allow you to create options like size, add-ons, and customizations. This feature requires the Pro tier." />
            )}
          </div>
        )}
      </div>
    </div>
  );
}
