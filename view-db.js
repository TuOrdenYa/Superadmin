import http from 'http';

const options = {
  hostname: 'localhost',
  port: 3000,
  path: '/api/db-view',
  method: 'GET'
};

const req = http.request(options, (res) => {
  let data = '';

  res.on('data', (chunk) => {
    data += chunk;
  });

  res.on('end', () => {
    const json = JSON.parse(data);
    console.log('\n=== DATABASE STATE ===\n');
    console.log('Time:', json.time);
    console.log('\n--- TENANTS ---');
    json.tenants.forEach(t => {
      console.log(`ID: ${t.id} | Name: ${t.name} | Slug: ${t.slug} | Tier: ${t.product_tier || 'NULL'} | Status: ${t.subscription_status || 'NULL'}`);
    });
    console.log('\n--- USERS (first 5) ---');
    json.users.slice(0, 5).forEach(u => {
      console.log(`ID: ${u.id} | Name: ${u.full_name} | Email: ${u.email} | Tenant: ${u.tenant_id} | Role: ${u.role}`);
    });
    console.log(`\n(Total users: ${json.users.length})`);
    console.log(`(Total items: ${json.items.length})`);
  });
});

req.on('error', (error) => {
  console.error('Error:', error.message);
  console.log('Make sure the dev server is running (npm run dev)');
});

req.end();
