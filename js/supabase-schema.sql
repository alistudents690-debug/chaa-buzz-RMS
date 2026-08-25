-- ================================================================
-- CHAA BUZZ CAFE - PRODUCTION SUPABASE POSTGRESQL SCHEMA
-- INCLUDES: RLS POLICIES, PERFORMANCE INDEXES, SECURE RPC, 4-PERSON TABLE CAPACITY & PAYMENT STATUS
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

-- 4. Create Orders Table with Payment Status
CREATE TABLE IF NOT EXISTS public.orders (
    id TEXT PRIMARY KEY,
    table_number INT NOT NULL,
    total_amount NUMERIC(10,2) NOT NULL DEFAULT 0,
    special_note TEXT DEFAULT '',
    status TEXT NOT NULL DEFAULT 'pending',
    payment_status TEXT NOT NULL DEFAULT 'unpaid',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    updated_at TIMESTAMPTZ DEFAULT NOW()
);

-- Safely add payment_status column if table already exists
DO $$
BEGIN
    IF NOT EXISTS (
        SELECT 1 FROM information_schema.columns 
        WHERE table_schema = 'public' 
          AND table_name = 'orders' 
          AND column_name = 'payment_status'
    ) THEN
        ALTER TABLE public.orders ADD COLUMN payment_status TEXT NOT NULL DEFAULT 'unpaid';
    END IF;
END $$;

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

-- 6. Create Table Sessions (Tracks Active Customers Per Table)
CREATE TABLE IF NOT EXISTS public.table_sessions (
    id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
    table_number INT NOT NULL,
    session_id TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active',
    created_at TIMESTAMPTZ DEFAULT NOW(),
    last_active_at TIMESTAMPTZ DEFAULT NOW(),
    UNIQUE(table_number, session_id)
);

-- ================================================================
-- 7. PERFORMANCE INDEXES
-- ================================================================
CREATE INDEX IF NOT EXISTS idx_orders_status ON public.orders(status);
CREATE INDEX IF NOT EXISTS idx_orders_payment_status ON public.orders(payment_status);
CREATE INDEX IF NOT EXISTS idx_orders_created_at ON public.orders(created_at DESC);
CREATE INDEX IF NOT EXISTS idx_orders_table_number ON public.orders(table_number);
CREATE INDEX IF NOT EXISTS idx_order_items_order_id ON public.order_items(order_id);
CREATE INDEX IF NOT EXISTS idx_table_sessions_lookup ON public.table_sessions(table_number, status, last_active_at DESC);

-- ================================================================
-- 8. SECURE PASSCODE-PROTECTED SERVER-SIDE RPC FUNCTION
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
-- 9. CONCURRENCY-SAFE 4-PERSON TABLE CAPACITY LIMIT RPC
-- ================================================================
CREATE OR REPLACE FUNCTION public.join_table_session(
    p_table_number INT,
    p_session_id TEXT,
    p_max_capacity INT DEFAULT 4,
    p_timeout_minutes INT DEFAULT 15
) RETURNS JSONB
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
DECLARE
    v_active_count INT;
    v_existing_session RECORD;
    v_cutoff TIMESTAMPTZ;
BEGIN
    v_cutoff := NOW() - (p_timeout_minutes || ' minutes')::INTERVAL;

    UPDATE public.table_sessions
    SET status = 'expired'
    WHERE table_number = p_table_number
      AND status = 'active'
      AND last_active_at < v_cutoff;

    SELECT * INTO v_existing_session
    FROM public.table_sessions
    WHERE table_number = p_table_number
      AND session_id = p_session_id
      AND status = 'active';

    IF FOUND THEN
        UPDATE public.table_sessions
        SET last_active_at = NOW()
        WHERE id = v_existing_session.id;

        SELECT COUNT(*) INTO v_active_count
        FROM public.table_sessions
        WHERE table_number = p_table_number
          AND status = 'active';

        RETURN jsonb_build_object(
            'success', true,
            'allowed', true,
            'active_count', v_active_count,
            'max_capacity', p_max_capacity,
            'message', 'Existing session refreshed'
        );
    END IF;

    PERFORM pg_advisory_xact_lock(p_table_number);

    SELECT COUNT(*) INTO v_active_count
    FROM public.table_sessions
    WHERE table_number = p_table_number
      AND status = 'active';

    IF v_active_count >= p_max_capacity THEN
        RETURN jsonb_build_object(
            'success', true,
            'allowed', false,
            'active_count', v_active_count,
            'max_capacity', p_max_capacity,
            'message', 'This table is full (4/4). Please ask the waiter for assistance.'
        );
    END IF;

    INSERT INTO public.table_sessions (table_number, session_id, status, created_at, last_active_at)
    VALUES (p_table_number, p_session_id, 'active', NOW(), NOW())
    ON CONFLICT (table_number, session_id) 
    DO UPDATE SET status = 'active', last_active_at = NOW();

    SELECT COUNT(*) INTO v_active_count
    FROM public.table_sessions
    WHERE table_number = p_table_number
      AND status = 'active';

    RETURN jsonb_build_object(
        'success', true,
        'allowed', true,
        'active_count', v_active_count,
        'max_capacity', p_max_capacity,
        'message', 'Session joined successfully'
    );
END;
$$;

CREATE OR REPLACE FUNCTION public.clear_table_sessions(
    p_table_number INT
) RETURNS BOOLEAN
LANGUAGE plpgsql
SECURITY DEFINER
AS $$
BEGIN
    UPDATE public.table_sessions
    SET status = 'closed'
    WHERE table_number = p_table_number
      AND status = 'active';

    RETURN TRUE;
END;
$$;

-- ================================================================
-- 10. ROW LEVEL SECURITY (RLS) POLICIES
-- ================================================================
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.menu_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.cafe_tables ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.table_sessions ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS "Public Read Categories" ON public.categories;
CREATE POLICY "Public Read Categories" ON public.categories FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Menu Items" ON public.menu_items;
CREATE POLICY "Public Read Menu Items" ON public.menu_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Menu Items" ON public.menu_items;
CREATE POLICY "Public Insert Menu Items" ON public.menu_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Menu Items" ON public.menu_items;
CREATE POLICY "Public Update Menu Items" ON public.menu_items FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Insert Orders" ON public.orders;
CREATE POLICY "Public Insert Orders" ON public.orders FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Orders" ON public.orders;
CREATE POLICY "Public Read Orders" ON public.orders FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Update Orders" ON public.orders;
CREATE POLICY "Public Update Orders" ON public.orders FOR UPDATE USING (true) WITH CHECK (true);

DROP POLICY IF EXISTS "Public Insert Order Items" ON public.order_items;
CREATE POLICY "Public Insert Order Items" ON public.order_items FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Read Order Items" ON public.order_items;
CREATE POLICY "Public Read Order Items" ON public.order_items FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Read Table Sessions" ON public.table_sessions;
CREATE POLICY "Public Read Table Sessions" ON public.table_sessions FOR SELECT USING (true);

DROP POLICY IF EXISTS "Public Insert Table Sessions" ON public.table_sessions;
CREATE POLICY "Public Insert Table Sessions" ON public.table_sessions FOR INSERT WITH CHECK (true);

DROP POLICY IF EXISTS "Public Update Table Sessions" ON public.table_sessions;
CREATE POLICY "Public Update Table Sessions" ON public.table_sessions FOR UPDATE USING (true) WITH CHECK (true);

-- ================================================================
-- 11. REALTIME PUBLICATION SETUP
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
-- 12. STORAGE BUCKET & POLICIES
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
