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
}

interface TenantProfile {
  name: string;
  logo_url: string;
  primary_color: string;
  secondary_color: string;
  description: string;
  instagram: string;
  whatsapp: string;
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
  const [profile, setProfile] = useState<TenantProfile>({
    name: '', logo_url: '', primary_color: '#f97316',
    secondary_color: '#ea580c', description: '', instagram: '', whatsapp: '',
  });
  const [categories, setCategories] = useState<Category[]>([]);
  const [items, setItems] = useState<MenuItem[]>([]);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [cart, setCart] = useState<CartItem[]>([]);
  const [showCart, setShowCart] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [orderPlaced, setOrderPlaced] = useState(false);
  const [placingOrder, setPlacingOrder] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const tenantRes = await fetch(`/api/tenant-by-slug?slug=${slug}`);
        const tenantData = await tenantRes.json();
        if (!tenantData.ok) { setError('Restaurant not found'); setIsLoading(false); return; }
        setTenantId(tenantData.tenant.id);
        setTenantName(tenantData.tenant.name);

        const profileRes = await fetch(`/api/tenants/${slug}/profile`);
        const profileData = await profileRes.json();
        if (profileData.ok) setProfile({
          name: profileData.profile.name || tenantData.tenant.name,
          logo_url: profileData.profile.logo_url || '',
          primary_color: profileData.profile.primary_color || '#f97316',
          secondary_color: profileData.profile.secondary_color || '#ea580c',
          description: profileData.profile.description || '',
          instagram: profileData.profile.instagram || '',
          whatsapp: profileData.profile.whatsapp || '',
        });

        const locationRes = await fetch(`/api/tenants/${slug}/locations/by-slug?slug=${location}`);
        const locationData = await locationRes.json();
        if (!locationData.ok) { setError('Location not found'); setIsLoading(false); return; }
        setLocationId(locationData.location.id);
        setLocationName(locationData.location.name);

