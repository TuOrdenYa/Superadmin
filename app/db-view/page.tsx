'use client';

import { useEffect, useState } from 'react';

export default function DatabaseView() {
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/db-view')
      .then(res => res.json())
      .then(data => {
        setData(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div className="p-8">Loading...</div>;
  if (error) return <div className="p-8 text-red-500">Error: {error}</div>;

  return (
    <div className="p-8 max-w-6xl mx-auto">
      <h1 className="text-3xl font-bold mb-6">Database View</h1>
      
      {data?.error ? (
        <div className="bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded mb-4">
          <strong>Error:</strong> {data.error}
          <br />
          <strong>Code:</strong> {data.code}
        </div>
      ) : (
        <>
          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Connection Info</h2>
            <div className="bg-green-100 border border-green-400 px-4 py-3 rounded">
              <p><strong>Status:</strong> Connected</p>
              <p><strong>Time:</strong> {data?.time}</p>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Tenants ({data?.tenants?.length || 0})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Slug</th>
                    <th className="px-4 py-2 border">Tier</th>
                    <th className="px-4 py-2 border">Status</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.tenants?.map((t: any) => (
                    <tr key={t.id}>
                      <td className="px-4 py-2 border">{t.id}</td>
                      <td className="px-4 py-2 border font-semibold">{t.name}</td>
                      <td className="px-4 py-2 border text-orange-600">{t.slug}</td>
                      <td className="px-4 py-2 border">
                        <span className={`px-2 py-1 text-xs font-bold rounded ${
                          t.product_tier === 'pro' ? 'bg-purple-100 text-purple-700' :
                          t.product_tier === 'plus' ? 'bg-orange-100 text-orange-700' :
                          t.product_tier === 'light' ? 'bg-gray-100 text-gray-700' :
                          'bg-red-100 text-red-700'
                        }`}>
                          {t.product_tier ? t.product_tier.toUpperCase() : 'NOT SET'}
                        </span>
                      </td>
                      <td className="px-4 py-2 border">
                        <span className={`font-semibold ${
                          t.subscription_status === 'active' ? 'text-green-600' : 'text-red-600'
                        }`}>
                          {t.subscription_status || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div className="mb-8">
            <h2 className="text-xl font-semibold mb-3">Users ({data?.users?.length || 0})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Email</th>
                    <th className="px-4 py-2 border">Tenant ID</th>
                    <th className="px-4 py-2 border">Role</th>
                    <th className="px-4 py-2 border">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.users?.map((u: any) => (
                    <tr key={u.id}>
                      <td className="px-4 py-2 border">{u.id}</td>
                      <td className="px-4 py-2 border">{u.full_name}</td>
                      <td className="px-4 py-2 border">{u.email}</td>
                      <td className="px-4 py-2 border">{u.tenant_id}</td>
                      <td className="px-4 py-2 border">{u.role}</td>
                      <td className="px-4 py-2 border">{u.is_active ? '✓' : '✗'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          <div>
            <h2 className="text-xl font-semibold mb-3">Menu Items ({data?.items?.length || 0})</h2>
            <div className="overflow-x-auto">
              <table className="min-w-full bg-white border">
                <thead className="bg-gray-100">
                  <tr>
                    <th className="px-4 py-2 border">ID</th>
                    <th className="px-4 py-2 border">Name</th>
                    <th className="px-4 py-2 border">Tenant ID</th>
                    <th className="px-4 py-2 border">Price</th>
                    <th className="px-4 py-2 border">Active</th>
                  </tr>
                </thead>
                <tbody>
                  {data?.items?.slice(0, 10).map((i: any) => (
                    <tr key={i.id}>
                      <td className="px-4 py-2 border">{i.id}</td>
                      <td className="px-4 py-2 border">{i.name}</td>
                      <td className="px-4 py-2 border">{i.tenant_id}</td>
                      <td className="px-4 py-2 border">${i.price}</td>
                      <td className="px-4 py-2 border">{i.active ? '✓' : '✗'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
              {data?.items?.length > 10 && (
                <p className="text-sm text-gray-600 mt-2">Showing first 10 of {data.items.length} items</p>
              )}
            </div>
          </div>
        </>
      )}
    </div>
  );
}
