// Test script to verify tier enforcement
// Run this after starting the dev server: node test-tiers.mjs

const BASE_URL = 'http://localhost:3000';

async function testTierAccess(tenantId, tenantName, tier) {
  console.log(`\n=== Testing ${tenantName} (Tenant ${tenantId} - ${tier} tier) ===\n`);
  
  const tests = [
    {
      name: 'Tables (Pro only)',
      url: `${BASE_URL}/api/tables?tenant_id=${tenantId}&location_id=1`,
      expectedSuccess: tier === 'pro'
    },
    {
      name: 'Variant Groups (Pro only)',
      url: `${BASE_URL}/api/variant-group-templates?tenant_id=${tenantId}`,
      expectedSuccess: tier === 'pro'
    },
    {
      name: 'Orders (Plus/Pro)',
      method: 'POST',
      url: `${BASE_URL}/api/orders`,
      body: {
        tenant_id: tenantId,
        location_id: 1,
        items: [],
        to_go: true
      },
      expectedSuccess: tier === 'plus' || tier === 'pro'
    },
    {
      name: 'Menu (All tiers)',
      url: `${BASE_URL}/api/menu?tenant_id=${tenantId}`,
      expectedSuccess: true
    }
  ];

  for (const test of tests) {
    try {
      const options = {
        method: test.method || 'GET',
        headers: { 'Content-Type': 'application/json' }
      };
      
      if (test.body) {
        options.body = JSON.stringify(test.body);
      }
      
      const response = await fetch(test.url, options);
      const data = await response.json();
      
      const success = response.status === 200;
      const expected = test.expectedSuccess;
      const passed = success === expected;
      
      console.log(`${passed ? '✓' : '✗'} ${test.name}`);
      console.log(`  Status: ${response.status} (Expected: ${expected ? '200' : '403'})`);
      
      if (!passed) {
        console.log(`  Response:`, data);
      }
      
      if (data.upgrade_required) {
        console.log(`  ℹ  Upgrade message: ${data.error}`);
      }
    } catch (error) {
      console.log(`✗ ${test.name} - Error: ${error.message}`);
    }
  }
}

async function runTests() {
  console.log('🧪 Testing Product Tier Enforcement\n');
  console.log('Make sure you have run the 002_set_tenant_tiers.sql migration first!\n');
  
  // Test each tier
  await testTierAccess(1, 'Pizza Paradise', 'pro');
  await testTierAccess(2, 'Burger Place', 'plus');
  
  // Find the Popo tenant (might have different ID)
  try {
    const response = await fetch(`${BASE_URL}/api/db-view`);
    const data = await response.json();
    const popoTenant = data.tenants.find(t => t.name.toLowerCase().includes('popo'));
    
    if (popoTenant) {
      await testTierAccess(popoTenant.id, popoTenant.name, 'light');
    } else {
      console.log('\n⚠  Popo tenant not found in database');
    }
  } catch (error) {
    console.log('\n⚠  Could not fetch tenants:', error.message);
  }
  
  console.log('\n✅ Tier enforcement tests complete!\n');
}

runTests();
