-- Products Table
CREATE TABLE products (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price DECIMAL(10, 2) NOT NULL,
    image TEXT NOT NULL,
    images TEXT[],
    tag TEXT,
    description TEXT,
    sizes TEXT[],
    colors TEXT[],
    material TEXT,
    care_instructions TEXT,
    is_premium BOOLEAN DEFAULT FALSE,
    stock INTEGER DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    items JSONB NOT NULL,
    total_amount DECIMAL(10, 2) NOT NULL,
    address JSONB NOT NULL,
    payment_status TEXT NOT NULL DEFAULT 'pending',
    razorpay_order_id TEXT,
    razorpay_payment_id TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Addresses Table (Optional - for saved addresses)
CREATE TABLE addresses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    user_id UUID,
    full_name TEXT NOT NULL,
    phone TEXT NOT NULL,
    address_line1 TEXT NOT NULL,
    address_line2 TEXT,
    city TEXT NOT NULL,
    state TEXT NOT NULL,
    pincode TEXT NOT NULL,
    is_default BOOLEAN DEFAULT FALSE,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Insert Sample Products
INSERT INTO products (name, category, price, image, images, tag, description, sizes, colors, material, care_instructions, is_premium, stock) VALUES
('Urban Rebel Tee', 'Essentials', 1299, '/images/card1.jpg', ARRAY['/images/card1.jpg'], 'Bestseller', 'Premium cotton tee with urban design', ARRAY['S', 'M', 'L', 'XL'], ARRAY['Black', 'White', 'Grey'], '100% Cotton', 'Machine wash cold', FALSE, 50),
('Street Hoodie', 'Essentials', 2499, '/images/card2.jpg', ARRAY['/images/card2.jpg'], 'New', 'Comfortable hoodie for street style', ARRAY['S', 'M', 'L', 'XL', 'XXL'], ARRAY['Black', 'Navy', 'Maroon'], '80% Cotton, 20% Polyester', 'Machine wash cold', FALSE, 30),
('Heritage Bomber', 'Premium', 12999, '/images/card1.jpg', ARRAY['/images/card1.jpg'], 'Limited', 'Fusion of heritage and modern streetwear', ARRAY['M', 'L', 'XL'], ARRAY['Black', 'Olive'], 'Premium Cotton Blend', 'Dry clean only', TRUE, 10),
('Royal Kurta Set', 'Premium', 8499, '/images/card2.jpg', ARRAY['/images/card2.jpg'], 'Exclusive', 'Contemporary kurta with traditional embroidery', ARRAY['S', 'M', 'L', 'XL'], ARRAY['White', 'Cream', 'Black'], 'Pure Cotton', 'Hand wash recommended', TRUE, 15),
('Artisan Jacket', 'Premium', 15999, '/images/card3.jpg', ARRAY['/images/card3.jpg'], 'New', 'Handcrafted jacket with artisan details', ARRAY['M', 'L', 'XL'], ARRAY['Black', 'Brown'], 'Leather & Cotton', 'Professional clean only', TRUE, 8),
('Urban Sherwani', 'Premium', 18999, '/images/card4.jpg', ARRAY['/images/card4.jpg'], 'Hot', 'Modern sherwani for urban occasions', ARRAY['M', 'L', 'XL', 'XXL'], ARRAY['Black', 'Navy', 'Maroon'], 'Silk Blend', 'Dry clean only', TRUE, 12);

-- Enable Row Level Security (RLS)
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE addresses ENABLE ROW LEVEL SECURITY;

-- Create policies for public read access to products
CREATE POLICY "Public can view products" ON products FOR SELECT USING (true);

-- Create policies for orders (adjust based on your auth setup)
CREATE POLICY "Users can view their own orders" ON orders FOR SELECT USING (true);
CREATE POLICY "Users can create orders" ON orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own orders" ON orders FOR UPDATE USING (true);

-- Create policies for addresses
CREATE POLICY "Users can view their own addresses" ON addresses FOR SELECT USING (true);
CREATE POLICY "Users can create addresses" ON addresses FOR INSERT WITH CHECK (true);
CREATE POLICY "Users can update their own addresses" ON addresses FOR UPDATE USING (true);
CREATE POLICY "Users can delete their own addresses" ON addresses FOR DELETE USING (true);
