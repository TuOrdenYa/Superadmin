// Test script for API endpoints
const BASE_URL = 'http://localhost:3000/api';

async function test() {
  console.log('🧪 Testing API Endpoints\n');

  // Test 1: Get Menu
  console.log('1️⃣ Testing GET /api/menu...');
  try {
    const res = await fetch(`${BASE_URL}/menu?tenant_id=1`);
    const data = await res.json();
    console.log('✅ Menu:', data.ok ? `${data.menu?.length || 0} items` : 'ERROR');
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log('❌ Error:', e.message);
  }

  console.log('\n2️⃣ Testing GET /api/categories...');
  try {
    const res = await fetch(`${BASE_URL}/categories?tenant_id=1`);
    const data = await res.json();
    console.log('✅ Categories:', data.ok ? `${data.categories?.length || 0} categories` : 'ERROR');
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log('❌ Error:', e.message);
  }

  console.log('\n3️⃣ Testing POST /api/auth/login...');
  try {
    const res = await fetch(`${BASE_URL}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        tenant_id: 1,
        email: 'admin@test.com',
        password: 'password123'
      })
    });
    const data = await res.json();
    console.log('✅ Login:', data.ok ? 'Success' : data.error);
    console.log(JSON.stringify(data, null, 2));
    
    if (data.ok && data.token) {
      const token = data.token;
      
      console.log('\n4️⃣ Testing GET /api/auth/me...');
      const meRes = await fetch(`${BASE_URL}/auth/me`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      const meData = await meRes.json();
      console.log('✅ Auth Me:', meData.ok ? meData.user?.email : meData.error);
      console.log(JSON.stringify(meData, null, 2));
    }
  } catch (e) {
    console.log('❌ Error:', e.message);
  }

  console.log('\n5️⃣ Testing POST /api/orders...');
  try {
    const res = await fetch(`${BASE_URL}/orders`, {
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
        to_go: false,
        chef_notes: 'Test order'
      })
    });
    const data = await res.json();
    console.log('✅ Create Order:', data.ok ? `Order #${data.order_id}, Total: $${data.total}` : data.error);
    console.log(JSON.stringify(data, null, 2));

    if (data.ok && data.order_id) {
      const orderId = data.order_id;
      
      console.log(`\n6️⃣ Testing GET /api/orders/${orderId}...`);
      const orderRes = await fetch(`${BASE_URL}/orders/${orderId}`);
      const orderData = await orderRes.json();
      console.log('✅ Get Order:', orderData.ok ? `${orderData.items?.length || 0} items` : 'ERROR');
      console.log(JSON.stringify(orderData, null, 2));

      console.log(`\n7️⃣ Testing PATCH /api/orders/${orderId}/status...`);
      const statusRes = await fetch(`${BASE_URL}/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status: 'READY' })
      });
      const statusData = await statusRes.json();
      console.log('✅ Update Status:', statusData.ok ? statusData.order?.status : statusData.error);
      console.log(JSON.stringify(statusData, null, 2));
    }
  } catch (e) {
    console.log('❌ Error:', e.message);
  }

  console.log('\n8️⃣ Testing GET /api/kds/orders...');
  try {
    const res = await fetch(`${BASE_URL}/kds/orders?tenant_id=1&location_id=1`);
    const data = await res.json();
    console.log('✅ KDS Orders:', data.ok ? `${data.orders?.length || 0} orders` : 'ERROR');
    console.log(JSON.stringify(data, null, 2));
  } catch (e) {
    console.log('❌ Error:', e.message);
  }

  console.log('\n✨ Test Complete!');
}

test();
