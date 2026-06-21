'use client';

import { useState, useEffect } from 'react';
import { use } from 'react';
import { useSearchParams } from 'next/navigation';

interface Category {
  id: string;
  name: string;
  position: number;
  is_custom?: boolean;
}

interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: string;
  category_id: string;
  image_url?: string;
  active: boolean;
}

interface CartItem extends MenuItem {
  quantity: number;
  notes?: string;
}

const formatPrice = (price: string | number) =>
  new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(Number(price));

export default function MenuPage({ params }: { params: Promise<{ slug: string; location: string }> }) {
  const { slug, location } = use(params);
  const searchParams = useSearchParams();
  const tableId = searchParams.get('table');

  const [tenantId, setTenantId] = useState<string | null>(null);
  const [locationId, setLocationId] = useState<string | null>(null);
  const [tenantName, setTenantName] = useState<string>('');
  const [locationName, setLocationName] = useState<string>('');
  const [tableNumber, setTableNumber] = useState<string>('');
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  // Fetch tenant and location by slugs
  useEffect(() => {
    const fetchData = async () => {
      try {
        // Get tenant by slug
        const tenantRes = await fetch(`/api/tenant-by-slug?slug=${slug}`);
        const tenantData = await tenantRes.json();
        if (!tenantData.ok) { setError('Restaurant not found'); setIsLoading(false); return; }
        setTenantId(tenantData.tenant.id);
        setTenantName(tenantData.tenant.name);

        // Get location by slug
        const locationRes = await fetch(`/api/tenants/${slug}/locations/by-slug?slug=${location}`);
        const locationData = await locationRes.json();
        if (!locationData.ok) { setError('Location not found'); setIsLoading(false); return; }
        setLocationId(locationData.location.id);
        setLocationName(locationData.location.name);

        // Get table info if tableId provided
        if (tableId) {
          const tableRes = await fetch(`/api/tables/${tableId}`);
          const tableData = await tableRes.json();
          if (tableData.ok) setTableNumber(tableData.table.name || tableData.table.number || tableId);
        }
      } catch (error) {
        console.error('Error fetching data:', error);
        setError('Failed to load restaurant');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug, location, tableId]);

  // Fetch menu data
  useEffect(() => {
    if (!tenantId || !locationId) return;
    const fetchMenu = async () => {
      try {
        const [categoriesRes, itemsRes] = await Promise.all([
          fetch(`/api/categories?tenant_id=${slug}`),
          fetch(`/api/menu?tenant_id=${tenantId}&location_id=${locationId}`)
        ]);
        const categoriesData = await categoriesRes.json();
        const itemsData = await itemsRes.json();
        if (categoriesData.ok) setCategories(categoriesData.categories);
        if (itemsData.ok) setItems(itemsData.items.filter((item: MenuItem) => item.active));
      } catch (error) {
        console.error('Error fetching menu:', error);
      }
    };
    fetchMenu();
  }, [tenantId, locationId, slug]);

  const addToCart = (item: MenuItem) => {
    setCart(prev => {
      const existing = prev.find(c => c.id === item.id);
      if (existing) return prev.map(c => c.id === item.id ? { ...c, quantity: c.quantity + 1 } : c);
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const removeFromCart = (itemId: string) => setCart(prev => prev.filter(i => i.id !== itemId));

  const updateQuantity = (itemId: string, qty: number) => {
    if (qty === 0) removeFromCart(itemId);
    else setCart(prev => prev.map(i => i.id === itemId ? { ...i, quantity: qty } : i));
  };

  const handlePlaceOrder = async () => {
    if (!tenantId || !locationId || cart.length === 0) return;
    setPlacingOrder(true);
    try {
      const res = await fetch('/api/orders', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          tenant_id: tenantId,
          location_id: locationId,
          table_id: tableId || null,
          items: cart.map(item => ({
            menu_item_id: item.id,
            quantity: item.quantity,
            price: item.price,
            notes: item.notes || null,
          })),
          total: cartTotal,
        }),
      });
      const data = await res.json();
      if (data.ok) {
        setCart([]);
        setShowCart(false);
        setOrderPlaced(true);
        setTimeout(() => setOrderPlaced(false), 5000);
      } else {
        alert(data.error || 'Error placing order');
      }
    } catch (error) {
      alert('Error placing order');
    } finally {
      setPlacingOrder(false);
    }
  };

  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const filteredItems = selectedCategory ? items.filter(i => i.category_id === selectedCategory) : items;

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-4">🍽️</div>
          <div className="text-gray-600 text-lg mb-2">Cargando menú...</div>
          <div className="text-sm text-gray-400">Por favor espera</div>
        </div>
      </div>
    );
  }

  if (error || !tenantId) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center">
        <div className="text-center">
          <div className="text-5xl mb-4">😕</div>
          <div className="text-red-600 text-xl font-bold mb-2">{error || 'Restaurante no encontrado'}</div>
          <div className="text-gray-600">Verifica la URL e intenta de nuevo</div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Order placed toast */}
      {orderPlaced && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-lg shadow-lg font-semibold text-center">
          ✅ ¡Pedido enviado! El mesero lo atenderá pronto.
        </div>
      )}

      {/* Header */}
      <div className="bg-gradient-to-r from-orange-500 to-orange-600 text-white sticky top-0 z-40 shadow-lg">
        <div className="max-w-4xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div>
              <h1 className="text-xl font-bold">{tenantName}</h1>
              <p className="text-sm text-orange-100">{locationName}</p>
              {tableNumber && <p className="text-xs text-orange-200">Mesa #{tableNumber}</p>}
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="relative bg-white text-orange-600 px-4 py-2 rounded-lg font-bold hover:bg-orange-50 transition"
            >
              🛒
              {cartItemCount > 0 && (
                <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-6 h-6 flex items-center justify-center font-bold">
                  {cartItemCount}
                </span>
              )}
            </button>
          </div>
        </div>
      </div>

      {/* Category Filter */}
      <div className="bg-white border-b sticky top-16 z-30 shadow-sm">
        <div className="max-w-4xl mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold text-sm transition ${selectedCategory === null ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className={`px-4 py-2 rounded-full whitespace-nowrap font-semibold text-sm transition ${selectedCategory === cat.id ? 'bg-orange-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'}`}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items */}
      <div className="max-w-4xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-xl shadow-sm overflow-hidden hover:shadow-md transition-shadow border border-gray-100">
              {item.image_url && (
                <img src={item.image_url} alt={item.name} className="w-full h-44 object-cover" />
              )}
              <div className="p-4">
                <h3 className="text-base font-bold text-black">{item.name}</h3>
                {item.description && <p className="text-sm text-gray-500 mt-1 line-clamp-2">{item.description}</p>}
                <div className="flex justify-between items-center mt-3">
                  <span className="text-lg font-bold text-orange-600">{formatPrice(item.price)}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="bg-orange-500 text-white px-4 py-2 rounded-lg hover:bg-orange-600 font-semibold text-sm transition"
                  >
                    + Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-16 text-gray-400">
            <div className="text-4xl mb-2">🍽️</div>
            <p>No hay items disponibles en esta categoría</p>
          </div>
        )}
      </div>

      {/* Floating cart button */}
      {cartItemCount > 0 && !showCart && (
        <div className="fixed bottom-6 left-0 right-0 flex justify-center z-40 px-4">
          <button
            onClick={() => setShowCart(true)}
            className="bg-orange-500 text-white px-8 py-4 rounded-full shadow-xl font-bold text-lg hover:bg-orange-600 transition flex items-center gap-3"
          >
            🛒 Ver pedido ({cartItemCount}) — {formatPrice(cartTotal)}
          </button>
        </div>
      )}

      {/* Cart Sidebar */}
      {showCart && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowCart(false)} />
          <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl z-50 flex flex-col">
            <div className="bg-orange-500 text-white p-4 flex justify-between items-center">
              <h2 className="text-xl font-bold">Tu Pedido</h2>
              <button onClick={() => setShowCart(false)} className="text-3xl leading-none hover:text-orange-200">×</button>
            </div>

            {tableNumber && (
              <div className="bg-orange-50 px-4 py-2 text-sm text-orange-700 font-semibold border-b border-orange-100">
                Mesa #{tableNumber}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-400 mt-12">
                  <div className="text-4xl mb-2">🛒</div>
                  <p>Tu carrito está vacío</p>
                </div>
              ) : (
                <div className="space-y-3">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-xl p-3">
                      <div className="flex justify-between items-start mb-2">
                        <h3 className="font-bold text-black text-sm flex-1">{item.name}</h3>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-400 hover:text-red-600 ml-2 text-lg leading-none">×</button>
                      </div>
                      <div className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="bg-gray-200 text-black w-8 h-8 rounded-full font-bold hover:bg-gray-300 flex items-center justify-center">−</button>
                          <span className="font-bold text-black w-6 text-center">{item.quantity}</span>
                          <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="bg-orange-500 text-white w-8 h-8 rounded-full font-bold hover:bg-orange-600 flex items-center justify-center">+</button>
                        </div>
                        <span className="font-bold text-black">{formatPrice(parseFloat(item.price) * item.quantity)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-4 space-y-3 bg-white">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-black">Total:</span>
                  <span className="text-orange-600">{formatPrice(cartTotal)}</span>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="w-full bg-orange-500 text-white py-4 rounded-xl font-bold text-lg hover:bg-orange-600 transition disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  {placingOrder ? '⏳ Enviando pedido...' : '✅ Hacer Pedido'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
