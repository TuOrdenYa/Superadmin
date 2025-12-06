'use client';

import { useState } from 'react';

export default function TestPage() {
  const [results, setResults] = useState<any>({});
  const [loading, setLoading] = useState<string | null>(null);

  const testEndpoint = async (name: string, url: string, options?: RequestInit) => {
    setLoading(name);
    try {
      const res = await fetch(url, options);
      const data = await res.json();
      console.log(`${name}:`, { status: res.status, data });
      setResults((prev: any) => ({ ...prev, [name]: { status: res.status, data } }));
    } catch (error: any) {
      console.error(`${name} error:`, error);
      setResults((prev: any) => ({ ...prev, [name]: { error: error.message } }));
    } finally {
      setLoading(null);
    }
  };

  return (
    <div className="p-8 max-w-4xl mx-auto bg-white min-h-screen">
      <h1 className="text-3xl font-bold mb-6 text-black">API Test Page</h1>
      <div className="mb-4 p-4 bg-blue-100 border border-blue-300 rounded">
        <p className="text-sm text-black">Click buttons below to test API endpoints. Results will appear below each button.</p>
        <p className="text-xs text-gray-700 mt-1">Check browser console (F12) for detailed logs.</p>
      </div>
      
      <div className="space-y-4">
        <div className="border rounded p-4">
          <h2 className="font-bold text-xl mb-2">Menu & Categories</h2>
          <div className="space-x-2">
            <button
              onClick={() => testEndpoint('menu', '/api/menu?tenant_id=1')}
              disabled={loading === 'menu'}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Test GET /api/menu
            </button>
            <button
              onClick={() => testEndpoint('categories', '/api/categories?tenant_id=1')}
              disabled={loading === 'categories'}
              className="bg-blue-500 text-white px-4 py-2 rounded hover:bg-blue-600 disabled:opacity-50"
            >
              Test GET /api/categories
            </button>
          </div>
          {results.menu && (
            <div className="mt-2 p-3 bg-green-50 border-2 border-green-500 rounded">
              <div className="font-bold text-green-800 mb-2">✅ Status: {results.menu.status}</div>
              <pre className="text-xs overflow-auto text-black bg-white p-2 rounded">
                {JSON.stringify(results.menu.data, null, 2)}
              </pre>
            </div>
          )}
          {results.categories && (
            <div className="mt-2 p-3 bg-green-50 border-2 border-green-500 rounded">
              <div className="font-bold text-green-800 mb-2">✅ Status: {results.categories.status}</div>
              <pre className="text-xs overflow-auto text-black bg-white p-2 rounded">
                {JSON.stringify(results.categories.data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="border rounded p-4">
          <h2 className="font-bold text-xl mb-2">Authentication</h2>
          <div className="space-x-2">
            <button
              onClick={() => testEndpoint('login', '/api/auth/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  tenant_id: 1,
                  email: 'admin@test.com',
                  password: 'password123'
                })
              })}
              disabled={loading === 'login'}
              className="bg-green-500 text-white px-4 py-2 rounded hover:bg-green-600 disabled:opacity-50"
            >
              Test POST /api/auth/login
            </button>
          </div>
          {results.login && (
            <div className={`mt-2 p-3 border-2 rounded ${
              results.login.status === 200 ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
            }`}>
              <div className={`font-bold mb-2 ${
                results.login.status === 200 ? 'text-green-800' : 'text-red-800'
              }`}>
                {results.login.status === 200 ? '✅' : '❌'} Status: {results.login.status}
              </div>
              <pre className="text-xs overflow-auto text-black bg-white p-2 rounded">
                {JSON.stringify(results.login.data || results.login.error, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="border rounded p-4">
          <h2 className="font-bold text-xl mb-2">Orders</h2>
          <div className="space-x-2">
            <button
              onClick={() => testEndpoint('createOrder', '/api/orders', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  tenant_id: 1,
                  location_id: 1,
                  table_id: 1,
                  items: [
                    { name: 'Test Pizza', qty: 2, price: 15.99 },
                    { name: 'Test Drink', qty: 1, price: 3.50 }
                  ],
                  chef_notes: 'Test order from Next.js'
                })
              })}
              disabled={loading === 'createOrder'}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              Test POST /api/orders
            </button>
            <button
              onClick={() => testEndpoint('kdsOrders', '/api/kds/orders?tenant_id=1&location_id=1')}
              disabled={loading === 'kdsOrders'}
              className="bg-purple-500 text-white px-4 py-2 rounded hover:bg-purple-600 disabled:opacity-50"
            >
              Test GET /api/kds/orders
            </button>
          </div>
          {results.createOrder && (
            <div className={`mt-2 p-3 border-2 rounded ${
              results.createOrder.status === 200 ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
            }`}>
              <div className={`font-bold mb-2 ${
                results.createOrder.status === 200 ? 'text-green-800' : 'text-red-800'
              }`}>
                {results.createOrder.status === 200 ? '✅' : '❌'} Status: {results.createOrder.status}
              </div>
              <pre className="text-xs overflow-auto text-black bg-white p-2 rounded">
                {JSON.stringify(results.createOrder.data || results.createOrder.error, null, 2)}
              </pre>
            </div>
          )}
          {results.kdsOrders && (
            <div className="mt-2 p-3 bg-green-50 border-2 border-green-500 rounded">
              <div className="font-bold text-green-800 mb-2">✅ Status: {results.kdsOrders.status}</div>
              <pre className="text-xs overflow-auto text-black bg-white p-2 rounded">
                {JSON.stringify(results.kdsOrders.data, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="border rounded p-4">
          <h2 className="font-bold text-xl mb-2">Backoffice</h2>
          <div className="space-x-2 mb-2">
            <button
              onClick={() => testEndpoint('backofficeItems', '/api/backoffice/items?tenant_id=1&location_id=1')}
              disabled={loading === 'backofficeItems'}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              Test GET /api/backoffice/items
            </button>
            <button
              onClick={() => testEndpoint('locations', '/api/tenants/1/locations')}
              disabled={loading === 'locations'}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              Test GET /api/tenants/1/locations
            </button>
          </div>
          <div className="space-x-2 mb-2">
            <button
              onClick={() => testEndpoint('createItem', '/api/items', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  tenant_id: 1,
                  category_id: 1,
                  name: 'Test Item from API',
                  description: 'Created via test page',
                  price: 9.99
                })
              })}
              disabled={loading === 'createItem'}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              Test POST /api/items (Create)
            </button>
            <button
              onClick={() => testEndpoint('updateItemActive', '/api/items/1/active', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  tenant_id: 1,
                  active: false
                })
              })}
              disabled={loading === 'updateItemActive'}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              Test PUT /api/items/1/active
            </button>
          </div>
          <div className="space-x-2">
            <button
              onClick={() => testEndpoint('updatePrice', '/api/items/1/price', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  tenant_id: 1,
                  location_id: 1,
                  price_override: 12.50
                })
              })}
              disabled={loading === 'updatePrice'}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              Test PUT /api/items/1/price
            </button>
            <button
              onClick={() => testEndpoint('updateAvailability', '/api/items/1/availability', {
                method: 'PUT',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  tenant_id: 1,
                  location_id: 1,
                  active: true
                })
              })}
              disabled={loading === 'updateAvailability'}
              className="bg-orange-500 text-white px-4 py-2 rounded hover:bg-orange-600 disabled:opacity-50"
            >
              Test PUT /api/items/1/availability
            </button>
          </div>
          {results.backofficeItems && (
            <div className="mt-2 p-3 bg-green-50 border-2 border-green-500 rounded">
              <div className="font-bold text-green-800 mb-2">✅ Status: {results.backofficeItems.status}</div>
              <pre className="text-xs overflow-auto text-black bg-white p-2 rounded">
                {JSON.stringify(results.backofficeItems.data, null, 2)}
              </pre>
            </div>
          )}
          {results.locations && (
            <div className="mt-2 p-3 bg-green-50 border-2 border-green-500 rounded">
              <div className="font-bold text-green-800 mb-2">✅ Locations - Status: {results.locations.status}</div>
              <pre className="text-xs overflow-auto text-black bg-white p-2 rounded">
                {JSON.stringify(results.locations.data, null, 2)}
              </pre>
            </div>
          )}
          {results.createItem && (
            <div className={`mt-2 p-3 border-2 rounded ${
              results.createItem.status === 200 ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
            }`}>
              <div className={`font-bold mb-2 ${
                results.createItem.status === 200 ? 'text-green-800' : 'text-red-800'
              }`}>
                {results.createItem.status === 200 ? '✅' : '❌'} Create Item - Status: {results.createItem.status}
              </div>
              <pre className="text-xs overflow-auto text-black bg-white p-2 rounded">
                {JSON.stringify(results.createItem.data || results.createItem.error, null, 2)}
              </pre>
            </div>
          )}
          {(results.updateItemActive || results.updatePrice || results.updateAvailability) && (
            <div className="mt-2 p-3 bg-blue-50 border-2 border-blue-500 rounded">
              <div className="font-bold text-blue-800 mb-2">📝 Item Updates:</div>
              {results.updateItemActive && (
                <div className="mb-2">
                  <div className="font-semibold">Active Toggle:</div>
                  <pre className="text-xs overflow-auto text-black bg-white p-2 rounded">
                    {JSON.stringify(results.updateItemActive.data || results.updateItemActive.error, null, 2)}
                  </pre>
                </div>
              )}
              {results.updatePrice && (
                <div className="mb-2">
                  <div className="font-semibold">Price Update:</div>
                  <pre className="text-xs overflow-auto text-black bg-white p-2 rounded">
                    {JSON.stringify(results.updatePrice.data || results.updatePrice.error, null, 2)}
                  </pre>
                </div>
              )}
              {results.updateAvailability && (
                <div className="mb-2">
                  <div className="font-semibold">Availability Update:</div>
                  <pre className="text-xs overflow-auto text-black bg-white p-2 rounded">
                    {JSON.stringify(results.updateAvailability.data || results.updateAvailability.error, null, 2)}
                  </pre>
                </div>
              )}
            </div>
          )}
        </div>

        <div className="border rounded p-4">
          <h2 className="font-bold text-xl mb-2">Tables Management</h2>
          <div className="space-x-2 mb-2">
            <button
              onClick={() => testEndpoint('getTables', '/api/tables?location_id=1')}
              disabled={loading === 'getTables'}
              className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 disabled:opacity-50"
            >
              Test GET /api/tables
            </button>
            <button
              onClick={() => testEndpoint('createTable', '/api/tables', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  location_id: 1,
                  number: 'T-' + Date.now()
                })
              })}
              disabled={loading === 'createTable'}
              className="bg-teal-500 text-white px-4 py-2 rounded hover:bg-teal-600 disabled:opacity-50"
            >
              Test POST /api/tables (Create)
            </button>
          </div>
          {results.getTables && (
            <div className="mt-2 p-3 bg-green-50 border-2 border-green-500 rounded">
              <div className="font-bold text-green-800 mb-2">✅ Status: {results.getTables.status}</div>
              <pre className="text-xs overflow-auto text-black bg-white p-2 rounded">
                {JSON.stringify(results.getTables.data, null, 2)}
              </pre>
            </div>
          )}
          {results.createTable && (
            <div className={`mt-2 p-3 border-2 rounded ${
              results.createTable.status === 200 ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
            }`}>
              <div className={`font-bold mb-2 ${
                results.createTable.status === 200 ? 'text-green-800' : 'text-red-800'
              }`}>
                {results.createTable.status === 200 ? '✅' : '❌'} Status: {results.createTable.status}
              </div>
              <pre className="text-xs overflow-auto text-black bg-white p-2 rounded">
                {JSON.stringify(results.createTable.data || results.createTable.error, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="border rounded p-4">
          <h2 className="font-bold text-xl mb-2">Waiter Calls</h2>
          <div className="space-x-2 mb-2">
            <button
              onClick={() => testEndpoint('getWaiterCalls', '/api/waiter/calls?tenant_id=1&location_id=1&status=PENDING')}
              disabled={loading === 'getWaiterCalls'}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 disabled:opacity-50"
            >
              Test GET /api/waiter/calls
            </button>
            <button
              onClick={() => testEndpoint('createWaiterCall', '/api/waiter/calls', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  tenant_id: 1,
                  location_id: 1,
                  table_id: 1,
                  message: 'Need service please'
                })
              })}
              disabled={loading === 'createWaiterCall'}
              className="bg-pink-500 text-white px-4 py-2 rounded hover:bg-pink-600 disabled:opacity-50"
            >
              Test POST /api/waiter/calls
            </button>
          </div>
          {results.getWaiterCalls && (
            <div className="mt-2 p-3 bg-green-50 border-2 border-green-500 rounded">
              <div className="font-bold text-green-800 mb-2">✅ Status: {results.getWaiterCalls.status}</div>
              <pre className="text-xs overflow-auto text-black bg-white p-2 rounded">
                {JSON.stringify(results.getWaiterCalls.data, null, 2)}
              </pre>
            </div>
          )}
          {results.createWaiterCall && (
            <div className={`mt-2 p-3 border-2 rounded ${
              results.createWaiterCall.status === 200 ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
            }`}>
              <div className={`font-bold mb-2 ${
                results.createWaiterCall.status === 200 ? 'text-green-800' : 'text-red-800'
              }`}>
                {results.createWaiterCall.status === 200 ? '✅' : '❌'} Status: {results.createWaiterCall.status}
              </div>
              <pre className="text-xs overflow-auto text-black bg-white p-2 rounded">
                {JSON.stringify(results.createWaiterCall.data || results.createWaiterCall.error, null, 2)}
              </pre>
            </div>
          )}
        </div>

        <div className="border rounded p-4">
          <h2 className="font-bold text-xl mb-2">Variants System</h2>
          <div className="space-x-2 mb-2">
            <button
              onClick={() => testEndpoint('getVariantGroups', '/api/variant-group-templates')}
              disabled={loading === 'getVariantGroups'}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
            >
              Test GET /api/variant-group-templates
            </button>
            <button
              onClick={() => testEndpoint('createVariantGroup', '/api/variant-group-templates', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({
                  name: 'Size Options',
                  position: 0,
                  required: true,
                  max_select: 1
                })
              })}
              disabled={loading === 'createVariantGroup'}
              className="bg-indigo-500 text-white px-4 py-2 rounded hover:bg-indigo-600 disabled:opacity-50"
            >
              Test POST /api/variant-group-templates
            </button>
          </div>
          {results.getVariantGroups && (
            <div className="mt-2 p-3 bg-green-50 border-2 border-green-500 rounded">
              <div className="font-bold text-green-800 mb-2">✅ Status: {results.getVariantGroups.status}</div>
              <pre className="text-xs overflow-auto text-black bg-white p-2 rounded">
                {JSON.stringify(results.getVariantGroups.data, null, 2)}
              </pre>
            </div>
          )}
          {results.createVariantGroup && (
            <div className={`mt-2 p-3 border-2 rounded ${
              results.createVariantGroup.status === 200 ? 'bg-green-50 border-green-500' : 'bg-red-50 border-red-500'
            }`}>
              <div className={`font-bold mb-2 ${
                results.createVariantGroup.status === 200 ? 'text-green-800' : 'text-red-800'
              }`}>
                {results.createVariantGroup.status === 200 ? '✅' : '❌'} Status: {results.createVariantGroup.status}
              </div>
              <pre className="text-xs overflow-auto text-black bg-white p-2 rounded">
                {JSON.stringify(results.createVariantGroup.data || results.createVariantGroup.error, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
