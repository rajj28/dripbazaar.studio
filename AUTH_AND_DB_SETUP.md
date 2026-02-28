# Authentication & Database Setup Guide

## ✅ SETUP COMPLETE - READY TO TEST

All authentication and database integration has been implemented. Steps 1-2 are confirmed complete by the user.

## Implementation Status

✅ SQL schema created and run in Supabase
✅ Environment variables added to .env
✅ AuthProvider wrapped in main.tsx
✅ PreBook page requires authentication
✅ Database integration in PreBook and PreBookPayment
✅ Error handling with validation
✅ Payment screenshot upload to Supabase Storage
✅ TypeScript errors fixed
✅ CSS styling for errors and progress bars added

## Quick Test Checklist

### 1. Test Authentication Flow
- [ ] Visit http://localhost:5174/auth
- [ ] Create a new account (sign up)
- [ ] Check email for verification (if enabled in Supabase)
- [ ] Sign in with credentials
- [ ] Verify redirect to home page

### 2. Test Pre-Booking Flow
- [ ] Click "PRE-BOOK NOW" on any drop (DROP 01, 02, or 03)
- [ ] If not logged in, should redirect to /auth
- [ ] After login, should redirect back to pre-book page
- [ ] Fill in all form fields (name should be pre-filled from profile)
- [ ] Select a size
- [ ] Click "CONFIRM PRE-BOOKING"
- [ ] Should navigate to payment page

### 3. Test Payment Flow
- [ ] Verify QR code displays
- [ ] Enter transaction ID (minimum 10 characters)
- [ ] Upload a payment screenshot (max 5MB, image only)
- [ ] Verify file name shows with checkmark
- [ ] Click "CONFIRM PAYMENT"
- [ ] Watch progress bar (30% → 60% → 80% → 100%)
- [ ] Should navigate to success page

### 4. Verify Database Records
- [ ] Go to Supabase Dashboard → Table Editor
- [ ] Check `profiles` table - should have your user
- [ ] Check `orders` table - should have your order with status "payment_submitted"
- [ ] Check `payments` table - should have payment record with status "pending"
- [ ] Go to Storage → payment-proofs bucket
- [ ] Verify screenshot uploaded in folder named with your user ID

### 5. Test Error Handling
- [ ] Try invalid phone number (should show error)
- [ ] Try invalid pincode (should show error)
- [ ] Try transaction ID less than 10 chars (should show error)
- [ ] Try uploading file larger than 5MB (should show error)
- [ ] Try uploading non-image file (should show error)

## 1. Database Schema

### Tables Created:
- `profiles` - User profile information
- `orders` - Pre-booking orders
- `payments` - Payment records with screenshot storage

### Run the Schema:
```bash
# In Supabase SQL Editor, run:
supabase-prebook-schema.sql
```

## 2. Environment Variables

Add to `.env`:
```env
VITE_SUPABASE_URL=your_supabase_project_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

## 3. Files Created

### Core Files:
- `src/lib/supabaseClient.ts` - Supabase client with TypeScript types
- `src/context/AuthContext.tsx` - Authentication context provider
- `src/pages/Auth.tsx` - Login/Signup page
- `src/pages/Auth.css` - Auth page styling

### Database Schema:
- `supabase-prebook-schema.sql` - Complete database setup

## 4. Next Steps

### A. Update main.tsx to add AuthProvider:
```typescript
import { AuthProvider } from './context/AuthContext'

<AuthProvider>
  <BrowserRouter>
    <Routes>
      <Route path="/" element={<App />} />
      <Route path="/auth" element={<Auth />} />
      <Route path="/prebook" element={<PreBook />} />
      <Route path="/prebook-payment" element={<PreBookPayment />} />
      <Route path="/payment-success" element={<PaymentSuccess />} />
    </Routes>
  </BrowserRouter>
</AuthProvider>
```

### B. Update PreBook.tsx to require auth:
```typescript
import { useAuth } from '../context/AuthContext';
import { useNavigate } from 'react-router-dom';

// In component:
const { user } = useAuth();
const navigate = useNavigate();

