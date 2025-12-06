-- Fix password hashes for all test users
-- New hash is for password: password123

UPDATE users 
SET password_hash = '$2b$10$L0U0ZZqhYna/QmW7A4qdgeb6FKf/zRWKd1fRmG8IsNskuTe9FVl8C'
WHERE email IN (
    'admin@pizzaparadise.com',
    'manager.downtown@pizzaparadise.com',
    'manager.westside@pizzaparadise.com',
    'waiter1@pizzaparadise.com',
    'waiter2@pizzaparadise.com',
    'admin@burgerblast.com',
    'manager.main@burgerblast.com',
    'manager.mall@burgerblast.com',
    'waiter.main@burgerblast.com',
    'waiter.mall@burgerblast.com'
);

-- Verify the update
SELECT email, full_name, role, 
       CASE WHEN password_hash = '$2b$10$L0U0ZZqhYna/QmW7A4qdgeb6FKf/zRWKd1fRmG8IsNskuTe9FVl8C' 
            THEN 'Updated ✓' 
            ELSE 'Old hash' 
       END as hash_status
FROM users 
WHERE tenant_id IN (1, 2)
ORDER BY tenant_id, role, email;
