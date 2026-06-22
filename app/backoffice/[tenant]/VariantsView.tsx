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
  scope: 'global' | 'custom';
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
  const [editingPrice, setEditingPrice] = useState<string | null>(null);
  const [editPriceValue, setEditPriceValue] = useState<string>('');
  const [togglingOption, setTogglingOption] = useState<string | null>(null);

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

  const toggleOptionOnItem = async (groupId: string, optionId: string, currentlyActive: boolean) => {
    if (!selectedItem) return;
    setTogglingOption(optionId);
    try {
      const res = await fetch(`/api/items/${selectedItem}/variant-options/${optionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          group_template_id: groupId,
          active: !currentlyActive,
        }),
      });
      const data = await res.json();
      if (data.ok) fetchItemVariants(selectedItem);
      else alert(data.error || 'Error al actualizar opción');
    } catch { alert('Error al actualizar opción'); }
    finally { setTogglingOption(null); }
  };

  const saveOptionPrice = async (groupId: string, optionId: string) => {
    if (!selectedItem) return;
    try {
      const res = await fetch(`/api/items/${selectedItem}/variant-options/${optionId}`, {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          group_template_id: groupId,
          price_delta: parseFloat(editPriceValue) || 0,
        }),
      });
      const data = await res.json();
      if (data.ok) { fetchItemVariants(selectedItem); setEditingPrice(null); }
      else alert(data.error || 'Error al guardar precio');
    } catch { alert('Error al guardar precio'); }
  };

  if (loading) return <div className="text-center py-12 text-gray-500">Cargando variantes...</div>;

  return (
    <div className="max-w-5xl mx-auto space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-black">
          {locale === 'es' ? 'Variantes de productos' : 'Product variants'}
        </h2>
        <p className="text-sm text-gray-500 mt-1">
          {locale === 'es'
            ? 'Asigna grupos de opciones a tus productos y ajusta los precios'
            : 'Assign option groups to your products and adjust prices'}
        </p>
      </div>

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
                      <div className="flex items-center gap-2">
                        <span className="font-bold text-black text-sm">{group.name}</span>
                        <span className={`text-xs px-2 py-0.5 rounded font-semibold ${
                          group.scope === 'global'
                            ? 'bg-blue-100 text-blue-700'
                            : 'bg-purple-100 text-purple-700'
                        }`}>
                          {group.scope === 'global'
                            ? (locale === 'es' ? 'Global' : 'Global')
                            : (locale === 'es' ? 'Personalizado' : 'Custom')}
                        </span>
                      </div>
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
                      <div className="space-y-1.5">
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
                      {/* Group header */}
                      <div className="flex items-center justify-between mb-2">
                        <div>
                          <span className={`text-sm font-bold ${isActive ? 'text-blue-800' : 'text-gray-600'}`}>
                            {group.name}
                          </span>
                          {group.required && (
                            <span className="ml-2 text-xs text-red-600 font-semibold">
                              {locale === 'es' ? 'requerido' : 'required'}
                            </span>
                          )}
                        </div>
                        <button
                          onClick={() => toggleGroupOnItem(group.id, isActive)}
                          className={`relative flex-shrink-0 w-10 h-6 rounded-full transition-colors focus:outline-none ${isActive ? 'bg-blue-600' : 'bg-gray-300'}`}
                        >
                          <span className={`absolute top-0.5 left-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 ${isActive ? 'translate-x-4' : 'translate-x-0'}`} />
                        </button>
                      </div>

                      {/* Options — price + active toggle */}
                      {isActive && assigned && assigned.options.length > 0 && (
                        <div className="space-y-1.5 mt-2 pt-2 border-t border-blue-100">
                          <p className="text-xs text-blue-600 font-semibold mb-2">
                            {locale === 'es' ? 'Opciones:' : 'Options:'}
                          </p>
                          {assigned.options.map(opt => {
                            const optActive = opt.item_active !== false;
                            return (
                              <div
                                key={opt.option_id}
                                className={`flex items-center justify-between rounded-lg px-2 py-1.5 transition ${optActive ? 'bg-white' : 'bg-gray-100 opacity-60'}`}
                              >
                                {/* Option name + active toggle */}
                                <div className="flex items-center gap-2">
                                  <button
                                    onClick={() => toggleOptionOnItem(group.id, opt.option_id, optActive)}
                                    disabled={togglingOption === opt.option_id}
                                    className={`relative flex-shrink-0 w-8 h-4 rounded-full transition-colors focus:outline-none ${optActive ? 'bg-blue-500' : 'bg-gray-300'}`}
                                  >
                                    <span className={`absolute top-0.5 left-0.5 w-3 h-3 bg-white rounded-full shadow transition-transform duration-200 ${optActive ? 'translate-x-4' : 'translate-x-0'}`} />
                                  </button>
                                  <span className={`text-xs font-medium ${optActive ? 'text-gray-800' : 'text-gray-400 line-through'}`}>
                                    {opt.option_name}
                                  </span>
                                </div>

                                {/* Price edit */}
                                {optActive && (
                                  editingPrice === opt.option_id ? (
                                    <div className="flex items-center gap-1">
                                      <input
                                        type="number"
                                        value={editPriceValue}
                                        onChange={e => setEditPriceValue(e.target.value)}
                                        className="w-20 px-2 py-0.5 border border-blue-300 rounded text-xs text-black"
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
                                  )
                                )}
                              </div>
                            );
                          })}
                        </div>
                      )}
                    </div>
                  );
                })}
                {groups.length === 0 && (
                  <p className="text-sm text-gray-400 text-center py-4">
                    {locale === 'es' ? 'No hay grupos disponibles' : 'No groups available'}
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