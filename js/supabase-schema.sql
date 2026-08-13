-- ====================================================================
-- CHAA BUZZ CAFE - SUPABASE DATABASE SCHEMA & REALTIME CONFIGURATION
-- ====================================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    icon TEXT DEFAULT 'Utensils',
    sort_order INT DEFAULT 0,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 2. Create Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY DEFAULT 'm_' || gen_random_uuid(),
    name TEXT NOT NULL,
    category_id TEXT REFERENCES public.categories(id) ON DELETE CASCADE,
    price NUMERIC(10,2) NOT NULL,
    description TEXT,
    image_url TEXT,
    is_veg BOOLEAN DEFAULT true,
    is_popular BOOLEAN DEFAULT false,
    in_stock BOOLEAN DEFAULT true,
    prep_time TEXT DEFAULT '10 mins',
    tags TEXT[] DEFAULT '{}',
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 3. Create Tables Table
CREATE TABLE IF NOT EXISTS public.cafe_tables (
    id INT PRIMARY KEY,
    name TEXT NOT NULL,
    capacity INT DEFAULT 4,
    qr_code_url TEXT,
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 4. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    table_number INT NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL,
    special_note TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending', -- 'pending', 'preparing', 'ready', 'served', 'completed'
    created_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL,
    updated_at TIMESTAMP WITH TIME ZONE DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- 5. Create Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    item_id TEXT REFERENCES public.menu_items(id),
    name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    note TEXT DEFAULT ''
);

-- ====================================================================
-- REALTIME SUBSCRIPTIONS ENABLING
-- ====================================================================
ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
ALTER PUBLICATION supabase_realtime ADD TABLE public.cafe_tables;

-- ====================================================================
-- ROW LEVEL SECURITY (RLS) POLICIES
-- ====================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Allow Public Read Access for Menu, Categories, and Tables
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);
CREATE POLICY "Public Read Menu Items" ON public.menu_items FOR SELECT USING (true);
CREATE POLICY "Public Read Cafe Tables" ON public.cafe_tables FOR SELECT USING (true);

-- Allow Public Order Creation (Customers scan QR and place order without auth)
CREATE POLICY "Public Create Orders" ON public.orders FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);
CREATE POLICY "Public Create Order Items" ON public.order_items FOR INSERT WITH CHECK (true);
CREATE POLICY "Public Read Order Items" ON public.order_items FOR SELECT USING (true);

-- Allow Order Updates for Waiter / Kitchen / Admin
CREATE POLICY "Staff Update Orders" ON public.orders FOR UPDATE USING (true);
CREATE POLICY "Admin Modify Menu" ON public.menu_items FOR ALL USING (true);