        if (tableId) {
          const tableRes = await fetch(`/api/tables/${tableId}`);
          const tableData = await tableRes.json();
          if (tableData.ok) setTableNumber(tableData.table.name || tableData.table.number || tableId);
        }
      } catch (error) {
        setError('Failed to load restaurant');
      } finally {
        setIsLoading(false);
      }
    };
    fetchData();
  }, [slug, location, tableId]);

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
      } catch (error) { console.error('Error fetching menu:', error); }
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
          tenant_id: tenantId, location_id: locationId, table_id: tableId || null,
          items: cart.map(item => ({ menu_item_id: item.id, quantity: item.quantity, price: item.price, notes: null })),
          total: cartTotal,
        }),
      });
      const data = await res.json();
      if (data.ok) { setCart([]); setShowCart(false); setOrderPlaced(true); setTimeout(() => setOrderPlaced(false), 5000); }
      else alert(data.error || 'Error placing order');
    } catch { alert('Error placing order'); }
    finally { setPlacingOrder(false); }
  };

  const cartTotal = cart.reduce((sum, item) => sum + parseFloat(item.price) * item.quantity, 0);
  const cartItemCount = cart.reduce((sum, item) => sum + item.quantity, 0);
  const filteredItems = selectedCategory ? items.filter(i => i.category_id === selectedCategory) : items;
  const primaryColor = profile.primary_color || '#f97316';
  const secondaryColor = profile.secondary_color || '#ea580c';

  if (isLoading) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-4xl mb-4">🍽️</div>
        <div className="text-gray-600 text-lg mb-2">Cargando menú...</div>
        <div className="text-sm text-gray-400">Por favor espera</div>
      </div>
    </div>
  );

  if (error || !tenantId) return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center">
      <div className="text-center">
        <div className="text-5xl mb-4">😕</div>
        <div className="text-red-600 text-xl font-bold mb-2">{error || 'Restaurante no encontrado'}</div>
        <div className="text-gray-600">Verifica la URL e intenta de nuevo</div>
      </div>
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Order placed toast */}
      {orderPlaced && (
        <div className="fixed top-4 left-1/2 transform -translate-x-1/2 z-50 text-white px-6 py-3 rounded-lg shadow-lg font-semibold text-center" style={{ backgroundColor: primaryColor }}>
          ✅ ¡Pedido enviado! El mesero lo atenderá pronto.
        </div>
      )}

      {/* Header */}
      <div className="text-white sticky top-0 z-40 shadow-lg" style={{ background: `linear-gradient(to right, ${primaryColor}, ${secondaryColor})` }}>
        <div className="max-w-7xl mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <div className="flex items-center gap-3">
              {profile.logo_url && <img src={profile.logo_url} alt="Logo" className="h-10 w-auto rounded-lg bg-white p-1" />}
              <div>
                <h1 className="text-xl font-bold leading-tight">
                  {profile.name || tenantName}
                  <span className="font-normal opacity-80"> · {locationName}</span>
                  {tableNumber && <span className="font-normal opacity-60"> · Mesa #{tableNumber}</span>}
                </h1>
              </div>
            </div>
            <button
              onClick={() => setShowCart(true)}
              className="relative bg-white px-4 py-2 rounded-lg font-bold hover:bg-gray-100 transition"
              style={{ color: primaryColor }}
            >
              🛒 {cartItemCount > 0 ? `(${cartItemCount})` : ''}
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
        <div className="max-w-7xl mx-auto px-4 py-3 overflow-x-auto">
          <div className="flex space-x-2">
            <button
              onClick={() => setSelectedCategory(null)}
              className="px-4 py-2 rounded-lg whitespace-nowrap font-semibold text-sm transition"
              style={selectedCategory === null ? { backgroundColor: primaryColor, color: 'white' } : { backgroundColor: '#e5e7eb', color: '#374151' }}
            >
              Todos
            </button>
            {categories.map((cat) => (
              <button
                key={cat.id}
                onClick={() => setSelectedCategory(cat.id)}
                className="px-4 py-2 rounded-lg whitespace-nowrap font-semibold text-sm transition"
                style={selectedCategory === cat.id ? { backgroundColor: primaryColor, color: 'white' } : { backgroundColor: '#e5e7eb', color: '#374151' }}
              >
                {cat.name}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* Menu Items Grid */}
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredItems.map((item) => (
            <div key={item.id} className="bg-white rounded-lg shadow-md overflow-hidden hover:shadow-xl transition-shadow">
              {item.image_url && (
                <img src={item.image_url} alt={item.name} className="w-full h-48 object-cover" />
              )}
              <div className="p-4">
                <h3 className="text-lg font-bold text-black">{item.name}</h3>
                {item.description && <p className="text-sm text-gray-600 mt-1">{item.description}</p>}
                <div className="flex justify-between items-center mt-4">
                  <span className="text-xl font-bold" style={{ color: primaryColor }}>{formatPrice(item.price)}</span>
                  <button
                    onClick={() => addToCart(item)}
                    className="text-white px-4 py-2 rounded-lg font-semibold hover:opacity-90 transition"
                    style={{ backgroundColor: primaryColor }}
                  >
                    + Agregar
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>

        {filteredItems.length === 0 && (
          <div className="text-center py-12 text-gray-500">
            No hay items disponibles en esta categoría
          </div>
        )}

        {/* Footer */}
        <div className="mt-12 pt-6 border-t border-gray-200 text-center">
          {(profile.instagram || profile.whatsapp) && (
            <div className="flex justify-center gap-6 mb-4">
              {profile.instagram && (
                <a href={`https://instagram.com/${profile.instagram}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-pink-600 transition">
                  📸 @{profile.instagram}
                </a>
              )}
              {profile.whatsapp && (
                <a href={`https://wa.me/${profile.whatsapp.replace(/\D/g, '')}`} target="_blank" rel="noopener noreferrer" className="flex items-center gap-1 text-sm font-semibold text-gray-600 hover:text-green-600 transition">
                  💬 {profile.whatsapp}
                </a>
              )}
            </div>
          )}
          <p className="text-gray-400 text-xs">
            © {new Date().getFullYear()} {profile.name || tenantName} · Elaborado por{' '}
            <a href="https://tuordenya.com" target="_blank" rel="noopener noreferrer" className="hover:text-gray-600 underline">TuOrdenYa</a>
            {' '}· Todos los derechos reservados
          </p>
        </div>
      </div>

      {/* Cart Sidebar */}
      {showCart && (
        <>
          <div className="fixed inset-0 bg-black bg-opacity-50 z-40" onClick={() => setShowCart(false)} />
          <div className="fixed right-0 top-0 h-full w-full md:w-96 bg-white shadow-xl z-50 flex flex-col">
            <div className="text-white p-4 flex justify-between items-center" style={{ backgroundColor: primaryColor }}>
              <h2 className="text-xl font-bold">Tu Pedido</h2>
              <button onClick={() => setShowCart(false)} className="text-2xl hover:opacity-70">×</button>
            </div>

            {tableNumber && (
              <div className="px-4 py-2 text-sm font-semibold border-b" style={{ backgroundColor: `${primaryColor}20`, color: primaryColor }}>
                Mesa #{tableNumber}
              </div>
            )}

            <div className="flex-1 overflow-y-auto p-4">
              {cart.length === 0 ? (
                <div className="text-center text-gray-500 mt-8">Tu carrito está vacío</div>
              ) : (
                <div className="space-y-4">
                  {cart.map((item) => (
                    <div key={item.id} className="bg-gray-50 rounded-lg p-3">
                      <div className="flex justify-between items-start">
                        <div className="flex-1">
                          <h3 className="font-bold text-black">{item.name}</h3>
                          <p className="text-sm text-gray-600">{formatPrice(item.price)} c/u</p>
                        </div>
                        <button onClick={() => removeFromCart(item.id)} className="text-red-600 hover:text-red-800 text-xl">×</button>
                      </div>
                      <div className="flex items-center mt-2 space-x-2">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="bg-gray-300 text-black px-3 py-1 rounded hover:bg-gray-400 font-bold">−</button>
                        <span className="font-bold text-black">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="text-white px-3 py-1 rounded font-bold hover:opacity-90" style={{ backgroundColor: primaryColor }}>+</button>
                        <span className="ml-auto font-bold text-black">{formatPrice(parseFloat(item.price) * item.quantity)}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {cart.length > 0 && (
              <div className="border-t p-4 space-y-3">
                <div className="flex justify-between text-lg font-bold">
                  <span className="text-black">Total:</span>
                  <span style={{ color: primaryColor }}>{formatPrice(cartTotal)}</span>
                </div>
                <button
                  onClick={handlePlaceOrder}
                  disabled={placingOrder}
                  className="w-full text-white py-3 rounded-lg font-bold hover:opacity-90 transition disabled:opacity-50"
                  style={{ backgroundColor: primaryColor }}
                >
                  {placingOrder ? '⏳ Enviando...' : '✅ Hacer Pedido'}
                </button>
              </div>
            )}
          </div>
        </>
      )}
    </div>
  );
}
