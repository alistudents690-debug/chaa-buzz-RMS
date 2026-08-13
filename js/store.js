// Chaa Buzz Cafe State Manager & Realtime Bus Engine
import { INITIAL_MENU_ITEMS, INITIAL_CATEGORIES, INITIAL_TABLES } from './data.js';

const STORAGE_KEYS = {
  MENU: 'chaa_buzz_menu',
  CATEGORIES: 'chaa_buzz_categories',
  ORDERS: 'chaa_buzz_orders',
  TABLES: 'chaa_buzz_tables',
  CART: 'chaa_buzz_cart',
  ACTIVE_TABLE: 'chaa_buzz_active_table'
};

class Store extends EventTarget {
  constructor() {
    super();
    this.broadcast = new BroadcastChannel('chaa_buzz_realtime');
    
    // Initialize Local Storage if missing
    this.initStorage();

    // Listen for broadcast messages from other tabs (Customer <-> Kitchen <-> Waiter <-> Admin)
    this.broadcast.onmessage = (event) => {
      if (event.data && event.data.type) {
        this.dispatchEvent(new CustomEvent('state-changed', { detail: event.data }));
        this.dispatchEvent(new CustomEvent(event.data.type, { detail: event.data.payload }));
      }
    };

    // Also listen to storage events across windows
    window.addEventListener('storage', (e) => {
      this.dispatchEvent(new CustomEvent('state-changed', { detail: { key: e.key } }));
    });
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
      // Demo active orders to give a lively initial view
      const demoOrders = [
        {
          id: "ORD-101",
          tableNumber: 7,
          items: [
            { id: "m1", name: "Special Matka Milk Chaa", price: 60, quantity: 2, note: "Extra Malai" },
            { id: "m7", name: "Smokey Buzz Chicken Burger", price: 320, quantity: 1, note: "Less spicy" },
            { id: "m14", name: "Loaded Buzz Fries", price: 190, quantity: 1, note: "" }
          ],
          totalAmount: 630,
          specialNote: "Please serve tea first",
          status: "pending", // "pending" | "preparing" | "ready" | "served" | "completed"
          createdAt: new Date(Date.now() - 4 * 60000).toISOString(), // 4 mins ago
          updatedAt: new Date(Date.now() - 4 * 60000).toISOString()
        },
        {
          id: "ORD-102",
          tableNumber: 3,
          items: [
            { id: "m4", name: "Hazelnut Cappuccino", price: 240, quantity: 1, note: "" },
            { id: "m11", name: "Belgian Chocolate Lava Cake", price: 260, quantity: 1, note: "Warm ice cream" }
          ],
          totalAmount: 500,
          specialNote: "",
          status: "preparing",
          createdAt: new Date(Date.now() - 9 * 60000).toISOString(),
          updatedAt: new Date(Date.now() - 2 * 60000).toISOString()
        }
      ];
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(demoOrders));
    }
    if (!localStorage.getItem(STORAGE_KEYS.CART)) {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify([]));
    }
  }

  notify(type, payload) {
    const data = { type, payload, timestamp: Date.now() };
    this.broadcast.postMessage(data);
    this.dispatchEvent(new CustomEvent('state-changed', { detail: data }));
    this.dispatchEvent(new CustomEvent(type, { detail: payload }));
  }

  // --- Menu Data API ---
  getMenuItems() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.MENU)) || [];
    } catch {
      return INITIAL_MENU_ITEMS;
    }
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
    this.notify('menu-updated', items);
  }

  deleteMenuItem(id) {
    let items = this.getMenuItems();
    items = items.filter(i => i.id !== id);
    localStorage.setItem(STORAGE_KEYS.MENU, JSON.stringify(items));
    this.notify('menu-updated', items);
  }

  // --- Categories API ---
  getCategories() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CATEGORIES)) || INITIAL_CATEGORIES;
    } catch {
      return INITIAL_CATEGORIES;
    }
  }

  saveCategory(cat) {
    const categories = this.getCategories();
    const existingIdx = categories.findIndex(c => c.id === cat.id);
    if (existingIdx >= 0) {
      categories[existingIdx] = cat;
    } else {
      categories.push(cat);
    }
    localStorage.setItem(STORAGE_KEYS.CATEGORIES, JSON.stringify(categories));
    this.notify('categories-updated', categories);
  }

  // --- Tables API ---
  getTables() {
    try {
      const tables = JSON.parse(localStorage.getItem(STORAGE_KEYS.TABLES)) || INITIAL_TABLES;
      const orders = this.getOrders();
      // Sync active order statuses with table
      return tables.map(t => {
        const activeOrder = orders.find(o => Number(o.tableNumber) === Number(t.id) && o.status !== 'completed');
        return {
          ...t,
          status: activeOrder ? (activeOrder.status === 'pending' ? 'order-pending' : activeOrder.status) : 'available',
          activeOrderId: activeOrder ? activeOrder.id : null
        };
      });
    } catch {
      return INITIAL_TABLES;
    }
  }

  // --- Orders API ---
  getOrders() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.ORDERS)) || [];
    } catch {
      return [];
    }
  }

  createOrder({ tableNumber, items, specialNote = "" }) {
    const orders = this.getOrders();
    const newOrderNumber = orders.length + 101;
    const totalAmount = items.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    
    const newOrder = {
      id: `ORD-${newOrderNumber}`,
      tableNumber: Number(tableNumber),
      items,
      totalAmount,
      specialNote,
      status: 'pending', // pending -> preparing -> ready -> served -> completed
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString()
    };

    orders.unshift(newOrder);
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
    
    // Play Kitchen Bell Sound
    this.playBellSound();

    this.notify('order-created', newOrder);
    return newOrder;
  }

  updateOrderStatus(orderId, status) {
    const orders = this.getOrders();
    const order = orders.find(o => o.id === orderId);
    if (order) {
      order.status = status;
      order.updatedAt = new Date().toISOString();
      localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(orders));
      
      if (status === 'ready') {
        this.playBellSound('ready');
      }

      this.notify('order-status-changed', order);
    }
  }

  clearTable(tableNumber) {
    const orders = this.getOrders();
    const updatedOrders = orders.map(o => {
      if (Number(o.tableNumber) === Number(tableNumber) && o.status !== 'completed') {
        return { ...o, status: 'completed', updatedAt: new Date().toISOString() };
      }
      return o;
    });
    localStorage.setItem(STORAGE_KEYS.ORDERS, JSON.stringify(updatedOrders));
    this.notify('table-cleared', { tableNumber });
  }

  // --- Customer Cart API ---
  getCart() {
    try {
      return JSON.parse(localStorage.getItem(STORAGE_KEYS.CART)) || [];
    } catch {
      return [];
    }
  }

  setCart(cart) {
    localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart));
    this.notify('cart-updated', cart);
  }

  addToCart(item, note = "") {
    const cart = this.getCart();
    const existing = cart.find(c => c.id === item.id && c.note === note);
    if (existing) {
      existing.quantity += 1;
    } else {
      cart.push({
        id: item.id,
        name: item.name,
        price: item.price,
        image: item.image,
        quantity: 1,
        note: note
      });
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

  // --- Sound Synthesizer (Web Audio API) ---
  playBellSound(type = 'new-order') {
    try {
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) return;
      const ctx = new AudioContext();

      if (type === 'new-order') {
        // High alert double chime (E5 + G5)
        const notes = [659.25, 783.99];
        notes.forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.2, ctx.currentTime + idx * 0.15);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.15 + 0.6);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.15);
          osc.stop(ctx.currentTime + idx * 0.15 + 0.6);
        });
      } else if (type === 'ready') {
        // Pleasant double ding (C5 + C6)
        [523.25, 1046.50].forEach((freq, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.value = freq;
          gain.gain.setValueAtTime(0.25, ctx.currentTime + idx * 0.12);
          gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + idx * 0.12 + 0.8);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(ctx.currentTime + idx * 0.12);
          osc.stop(ctx.currentTime + idx * 0.12 + 0.8);
        });
      }
    } catch (e) {
      console.log('Audio playback prevented or unsupported:', e);
    }
  }
}

export const store = new Store();
