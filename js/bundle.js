// Chaa Buzz Cafe - Full Application Bundle with Direct Supabase DB Integration & Realtime Sync

// ====================================================================
// 1. DATASET & CONFIGURATION
// ====================================================================
const CAFE_INFO = {
  name: "Chaa Buzz Cafe",
  tagline: "Artisan Teas, Specialty Coffee & Gourmet Bites",
  address: "House 14, Road 7, Block C, Banani, Dhaka",
  phone: "+880 1712-345678",
  currency: "৳"
};

// Security Passcodes mapping to roles:
// 6002 -> Admin | 1210 -> Chef (Kitchen KDS) | 9100 -> Waiter
const PASSCODE_ROLES = {
  "6002": "admin",
  "1210": "kitchen",
  "9100": "waiter"
};

// --- SUPABASE CLIENT INITIALIZATION ---
const SUPABASE_URL = "https://umnbgjhhcvmkcdibmsdr.supabase.co";
const SUPABASE_KEY = "sb_publishable_CdBFJUtArtuAyveQue5aQQ_UnkXlRkt";
const supabase = (window.supabase && window.supabase.createClient) 
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

const PRESET_IMAGES = [
  { label: "🍵 Matka Chaa", url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80" },
  { label: "☕ Cappuccino", url: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80" },
  { label: "🧊 Iced Latte", url: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80" },
  { label: "🍔 Chicken Burger", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80" },
  { label: "🍔 Smash Burger", url: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80" },
  { label: "🍕 Truffle Pizza", url: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80" },
  { label: "🍝 Alfredo Pasta", url: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80" },
  { label: "🍰 Lava Cake", url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80" },
  { label: "🍹 Mojito", url: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80" },
  { label: "🍟 Loaded Fries", url: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=600&q=80" }
];

const INITIAL_CATEGORIES = [
  { id: "all", name: "All Items" },
  { id: "tea-chaa", name: "Chaa & Teas" },
  { id: "coffee", name: "Specialty Coffee" },
  { id: "burgers", name: "Gourmet Burgers" },
  { id: "pizza-pasta", name: "Pizza & Pasta" },
  { id: "desserts", name: "Desserts & Bakery" },
  { id: "cold-drinks", name: "Cold Drinks & Shakes" },
  { id: "snacks", name: "Crispy Snacks" }
];

const INITIAL_MENU_ITEMS = [
  {
    id: "m1",
    name: "Special Matka Milk Chaa",
    category: "tea-chaa",
    price: 60,
    description: "Traditional slow-brewed spiced milk tea served in an authentic earthen clay pot (matka). Rich, creamy, and fragrant.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "m2",
    name: "Zafrani Elaichi Tea",
    category: "tea-chaa",
    price: 80,
    description: "Premium Assam tea leaves infused with saffron strands and freshly crushed green cardamom.",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80",
    isPopular: false,
    inStock: true
  },
  {
    id: "m4",
    name: "Hazelnut Cappuccino",
    category: "coffee",
    price: 240,
    description: "Double shot espresso with silky microfoam milk and roasted hazelnut syrup, dusted with dark cocoa powder.",
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "m5",
    name: "Spanish Iced Latte",
    category: "coffee",
    price: 280,
    description: "Rich espresso poured over sweet condensed milk, fresh whole milk, and clear ice spheres.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "m7",
    name: "Smokey Buzz Chicken Burger",
    category: "burgers",
    price: 320,
    description: "Crispy double-fried chicken breast, smoked cheddar cheese, honey mustard coleslaw, and house buzz sauce in a toasted brioche bun.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "m8",
    name: "Classic Cheese Smash Beef Burger",
    category: "burgers",
    price: 380,
    description: "100% Angus beef patty smashed crispy on the grill, melted American cheese, caramelized onions, pickles, and burger relish.",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "m9",
    name: "Truffle Mushroom Pizza (10\")",
    category: "pizza-pasta",
    price: 550,
    description: "Hand-tossed sourdough pizza topped with roasted wild mushrooms, mozzarella, garlic butter, and black truffle oil spray.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    isPopular: false,
    inStock: true
  },
  {
    id: "m10",
    name: "Creamy Chicken Alfredo Pasta",
    category: "pizza-pasta",
    price: 420,
    description: "Fettuccine pasta tossed in rich parmesan cream sauce with tender grilled chicken breast, fresh parsley, and cracked black pepper.",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "m11",
    name: "Belgian Chocolate Lava Cake",
    category: "desserts",
    price: 260,
    description: "Warm chocolate cake with a molten Belgian dark chocolate center, served with a scoop of Madagascar vanilla bean ice cream.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "m13",
    name: "Mango Passionfruit Mojito",
    category: "cold-drinks",
    price: 210,
    description: "Sparkling soda layered with Alphonso mango puree, passionfruit nectar, muddled mint leaves, and lime juice.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "m14",
    name: "Loaded Buzz Fries",
    category: "snacks",
    price: 190,
    description: "Golden seasoned french fries topped with melted cheddar sauce, jalapeno slices, crispy fried onions, and spicy mayo drizzle.",
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  }
];

const INITIAL_TABLES = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  name: `Table ${i + 1}`,
  capacity: i % 2 === 0 ? 4 : 2,
  status: "available",
  activeOrderId: null
}));

// ====================================================================
// 2. REALTIME CLOUD SYNC & DUAL SUPABASE DB ENGINE
// ====================================================================
const STORAGE_KEYS = {
  MENU: 'chaa_buzz_menu',
  CATEGORIES: 'chaa_buzz_categories',
  ORDERS: 'chaa_buzz_orders',
  TABLES: 'chaa_buzz_tables',
  CART: 'chaa_buzz_cart'
};

const SYNC_TOPIC = "chaa_buzz_cafe_orders_v5";
const NTFY_RELAY = `https://ntfy.sh/${SYNC_TOPIC}`;

class Store extends EventTarget {
  constructor() {
    super();
    this.broadcast = new BroadcastChannel('chaa_buzz_realtime');
    this.initStorage();

    // Cross-tab broadcast listener
    this.broadcast.onmessage = (event) => {
      if (event.data) {
        this.dispatchEvent(new CustomEvent('state-changed', { detail: event.data }));
      }
    };
    window.addEventListener('storage', () => {
      this.dispatchEvent(new CustomEvent('state-changed'));
    });

    // Cloud Sync Engine
    this.initCloudSyncEngine();
  }

  initStorage() {
    if (!localStorage.getItem(STORAGE_KEYS.MENU)) {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(INITIAL_MENU_ITEMS));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CATEGORIES)) {
      localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(INITIAL_CATEGORIES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.TABLES)) {
      localStorage.setItem(STORAGE_KEYS.TABLES, JSON.stringify(INITIAL_TABLES));
    }
    if (!localStorage.getItem(STORAGE_KEYS.ORDERS)) {
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify([]));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }
  }

  initCloudSyncEngine() {
    // 1. Supabase Initial Load & Realtime Channel Subscription
    if (supabase) {
      this.fetchOrdersFromSupabase();

      try {
        supabase
          .channel('public:orders')
          .on('postgres_changes', { event: '*', schema: 'public', table: 'orders' }, (payload) => {
            if (payload.eventType === 'INSERT') {
              this.fetchSingleOrderFromSupabase(payload.new.id);
            } else if (payload.eventType === 'UPDATE') {
              const orders = this.getOrders();
              const idx = orders.findIndex(o => o.id === payload.new.id);
              if (idx >= 0) {
                orders[idx].status = payload.new.status;
                localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
                if (payload.new.status === 'ready') this.playBellSound('ready');
                this.notify('order-updated', orders[idx]);
              }
            }
          })
          .subscribe();
      } catch (err) {}
    }

    // 2. HTTP Event Relay Stream & Backup Polling
    try {
      if (typeof EventSource !== 'undefined') {
        const es = new EventSource(`${NTFY_RELAY}/json`);
        es.onmessage = (e) => {
          try {
            const data = JSON.parse(e.data);
            if (data && data.message) {
              const payload = JSON.parse(data.message);
              this.applyIncomingSync(payload);
            }
          } catch (err) {}
        };
      }
    } catch (e) {}

    const runCloudSync = async () => {
      try {
        const res = await fetch(`${NTFY_RELAY}/json?poll=1`);
        if (res.ok) {
          const text = await res.text();
          const lines = text.trim().split('\n');
          for (const line of lines) {
            if (!line) continue;
            try {
              const msgObj = JSON.parse(line);
              if (msgObj && msgObj.message) {
                const payload = JSON.parse(msgObj.message);
                this.applyIncomingSync(payload);
              }
            } catch(e){}
          }
        }
      } catch (err) {}
    };

    runCloudSync();
    setInterval(runCloudSync, 1500);
  }

  async fetchOrdersFromSupabase() {
    if (!supabase) return;
    try {
      const { data: dbOrders, error } = await supabase
        .from('orders')
        .select(`
          id,
          table_number,
          total_amount,
          special_note,
          status,
          created_at,
          order_items (
            name,
            price,
            quantity,
            note
          )
        `)
        .order('created_at', { ascending: false });

      if (!error && dbOrders) {
        const mapped = dbOrders.map(o => ({
          id: o.id,
          tableNumber: o.table_number,
          totalAmount: Number(o.total_amount),
          specialNote: o.special_note || '',
          status: o.status,
          createdAt: o.created_at,
          items: (o.order_items || []).map(i => ({
            name: i.name,
            price: Number(i.price),
            quantity: i.quantity,
            note: i.note || ''
          }))
        }));

        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mapped));
        this.notify('orders-loaded');
      }
    } catch (err) {}
  }

  async fetchSingleOrderFromSupabase(orderId) {
    if (!supabase) return;
    try {
      const { data: o, error } = await supabase
        .from('orders')
        .select(`
          id,
          table_number,
          total_amount,
          special_note,
          status,
          created_at,
          order_items (
            name,
            price,
            quantity,
            note
          )
        `)
        .eq('id', orderId)
        .single();

      if (!error && o) {
        const mappedOrder = {
          id: o.id,
          tableNumber: o.table_number,
          totalAmount: Number(o.total_amount),
          specialNote: o.special_note || '',
          status: o.status,
          createdAt: o.created_at,
          items: (o.order_items || []).map(i => ({
            name: i.name,
            price: Number(i.price),
            quantity: i.quantity,
            note: i.note || ''
          }))
        };
        this.applyIncomingSync({ type: 'order-created', data: mappedOrder });
      }
    } catch (err) {}
  }

  applyIncomingSync(payload) {
    if (!payload || !payload.type) return;

    if (payload.type === 'order-created') {
      const orders = this.getOrders();
      const exists = orders.some(o => o.id === payload.data.id);
      if (!exists) {
        orders.unshift(payload.data);
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        this.playBellSound('new');
        this.notify('order-created', payload.data);
      }
    } else if (payload.type === 'order-updated') {
      const orders = this.getOrders();
      const idx = orders.findIndex(o => o.id === payload.data.id);
      if (idx >= 0) {
        orders[idx] = payload.data;
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        if (payload.data.status === 'ready') this.playBellSound('ready');
        this.notify('order-updated', payload.data);
      }
    } else if (payload.type === 'table-cleared') {
      const orders = this.getOrders().map(o => {
        if (Number(o.tableNumber) === Number(payload.data.tableNumber) && o.status !== 'completed') {
          return { ...o, status: 'completed' };
        }
        return o;
      });
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.notify('table-cleared');
    } else if (payload.type === 'menu-updated') {
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(payload.data));
      this.notify('menu-updated');
    }
  }

  publishCrossDevice(type, data) {
    try {
      fetch(NTFY_RELAY, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ type, data, timestamp: Date.now() })
      }).catch(() => {});
    } catch (e) {}
  }

  notify(type, payload) {
    const data = { type, payload };
    this.broadcast.postMessage(data);
    this.dispatchEvent(new CustomEvent('state-changed', { detail: data }));
  }

  getMenuItems() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU)) || INITIAL_MENU_ITEMS; } catch { return INITIAL_MENU_ITEMS; }
  }

  saveMenuItem(item) {
    const items = this.getMenuItems();
    const existingIdx = items.findIndex(i => i.id === item.id);
    if (existingIdx >= 0) {
      items[existingIdx] = { ...items[existingIdx], ...item };
    } else {
      items.unshift({ ...item, id: `m_${Date.now()}` });
    }
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(items));
    this.notify('menu-updated');
    this.publishCrossDevice('menu-updated', items);
  }

  toggleStockStatus(id) {
    const items = this.getMenuItems();
    const item = items.find(i => i.id === id);
    if (item) {
      item.inStock = !item.inStock;
      localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(items));
      this.notify('menu-updated');
      this.publishCrossDevice('menu-updated', items);
    }
  }

  deleteMenuItem(id) {
    const items = this.getMenuItems().filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(items));
    this.notify('menu-updated');
    this.publishCrossDevice('menu-updated', items);
  }

  getCategories() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || INITIAL_CATEGORIES; } catch { return INITIAL_CATEGORIES; }
  }

  getTables() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.TABLES)) || INITIAL_TABLES; } catch { return INITIAL_TABLES; }
  }

  getOrders() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || []; } catch { return []; }
  }

  // --- Create Order (Direct Supabase DB Insert + Relay Sync) ---
  createOrder({ tableNumber, items, specialNote = "" }) {
    const orders = this.getOrders();
    const uniqueIdSuffix = Date.now().toString().slice(-5) + Math.floor(10 + Math.random() * 90);
    const newOrderId = `ORD-${uniqueIdSuffix}`;
    const totalAmount = items.reduce((sum, i) => sum + (i.price * i.quantity), 0);
    
    const newOrder = {
      id: newOrderId,
      tableNumber: Number(tableNumber),
      items,
      totalAmount,
      specialNote,
      status: 'pending',
      createdAt: new Date().toISOString()
    };
    
    // 1. Local & Relay Update
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.playBellSound('new');
    this.notify('order-created', newOrder);
    this.publishCrossDevice('order-created', newOrder);

    // 2. Direct Supabase DB Persist
    if (supabase) {
      supabase
        .from('orders')
        .insert([{
          id: newOrderId,
          table_number: Number(tableNumber),
          total_amount: totalAmount,
          special_note: specialNote || '',
          status: 'pending'
        }])
        .then(({ error }) => {
          if (error) console.error("Supabase order insert error:", error);
        });

      const orderItemsPayload = items.map(item => ({
        order_id: newOrderId,
        item_id: item.id || null,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        note: item.note || ''
      }));

      supabase
        .from('order_items')
        .insert(orderItemsPayload)
        .then(({ error }) => {
          if (error) console.error("Supabase order_items insert error:", error);
        });
    }

    return newOrder;
  }

  updateOrderStatus(orderId, status) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      if (status === 'ready') this.playBellSound('ready');
      this.notify('order-updated', order);
      this.publishCrossDevice('order-updated', order);

      // Direct Supabase DB Update
      if (supabase) {
        supabase
          .from('orders')
          .update({ status, updated_at: new Date().toISOString() })
          .eq('id', orderId)
          .then(({ error }) => {
            if (error) console.error("Supabase status update error:", error);
          });
      }
    }
  }

  clearTable(tableNumber) {
    const orders = this.getOrders().map(o => {
      if (Number(o.tableNumber) === Number(tableNumber) && o.status !== 'completed') {
        return { ...o, status: 'completed' };
      }
      return o;
    });
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.notify('table-cleared');
    this.publishCrossDevice('table-cleared', { tableNumber });

    // Direct Supabase DB Update
    if (supabase) {
      supabase
        .from('orders')
        .update({ status: 'completed', updated_at: new Date().toISOString() })
        .eq('table_number', Number(tableNumber))
        .neq('status', 'completed')
        .then(({ error }) => {
          if (error) console.error("Supabase table clear error:", error);
        });
    }
  }

  getCart() {
    try { return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || []; } catch { return []; }
  }

  setCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    this.notify('cart-updated');
  }

  addToCart(item, note = "") {
    const cart = this.getCart();
    const existing = cart.find(c => c.id === item.id && c.note === note);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({ id: item.id, name: item.name, price: item.price, image: item.image, quantity: 1, note });
    }
    this.setCart(cart);
  }

  removeFromCart(itemId, note = "") {
    let cart = this.getCart();
    const existing = cart.find(c => c.id === itemId && c.note === note);
    if (existing) {
      if (existing.quantity > 1) {
        existing.quantity -= 1;
      } else {
        cart = cart.filter(c => !(c.id === itemId && c.note === note));
      }
    }
    this.setCart(cart);
  }

  clearCart() {
    this.setCart([]);
  }

  playBellSound(type = 'new') {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = 'sine';
      osc.frequency.value = type === 'new' ? 659.25 : 880;
      gain.gain.setValueAtTime(0.2, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.5);
      osc.connect(gain);
      gain.connect(ctx.destination);
      osc.start();
      osc.stop(ctx.currentTime + 0.5);
    } catch (e) {}
  }
}

