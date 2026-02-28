-- Update Test Orders Status
-- This script updates your test orders from 'pending' to 'payment_verified'
-- so you can test the admin dashboard confirmation flow

-- Update the two test orders
UPDATE orders 
SET status = 'payment_verified'
WHERE id IN (
  SELECT id FROM orders 
  WHERE status = 'pending' 
  ORDER BY created_at DESC 
  LIMIT 2
);

-- Verify the update
SELECT 
  id,
  status,
  total_amount,
  created_at
FROM orders
ORDER BY created_at DESC
LIMIT 5;
