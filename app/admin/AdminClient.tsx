'use client';

import { useState, useEffect, useCallback } from 'react';
import UserManagement from './UserManagement';

interface Tenant {
  id: string;
  name: string;
  slug: string;
  tax_id?: string;
  ad_free?: boolean;
  product_tier?: string;
  subscription_status?: string;
  is_active?: boolean;
  created_at?: string;
  phone?: string;
  city?: string;
  currency?: string;
  locations_count?: number;
  active_locations?: number;
  items_count?: number;
  active_items?: number;
  users_count?: number;
  orders_this_month?: number;
  last_order_at?: string;
  pipeline_profile?: boolean;
  pipeline_has_items?: boolean;
  pipeline_first_order?: boolean;
}

type Tab = 'tenants' | 'pipeline' | 'crear';

export default function AdminClient() {
  const [tenants, setTenants] = useState<Tenant[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState<Tab>('tenants');

  // Auth
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [password, setPassword] = useState('');
  const [savedPassword, setSavedPassword] = useState('');
  const [authError, setAuthError] = useState('');

  // Filtros
  const [search, setSearch] = useState('');
  const [filterTier, setFilterTier] = useState('');
  const [filterStatus, setFilterStatus] = useState('');

  // Crear tenant
  const [newTenantName, setNewTenantName] = useState('');
  const [newTenantSlug, setNewTenantSlug] = useState('');
  const [newTenantId, setNewTenantId] = useState('');
  const [newTenantTier, setNewTenantTier] = useState<'light' | 'plus' | 'pro'>('light');

  // Editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editTier, setEditTier] = useState<'light' | 'plus' | 'pro'>('light');

  const adminFetch = useCallback((url: string, options: RequestInit = {}) => {
    return fetch(url, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'x-admin-password': savedPassword,
        ...options.headers,
      },
    });
  }, [savedPassword]);

  useEffect(() => {
    const authenticated = sessionStorage.getItem('admin_authenticated');
    const pw = sessionStorage.getItem('admin_pw');
    if (authenticated === 'true' && pw) {
      setSavedPassword(pw);
      setIsAuthenticated(true);
    }
  }, []);

  const handleAdminLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    const res = await fetch('/api/admin/tenants', {
      headers: { 'Content-Type': 'application/json', 'x-admin-password': password },
    });
    if (res.ok) {
      setSavedPassword(password);
      setIsAuthenticated(true);
      sessionStorage.setItem('admin_authenticated', 'true');
      sessionStorage.setItem('admin_pw', password);
      setAuthError('');
    } else {
      setAuthError('Contraseña incorrecta');
    }
  };

  const handleLogout = () => {
    sessionStorage.removeItem('admin_authenticated');
    sessionStorage.removeItem('admin_pw');
    setSavedPassword('');
    setIsAuthenticated(false);
  };

  const fetchTenants = useCallback(async () => {
    try {
      const res = await adminFetch('/api/admin/tenants');
      const data = await res.json();
      if (data.ok) setTenants(data.tenants);
    } catch (error) {
      console.error('Error fetching tenants:', error);
    }
  }, [adminFetch]);

  useEffect(() => {
    if (isAuthenticated && savedPassword) fetchTenants();
  }, [isAuthenticated, savedPassword, fetchTenants]);

  const handleTenantNameChange = (name: string) => {
    setNewTenantName(name);
    setNewTenantSlug(name.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, ''));
  };

  const handleCreateTenant = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      const res = await adminFetch('/api/admin/tenants', {
        method: 'POST',
        body: JSON.stringify({
          id: newTenantId ? parseInt(newTenantId) : undefined,
          name: newTenantName,
          slug: newTenantSlug,
          product_tier: newTenantTier,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setNewTenantName(''); setNewTenantSlug(''); setNewTenantId(''); setNewTenantTier('light');
        setActiveTab('tenants');
        fetchTenants();
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error creating tenant:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateTier = async (tenantId: string, newTier: string) => {
    setLoading(true);
    try {
      const res = await adminFetch(`/api/admin/tenants/${tenantId}`, {
        method: 'PUT',
        body: JSON.stringify({ product_tier: newTier, subscription_status: 'active' }),
      });
      const data = await res.json();
      if (data.ok) {
        setEditingId(null);
        fetchTenants();
      } else {
        alert('Error: ' + (data.error || 'Unknown error'));
      }
    } catch (error) {
      console.error('Error updating tier:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggleActive = async (tenant: Tenant) => {
    try {
      const res = await adminFetch(`/api/admin/tenants/${tenant.id}`, {
        method: 'PUT',
        body: JSON.stringify({ is_active: !tenant.is_active }),
      });
      const data = await res.json();
      if (data.ok) fetchTenants();
    } catch (error) {
      console.error('Error toggling tenant:', error);
    }
  };

  const filteredTenants = tenants.filter(t => {
    if (search && !t.name.toLowerCase().includes(search.toLowerCase()) &&
        !t.slug.toLowerCase().includes(search.toLowerCase()) &&
        !(t.tax_id || '').includes(search)) return false;
    if (filterTier && t.product_tier !== filterTier) return false;
    if (filterStatus && t.subscription_status !== filterStatus) return false;
    return true;
  });

  // Métricas globales
  const totalOrders = tenants.reduce((s, t) => s + (t.orders_this_month || 0), 0);
  const inactive = tenants.filter(t => {
    if (!t.last_order_at) return true;
    const days = (Date.now() - new Date(t.last_order_at).getTime()) / 86400000;
    return days > 30;
  }).length;
  const incomplete = tenants.filter(t => !t.pipeline_first_order).length;

  function tierBadge(tier?: string) {
    const styles: Record<string, string> = {
      pro: 'bg-purple-100 text-purple-700',
      plus: 'bg-orange-100 text-orange-700',
      light: 'bg-gray-100 text-gray-600',
    };
    return (
      <span className={`px-2 py-0.5 text-xs font-bold rounded ${styles[tier || 'light'] || styles.light}`}>
        {(tier || 'light').toUpperCase()}
      </span>
    );
  }

  function statusBadge(status?: string, isActive?: boolean) {
    if (!isActive) return <span className="px-2 py-0.5 text-xs font-bold rounded bg-red-100 text-red-700">Desactivado</span>;
    const styles: Record<string, string> = {
      active: 'bg-green-100 text-green-700',
      trial: 'bg-yellow-100 text-yellow-700',
      paused: 'bg-red-100 text-red-700',
      inactive: 'bg-gray-100 text-gray-500',
    };
    const labels: Record<string, string> = { active: 'Activo', trial: 'Trial', paused: 'Pausado', inactive: 'Inactivo' };
    return (
      <span className={`px-2 py-0.5 text-xs font-bold rounded ${styles[status || 'inactive'] || styles.inactive}`}>
        {labels[status || 'inactive'] || status}
      </span>
    );
  }

  function daysAgo(date?: string) {
    if (!date) return '—';
    const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
    if (days === 0) return 'hoy';
    if (days === 1) return 'ayer';
    return `hace ${days}d`;
  }

  if (!isAuthenticated) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-900 via-blue-800 to-indigo-900 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-2xl p-8 max-w-md w-full">
          <h1 className="text-3xl font-bold text-black mb-2">Super Admin</h1>
          <p className="text-gray-500 mb-6">TuOrdenYa · Panel de control</p>
          {authError && <div className="bg-red-50 text-red-600 p-3 rounded mb-4 text-sm">{authError}</div>}
          <form onSubmit={handleAdminLogin}>
            <div className="mb-4">
              <label className="block text-sm font-bold text-black mb-2">Contraseña</label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 text-black"
                placeholder="Contraseña de administrador"
                required
              />
            </div>
            <button type="submit" className="w-full bg-orange-600 text-white py-2 px-4 rounded-lg hover:bg-orange-700 transition font-semibold">
              Entrar
            </button>
          </form>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4 flex justify-between items-center">
        <div>
          <h1 className="text-xl font-bold text-black">TuOrdenYa · Superadmin</h1>
          <p className="text-xs text-gray-500">{tenants.length} tenants registrados</p>
        </div>
        <button onClick={handleLogout} className="px-3 py-1.5 text-sm bg-gray-100 text-gray-700 rounded hover:bg-gray-200 font-semibold">
          Cerrar sesión
        </button>
      </div>

      <div className="max-w-7xl mx-auto px-6 py-6">

        {/* Métricas */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-6">
          {[
            { label: 'Tenants activos', value: tenants.filter(t => t.is_active !== false).length, sub: `de ${tenants.length} totales` },
            { label: 'Pedidos este mes', value: totalOrders.toLocaleString('es-CO'), sub: 'todos los tenants' },
            { label: 'Sin actividad 30d', value: inactive, sub: 'requieren seguimiento', warn: inactive > 0 },
            { label: 'Sin primer pedido', value: incomplete, sub: 'onboarding incompleto', warn: incomplete > 0 },
          ].map((m, i) => (
            <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
              <div className="text-xs text-gray-500 mb-1">{m.label}</div>
              <div className={`text-2xl font-bold ${m.warn ? 'text-orange-600' : 'text-black'}`}>{m.value}</div>
              <div className="text-xs text-gray-400 mt-1">{m.sub}</div>
            </div>
          ))}
        </div>

        {/* Tabs */}
        <div className="flex gap-1 bg-gray-100 p-1 rounded-lg mb-6 w-fit">
          {([['tenants', 'Tenants'], ['pipeline', 'Pipeline'], ['crear', '+ Nuevo tenant']] as [Tab, string][]).map(([tab, label]) => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-4 py-2 text-sm rounded-md font-semibold transition ${activeTab === tab ? 'bg-white text-black shadow-sm' : 'text-gray-500 hover:text-black'}`}
            >
              {label}
            </button>
          ))}
        </div>

        {/* Tab: Tenants */}
        {activeTab === 'tenants' && (
          <div>
            {/* Filtros */}
            <div className="flex gap-3 mb-4 flex-wrap">
              <input
                type="text"
                placeholder="Buscar por nombre, slug o NIT..."
                value={search}
                onChange={e => setSearch(e.target.value)}
                className="flex-1 min-w-48 px-3 py-2 text-sm border border-gray-300 rounded-lg focus:ring-2 focus:ring-orange-500 text-black"
              />
              <select value={filterTier} onChange={e => setFilterTier(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-black">
                <option value="">Todos los tiers</option>
                <option value="pro">Pro</option>
                <option value="plus">Plus</option>
                <option value="light">Light</option>
              </select>
              <select value={filterStatus} onChange={e => setFilterStatus(e.target.value)} className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-black">
                <option value="">Todos los estados</option>
                <option value="active">Activo</option>
                <option value="trial">Trial</option>
                <option value="paused">Pausado</option>
                <option value="inactive">Inactivo</option>
              </select>
            </div>

            {/* Tabla */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead className="bg-gray-50 border-b border-gray-200">
                    <tr>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Restaurante</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Tier</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Estado</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Sedes</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Items</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Usuarios</th>
                      <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Pedidos/mes</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Último pedido</th>
                      <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Acciones</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-gray-100">
                    {filteredTenants.length === 0 ? (
                      <tr><td colSpan={9} className="px-4 py-8 text-center text-gray-400">Sin resultados</td></tr>
                    ) : filteredTenants.map(tenant => (
                      <tr key={tenant.id} className={`hover:bg-gray-50 ${tenant.is_active === false ? 'opacity-50' : ''}`}>
                        <td className="px-4 py-3">
                          <div className="font-semibold text-black">{tenant.name}</div>
                          <div className="text-xs text-gray-400">{tenant.slug}.tuordenya.com · {tenant.tax_id || '—'}</div>
                        </td>
                        <td className="px-4 py-3">
                          {editingId === tenant.id ? (
                            <select
                              value={editTier}
                              onChange={e => setEditTier(e.target.value as 'light' | 'plus' | 'pro')}
                              className="px-2 py-1 text-xs border-2 border-orange-500 rounded text-black"
                              autoFocus
                            >
                              <option value="light">Light</option>
                              <option value="plus">Plus</option>
                              <option value="pro">Pro</option>
                            </select>
                          ) : tierBadge(tenant.product_tier)}
                        </td>
                        <td className="px-4 py-3">{statusBadge(tenant.subscription_status, tenant.is_active)}</td>
                        <td className="px-4 py-3 text-center text-black">{tenant.locations_count ?? '—'}</td>
                        <td className="px-4 py-3 text-center text-black">{tenant.active_items ?? '—'}<span className="text-gray-400">/{tenant.items_count ?? '—'}</span></td>
                        <td className="px-4 py-3 text-center text-black">{tenant.users_count ?? '—'}</td>
                        <td className="px-4 py-3 text-center font-semibold text-black">{tenant.orders_this_month ?? 0}</td>
                        <td className="px-4 py-3 text-xs text-gray-500">{daysAgo(tenant.last_order_at)}</td>
                        <td className="px-4 py-3">
                          <div className="flex gap-2 items-center">
                            {editingId === tenant.id ? (
                              <>
                                <button onClick={() => handleUpdateTier(tenant.id, editTier)} disabled={loading} className="text-xs px-2 py-1 bg-green-600 text-white rounded hover:bg-green-700 disabled:opacity-50">Guardar</button>
                                <button onClick={() => setEditingId(null)} className="text-xs px-2 py-1 bg-gray-200 text-gray-700 rounded hover:bg-gray-300">Cancelar</button>
                              </>
                            ) : (
                              <>
                                <button onClick={() => { setEditingId(tenant.id); setEditTier((tenant.product_tier as 'light' | 'plus' | 'pro') || 'light'); }} className="text-xs px-2 py-1 bg-orange-100 text-orange-700 rounded hover:bg-orange-200 font-semibold">Tier</button>
                                <button onClick={() => handleToggleActive(tenant)} className={`text-xs px-2 py-1 rounded font-semibold ${tenant.is_active !== false ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}>
                                  {tenant.is_active !== false ? 'Desactivar' : 'Activar'}
                                </button>
                              </>
                            )}
                          </div>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>

            {/* User Management */}
            <div className="mt-6">
              <UserManagement tenants={tenants} adminFetch={adminFetch} />
            </div>
          </div>
        )}

        {/* Tab: Pipeline */}
        {activeTab === 'pipeline' && (
          <div>
            {/* Resumen */}
            <div className="grid grid-cols-3 gap-4 mb-6">
              {[
                { label: 'Perfil configurado', value: tenants.filter(t => t.pipeline_profile).length, total: tenants.length },
                { label: 'Items creados', value: tenants.filter(t => t.pipeline_has_items).length, total: tenants.length },
                { label: 'Primer pedido', value: tenants.filter(t => t.pipeline_first_order).length, total: tenants.length },
              ].map((s, i) => (
                <div key={i} className="bg-white rounded-lg border border-gray-200 p-4">
                  <div className="text-xs text-gray-500 mb-1">{s.label}</div>
                  <div className="text-2xl font-bold text-black">{s.value}<span className="text-sm text-gray-400 font-normal">/{s.total}</span></div>
                  <div className="mt-2 h-1.5 bg-gray-100 rounded-full overflow-hidden">
                    <div className="h-full bg-orange-500 rounded-full" style={{ width: `${s.total ? (s.value / s.total) * 100 : 0}%` }} />
                  </div>
                </div>
              ))}
            </div>

            {/* Tabla pipeline */}
            <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
              <table className="w-full text-sm">
                <thead className="bg-gray-50 border-b border-gray-200">
                  <tr>
                    <th className="px-4 py-3 text-left text-xs font-bold text-gray-500 uppercase">Restaurante</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Registrado</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Perfil</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Items</th>
                    <th className="px-4 py-3 text-center text-xs font-bold text-gray-500 uppercase">Primer pedido</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-gray-100">
                  {tenants.map(t => {
                    const steps = [true, !!t.pipeline_profile, !!t.pipeline_has_items, !!t.pipeline_first_order];
                    return (
                      <tr key={t.id} className="hover:bg-gray-50">
                        <td className="px-4 py-3">
                          <div className="font-semibold text-black">{t.name}</div>
                          <div className="text-xs text-gray-400">{tierBadge(t.product_tier)}</div>
                        </td>
                        {steps.map((done, i) => (
                          <td key={i} className="px-4 py-3 text-center">
                            <span className={`inline-flex items-center justify-center w-6 h-6 rounded-full text-xs font-bold ${done ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-400'}`}>
                              {done ? '✓' : '–'}
                            </span>
                          </td>
                        ))}
                      </tr>
                    );
                  })}
                </tbody>
              </table>
            </div>
          </div>
        )}

        {/* Tab: Crear tenant */}
        {activeTab === 'crear' && (
          <div className="max-w-lg">
            <div className="bg-white rounded-lg border border-gray-200 p-6">
              <h2 className="text-lg font-bold text-black mb-4">Nuevo tenant</h2>
              <form onSubmit={handleCreateTenant} className="space-y-4">
                <div>
                  <label className="block text-sm font-bold text-black mb-1">NIT / Tax ID <span className="font-normal text-gray-400">(opcional)</span></label>
                  <input type="number" value={newTenantId} onChange={e => setNewTenantId(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 text-black"
                    placeholder="Ej: 1015439930" />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Nombre del restaurante</label>
                  <input type="text" value={newTenantName} onChange={e => handleTenantNameChange(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 text-black"
                    placeholder="Ej: Pizza Roma" required />
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Slug</label>
                  <input type="text" value={newTenantSlug} onChange={e => setNewTenantSlug(e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 text-black"
                    placeholder="pizza-roma" pattern="[a-z0-9-]+" required />
                  <p className="text-xs text-gray-400 mt-1">{newTenantSlug || 'tu-slug'}.tuordenya.com</p>
                </div>
                <div>
                  <label className="block text-sm font-bold text-black mb-1">Tier inicial</label>
                  <select value={newTenantTier} onChange={e => setNewTenantTier(e.target.value as 'light' | 'plus' | 'pro')}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm focus:ring-2 focus:ring-orange-500 text-black">
                    <option value="light">Light — Menú + QR</option>
                    <option value="plus">Plus — Pedidos + Reportes</option>
                    <option value="pro">Pro — Todo incluido</option>
                  </select>
                </div>
                <button type="submit" disabled={loading}
                  className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 font-semibold">
                  {loading ? 'Creando...' : 'Crear tenant'}
                </button>
              </form>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}