const store = new Store();

// ====================================================================
// 3. REACT COMPONENTS & APP
// ====================================================================
const { useState, useEffect, useMemo, useRef } = React;
const formatPrice = (amt) => `${CAFE_INFO.currency}${Number(amt).toLocaleString()}`;

// --- Pure Vector SVG QR Generator Component ---
function QrCodeSvg({ value, size = 160 }) {
  const containerRef = useRef(null);

  useEffect(() => {
    if (!containerRef.current) return;
    containerRef.current.innerHTML = '';
    if (window.QRCode) {
      new window.QRCode(containerRef.current, {
        text: value,
        width: size,
        height: size,
        colorDark: "#1C1917",
        colorLight: "#FFFFFF",
        correctLevel: window.QRCode.CorrectLevel.H
      });
    } else {
      const encoded = encodeURIComponent(value);
      const img = document.createElement('img');
      img.src = `https://api.qrserver.com/v1/create-qr-code/?size=${size}x${size}&data=${encoded}`;
      img.width = size;
      img.height = size;
      img.alt = "QR Code";
      containerRef.current.appendChild(img);
    }
  }, [value, size]);

  return <div ref={containerRef} className="flex justify-center items-center bg-white p-2 rounded-xl" />;
}

// --- Customer Menu Component ---
function CustomerMenu({ activeTable, onSelectTable, onOpenStaffAuth }) {
  const [menuItems, setMenuItems] = useState(store.getMenuItems());
  const [categories, setCategories] = useState(store.getCategories());
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [cart, setCart] = useState(store.getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [specialNote, setSpecialNote] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);

  useEffect(() => {
    const update = () => {
      setMenuItems(store.getMenuItems());
      setCategories(store.getCategories());
      setCart(store.getCart());
      if (activeTable) {
        const orders = store.getOrders();
        const current = orders.find(o => Number(o.tableNumber) === Number(activeTable) && o.status !== 'completed');
        setActiveOrder(current || null);
      }
    };
    store.addEventListener('state-changed', update);
    update();
    return () => store.removeEventListener('state-changed', update);
  }, [activeTable]);

  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchCat = selectedCategory === "all" || item.category === selectedCategory;
      const matchSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          item.description.toLowerCase().includes(searchQuery.toLowerCase());
      return matchCat && matchSearch;
    });
  }, [menuItems, selectedCategory, searchQuery]);

  const cartTotal = cart.reduce((sum, i) => sum + (i.price * i.quantity), 0);
  const cartCount = cart.reduce((sum, i) => sum + i.quantity, 0);

  const handlePlaceOrder = () => {
    if (!activeTable) return alert("No table detected! Please scan a table QR code.");
    if (cart.length === 0) return;
    const newOrd = store.createOrder({ tableNumber: activeTable, items: cart, specialNote });
    store.clearCart();
    setIsCartOpen(false);
    setSpecialNote("");
    setActiveOrder(newOrd);
  };

  return (
    <div className="min-h-screen pb-28">
      {/* Header Banner */}
      <div className="bg-stone-900 text-white pt-6 pb-8 px-4 rounded-b-3xl shadow-xl relative">
        <div className="max-w-4xl mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-12 h-12 rounded-2xl bg-amber-500 text-stone-950 font-black text-2xl flex items-center justify-center shadow-lg">☕</div>
            <div>
              <h1 className="text-xl font-bold tracking-tight">{CAFE_INFO.name}</h1>
              <p className="text-stone-400 text-xs">{CAFE_INFO.tagline}</p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            {activeTable ? (
              <div className="bg-amber-500/20 border border-amber-500/40 text-amber-400 px-3.5 py-1.5 rounded-full font-bold text-xs flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                Table {activeTable}
              </div>
            ) : (
              <button onClick={() => onSelectTable(1)} className="bg-stone-800 text-stone-300 text-xs px-3 py-1.5 rounded-xl border border-stone-700">
                Demo Table 1
              </button>
            )}

            <button
              onClick={onOpenStaffAuth}
              title="Staff Portal Login"
              className="w-8 h-8 rounded-xl bg-stone-800 hover:bg-stone-700 border border-stone-700 text-stone-300 flex items-center justify-center text-xs ml-1"
            >
              🔒
            </button>
          </div>
        </div>

        {/* Search Input */}
        <div className="max-w-4xl mx-auto mt-5">
          <input
            type="text"
            placeholder="Search coffee, tea, burgers, pasta, desserts..."
            value={searchQuery}
            onChange={e => setSearchQuery(e.target.value)}
            className="w-full bg-stone-800 text-white text-xs rounded-2xl px-4 py-3 border border-stone-700 focus:outline-none focus:border-amber-500"
          />
        </div>
      </div>

      {/* Active Order Status Tracker */}
      {activeOrder && (
        <div className="max-w-4xl mx-auto px-4 -mt-4 mb-6 relative z-10">
          <div className="bg-amber-50 border border-amber-300 p-4 rounded-2xl shadow-lg">
            <div className="flex justify-between items-center">
              <div>
                <span className="text-[10px] font-bold text-amber-800 uppercase tracking-wider">Latest Order #{activeOrder.id}</span>
                <h3 className="font-bold text-stone-900 text-sm">Your order is being prepared!</h3>
              </div>
              <span className={`text-xs font-extrabold px-3 py-1 rounded-full uppercase ${
                activeOrder.status === 'ready' ? 'bg-emerald-500 text-white animate-bounce' : 'bg-amber-500 text-stone-950'
              }`}>
                {activeOrder.status === 'ready' ? '🔔 Ready to Serve!' : activeOrder.status}
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Category Pills */}
      <div className="max-w-4xl mx-auto px-4 mt-6 flex gap-2 overflow-x-auto pb-2">
        {categories.map(c => (
          <button
            key={c.id}
            onClick={() => setSelectedCategory(c.id)}
            className={`px-4 py-2 rounded-2xl text-xs font-bold whitespace-nowrap transition ${
              selectedCategory === c.id ? 'bg-amber-600 text-white shadow' : 'bg-white text-stone-600 border border-stone-200'
            }`}
          >
            {c.name}
          </button>
        ))}
      </div>

      {/* Food Grid */}
      <div className="max-w-4xl mx-auto px-4 mt-4 grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredItems.map(item => (
          <div key={item.id} className={`bg-white p-4 rounded-2xl border shadow-sm flex gap-4 ${!item.inStock ? 'opacity-60 grayscale' : 'border-stone-200'}`}>
            <img src={item.image} className="w-24 h-24 rounded-xl object-cover" />
            <div className="flex-1 flex flex-col justify-between">
              <div>
                <div className="flex items-center gap-2">
                  <h3 className="font-bold text-stone-900 text-sm">{item.name}</h3>
                  {item.isPopular && <span className="bg-amber-100 text-amber-800 text-[9px] font-extrabold px-1.5 py-0.5 rounded">⭐ Popular</span>}
                </div>
                <p className="text-stone-500 text-xs mt-1 line-clamp-2">{item.description}</p>
              </div>
              <div className="flex justify-between items-center mt-3">
                <span className="font-black text-stone-900">{formatPrice(item.price)}</span>
                {item.inStock ? (
                  <button
                    onClick={() => store.addToCart(item)}
                    className="bg-stone-900 hover:bg-amber-600 text-white text-xs font-bold px-3.5 py-1.5 rounded-xl transition"
                  >
                    + Add
                  </button>
                ) : (
                  <span className="text-[10px] font-bold text-rose-600 bg-rose-50 px-2 py-1 rounded-lg">Out of Stock</span>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>

      {/* Floating Cart Bar */}
      {cartCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 z-40 px-4">
          <div className="max-w-xl mx-auto bg-stone-900 text-white p-4 rounded-2xl shadow-2xl flex items-center justify-between">
            <div>
              <p className="text-[10px] text-stone-400">{cartCount} items selected</p>
              <p className="font-bold text-lg">{formatPrice(cartTotal)}</p>
            </div>
            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs px-5 py-2.5 rounded-xl"
            >
              View Cart & Order →
            </button>
          </div>
        </div>
      )}

      {/* Cart Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-lg w-full p-6 space-y-4 shadow-2xl">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-stone-900 text-base">Your Order Summary</h3>
              <button onClick={() => setIsCartOpen(false)} className="text-stone-400">✕</button>
            </div>

            <div className="space-y-2 max-h-60 overflow-y-auto">
              {cart.map((item, idx) => (
                <div key={idx} className="flex justify-between items-center p-2 bg-stone-50 rounded-xl">
                  <div>
                    <p className="font-bold text-xs text-stone-900">{item.name}</p>
                    <p className="text-[10px] text-stone-500">{formatPrice(item.price)}</p>
                  </div>
                  <div className="flex items-center gap-2">
                    <button onClick={() => store.removeFromCart(item.id)} className="px-2 py-0.5 bg-stone-200 text-xs rounded">-</button>
                    <span className="text-xs font-bold">{item.quantity}</span>
                    <button onClick={() => store.addToCart(item)} className="px-2 py-0.5 bg-stone-900 text-white text-xs rounded">+</button>
                  </div>
                </div>
              ))}
            </div>

            <textarea
              placeholder="Kitchen note (e.g. Less sugar)"
              value={specialNote}
              onChange={e => setSpecialNote(e.target.value)}
              className="w-full border rounded-xl p-2 text-xs"
            />

            <div className="pt-2 border-t flex justify-between items-center font-black">
              <span>Total: {formatPrice(cartTotal)}</span>
              <button onClick={handlePlaceOrder} className="bg-amber-500 text-stone-950 font-black text-xs px-5 py-3 rounded-xl">
                Confirm & Place Order
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// --- Waiter Dashboard Component ---
function WaiterDashboard() {
  const [tables, setTables] = useState(store.getTables());
  const [orders, setOrders] = useState(store.getOrders());

  useEffect(() => {
    const update = () => {
      setTables(store.getTables());
      setOrders(store.getOrders());
    };
    store.addEventListener('state-changed', update);
    update();
    return () => store.removeEventListener('state-changed', update);
  }, []);

  const activeOrders = orders.filter(o => o.status !== 'completed');

  return (
    <div className="min-h-screen bg-stone-100 p-6 max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border flex justify-between items-center">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse" />
            <h1 className="text-xl font-bold">Waiter Service Dashboard</h1>
          </div>
          <p className="text-xs text-stone-500">Connected to Supabase DB & Realtime Stream</p>
        </div>

        <button
          onClick={() => store.fetchOrdersFromSupabase()}
          className="bg-stone-100 hover:bg-stone-200 text-stone-700 text-xs font-bold px-3 py-2 rounded-xl flex items-center gap-1.5"
        >
          <span>🔄 Sync Supabase DB</span>
        </button>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border">
        <h2 className="text-xs font-bold uppercase text-stone-500 mb-4">Floor Map (16 Tables)</h2>
        <div className="grid grid-cols-4 md:grid-cols-8 gap-3">
          {tables.map(t => {
            const ords = orders.filter(o => Number(o.tableNumber) === Number(t.id) && o.status !== 'completed');
            const hasReady = ords.some(o => o.status === 'ready');
            const hasPreparing = ords.some(o => o.status === 'preparing');
            const hasPending = ords.some(o => o.status === 'pending');

            const statusText = hasReady ? '🔔 READY!' : hasPreparing ? '👨‍🍳 Preparing' : hasPending ? '⏱️ Order Sent' : 'Empty';

            return (
              <div key={t.id} className={`p-3 rounded-2xl border text-center ${ords.length > 0 ? 'bg-amber-50 border-amber-400 font-bold' : 'bg-stone-50 border-stone-200'}`}>
                <p className="text-xs">{t.name}</p>
                <p className="text-[10px] mt-1 capitalize text-stone-500">{statusText}</p>
                {ords.length > 0 && <span className="text-[9px] bg-amber-200 text-amber-900 px-1.5 py-0.2 rounded font-extrabold">{ords.length} Active Orders</span>}
              </div>
            );
          })}
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border space-y-4">
        <h2 className="text-xs font-bold uppercase text-stone-500">Active Orders ({activeOrders.length})</h2>
        {activeOrders.length === 0 ? (
          <p className="text-stone-400 text-xs py-4 text-center">No active table orders. Waiting for QR scans...</p>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {activeOrders.map(ord => (
              <div key={ord.id} className="bg-stone-50 p-4 rounded-2xl border flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex justify-between items-center font-black text-sm">
                    <span>Table {ord.tableNumber}</span>
                    <span className="text-[10px] text-stone-400 font-mono">#{ord.id}</span>
                  </div>
                  <div className="mt-1 flex justify-between items-center">
                    <span className="text-xs text-amber-600 font-bold uppercase">{ord.status}</span>
                    <span className="text-[10px] text-stone-500">{formatPrice(ord.totalAmount)}</span>
                  </div>
                  <div className="mt-2 text-xs space-y-1 border-t pt-2">
                    {ord.items.map((i, idx) => (
                      <div key={idx} className="flex justify-between">
                        <span>{i.quantity}x {i.name}</span>
                        <span>{formatPrice(i.price * i.quantity)}</span>
                      </div>
                    ))}
                  </div>
                </div>
                <div className="flex gap-2">
                  {ord.status === 'ready' && (
                    <button onClick={() => store.updateOrderStatus(ord.id, 'served')} className="flex-1 py-2 bg-emerald-600 text-white font-bold text-xs rounded-xl shadow">
                      Mark Served
                    </button>
                  )}
                  <button onClick={() => store.updateOrderStatus(ord.id, 'completed')} className="flex-1 py-2 bg-stone-800 text-white font-bold text-xs rounded-xl">
                    Clear Order
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// --- Kitchen Display System Component ---
function KitchenDisplay() {
  const [orders, setOrders] = useState(store.getOrders());

  useEffect(() => {
    const update = () => setOrders(store.getOrders());
    store.addEventListener('state-changed', update);
    update();
    return () => store.removeEventListener('state-changed', update);
  }, []);

  const kitchenOrders = orders.filter(o => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready');

  return (
    <div className="min-h-screen bg-stone-950 text-white p-6 max-w-7xl mx-auto space-y-6">
      <div className="flex justify-between items-center border-b border-stone-800 pb-4">
        <div>
          <div className="flex items-center gap-2">
            <span className="w-3 h-3 rounded-full bg-emerald-400 animate-pulse" />
            <h1 className="text-xl font-bold text-amber-400">Kitchen Display System (KDS)</h1>
          </div>
          <p className="text-xs text-stone-400 mt-0.5">Direct Supabase Realtime Postgres Stream</p>
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => store.fetchOrdersFromSupabase()}
            className="bg-stone-900 hover:bg-stone-800 border border-stone-800 text-stone-300 text-xs font-bold px-3 py-1.5 rounded-xl flex items-center gap-1.5"
          >
            <span>🔄 Force Sync</span>
          </button>
          <span className="text-xs bg-stone-900 border border-stone-800 px-3 py-1.5 rounded-full">{kitchenOrders.length} Active Orders</span>
        </div>
      </div>

      {kitchenOrders.length === 0 ? (
        <div className="text-center py-24 text-stone-500">
          <div className="text-5xl mb-3">👨‍🍳</div>
          <h2 className="text-lg font-bold text-stone-300">Kitchen is clear!</h2>
          <p className="text-xs mt-1 text-stone-500">Scanning any QR code on a mobile phone will show incoming orders here live.</p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {kitchenOrders.map(ord => (
            <div key={ord.id} className="bg-stone-900 border-2 border-stone-800 p-5 rounded-3xl flex flex-col justify-between space-y-4 shadow-2xl">
              <div>
                <div className="flex justify-between items-start border-b border-stone-800 pb-3">
                  <div>
                    <span className="text-2xl font-black text-amber-400">Table {ord.tableNumber}</span>
                    <p className="text-[10px] text-stone-400 font-mono mt-0.5">Order #{ord.id}</p>
                  </div>
                  <span className="text-xs uppercase bg-amber-500/20 text-amber-400 font-bold px-2.5 py-1 rounded-full">{ord.status}</span>
                </div>
                <div className="py-3 space-y-2">
                  {ord.items.map((i, idx) => (
                    <div key={idx} className="bg-stone-800 p-2 rounded-xl text-xs flex justify-between font-bold">
                      <span>{i.quantity}x {i.name}</span>
                      <span className="text-stone-400">{formatPrice(i.price * i.quantity)}</span>
                    </div>
                  ))}
                </div>
                {ord.specialNote && (
                  <p className="text-xs bg-amber-500/10 text-amber-300 p-2 rounded-xl border border-amber-500/20">
                    Note: {ord.specialNote}
                  </p>
                )}
              </div>

              <div>
                {ord.status === 'pending' && (
                  <button onClick={() => store.updateOrderStatus(ord.id, 'preparing')} className="w-full py-3 bg-amber-500 text-stone-950 font-black text-xs uppercase rounded-2xl shadow">
                    🔥 Start Preparing
                  </button>
                )}
                {ord.status === 'preparing' && (
                  <button onClick={() => store.updateOrderStatus(ord.id, 'ready')} className="w-full py-3 bg-emerald-500 text-stone-950 font-black text-xs uppercase rounded-2xl shadow">
                    🔔 Mark Ready for Pickup
                  </button>
                )}
                {ord.status === 'ready' && (
                  <button onClick={() => store.updateOrderStatus(ord.id, 'completed')} className="w-full py-3 bg-stone-800 text-stone-300 font-bold text-xs uppercase rounded-2xl">
                    ✅ Complete Order
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// --- Admin Panel Component ---
function AdminPanel({ onOpenPrintQr }) {
  const [menuItems, setMenuItems] = useState(store.getMenuItems());
  const [categories] = useState(store.getCategories());
  const [editingItem, setEditingItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);
  const [selectedImageUrl, setSelectedImageUrl] = useState("");

  useEffect(() => {
    const update = () => setMenuItems(store.getMenuItems());
    store.addEventListener('state-changed', update);
    return () => store.removeEventListener('state-changed', update);
  }, []);

  const handleOpenForm = (item = null) => {
    setEditingItem(item);
    setSelectedImageUrl(item ? item.image : PRESET_IMAGES[0].url);
    setIsFormOpen(true);
  };

  const handleSaveItem = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const itemData = {
      id: editingItem ? editingItem.id : undefined,
      name: formData.get('name'),
      category: formData.get('category'),
      price: Number(formData.get('price')),
      description: formData.get('description'),
      image: selectedImageUrl || formData.get('image'),
      isPopular: formData.get('isPopular') === 'on',
      inStock: formData.get('inStock') === 'on'
    };
    store.saveMenuItem(itemData);
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id) => {
    if (confirm("Are you sure you want to delete this food item?")) {
      store.deleteMenuItem(id);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 p-4 md:p-8 max-w-6xl mx-auto space-y-6">
      <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
        <div>
          <h1 className="text-2xl font-black text-stone-900">Admin Control Panel</h1>
          <p className="text-xs text-stone-500 mt-0.5">Manage Food Items, Upload/Select Images & Printable QR Cards</p>
        </div>

        <div className="flex gap-2">
          <button
            onClick={onOpenPrintQr}
            className="bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs px-4 py-2.5 rounded-2xl shadow transition"
          >
            🖨️ Printable QR Cards
          </button>
          
          <button
            onClick={() => handleOpenForm(null)}
            className="bg-stone-900 hover:bg-stone-800 text-white font-extrabold text-xs px-4 py-2.5 rounded-2xl shadow transition"
          >
            + Add Food Item
          </button>
        </div>
      </div>

      <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 space-y-4">
        <div className="flex justify-between items-center">
          <h2 className="text-xs font-black uppercase tracking-wider text-stone-500">Café Food Menu ({menuItems.length} Items)</h2>
        </div>

        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 font-bold uppercase">
                <th className="py-3 px-2">Food Image & Name</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Price</th>
                <th className="py-3 px-2">Stock Status</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {menuItems.map(item => (
                <tr key={item.id} className="hover:bg-stone-50">
                  <td className="py-3 px-2 flex items-center gap-3">
                    <img src={item.image} alt={item.name} className="w-12 h-12 rounded-xl object-cover border border-stone-200 flex-shrink-0" />
                    <div>
                      <p className="font-bold text-stone-900 text-xs">{item.name}</p>
                      {item.isPopular && <span className="text-[9px] bg-amber-100 text-amber-800 font-bold px-1.5 py-0.2 rounded">⭐ Popular</span>}
                    </div>
                  </td>
                  <td className="py-3 px-2 capitalize font-semibold text-stone-600">{item.category}</td>
                  <td className="py-3 px-2 font-black text-stone-900">{formatPrice(item.price)}</td>
                  <td className="py-3 px-2">
                    <button
                      onClick={() => store.toggleStockStatus(item.id)}
                      className={`px-3 py-1 rounded-full text-[10px] font-bold uppercase transition ${
                        item.inStock ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 'bg-rose-100 text-rose-800 border border-rose-300'
                      }`}
                    >
                      {item.inStock ? 'In Stock' : 'Out of Stock'}
                    </button>
                  </td>
                  <td className="py-3 px-2 text-right space-x-3">
                    <button onClick={() => handleOpenForm(item)} className="text-amber-700 font-bold hover:underline">Edit</button>
                    <button onClick={() => handleDeleteItem(item.id)} className="text-rose-600 font-bold hover:underline">Delete</button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Food Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveItem} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4 max-h-[90vh] overflow-y-auto">
            <div className="flex justify-between items-center border-b pb-3">
              <h3 className="font-bold text-stone-900 text-base">{editingItem ? 'Edit Food Item' : 'Add New Food Item'}</h3>
              <button type="button" onClick={() => setIsFormOpen(false)} className="text-stone-400">✕</button>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Item Name</label>
              <input name="name" defaultValue={editingItem?.name} required placeholder="e.g. Hazelnut Frappe" className="w-full bg-stone-50 border rounded-xl p-2.5 text-xs font-bold" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Category</label>
                <select name="category" defaultValue={editingItem?.category || 'coffee'} className="w-full bg-stone-50 border rounded-xl p-2.5 text-xs font-bold capitalize">
                  {categories.filter(c => c.id !== 'all').map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Price (৳)</label>
                <input type="number" name="price" defaultValue={editingItem?.price} required placeholder="250" className="w-full bg-stone-50 border rounded-xl p-2.5 text-xs font-bold" />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-xs font-bold text-stone-700 block">Food Image URL</label>
              <input
                type="url"
                name="image"
                value={selectedImageUrl}
                onChange={e => setSelectedImageUrl(e.target.value)}
                placeholder="https://images.unsplash.com/..."
                required
                className="w-full bg-stone-50 border rounded-xl p-2.5 text-xs font-mono"
              />

              <div>
                <span className="text-[10px] font-bold text-stone-500 block mb-1">Quick Select Preset Image:</span>
                <div className="flex gap-1.5 overflow-x-auto pb-1">
                  {PRESET_IMAGES.map((preset, idx) => (
                    <button
                      key={idx}
                      type="button"
                      onClick={() => setSelectedImageUrl(preset.url)}
                      className={`px-2.5 py-1 rounded-lg text-[10px] font-bold whitespace-nowrap border transition ${
                        selectedImageUrl === preset.url ? 'bg-amber-500 text-stone-950 border-amber-500' : 'bg-stone-100 text-stone-700 border-stone-200'
                      }`}
                    >
                      {preset.label}
                    </button>
                  ))}
                </div>
              </div>

              {selectedImageUrl && (
                <div className="flex items-center gap-3 bg-stone-50 p-2 rounded-xl border border-stone-200">
                  <img src={selectedImageUrl} className="w-16 h-16 rounded-lg object-cover" alt="Preview" />
                  <span className="text-[11px] text-stone-500 italic">Image Preview</span>
                </div>
              )}
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Description</label>
              <textarea name="description" defaultValue={editingItem?.description} rows="2" placeholder="Item description and ingredients..." className="w-full bg-stone-50 border rounded-xl p-2.5 text-xs" />
            </div>

            <div className="flex gap-4 text-xs font-bold text-stone-700 pt-2 border-t">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" name="inStock" defaultChecked={editingItem ? editingItem.inStock : true} />
                <span>In Stock</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" name="isPopular" defaultChecked={editingItem?.isPopular} />
                <span>Mark Popular ⭐</span>
              </label>
            </div>

            <div className="pt-3 border-t flex gap-3">
              <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-3 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-3 bg-stone-900 text-white font-extrabold text-xs rounded-xl shadow">
                Save Food Item
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// --- Printable QR Stand Cards Modal ---
function QrPrintModal({ onClose }) {
  const tables = Array.from({ length: 16 }, (_, i) => i + 1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/80 z-50 overflow-y-auto p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center pb-4 border-b no-print">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Printable QR Table Stand Cards</h2>
            <p className="text-xs text-stone-500">Vector QR codes generated locally. Ready to print.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="bg-amber-500 text-stone-950 font-black text-xs px-5 py-2.5 rounded-xl shadow">
              🖨️ Print Stand Cards Now
            </button>
            <button onClick={onClose} className="bg-stone-200 text-stone-800 font-bold text-xs px-3 py-2 rounded-xl">
              Close
            </button>
          </div>
        </div>

        <div id="printable-qr-section" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {tables.map(tblNum => {
            const tableUrl = `${window.location.origin}${window.location.pathname}?table=${tblNum}`;
            return (
              <div key={tblNum} className="border-2 border-stone-900 rounded-3xl p-6 text-center bg-white flex flex-col items-center justify-between space-y-4 shadow-sm page-break-inside-avoid">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-950 font-black text-lg flex items-center justify-center mx-auto mb-1">
                    ☕
                  </div>
                  <h3 className="font-black text-stone-900 text-base">{CAFE_INFO.name}</h3>
                  <p className="text-[10px] text-stone-500">Scan QR Code to View Menu & Order</p>
                </div>

                <div className="p-2 border border-stone-200 rounded-2xl bg-white">
                  <QrCodeSvg value={tableUrl} size={150} />
                </div>

                <div>
                  <span className="inline-block bg-stone-900 text-amber-400 font-black text-lg px-4 py-1 rounded-xl tracking-wider">
                    TABLE {tblNum}
                  </span>
                  <p className="text-[9px] text-stone-400 mt-1">No App or Login Required</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}

// --- SINGLE PASSCODE AUTO-ROLE DETECTION MODAL ---
function StaffAuthModal({ onClose, onAuthenticated }) {
  const [passcode, setPasscode] = useState('');
  const [error, setError] = useState(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    const detectedRole = PASSCODE_ROLES[passcode.trim()];
    if (detectedRole) {
      onAuthenticated(detectedRole);
    } else {
      setError(true);
      setPasscode('');
    }
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-3xl max-w-sm w-full p-6 shadow-2xl space-y-4">
        <div className="flex justify-between items-center border-b pb-3">
          <div className="flex items-center gap-2">
            <span className="text-xl">🔒</span>
            <h3 className="font-bold text-stone-900 text-sm">Staff Portal Login</h3>
          </div>
          <button onClick={onClose} className="text-stone-400">✕</button>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-stone-700 block mb-1">Enter Staff Passcode</label>
            <input
              type="password"
              maxLength="4"
              value={passcode}
              onChange={e => { setPasscode(e.target.value); setError(false); }}
              placeholder="••••"
              required
              autoFocus
              className={`w-full text-center text-2xl font-mono tracking-widest bg-stone-50 border rounded-xl p-3 focus:outline-none ${
                error ? 'border-rose-500 bg-rose-50' : 'focus:border-amber-500'
              }`}
            />
            {error && <p className="text-[10px] text-rose-600 font-bold mt-1 text-center">Invalid Passcode! Try again.</p>}
          </div>

          <div className="flex gap-2 pt-2">
            <button type="button" onClick={onClose} className="flex-1 py-2.5 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl">
              Cancel
            </button>
            <button type="submit" className="flex-1 py-2.5 bg-stone-900 text-white font-extrabold text-xs rounded-xl shadow">
              Unlock Panel
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

// --- Main Root App Component ---
function App() {
  const [activeRole, setActiveRole] = useState("customer");
  const [authenticatedStaffRole, setAuthenticatedStaffRole] = useState(null);
  const [isAuthOpen, setIsAuthOpen] = useState(false);
  const [activeTable, setActiveTable] = useState(null);
  const [isPrintQrOpen, setIsPrintQrOpen] = useState(false);

  useEffect(() => {
    const params = new URLSearchParams(window.location.search);
    const tbl = params.get('table');
    if (tbl) setActiveTable(Number(tbl));
  }, []);

  const handleStaffAuthenticated = (role) => {
    setAuthenticatedStaffRole(role);
    setActiveRole(role);
    setIsAuthOpen(false);
  };

  const handleLogoutStaff = () => {
    setAuthenticatedStaffRole(null);
    setActiveRole("customer");
  };

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {authenticatedStaffRole ? (
        <header className="bg-stone-950 text-stone-300 border-b border-stone-800 sticky top-0 z-50 p-2">
          <div className="max-w-7xl mx-auto flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-white text-xs">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
              <span>Staff Mode: <strong className="uppercase text-amber-400">{authenticatedStaffRole}</strong></span>
            </div>

            <div className="flex gap-1 bg-stone-900 p-1 rounded-xl border border-stone-800 text-xs">
              <button
                onClick={() => setActiveRole('waiter')}
                className={`px-3 py-1 rounded-lg font-bold capitalize ${activeRole === 'waiter' ? 'bg-amber-500 text-stone-950' : 'text-stone-400'}`}
              >
                Waiter
              </button>
              <button
                onClick={() => setActiveRole('kitchen')}
                className={`px-3 py-1 rounded-lg font-bold capitalize ${activeRole === 'kitchen' ? 'bg-amber-500 text-stone-950' : 'text-stone-400'}`}
              >
                Kitchen
              </button>
              <button
                onClick={() => setActiveRole('admin')}
                className={`px-3 py-1 rounded-lg font-bold capitalize ${activeRole === 'admin' ? 'bg-amber-500 text-stone-950' : 'text-stone-400'}`}
              >
                Admin
              </button>
              <button
                onClick={handleLogoutStaff}
                className="px-3 py-1 rounded-lg font-bold text-rose-400 hover:bg-rose-500/20"
              >
                🔒 Lock Staff Mode
              </button>
            </div>
          </div>
        </header>
      ) : null}

      <main className="flex-1">
        {activeRole === "customer" && (
          <CustomerMenu
            activeTable={activeTable}
            onSelectTable={t => setActiveTable(t)}
            onOpenStaffAuth={() => setIsAuthOpen(true)}
          />
        )}
        {activeRole === "waiter" && <WaiterDashboard />}
        {activeRole === "kitchen" && <KitchenDisplay />}
        {activeRole === "admin" && <AdminPanel onOpenPrintQr={() => setIsPrintQrOpen(true)} />}
      </main>

      {isAuthOpen && (
        <StaffAuthModal
          onClose={() => setIsAuthOpen(false)}
          onAuthenticated={handleStaffAuthenticated}
        />
      )}

      {isPrintQrOpen && (
        <QrPrintModal onClose={() => setIsPrintQrOpen(false)} />
      )}
    </div>
  );
}

ReactDOM.createRoot(document.getElementById('root')).render(<App />);
