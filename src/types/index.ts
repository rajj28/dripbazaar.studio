export interface Product {
  id: string;
  name: string;
  category: string;
  price: number;
  image: string;
  images?: string[];
  tag?: string;
  description?: string;
  sizes?: string[];
  colors?: string[];
  material?: string;
  care_instructions?: string;
  is_premium?: boolean;
  stock?: number;
  created_at?: string;
}

export interface CartItem {
  id: string;
  product: Product;
  quantity: number;
  size?: string;
  color?: string;
}

export interface Address {
  id?: string;
  user_id?: string;
  full_name: string;
  phone: string;
  address_line1: string;
  address_line2?: string;
  city: string;
  state: string;
  pincode: string;
  is_default?: boolean;
}

export interface Order {
  id: string;
  user_id?: string;
  items: CartItem[];
  total_amount: number;
  address: Address;
  payment_status: 'pending' | 'completed' | 'failed';
  razorpay_order_id?: string;
  razorpay_payment_id?: string;
  created_at: string;
}
