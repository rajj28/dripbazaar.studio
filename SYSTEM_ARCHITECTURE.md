# 🏗️ DRIP BAZAAR - System Architecture

## Complete system overview and data flow

---

## 🎯 High-Level Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                         FRONTEND                             │
│                    (React + TypeScript)                      │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Home   │  │   Auth   │  │ Pre-Book │  │  Admin   │   │
│  │   Page   │  │   Page   │  │   Flow   │  │Dashboard │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  Hosted on: Vercel (https://dripbazaar.studio)             │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                         BACKEND                              │
│                    (Supabase Services)                       │
│                                                              │
│  ┌──────────┐  ┌──────────┐  ┌──────────┐  ┌──────────┐   │
│  │   Auth   │  │ Database │  │ Storage  │  │   Edge   │   │
│  │ Service  │  │PostgreSQL│  │  Bucket  │  │Functions │   │
│  └──────────┘  └──────────┘  └──────────┘  └──────────┘   │
│                                                              │
│  Project: fdobfognqagtloyxmosg.supabase.co                 │
└─────────────────────────────────────────────────────────────┘
                            ↕
┌─────────────────────────────────────────────────────────────┐
│                    EXTERNAL SERVICES                         │
│                                                              │
│  ┌──────────────────────────────────────────────────────┐   │
│  │              Resend (Email Service)                  │   │
│  │         API: https://api.resend.com                  │   │
│  └──────────────────────────────────────────────────────┘   │
└─────────────────────────────────────────────────────────────┘
```

---

## 🔄 User Flow - Pre-Booking Journey

```
START
  │
  ├─→ [1] User visits dripbazaar.studio
  │       │
  │       ├─→ Views hero section
  │       ├─→ Browses 3D carousel
  │       └─→ Sees collection showcase
  │
  ├─→ [2] User clicks "PRE-BOOK NOW"
  │       │
  │       └─→ Redirected to /auth (if not logged in)
  │
  ├─→ [3] User signs up / logs in
  │       │
  │       ├─→ Supabase Auth validates credentials
  │       ├─→ Profile created in database
  │       └─→ Session token generated
  │
  ├─→ [4] User fills pre-booking form
  │       │
  │       ├─→ Name, phone, address, size
  │       ├─→ Form validation (client-side)
  │       └─→ Clicks "CONFIRM PRE-BOOKING"
  │
  ├─→ [5] Order created in database
  │       │
  │       ├─→ Order saved to 'orders' table
  │       ├─→ Status: "pending"
  │       ├─→ Order ID generated
  │       └─→ Email function triggered
  │
  ├─→ [6] Order confirmation email sent
  │       │
  │       ├─→ Edge Function calls Resend API
  │       ├─→ Email sent to customer
  │       └─→ User redirected to payment page
  │
  ├─→ [7] User uploads payment proof
  │       │
  │       ├─→ QR code displayed
  │       ├─→ User uploads screenshot
  │       ├─→ Screenshot saved to Supabase Storage
  │       ├─→ Transaction ID entered
  │       └─→ Clicks "SUBMIT PAYMENT"
  │
  ├─→ [8] Payment record created
  │       │
  │       ├─→ Payment saved to 'payments' table
  │       ├─→ Order status → "payment_submitted"
  │       ├─→ Email function triggered
  │       └─→ Payment received email sent
  │
  ├─→ [9] Admin verifies payment
  │       │
  │       ├─→ Admin views order in dashboard
  │       ├─→ Admin checks screenshot
  │       ├─→ Admin clicks "Verify Payment"
  │       └─→ Payment status → "verified"
  │
  ├─→ [10] Order confirmed
  │       │
  │       ├─→ Order status → "confirmed"
  │       ├─→ Email function triggered
  │       ├─→ Order confirmed email sent
  │       └─→ Ready for shipping
  │
END
```

---

## 🗄️ Database Schema

```
┌─────────────────────────────────────────────────────────────┐
│                         PROFILES                             │
├─────────────────────────────────────────────────────────────┤
│  id              UUID (Primary Key)                         │
│  email           TEXT                                        │
│  created_at      TIMESTAMP                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ (one-to-many)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                          ORDERS                              │
├─────────────────────────────────────────────────────────────┤
│  id              UUID (Primary Key)                         │
│  user_id         UUID (Foreign Key → profiles.id)           │
│  product_name    TEXT                                        │
│  size            TEXT                                        │
│  amount          NUMERIC                                     │
│  full_name       TEXT                                        │
│  phone           TEXT                                        │
│  address         TEXT                                        │
│  city            TEXT                                        │
│  state           TEXT                                        │
│  pincode         TEXT                                        │
│  status          TEXT (pending, payment_submitted,          │
│                       confirmed, shipped, delivered,         │
│                       cancelled)                             │
│  created_at      TIMESTAMP                                   │
└─────────────────────────────────────────────────────────────┘
                            │
                            │ (one-to-one)
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                         PAYMENTS                             │
├─────────────────────────────────────────────────────────────┤
│  id              UUID (Primary Key)                         │
│  order_id        UUID (Foreign Key → orders.id)             │
│  user_id         UUID (Foreign Key → profiles.id)           │
│  transaction_id  TEXT                                        │
│  screenshot_url  TEXT                                        │
│  amount          NUMERIC                                     │
│  status          TEXT (pending, verified, rejected)         │
│  rejection_reason TEXT                                       │
│  verified_at     TIMESTAMP                                   │
│  created_at      TIMESTAMP                                   │
└─────────────────────────────────────────────────────────────┘
```

---

## 📧 Email Flow Architecture

```
┌─────────────────────────────────────────────────────────────┐
│                      TRIGGER EVENTS                          │
└─────────────────────────────────────────────────────────────┘
         │                    │                    │
         │                    │                    │
    [Order Created]   [Payment Uploaded]   [Payment Verified]
         │                    │                    │
         ↓                    ↓                    ↓
┌─────────────────────────────────────────────────────────────┐
│              SUPABASE EDGE FUNCTION (send-email)            │
│                                                              │
│  1. Receive request with:                                   │
│     - type: "order_confirmation" | "payment_received" |     │
│             "payment_verified"                              │
│     - orderId: UUID                                          │
│                                                              │
│  2. Fetch order details from database                       │
│                                                              │
│  3. Generate HTML email template                            │
│                                                              │
│  4. Call Resend API                                         │
└─────────────────────────────────────────────────────────────┘
                            ↓
┌─────────────────────────────────────────────────────────────┐
│                      RESEND API                              │
│                                                              │
│  1. Validate API key                                        │
│  2. Process email                 