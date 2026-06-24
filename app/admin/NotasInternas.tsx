'use client';

import { useState, useEffect, useCallback } from 'react';

interface Note {
  id: string;
  tenant_id: string;
  tenant_name: string;
  text: string;
  created_at: string;
}

interface Tenant {
  id: string;
  name: string;
}

interface Props {
  adminFetch: (url: string, options?: RequestInit) => Promise<Response>;
  tenants: Tenant[];
}

export default function NotasInternas({ adminFetch, tenants }: Props) {
  const [notes, setNotes] = useState<Note[]>([]);
  const [filterTenant, setFilterTenant] = useState('');
  const [newText, setNewText] = useState('');
  const [newTenantId, setNewTenantId] = useState('');
  const [showForm, setShowForm] = useState(false);
  const [loading, setLoading] = useState(false);

  const fetchNotes = useCallback(async () => {
    try {
      const url = filterTenant
        ? `/api/superadmin/notes?tenant_id=${filterTenant}`
        : '/api/superadmin/notes';
      const res = await adminFetch(url);
      const data = await res.json();
      if (data.ok) setNotes(data.notes);
    } catch (error) {
      console.error('Error fetching notes:', error);
    }
  }, [adminFetch, filterTenant]);

  useEffect(() => { fetchNotes(); }, [fetchNotes]);

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newTenantId || !newText.trim()) return;
    setLoading(true);
    try {
      const res = await adminFetch('/api/superadmin/notes', {
        method: 'POST',
        body: JSON.stringify({ tenant_id: newTenantId, text: newText }),
      });
      const data = await res.json();
      if (data.ok) {
        setNewText('');
        setNewTenantId('');
        setShowForm(false);
        fetchNotes();
      } else {
        alert('Error: ' + (data.error || 'No se pudo guardar'));
      }
    } catch (error) {
      console.error('Error creating note:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async (noteId: string) => {
    if (!confirm('¿Eliminar esta nota?')) return;
    try {
      const res = await adminFetch(`/api/superadmin/notes/${noteId}`, { method: 'DELETE' });
      const data = await res.json();
      if (data.ok) fetchNotes();
    } catch (error) {
      console.error('Error deleting note:', error);
    }
  };

  function timeAgo(date: string) {
    const days = Math.floor((Date.now() - new Date(date).getTime()) / 86400000);
    if (days === 0) return 'hoy';
    if (days === 1) return 'ayer';
    return `hace ${days}d`;
  }

  return (
    <div>
      <div className="flex justify-between items-center mb-4">
        <div className="flex gap-3 items-center">
          <select
            value={filterTenant}
            onChange={e => setFilterTenant(e.target.value)}
            className="px-3 py-2 text-sm border border-gray-300 rounded-lg text-black"
          >
            <option value="">Todos los tenants</option>
            {tenants.map(t => (
              <option key={t.id} value={t.id}>{t.name}</option>
            ))}
          </select>
        </div>
        <button
          onClick={() => setShowForm(!showForm)}
          className="text-sm px-3 py-1.5 bg-orange-600 text-white rounded-lg hover:bg-orange-700 font-semibold"
        >
          {showForm ? 'Cancelar' : '+ Nueva nota'}
        </button>
      </div>

      {showForm && (
        <div className="bg-white rounded-lg border border-gray-200 p-6 mb-6">
          <h3 className="text-sm font-bold text-black mb-4">Nueva nota interna</h3>
          <form onSubmit={handleCreate} className="space-y-4">
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Tenant</label>
              <select
                value={newTenantId}
                onChange={e => setNewTenantId(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black"
                required
              >
                <option value="">Selecciona un tenant...</option>
                {tenants.map(t => (
                  <option key={t.id} value={t.id}>{t.name}</option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-xs font-bold text-gray-700 mb-1">Nota</label>
              <textarea
                value={newText}
                onChange={e => setNewText(e.target.value)}
                className="w-full px-3 py-2 border border-gray-300 rounded-lg text-sm text-black resize-none"
                rows={4}
                placeholder="Contexto, seguimiento, observaciones..."
                required
              />
            </div>
            <button
              type="submit"
              disabled={loading}
              className="w-full bg-orange-600 text-white py-2 rounded-lg hover:bg-orange-700 disabled:opacity-50 font-semibold text-sm"
            >
              {loading ? 'Guardando...' : 'Guardar nota'}
            </button>
          </form>
        </div>
      )}

      <div className="space-y-3">
        {notes.length === 0 ? (
          <div className="bg-white rounded-lg border border-gray-200 px-4 py-8 text-center text-gray-400 text-sm">
            Sin notas — usa el botón para agregar contexto sobre un tenant
          </div>
        ) : notes.map(note => (
          <div key={note.id} className="bg-white rounded-lg border border-gray-200 p-4">
            <div className="flex justify-between items-start mb-2">
              <div>
                <span className="text-xs font-bold text-orange-600">{note.tenant_name}</span>
                <span className="text-xs text-gray-400 ml-2">{timeAgo(note.created_at)}</span>
              </div>
              <button
                onClick={() => handleDelete(note.id)}
                className="text-xs text-red-400 hover:text-red-600 font-semibold"
              >
                Eliminar
              </button>
            </div>
            <p className="text-sm text-black whitespace-pre-wrap">{note.text}</p>
          </div>
        ))}
      </div>
    </div>
  );
}