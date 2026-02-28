import { createClient } from '@supabase/supabase-js';

const supabaseUrl = import.meta.env.VITE_SUPABASE_URL || '';
const supabaseAnonKey = import.meta.env.VITE_SUPABASE_ANON_KEY || '';

if (!supabaseUrl || !supabaseAnonKey) {
  console.warn('Supabase credentials not found. Using mock mode.');
}

export const supabase = createClient(supabaseUrl, supabaseAnonKey, {
  auth: {
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: true,
    storage: window.localStorage,
    storageKey: 'drip-riwaaz-auth',
    flowType: 'pkce'
  }
});

// Database types
export interface Profile {
  id: string;
  email: string;
  full_name: string | null;
  phone: string | null;
  created_at: string;
  updated_at: string;
}

export interface Order {
  id: string;
  user_id?: string;
  items: any[]; // CartItem[] - storing cart items as JSONB
  total_amount: number;
  address: any; // Address object stored as JSONB
  status: 'pending' | 'payment_submitted' | 'payment_verified' | 'confirmed' | 'shipped' | 'delivered' | 'cancelled';
  payment_method?: string;
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
  updated_at?: string;
  // Legacy fields for pre-book orders
  drop_name?: string;
  drop_id?: number;
  full_name?: string;
  phone?: string;
  city?: string;
  state?: string;
  pincode?: string;
  size?: string;
  price?: number;
}

export interface Payment {
  id: string;
  order_id: string;
  user_id: string;
  transaction_id: string;
  amount: number;
  payment_method: string;
  payment_screenshot_url: string | null;
  status: 'pending' | 'verified' | 'failed' | 'refunded';
  verified_at: string | null;
  verified_by: string | null;
  admin_notes: string | null;
  created_at: string;
  updated_at: string;
}
