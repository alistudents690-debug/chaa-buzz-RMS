// Store Class Module - Shared state manager & Realtime Cloud Sync
const STORAGE_KEYS = {
  MENU: 'chaa_buzz_menu',
  CATEGORIES: 'chaa_buzz_categories',
  ORDERS: 'chaa_buzz_orders',
  TABLES: 'chaa_buzz_tables',
  CART: 'chaa_buzz_cart'
};

const SYNC_TOPIC = "chaa_buzz_cafe_orders_v5";
const NTFY_RELAY = `https://ntfy.sh/${SYNC_TOPIC}`;

const SUPABASE_URL = "https://umnbgjhhcvmkcdibmsdr.supabase.co";
const SUPABASE_KEY = "sb_publishable_CdBFJUtArtuAyveQue5aQQ_UnkXlRkt";
const supabase = (window.supabase && window.supabase.createClient) 
  ? window.supabase.createClient(SUPABASE_URL, SUPABASE_KEY) 
  : null;

class Store extends EventTarget {
  constructor() {
    super();
    this.broadcast = new BroadcastChannel('chaa_buzz_realtime');
    this.initStorage();

    this.broadcast.onmessage = (event) => {
      if (event.data) {
        this.dispatchEvent(new CustomEvent('state-changed', { detail: event.data }));
      }
    };
    window.addEventListener('storage', () => {
      this.dispatchEvent(new CustomEvent('state-changed'));
    });

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
        const existingOrders = this.getOrders();
        const mapped = dbOrders.map(o => {
          const existing = existingOrders.find(e => e.id === o.id);
          const fetchedItems = (o.order_items || []).map(i => ({
            name: i.name,
            price: Number(i.price),
            quantity: i.quantity,
            note: i.note || ''
          }));

          return {
            id: o.id,
            tableNumber: o.table_number,
            totalAmount: Number(o.total_amount),
            specialNote: o.special_note || '',
            status: o.status,
            createdAt: o.created_at,
            items: fetchedItems.length > 0 ? fetchedItems : (existing ? existing.items : [])
          };
        });

        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(mapped));
        this.notify('orders-loaded');
      }
    } catch (err) {}
  }

  async fetchSingleOrderFromSupabase(orderId, retryCount = 0) {
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
        const fetchedItems = (o.order_items || []).map(i => ({
          name: i.name,
          price: Number(i.price),
          quantity: i.quantity,
          note: i.note || ''
        }));

        if (fetchedItems.length === 0 && retryCount < 2) {
          setTimeout(() => this.fetchSingleOrderFromSupabase(orderId, retryCount + 1), 500);
          return;
        }

        const existingOrder = this.getOrders().find(ord => ord.id === o.id);
        const mappedOrder = {
          id: o.id,
          tableNumber: o.table_number,
          totalAmount: Number(o.total_amount),
          specialNote: o.special_note || '',
          status: o.status,
          createdAt: o.created_at,
          items: fetchedItems.length > 0 ? fetchedItems : (existingOrder ? existingOrder.items : [])
        };

        this.applyIncomingSync({ type: 'order-created', data: mappedOrder });
      }
    } catch (err) {}
  }

  applyIncomingSync(payload) {
    if (!payload || !payload.type) return;

    if (payload.type === 'order-created') {
      const orders = this.getOrders();
      const idx = orders.findIndex(o => o.id === payload.data.id);
      if (idx >= 0) {
        orders[idx].status = payload.data.status || orders[idx].status;
        if (payload.data.items && payload.data.items.length > 0) {
          orders[idx].items = payload.data.items;
        }
      } else {
        orders.unshift(payload.data);
      }
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      this.playBellSound('new');
      this.notify('order-created', payload.data);
    } else if (payload.type === 'order-updated') {
      const orders = this.getOrders();
      const idx = orders.findIndex(o => o.id === payload.data.id);
      if (idx >= 0) {
        orders[idx] = { ...orders[idx], ...payload.data };
        localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
        if (payload.data.status === 'ready') this.playBellSound('ready');
        this.notify('order-updated', orders[idx]);
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

  async createOrder({ tableNumber, items, specialNote = "" }) {
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
    
    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    this.playBellSound('new');
    this.notify('order-created', newOrder);
    this.publishCrossDevice('order-created', newOrder);

    if (supabase) {
      try {
        await supabase
          .from('orders')
          .insert([{
            id: newOrderId,
            table_number: Number(tableNumber),
            total_amount: totalAmount,
            special_note: specialNote || '',
            status: 'pending'
          }]);

        const orderItemsPayload = items.map(item => ({
          order_id: newOrderId,
          item_id: item.id || null,
          name: item.name,
          price: item.price,
          quantity: item.quantity,
          note: item.note || ''
        }));

        await supabase
          .from('order_items')
          .insert(orderItemsPayload);
      } catch (err) {}
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
