# Drip Riwaaz E-Commerce Setup Guide

## Overview
Complete e-commerce implementation with:
- Product catalog (Regular & Premium)
- Shopping cart with persistent storage
- Multi-step checkout flow
- Address management
- Razorpay payment integration (UPI, Cards, Net Banking, Wallets)
- Order management
- Responsive design matching brand theme

## Features Implemented

### 1. Product Pages
- **Premium Products Page** (`/premium`) - Exclusive collection showcase
- **Product Detail Page** (`/product/:id`) - Full product information with size/color selection
- **Clickable Product Cards** - Navigate to detail pages from any product card

### 2. Shopping Cart
- **Cart Page** (`/cart`) - View and manage cart items
- **Persistent Storage** - Cart saved in localStorage
- **Quantity Management** - Increase/decrease quantities
- **Real-time Totals** - Automatic price calculations
- **Cart Badge** - Shows item count in navigation

### 3. Checkout Flow
- **Address Form** (`/checkout`) - Collect delivery details with validation
- **Order Summary** - Review items and pricing
- **Free Shipping** - On orders above ₹2000

### 4. Payment Integration
- **Razorpay Gateway** (`/payment`) - Secure payment processing
- **Multiple Payment Methods**:
  - Credit/Debit Cards
  - UPI (GPay, PhonePe, Paytm)
  - Net Banking
  - Wallets
- **Order Success Page** - Confirmation with order ID

### 5. Database Integration
- **Supabase Backend** - Products, orders, and addresses storage
- **Real-time Data** - Fetch products from database
- **Order Tracking** - Store order history

## Setup Instructions

### 1. Install Dependencies
```bash
cd db
npm install
```

### 2. Configure Supabase

#### Create Supabase Project
1. Go to [supabase.com](https://supabase.com)
2. Create a new project
3. Copy your project URL and anon key

#### Run Database Schema
1. Open Supabase SQL Editor
2. Copy contents from `supabase-schema.sql`
3. Execute the SQL to create tables and sample data

### 3. Configure Razorpay

#### Create Razorpay Account
1. Go to [razorpay.com](https://razorpay.com)
2. Sign up and verify your account
3. Go to Settings → API Keys
4. Generate Test/Live keys

### 4. Environment Variables

Create `.env` file in the `db` directory:
```bash
cp .env.example .env
```

Edit `.env` with your credentials:
```env
VITE_SUPABASE_URL=https://your-project.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here
VITE_RAZORPAY_KEY_ID=rzp_test_your-key-here
```

### 5. Run Development Server
```bash
npm run dev
```

## File Structure

```
db/src/
├── components/
│   ├── NavOverlay.tsx          # Updated with cart icon
│   ├── FeaturedProducts.tsx    # Clickable product cards
│   └── PaperCrumpleScroll.tsx  # Links to premium page
├── pages/
│   ├── HomePage.tsx            # Main landing page
│   ├── PremiumProducts.tsx     # Premium collection
│   ├── ProductDetail.tsx       # Product details
│   ├── Cart.tsx                # Shopping cart
│   ├── Checkout.tsx            # Address & checkout
│   ├── Payment.tsx             # Razorpay integration
│   └── OrderSuccess.tsx        # Order confirmation
├── context/
│   └── CartContext.tsx         # Cart state management
├── lib/
│   └── supabase.ts            # Supabase client
├── types/
│   └── index.ts               # TypeScript types
├── AppRouter.tsx              # Route configuration
└── App.tsx                    # Main app component
```

## Navigation Flow

```
Home (/)
  ├─→ Premium Products (/premium)
  │     └─→ Product Detail (/product/:id)
  │           └─→ Cart (/cart)
  │                 └─→ Checkout (/checkout)
  │                       └─→ Payment (/payment)
  │                             └─→ Order Success (/order-success)
  └─→ Cart (/cart) [via nav icon]
```

## Key Features

### Responsive Design
- Mobile-first approach
- Breakpoints: 480px, 768px, 1024px
- Touch-friendly buttons and interactions
- Optimized layouts for all screen sizes

### Cart Management
- Add to cart from product cards (Quick Add)
- Add to cart from product detail page
- Update quantities
- Remove items
- Persistent across sessions

### Payment Flow
1. User adds items to cart
2. Proceeds to checkout
3. Fills delivery address
4. Reviews order summary
5. Selects payment method
6. Completes payment via Razorpay
7. Receives order confirmation

### Database Schema

#### Products Table
- id, name, category, price
- image, images (array)
- tag, description
- sizes, colors (arrays)
- material, care_instructions
- is_premium (boolean)
- stock, created_at

#### Orders Table
- id, user_id
- items (JSONB)
- total_amount, address (JSONB)
- payment_status
- razorpay_order_id, razorpay_payment_id
- created_at

## Testing

### Test Payment Flow
1. Use Razorpay test mode keys
2. Test card: 4111 1111 1111 1111
3. Any future expiry date
4. Any CVV

### Test UPI
- Use test UPI ID: success@razorpay
- For failure: failure@razorpay

## Production Checklist

- [ ] Replace test Razorpay keys with live keys
- [ ] Configure Supabase RLS policies for user authentication
- [ ] Add user authentication (Supabase Auth)
- [ ] Set up email notifications
- [ ] Configure shipping rates
- [ ] Add inventory management
- [ ] Set up order tracking
- [ ] Add product reviews
- [ ] Implement search functionality
- [ ] Add filters and sorting
- [ ] Set up analytics
- [ ] Configure CDN for images
- [ ] Add error boundaries
- [ ] Set up monitoring and logging

## Customization

### Adding New Products
1. Add product images to `/public/images/`
2. Insert product data in Supabase:
```sql
INSERT INTO products (name, category, price, image, is_premium, ...)
VALUES ('Product Name', 'Category', 1999, '/images/product.jpg', false, ...);
```

### Styling
- Theme colors in `src/index.css`
- Component styles in respective `.css` files
- Consistent with existing orange gradient theme

## Support

For issues or questions:
1. Check Supabase logs for database errors
2. Check browser console for frontend errors
3. Verify environment variables are set correctly
4. Ensure Razorpay keys are valid

## Next Steps

1. Add user authentication
2. Implement wishlist functionality
3. Add product search and filters
4. Create admin dashboard
5. Add order tracking
6. Implement email notifications
7. Add product reviews and ratings
8. Create size guide
9. Add return/exchange policy
10. Implement discount codes
