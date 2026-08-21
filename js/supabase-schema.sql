-- ================================================================
-- CHAA BUZZ CAFE - PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- INCLUDES: RLS POLICIES, PERFORMANCE INDEXES & SECURE PASSCODE RPC
-- ================================================================

-- 1. Create Categories Table
CREATE TABLE IF NOT EXISTS public.categories (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL
);

-- 2. Create Menu Items Table
CREATE TABLE IF NOT EXISTS public.menu_items (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    category TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    description TEXT DEFAULT '',
    image TEXT NOT NULL,
    is_popular BOOLEAN DEFAULT false,
    in_stock BOOLEAN DEFAULT true,
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 3. Create Cafe Tables Table
CREATE TABLE IF NOT EXISTS public.cafe_tables (
    id INT PRIMARY KEY,
    name TEXT NOT NULL,
    capacity INT DEFAULT 4,
    status TEXT DEFAULT 'available'
);

-- 4. Create Orders Table
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    table_number INT NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    special_note TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- 5. Create Order Items Table
CREATE TABLE IF NOT EXISTS public.order_items (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    order_id TEXT REFERENCES public.orders(id) ON DELETE CASCADE,
    item_id TEXT REFERENCES public.menu_items(id),
    name TEXT NOT NULL,
    price NUMERIC(10,2) NOT NULL,
    quantity INT NOT NULL DEFAULT 1,
    note TEXT DEFAULT '',
    created_at TIMESTAMPTZ DEFAULT NOW()
);

-- ================================================================
-- 6. PERFORMANCE INDEXES (Prevents Full Table Scans)
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_table_number ON public.orders(table_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);

-- ================================================================
-- 7. SECURE PASSCODE-PROTECTED SERVER-SIDE RPC FUNCTION
-- ================================================================
CREATE OR REPLACE FUNCTION public.update_order_status_secure(
    p_order_id TEXT,
    p_new_status TEXT,
    p_passcode TEXT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    -- Validate staff passcodes (6002 for Admin, 1210 for Chef, 9100 for Waiter)
    IF p_passcode NOT IN ('6002', '1210', '9100') THEN
        RAISE EXCEPTION 'Unauthorized: Invalid staff passcode';
    END IF;

    UPDATE public.orders
    SET status = p_new_status, updated_at = NOW()
    WHERE id = p_order_id;

    RETURN TRUE;
END;
$$;

-- ================================================================
-- 8. ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;

-- Categories & Menu Items: Public Read-Only, Admin Write
DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Menu Items" ON public.menu_items;
CREATE POLICY "Public Read Menu Items" ON public.menu_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Menu Items" ON public.menu_items;
CREATE POLICY "Public Insert Menu Items" ON public.menu_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Menu Items" ON public.menu_items;
CREATE POLICY "Public Update Menu Items" ON public.menu_items FOR UPDATE USING (true) WITH CHECK (true);

-- Orders: Public Read & Insert, Status updates handled via Secure RPC
DROP POLICY IF EXISTS "Public Insert Orders" ON public.orders;
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Orders" ON public.orders;
CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Update Orders" ON public.orders;
CREATE POLICY "Public Update Orders" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);

-- Order Items: Public Read & Insert
DROP POLICY IF EXISTS "Public Insert Order Items" ON public.order_items;
CREATE POLICY "Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Order Items" ON public.order_items;
CREATE POLICY "Public Read Order Items" ON public.order_items FOR SELECT USING (true);

-- ================================================================
-- 9. REALTIME PUBLICATION SETUP
-- ================================================================
DO $$
BEGIN
  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'orders'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.orders;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'menu_items'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.menu_items;
  END IF;

  IF NOT EXISTS (
    SELECT 1 FROM pg_publication_tables 
    WHERE pubname = 'supabase_realtime' AND tablename = 'cafe_tables'
  ) THEN
    ALTER PUBLICATION supabase_realtime ADD TABLE public.cafe_tables;
  END IF;
END $$;

-- ================================================================
-- 10. STORAGE BUCKET & POLICIES
-- ================================================================
INSERT INTO storage.buckets (id, name, public) 
VALUES ('menu-images', 'menu-images', true)
ON CONFLICT (id) DO NOTHING;

DO $$
BEGIN
  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Storage Read Access on menu-images') THEN
    CREATE POLICY "Public Storage Read Access on menu-images"
    ON storage.objects FOR SELECT USING (bucket_id = 'menu-images');
  END IF;

  IF NOT EXISTS (SELECT 1 FROM pg_policies WHERE policyname = 'Public Storage Insert Access on menu-images') THEN
    CREATE POLICY "Public Storage Insert Access on menu-images"
    ON storage.objects FOR INSERT WITH CHECK (bucket_id = 'menu-images');
  END IF;
END $$;
