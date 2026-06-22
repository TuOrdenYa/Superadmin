'use client';
import { useState, useEffect, useCallback } from 'react';

interface VariantOption {
  id: string;
  name: string;
  position: number;
  price_delta: number;
  active: boolean;
}

interface VariantGroup {
  id: string;
  name: string;
  position: number;
  required: boolean;
  max_select: number;
  active: boolean;
  options?: VariantOption[];
}

interface ItemVariantGroup {
  group_id: string;
  group_name: string;
  required: boolean;
  position: number;
  item_active: boolean | null;
  options: {
    option_id: string;
    option_name: string;
    price_delta: number;
    item_price_delta: number | null;
    item_active: boolean | null;
  }[];
}

interface MenuItem {
  id: string;
  name: string;
  price: string;
}

interface Props {
  tenantId: string;
  items: MenuItem[];
  locale: string;
}

const fmt = (n: number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(n);

export default function VariantsView({ tenantId, items, locale }: Props) {
  const [groups, setGroups] = useState<VariantGroup[]>([]);
  const [loading, setLoading] = useState(true);
  const [expandedGroup, setExpandedGroup] = useState<string | null>(null);
  const [groupOptions, setGroupOptions] = useState<Record<string, VariantOption[]>>({});
  const [selectedItem, setSelectedItem] = useState<string>('');
  const [itemVariants, setItemVariants] = useState<ItemVariantGroup[]>([]);
  const [loadingItemVariants, setLoadingItemVariants] = useState(false);
  const [showGroupForm, setShowGroupForm] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', required: false, max_select: 1 });
  const [showOptionForm, setShowOptionForm] = useState<string | null>(null);
  const [newOption, setNewOption] = useState({ name: '', price_delta: 0 });
  const [saving, setSaving] = useState(false);
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<string>('');

  const fetchGroups = useCallback(async () => {
    try {
      const res = await fetch(`/api/variant-group-templates?tenant_id=${tenantId}`);
      const data = await res.json();
      if (data.ok) setGroups(data.groups || []);
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  }, [tenantId]);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  const fetchGroupOptions = async (groupId: string) => {
    if (expandedGroup === groupId) { setExpandedGroup(null); return; }
    if (!groupOptions[groupId]) {
      try {
        const res = await fetch(`/api/variant-group-templates/${groupId}/options?tenant_id=${tenantId}`);
        const data = await res.json();
        if (data.ok) setGroupOptions(prev => ({ ...prev, [groupId]: data.options || [] }));
      } catch (e) { console.error(e); }
    }
    setExpandedGroup(groupId);
  };

  const fetchItemVariants = async (itemId: string) => {
    if (!itemId) { setItemVariants([]); return; }
    setLoadingItemVariants(true);
    try {
      const res = await fetch(`/api/items/${itemId}/variants?tenant_id=${tenantId}`);
      const data = await res.json();
      if (data.ok) setItemVariants(data.variants || []);
    } catch (e) { console.error(e); }
    finally { setLoadingItemVariants(false); }
  };

  const handleCreateGroup = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch('/api/variant-group-templates', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: tenantId, ...newGroup }),
      });
      const data = await res.json();
      if (data.ok) {
        fetchGroups();
        setNewGroup({ name: '', required: false, max_select: 1 });
        setShowGroupForm(false);
      } else alert(data.error || 'Error al crear grupo');
    } catch { alert('Error al crear grupo'); }
    finally { setSaving(false); }
  };

  const handleCreateOption = async (e: React.FormEvent, groupId: string) => {
    e.preventDefault();
    setSaving(true);
    try {
      const res = await fetch(`/api/variant-group-templates/${groupId}/options`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: tenantId, ...newOption }),
      });
      const data = await res.json();
      if (data.ok) {
        setGroupOptions(prev => ({ ...prev, [groupId]: [...(prev[groupId] || []), data.option] }));
        setNewOption({ name: '', price_delta: 0 });
        setShowOptionForm(null);
      } else alert(data.error || 'Error al crear opción');
    } catch { alert('Error al crear opción'); }
    finally { setSaving(false); }
  };

  const toggleGroupOnItem = async (groupId: string, currentlyActive: boolean) => {
    if (!selectedItem) return;
    try {
      const res = await fetch(`/api/items/${selectedItem}/variants`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: tenantId, group_template_id: groupId, active: !currentlyActive }),
      });
      const data = await res.json();
      if (data.ok) fetchItemVariants(selectedItem);
      else alert(data.error || 'Error');
    } catch { alert('Error al actualizar variante'); }
  };

  const saveOptionPrice = async (groupId: string, optionId: string) => {
    if (!selectedItem) return;
    try {
      const res = await fetch(`/api/items/${selectedItem}/variant-options/${optionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ tenant_id: tenantId, group_template_id: groupId, price_delta: parseFloat(editPriceValue) || 0 }),
      });
      const data = await res.json();
      if (data.ok) { fetchItemVariants(selectedItem); setEditingPrice(null); }
      else alert(data.error || 'Error al guardar precio');
    } catch { alert('Error al guardar precio'); }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Cargando variantes...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-black">
            {locale === 'es' ? 'Variantes de productos' : 'Product variants'}
          </h2>
          <p className="text-sm text-gray-500 mt-1">
            {locale === 'es'
              ? 'Gestiona grupos de opciones y asígnalos a tus productos'
              : 'Manage option groups and assign them to your products'}
          </p>
        </div>
        <button
          onClick={() => setShowGroupForm(v => !v)}
          className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 font-semibold text-sm"
        >
          + {locale === 'es' ? 'Nuevo grupo' : 'New group'}
        </button>
      </div>

      {/* Create group form */}
      {showGroupForm && (
        <div className="bg-white rounded-xl border border-gray-200 p-5">
          <h3 className="font-bold text-black mb-4">{locale === 'es' ? 'Nuevo grupo de variantes' : 'New variant group'}</h3>
          <form onSubmit={handleCreateGroup} className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="md:col-span-2">
                <label className="block text-sm font-bold text-black mb-1">{locale === 'es' ? 'Nombre' : 'Name'} *</label>
                <input
                  type="text"
                  value={newGroup.name}
                  onChange={e => setNewGroup(g => ({ ...g, name: e.target.value }))}
                  placeholder={locale === 'es' ? 'Ej: Tamaño, Proteína, Extras' : 'e.g. Size, Protein, Extras'}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm"
                  required
                />
              </div>
              <div>
                <label className="block text-sm font-bold text-black mb-1">{locale === 'es' ? 'Máx. selecciones' : 'Max selections'}</label>
                <input
                  type="number" min={1} value={newGroup.max_select}
                  onChange={e => setNewGroup(g => ({ ...g, max_select: parseInt(e.target.value) }))}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm"
                />
              </div>
            </div>
            <label className="flex items-center gap-2 cursor-pointer">
              <input type="checkbox" checked={newGroup.required}
                onChange={e => setNewGroup(g => ({ ...g, required: e.target.checked }))} className="w-4 h-4 rounded" />
              <span className="text-sm font-semibold text-black">
                {locale === 'es' ? 'Requerido (el cliente debe elegir)' : 'Required (customer must choose)'}
              </span>
            </label>
            <div className="flex gap-2">
              <button type="submit" disabled={saving}
                className="px-5 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 font-semibold text-sm disabled:opacity-50">
                {saving ? '...' : locale === 'es' ? 'Crear grupo' : 'Create group'}
              </button>
              <button type="button" onClick={() => setShowGroupForm(false)}
                className="px-5 py-2 bg-gray-200 text-gray-700 rounded-lg hover:bg-gray-300 font-semibold text-sm">
                {locale === 'es' ? 'Cancelar' : 'Cancel'}
              </button>
            </div>
          </form>
        </div>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Left: Groups library */}
        <div>
          <h3 className="font-bold text-gray-600 text-xs uppercase tracking-wider mb-3">
            {locale === 'es' ? 'Grupos disponibles' : 'Available groups'}
          </h3>
          {groups.length === 0 ? (
            <div className="bg-white rounded-xl border border-dashed border-gray-300 p-8 text-center text-gray-400">
              <p className="text-3xl mb-2">🎛️</p>
              <p className="text-sm">{locale === 'es' ? 'No hay grupos aún' : 'No groups yet'}</p>
            </div>
          ) : (
            <div className="space-y-2">
              {groups.map(group => (
                <div key={group.id} className="bg-white rounded-xl border border-gray-200 overflow-hidden">
                  <button
                    onClick={() => fetchGroupOptions(group.id)}
                    className="w-full flex items-center justify-between px-4 py-3 hover:bg-gray-50 transition text-left"
                  >
                    <div>
                      <span className="font-bold text-black text-sm">{group.name}</span>
                      <div className="flex items-center gap-2 mt-0.5">
                        {group.required && (
                          <span className="text-xs bg-red-100 text-red-700 px-2 py-0.5 rounded font-semibold">
                            {locale === 'es' ? 'Requerido' : 'Required'}
                          </span>
                        )}
                        <span className="text-xs text-gray-400">
                          {locale === 'es' ? `Máx. ${group.max_select}` : `Max ${group.max_select}`}
                        </span>
                      </div>
                    </div>
                    <span className="text-gray-400 text-sm">{expandedGroup === group.id ? '▲' : '▼'}</span>
                  </button>

                  {expandedGroup === group.id && (
                    <div className="border-t border-gray-100 px-4 py-3">
                      <div className="space-y-1.5 mb-3">
                        {(groupOptions[group.id] || []).map(opt => (
                          <div key={opt.id} className="flex items-center justify-between py-1">
                            <span className="text-sm text-gray-700">{opt.name}</span>
                            <span className="text-sm text-gray-500">
                              {opt.price_delta > 0 ? `+${fmt(opt.price_delta)}` : opt.price_delta < 0 ? fmt(opt.price_delta) : '—'}
                            </span>
                          </div>
                        ))}
                        {(groupOptions[group.id] || []).length === 0 && (
                          <p className="text-xs text-gray-400">{locale === 'es' ? 'Sin opciones aún' : 'No options yet'}</p>
                        )}
                      </div>

                      {showOptionForm === group.id ? (
                        <form onSubmit={e => handleCreateOption(e, group.id)} className="space-y-2 pt-2 border-t border-gray-100">
                          <div className="grid grid-cols-2 gap-2">
                            <input
                              type="text" value={newOption.name}
                              onChange={e => setNewOption(o => ({ ...o, name: e.target.value }))}
                              placeholder={locale === 'es' ? 'Nombre opción' : 'Option name'}
                              className="px-3 py-1.5 border border-gray-300 rounded-lg text-black text-sm" required
                            />
                            <input
                              type="number" value={newOption.price_delta}
                              onChange={e => setNewOption(o => ({ ...o, price_delta: parseFloat(e.target.value) || 0 }))}
                              placeholder="Δ precio (0)"
                              className="px-3 py-1.5 border border-gray-300 rounded-lg text-black text-sm"
                            />
                          </div>
                          <div className="flex gap-2">
                            <button type="submit" disabled={saving}
                              className="flex-1 py-1.5 bg-green-600 text-white rounded-lg font-semibold text-xs hover:bg-green-700 disabled:opacity-50">
                              {saving ? '...' : '+ Agregar'}
                            </button>
                            <button type="button" onClick={() => setShowOptionForm(null)}
                              className="flex-1 py-1.5 bg-gray-200 text-gray-700 rounded-lg font-semibold text-xs">
                              {locale === 'es' ? 'Cancelar' : 'Cancel'}
                            </button>
                          </div>
                        </form>
                      ) : (
                        <button
                          onClick={() => setShowOptionForm(group.id)}
                          className="w-full py-1.5 border border-dashed border-gray-300 rounded-lg text-xs text-gray-500 hover:border-gray-400 hover:text-gray-700 transition"
                        >
                          + {locale === 'es' ? 'Agregar opción' : 'Add option'}
                        </button>
                      )}
                    </div>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Right: Assign to product */}
        <div>
          <h3 className="font-bold text-gray-600 text-xs uppercase tracking-wider mb-3">
            {locale === 'es' ? 'Asignar a producto' : 'Assign to product'}
          </h3>
          <div className="bg-white rounded-xl border border-gray-200 p-4">
            <select
              value={selectedItem}
              onChange={e => { setSelectedItem(e.target.value); fetchItemVariants(e.target.value); }}
              className="w-full px-3 py-2 border border-gray-300 rounded-lg text-black text-sm mb-4"
            >
              <option value="">{locale === 'es' ? '— Selecciona un producto —' : '— Select a product —'}</option>
              {items.map(item => <option key={item.id} value={item.id}>{item.name}</option>)}
            </select>

            {selectedItem && loadingItemVariants && (
              <p className="text-sm text-gray-400 text-center py-4">Cargando...</p>
            )}

            {selectedItem && !loadingItemVariants && (
              <div className="space-y-2">
                {groups.map(group => {
                  const assigned = itemVariants.find(v => v.group_id === group.id);
                  const isActive = assigned ? assigned.item_active !== false : false;
                  return (
                    <div key={group.id} className={`rounded-lg border p-3 transition ${isActive ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-gray-50'}`}>
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className={`text-sm font-bold ${isActive ? 'text-blue-800' : 'text-gray-600'}`}>{group.name}</span>
                          {group.required && (
                            <span className="ml-2 text-xs text-red-600 font-semibold">
                              {locale === 'es' ? 'requerido' : 'required'}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => toggleGroupOnItem(group.id, isActive)}
                          className={`relative w-11 h-6 rounded-full transition-colors ${isActive ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                          <span className={`absolute top-1 w-4 h-4 bg-white rounded-full shadow transition-transform ${isActive ? 'translate-x-6' : 'translate-x-1'}`} />
                        </button>
                      </div>

                      {isActive && assigned && assigned.options.length > 0 && (
                        <div className="space-y-1 mt-2 pt-2 border-t border-blue-100">
                          <p className="text-xs text-blue-600 font-semibold mb-1">
                            {locale === 'es' ? 'Precio por opción:' : 'Price per option:'}
                          </p>
                          {assigned.options.map(opt => (
                            <div key={opt.option_id} className="flex items-center justify-between">
                              <span className="text-xs text-gray-700">{opt.option_name}</span>
                              {editingPrice === opt.option_id ? (
                                <div className="flex items-center gap-1">
                                  <input
                                    type="number"
                                    value={editPriceValue}
                                    onChange={e => setEditPriceValue(e.target.value)}
                                    className="w-24 px-2 py-0.5 border border-blue-300 rounded text-xs text-black"
                                    autoFocus
                                  />
                                  <button
                                    onClick={() => saveOptionPrice(group.id, opt.option_id)}
                                    className="text-xs bg-green-600 text-white px-2 py-0.5 rounded hover:bg-green-700"
                                  >✓</button>
                                  <button
                                    onClick={() => setEditingPrice(null)}
                                    className="text-xs bg-gray-300 text-gray-700 px-2 py-0.5 rounded"
                                  >✕</button>
                                </div>
                              ) : (
                                <button
                                  onClick={() => {
                                    setEditingPrice(opt.option_id);
                                    setEditPriceValue(String(opt.item_price_delta ?? opt.price_delta));
                                  }}
                                  className="text-xs text-blue-600 hover:text-blue-800 font-semibold"
                                >
                                  {opt.item_price_delta !== null ? `+${fmt(opt.item_price_delta)}` : `+${fmt(opt.price_delta)}`} ✏️
                                </button>
                              )}
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  );
                })}
                {groups.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    {locale === 'es' ? 'Crea grupos primero' : 'Create groups first'}
                  </p>
                )}
              </div>
            )}

            {!selectedItem && (
              <div className="text-center py-8 text-gray-300">
                <p className="text-3xl mb-2">↑</p>
                <p className="text-sm">{locale === 'es' ? 'Selecciona un producto arriba' : 'Select a product above'}</p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}