useEffect(() => {
  if (!user) {
    navigate('/auth', { state: { from: location } });
  }
}, [user]);
```

### C. Update PreBook.tsx to save to database:
```typescript
import { supabase } from '../lib/supabaseClient';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!user) return;

  try {
    // Create order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        user_id: user.id,
        drop_name: dropName,
        drop_id: parseInt(searchParams.get('drop') || '1'),
        full_name: formData.name,
        phone: formData.phone,
        address: formData.address,
        city: formData.city,
        state: formData.state,
        pincode: formData.pincode,
        size: formData.size,
        price: 1234.00,
        status: 'pending'
      })
      .select()
      .single();

    if (orderError) throw orderError;

    // Navigate to payment with order ID
    navigate('/prebook-payment', { 
      state: { 
        dropName, 
        formData,
        orderId: order.id
      } 
    });
  } catch (error) {
    console.error('Error creating order:', error);
    alert('Failed to create order. Please try again.');
  }
};
```

### D. Update PreBookPayment.tsx to save payment:
```typescript
import { supabase } from '../lib/supabaseClient';
import { useAuth } from '../context/AuthContext';

const handleSubmit = async (e: React.FormEvent) => {
  e.preventDefault();
  
  if (!user || !orderId) return;

  try {
    // Upload payment screenshot
    let screenshotUrl = null;
    if (paymentProof) {
      const fileExt = paymentProof.name.split('.').pop();
      const fileName = `${user.id}/${orderId}.${fileExt}`;
      
      const { error: uploadError } = await supabase.storage
        .from('payment-proofs')
        .upload(fileName, paymentProof);

      if (uploadError) throw uploadError;

      const { data: { publicUrl } } = supabase.storage
        .from('payment-proofs')
        .getPublicUrl(fileName);
      
      screenshotUrl = publicUrl;
    }

    // Create payment record
    const { error: paymentError } = await supabase
      .from('payments')
      .insert({
        order_id: orderId,
        user_id: user.id,
        transaction_id: transactionId,
        amount: 1234.00,
        payment_method: 'UPI',
        payment_screenshot_url: screenshotUrl,
        status: 'pending'
      });

    if (paymentError) throw paymentError;

    // Update order status
    await supabase
      .from('orders')
      .update({ status: 'payment_submitted' })
      .eq('id', orderId);

    navigate('/payment-success', { state: { dropName, formData } });
  } catch (error) {
    console.error('Error submitting payment:', error);
    alert('Failed to submit payment. Please try again.');
  }
};
```

### E. Add error handling:
```typescript
// Create a utility file: src/utils/errorHandler.ts
export const handleError = (error: any, context: string) => {
  console.error(`Error in ${context}:`, error);
  
  if (error.message?.includes('JWT')) {
    return 'Session expired. Please log in again.';
  }
  
  if (error.message?.includes('network')) {
    return 'Network error. Please check your connection.';
  }
  
  return error.message || 'An unexpected error occurred';
};

// Use in components:
try {
  // ... operation
} catch (error) {
  const errorMessage = handleError(error, 'PreBook submission');
  setError(errorMessage);
}
```

## 5. Features Implemented

✅ Email authentication with Supabase
✅ User profile management
✅ Order creation and tracking
✅ Payment record with screenshot upload
✅ Row Level Security (RLS) policies
✅ Protected routes
✅ Error handling utilities
✅ TypeScript types for all database tables

## 6. Admin Features (Future)

To view/verify payments, create an admin dashboard that:
1. Lists all pending payments
2. Shows payment screenshots
3. Allows verification/rejection
4. Updates order status

## 7. Testing

1. Sign up with a new email
2. Verify email (check Supabase auth settings)
3. Log in
4. Create a pre-booking
5. Submit payment with screenshot
6. Check Supabase dashboard to see records

## 8. Security Notes

- All tables have RLS enabled
- Users can only see their own data
- Payment screenshots are stored securely
- Passwords are hashed by Supabase Auth
- API keys should never be committed to git

## 9. Troubleshooting

**Issue: "supabaseUrl is required"**
- Solution: Add VITE_SUPABASE_URL and VITE_SUPABASE_ANON_KEY to .env

**Issue: "Row Level Security policy violation"**
- Solution: Ensure user is authenticated before database operations

**Issue: "Storage bucket not found"**
- Solution: Run the schema SQL to create the bucket

**Issue: Email not sending**
- Solution: Configure email templates in Supabase dashboard
