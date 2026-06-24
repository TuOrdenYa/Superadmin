'use client';

import { useState, useEffect, useCallback } from 'react';

interface Option {
  id: string;
  group_template_id: string;
  name: string;
  position: number;
  price_delta: number;
  active: boolean;
}

interface Group {
  id: string;
  name: string;
  position: number;
  required: boolean;
  max_select: number;
  active: boolean;
  created_at: string;
  options: Option[];
}

interface Props {
  adminFetch: (url: string, options?: RequestInit) => Promise<Response>;
}

export default function VariantesGlobales({ adminFetch }: Props) {
  const [groups, setGroups] = useState<Group[]>([]);
  const [loading, setLoading] = useState(false);
  const [expanded, setExpanded] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);

  const [newName, setNewName] = useState('');
  const [newRequired, setNewRequired] = useState(false);
  const [newMaxSelect, setNewMaxSelect] = useState(1);
  const [newOptions, setNewOptions] = useState([{ name: '', price_delta: 0 }]);

  const fetchGroups = useCallback(async () => {
    try {
      const res = await adminFetch('/api/superadmin/variant-groups');
      const data = await res.json();
      if (data.ok) setGroups(data.groups);
    } catch (error) {
      console.error('Error fetching variant groups:', error);
    }
  }, [adminFetch]);

  useEffect(() => { fetchGroups(); }, [fetchGroups]);

  const handleToggleActive = async (group: Group) => {
    try {
      const res = await adminFetch(`/api/superadmin/variant-groups/${group.id}`, {
        method: 'PATCH',
        body: JSON.stringify({ active: !group.active }),
      });
      const data = await res.json();
      if (data.ok) fetchGroups();
    } catch (error) {
      console.error('Error toggling group:', error);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newName.trim()) return;
    setLoading(true);
    try {
      const res = await adminFetch('/api/superadmin/variant-groups', {
        method: 'POST',
        body: JSON.stringify({
          name: newName,
          required: newRequired,
          max_select: newMaxSelect,
          options: newOptions.filter(o => o.name.trim()),
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setNewName('');
        setNewRequired(false);
        setNewMaxSelect(1);
        setNewOptions([{ name: '', price_delta: 0 }]);
        setShowForm(false);
        fetchGroups();
      } else {
        alert('Error: ' + (data.error || 'No se pudo crear'));
      }
    } catch (error) {
      console.error('Error creating group:', error);
    } finally {
      setLoading(false);
    }
  };

  const addOption = () => setNewOptions([...newOptions, { name: '', price_delta: 0 }]);
  const removeOption = (i: number) => setNewOptions(newOptions.filter((_, idx) => idx !== i));
  const updateOption = (i: number, field: 'name' | 'price_delta', value: string | number) => {
    const updated = [...newOptions];
    updated[i] = { ...updated[i], [field]: value };
    setNewOptions(updated);
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <p className="text-sm text-gray-500">Grupos disponibles para todos los tenants con tier Pro</p>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
        >
          {showForm ? 'Cancelar' : '+ Nuevo grupo'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-sm font-bold text-black mb-4">Nuevo grupo global</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nombre del grupo</label>
              <input
                type="text"
                value={newName}
                onChange={e => setNewName(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black focus:ring-2 focus:ring-orange-500"
                placeholder="Ej: Tamaño, Tipo de leche, Proteína"
                required
              />
            </div>
            <div className="flex gap-6">
              <label className="flex items-center gap-2 text-sm text-black">
                <input type="checkbox" checked={newRequired} onChange={e => setNewRequired(e.target.checked)} />
                Requerido
              </label>
              <div className="flex items-center gap-2">
                <label className="text-sm text-black">Máx. selección</label>
                <input
                  type="number"
                  min={1}
                  value={newMaxSelect}
                  onChange={e => setNewMaxSelect(parseInt(e.target.value))}
                  className="w-16 px-2 py-1 border border-gray-300 rounded text-sm text-black"
                />
              </div>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-2">Opciones</label>
              <div className="space-y-2">
                {newOptions.map((opt, i) => (
                  <div key={i} className="flex gap-2 items-center">
                    <input
                      type="text"
                      value={opt.name}
                      onChange={e => updateOption(i, 'name', e.target.value)}
                      className="flex-1 px-3 py-1.5 border border-gray-300 rounded text-sm text-black"
                      placeholder={`Opción ${i + 1}`}
                    />
                    <input
                      type="number"
                      value={opt.price_delta}
                      onChange={e => updateOption(i, 'price_delta', parseInt(e.target.value) || 0)}
                      className="w-24 px-3 py-1.5 border border-gray-300 rounded text-sm text-black"
                      placeholder="Δ precio"
                    />
                    {newOptions.length > 1 && (
                      <button type="button" onClick={() => removeOption(i)} className="text-red-500 hover:text-red-700 text-sm font-bold">✕</button>
                    )}
                  </div>
                ))}
              </div>
              <button type="button" onClick={addOption} className="mt-2 text-sm text-orange-600 hover:text-orange-700 font-semibold">
                + Agregar opción
              </button>
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 font-semibold text-sm"
            >
              {loading ? 'Creando...' : 'Crear grupo global'}
            </button>
          </form>
        </div>
      )}

      <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
        {groups.length === 0 ? (
          <div className="px-4 py-8 text-center text-gray-400 text-sm">Sin grupos globales</div>
        ) : groups.map(group => (
          <div key={group.id} className={`border-b border-gray-100 last:border-0 ${!group.active ? 'opacity-50' : ''}`}>
            <div className="flex items-center justify-between px-4 py-3">
              <div className="flex items-center gap-3">
                <button
                  onClick={() => setExpanded(expanded === group.id ? null : group.id)}
                  className="text-gray-400 hover:text-gray-600 text-xs"
                >
                  {expanded === group.id ? '▼' : '▶'}
                </button>
                <div>
                  <div className="font-semibold text-black text-sm">{group.name}</div>
                  <div className="text-xs text-gray-400">
                    {group.required ? 'Requerido · ' : ''}Máx. {group.max_select} · {group.options.length} opciones
                  </div>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <span className={`px-2 py-0.5 text-xs font-bold rounded ${group.active ? 'bg-green-100 text-green-700' : 'bg-gray-100 text-gray-500'}`}>
                  {group.active ? 'Activo' : 'Inactivo'}
                </span>
                <button
                  onClick={() => handleToggleActive(group)}
                  className={`text-xs px-2 py-1 rounded font-semibold ${group.active ? 'bg-red-100 text-red-700 hover:bg-red-200' : 'bg-green-100 text-green-700 hover:bg-green-200'}`}
                >
                  {group.active ? 'Desactivar' : 'Activar'}
                </button>
              </div>
            </div>
            {expanded === group.id && (
              <div className="px-10 pb-3">
                <table className="w-full text-xs">
                  <thead>
                    <tr className="text-gray-400 border-b border-gray-100">
                      <th className="text-left py-1 font-semibold">Opción</th>
                      <th className="text-right py-1 font-semibold">Δ precio</th>
                      <th className="text-center py-1 font-semibold">Activa</th>
                    </tr>
                  </thead>
                  <tbody>
                    {group.options.map(opt => (
                      <tr key={opt.id} className="border-b border-gray-50">
                        <td className="py-1 text-black">{opt.name}</td>
                        <td className="py-1 text-right text-gray-500">{opt.price_delta > 0 ? `+${opt.price_delta.toLocaleString('es-CO')}` : '—'}</td>
                        <td className="py-1 text-center">{opt.active ? '✓' : '–'}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}