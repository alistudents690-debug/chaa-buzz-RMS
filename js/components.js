// Chaa Buzz Cafe UI Components - Customer, Waiter, Kitchen, Admin & Printable QR
import { store } from './store.js';
import { CAFE_INFO } from './data.js';

const { useState, useEffect, useMemo } = React;

// Helper function to format prices
const formatPrice = (amount) => `${CAFE_INFO.currency}${Number(amount).toLocaleString()}`;

// ====================================================================
// 1. CUSTOMER MENU COMPONENT
// ====================================================================
export function CustomerMenu({ activeTable, onSelectTable }) {
  const [menuItems, setMenuItems] = useState(store.getMenuItems());
  const [categories, setCategories] = useState(store.getCategories());
  const [selectedCategory, setSelectedCategory] = useState("all");
  const [searchQuery, setSearchQuery] = useState("");
  const [dietFilter, setDietFilter] = useState("all"); // "all", "veg", "non-veg"
  const [cart, setCart] = useState(store.getCart());
  const [isCartOpen, setIsCartOpen] = useState(false);
  const [specialNote, setSpecialNote] = useState("");
  const [activeOrder, setActiveOrder] = useState(null);
  const [selectedFood, setSelectedFood] = useState(null); // Detail modal
  const [itemNote, setItemNote] = useState("");
  const [isPlacingOrder, setIsPlacingOrder] = useState(false);

  useEffect(() => {
    const handleStoreChange = () => {
      setMenuItems(store.getMenuItems());
      setCategories(store.getCategories());
      setCart(store.getCart());
      
      // Check if current table has an active order
      if (activeTable) {
        const orders = store.getOrders();
        const currentActive = orders.find(
          o => Number(o.tableNumber) === Number(activeTable) && o.status !== 'completed'
        );
        setActiveOrder(currentActive || null);
      }
    };

    store.addEventListener('state-changed', handleStoreChange);
    handleStoreChange();

    return () => store.removeEventListener('state-changed', handleStoreChange);
  }, [activeTable]);

  // Filtered Menu Items
  const filteredItems = useMemo(() => {
    return menuItems.filter(item => {
      const matchesCategory = selectedCategory === "all" || item.category === selectedCategory;
      const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                            item.description.toLowerCase().includes(searchQuery.toLowerCase());
      const matchesDiet = dietFilter === "all" || 
                          (dietFilter === "veg" && item.isVeg) || 
                          (dietFilter === "non-veg" && !item.isVeg);
      return matchesCategory && matchesSearch && matchesDiet && item.inStock;
    });
  }, [menuItems, selectedCategory, searchQuery, dietFilter]);

  const cartTotal = useMemo(() => {
    return cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
  }, [cart]);

  const cartItemCount = useMemo(() => {
    return cart.reduce((sum, item) => sum + item.quantity, 0);
  }, [cart]);

  const handleAddToCart = (item, note = "") => {
    store.addToCart(item, note);
    setSelectedFood(null);
    setItemNote("");
  };

  const handlePlaceOrder = () => {
    if (!activeTable) {
      alert("No table detected! Please scan a table QR code or select a table.");
      return;
    }
    if (cart.length === 0) return;

    setIsPlacingOrder(true);
    setTimeout(() => {
      const newOrder = store.createOrder({
        tableNumber: activeTable,
        items: cart,
        specialNote: specialNote
      });
      store.clearCart();
      setIsCartOpen(false);
      setSpecialNote("");
      setIsPlacingOrder(false);
      setActiveOrder(newOrder);
    }, 600);
  };

  return (
    <div className="min-h-screen pb-28">
      {/* Top Banner & Header */}
      <div className="bg-stone-900 text-white pt-6 pb-8 px-4 rounded-b-3xl shadow-xl relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-r from-amber-600/20 to-amber-900/30 pointer-events-none" />
        <div className="max-w-4xl mx-auto relative z-10">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 rounded-2xl bg-amber-500 flex items-center justify-center text-stone-900 font-black text-2xl shadow-lg">
                ☕
              </div>
              <div>
                <h1 className="text-2xl font-bold tracking-tight">{CAFE_INFO.name}</h1>
                <p className="text-stone-400 text-xs tracking-wide">{CAFE_INFO.tagline}</p>
              </div>
            </div>

            {/* Locked Table Badge */}
            {activeTable ? (
              <div className="flex items-center gap-2 bg-amber-500/10 border border-amber-500/30 px-3.5 py-1.5 rounded-full text-amber-400 font-semibold text-sm">
                <span className="w-2.5 h-2.5 rounded-full bg-emerald-400 animate-pulse" />
                <span>Table {activeTable}</span>
              </div>
            ) : (
              <button 
                onClick={() => onSelectTable(1)} 
                className="bg-stone-800 hover:bg-stone-700 text-stone-300 text-xs px-3 py-1.5 rounded-xl border border-stone-700"
              >
                Select Demo Table
              </button>
            )}
          </div>

          {/* Search Bar & Diet Filters */}
          <div className="mt-6 flex flex-col md:flex-row gap-3">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="Search coffee, tea, burgers, pasta..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="w-full bg-stone-800/80 text-white placeholder-stone-400 text-sm rounded-2xl px-4 py-3 pl-11 border border-stone-700/80 focus:outline-none focus:border-amber-500 transition"
              />
              <span className="absolute left-4 top-3.5 text-stone-400">🔍</span>
            </div>

            <div className="flex gap-1.5 bg-stone-800/80 p-1 rounded-2xl border border-stone-700/80 self-start">
              {['all', 'veg', 'non-veg'].map((filter) => (
                <button
                  key={filter}
                  onClick={() => setDietFilter(filter)}
                  className={`px-3 py-2 rounded-xl text-xs font-medium capitalize transition ${
                    dietFilter === filter
                      ? 'bg-amber-500 text-stone-900 font-bold shadow'
                      : 'text-stone-400 hover:text-white'
                  }`}
                >
                  {filter === 'veg' ? '🌱 Veg' : filter === 'non-veg' ? '🍖 Non-Veg' : 'All Diets'}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Active Order Tracker Banner (If customer placed an order) */}
      {activeOrder && (
        <div className="max-w-4xl mx-auto px-4 -mt-4 mb-6 relative z-20">
          <div className="glass-panel p-5 rounded-2xl shadow-lg border border-amber-500/20 bg-amber-50/90">
            <div className="flex items-center justify-between mb-3">
              <div>
                <span className="text-xs font-semibold text-amber-700 tracking-wider uppercase">Order Status #{activeOrder.id}</span>
                <h3 className="font-bold text-stone-900 text-base">Your food is being prepared!</h3>
              </div>
              <span className={`px-3 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${
                activeOrder.status === 'pending' ? 'bg-amber-100 text-amber-800 border border-amber-300' :
                activeOrder.status === 'preparing' ? 'bg-blue-100 text-blue-800 border border-blue-300' :
                activeOrder.status === 'ready' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300 glow-amber' :
                'bg-stone-200 text-stone-700'
              }`}>
                {activeOrder.status === 'pending' ? '⏱️ Order Received' :
                 activeOrder.status === 'preparing' ? '👨‍🍳 Preparing' :
                 activeOrder.status === 'ready' ? '🔔 Ready to Serve!' : '✅ Served'}
              </span>
            </div>

            {/* Timeline Progress */}
            <div className="relative flex items-center justify-between mt-4 px-2">
              <div className="absolute left-0 top-1/2 -translate-y-1/2 w-full h-1 bg-stone-200 -z-0 rounded" />
              {['pending', 'preparing', 'ready', 'served'].map((step, idx) => {
                const statusOrder = ['pending', 'preparing', 'ready', 'served'];
                const currentIdx = statusOrder.indexOf(activeOrder.status);
                const isPassed = currentIdx >= idx;
                return (
                  <div key={step} className="flex flex-col items-center z-10">
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center text-xs font-bold transition ${
                      isPassed ? 'bg-amber-500 text-stone-900 shadow-md ring-4 ring-amber-100' : 'bg-stone-200 text-stone-500'
                    }`}>
                      {idx + 1}
                    </div>
                    <span className={`text-[10px] mt-1.5 font-semibold capitalize ${isPassed ? 'text-amber-800' : 'text-stone-400'}`}>
                      {step}
                    </span>
                  </div>
                );
              })}
            </div>

            <div className="mt-4 pt-3 border-t border-amber-200/60 flex items-center justify-between text-xs text-stone-600">
              <span>Items: {activeOrder.items.map(i => `${i.quantity}x ${i.name}`).join(', ')}</span>
              <span className="font-bold text-stone-900">{formatPrice(activeOrder.totalAmount)}</span>
            </div>
          </div>
        </div>
      )}

      {/* Category Pills Navigation */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`px-4 py-2.5 rounded-2xl text-xs font-semibold whitespace-nowrap transition-all duration-200 ${
                selectedCategory === cat.id
                  ? 'bg-amber-600 text-white shadow-md shadow-amber-600/20 scale-105'
                  : 'bg-white text-stone-600 hover:bg-stone-100 border border-stone-200'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
      </div>

      {/* Food Items Grid */}
      <div className="max-w-4xl mx-auto px-4 mt-6">
        {filteredItems.length === 0 ? (
          <div className="text-center py-16 bg-white rounded-3xl border border-stone-200 shadow-sm">
            <div className="text-4xl mb-2">🔍</div>
            <h3 className="font-bold text-stone-800 text-base">No items found</h3>
            <p className="text-xs text-stone-500 mt-1">Try resetting your search or filters</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="bg-white rounded-2xl p-4 border border-stone-200/80 shadow-sm food-card-hover flex gap-4 relative overflow-hidden"
              >
                {/* Diet Icon Indicator */}
                <span className={`absolute top-3 right-3 w-4 h-4 border flex items-center justify-center p-0.5 rounded ${
                  item.isVeg ? 'border-emerald-600' : 'border-rose-600'
                }`}>
                  <span className={`w-2 h-2 rounded-full ${item.isVeg ? 'bg-emerald-600' : 'bg-rose-600'}`} />
                </span>

                {/* Food Image */}
                <div 
                  onClick={() => setSelectedFood(item)}
                  className="w-24 h-24 rounded-xl overflow-hidden bg-stone-100 flex-shrink-0 cursor-pointer relative"
                >
                  <img
                    src={item.image}
                    alt={item.name}
                    className="w-full h-full object-cover hover:scale-110 transition duration-300"
                  />
                  {item.isPopular && (
                    <span className="absolute bottom-1 left-1 bg-amber-500 text-stone-900 text-[9px] font-bold px-1.5 py-0.5 rounded-md shadow">
                      ⭐ Popular
                    </span>
                  )}
                </div>

                {/* Food Details */}
                <div className="flex-1 flex flex-col justify-between pr-4">
                  <div>
                    <h3 
                      onClick={() => setSelectedFood(item)}
                      className="font-bold text-stone-900 text-sm hover:text-amber-600 transition cursor-pointer leading-tight"
                    >
                      {item.name}
                    </h3>
                    <p className="text-stone-500 text-xs mt-1 line-clamp-2 leading-relaxed">
                      {item.description}
                    </p>
                  </div>

                  <div className="flex items-center justify-between mt-3">
                    <span className="font-extrabold text-stone-900 text-base">
                      {formatPrice(item.price)}
                    </span>

                    <button
                      onClick={() => handleAddToCart(item)}
                      className="bg-stone-900 hover:bg-amber-600 text-white text-xs font-bold px-3.5 py-2 rounded-xl transition shadow flex items-center gap-1.5 active:scale-95"
                    >
                      <span>+ Add</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Floating Bottom Cart Bar */}
      {cartItemCount > 0 && (
        <div className="fixed bottom-6 left-0 right-0 z-40 px-4">
          <div className="max-w-xl mx-auto bg-stone-900 text-white rounded-2xl p-4 shadow-2xl border border-stone-700/80 flex items-center justify-between backdrop-blur-md">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-900 font-extrabold text-sm flex items-center justify-center">
                {cartItemCount}
              </div>
              <div>
                <p className="text-xs text-stone-400">Total Amount</p>
                <p className="font-bold text-lg text-white">{formatPrice(cartTotal)}</p>
              </div>
            </div>

            <button
              onClick={() => setIsCartOpen(true)}
              className="bg-amber-500 hover:bg-amber-400 text-stone-900 font-extrabold text-sm px-5 py-2.5 rounded-xl shadow-lg transition active:scale-95 flex items-center gap-2"
            >
              <span>View Cart & Order</span>
              <span>→</span>
            </button>
          </div>
        </div>
      )}

      {/* Food Detail Customization Modal */}
      {selectedFood && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full overflow-hidden shadow-2xl animate-in fade-in zoom-in-95 duration-200">
            <div className="relative h-48 bg-stone-100">
              <img src={selectedFood.image} alt={selectedFood.name} className="w-full h-full object-cover" />
              <button
                onClick={() => setSelectedFood(null)}
                className="absolute top-3 right-3 w-8 h-8 rounded-full bg-black/50 text-white flex items-center justify-center text-sm font-bold backdrop-blur"
              >
                ✕
              </button>
            </div>

            <div className="p-6">
              <div className="flex items-center justify-between">
                <h3 className="font-bold text-lg text-stone-900">{selectedFood.name}</h3>
                <span className="font-extrabold text-amber-600 text-lg">{formatPrice(selectedFood.price)}</span>
              </div>
              <p className="text-stone-500 text-xs mt-2 leading-relaxed">{selectedFood.description}</p>

              <div className="mt-4">
                <label className="text-xs font-bold text-stone-700 block mb-1">Special Instructions (Optional)</label>
                <input
                  type="text"
                  placeholder="e.g. Less sugar, extra ice, no onions"
                  value={itemNote}
                  onChange={(e) => setItemNote(e.target.value)}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl px-3 py-2 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>

              <div className="mt-6 flex gap-3">
                <button
                  onClick={() => setSelectedFood(null)}
                  className="flex-1 bg-stone-100 hover:bg-stone-200 text-stone-700 font-bold text-xs py-3 rounded-xl transition"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleAddToCart(selectedFood, itemNote)}
                  className="flex-1 bg-amber-500 hover:bg-amber-400 text-stone-900 font-extrabold text-xs py-3 rounded-xl shadow transition"
                >
                  Add to Order • {formatPrice(selectedFood.price)}
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Cart & Checkout Modal */}
      {isCartOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-end md:items-center justify-center p-0 md:p-4">
          <div className="bg-white rounded-t-3xl md:rounded-3xl max-w-lg w-full max-h-[85vh] flex flex-col overflow-hidden shadow-2xl animate-in slide-in-from-bottom duration-300">
            {/* Modal Header */}
            <div className="p-4 border-b border-stone-100 flex items-center justify-between bg-stone-50">
              <div className="flex items-center gap-2">
                <span className="text-lg">🛒</span>
                <div>
                  <h3 className="font-bold text-stone-900 text-sm">Your Order Summary</h3>
                  <p className="text-[11px] text-stone-500">Table {activeTable || 'Unspecified'}</p>
                </div>
              </div>
              <button
                onClick={() => setIsCartOpen(false)}
                className="w-8 h-8 rounded-full bg-stone-200 hover:bg-stone-300 text-stone-600 text-xs font-bold flex items-center justify-center"
              >
                ✕
              </button>
            </div>

            {/* Cart Items List */}
            <div className="p-4 overflow-y-auto flex-1 space-y-3">
              {cart.map((item, idx) => (
                <div key={idx} className="flex items-center justify-between bg-stone-50 p-3 rounded-2xl border border-stone-200/60">
                  <div className="flex items-center gap-3">
                    <img src={item.image} className="w-12 h-12 rounded-xl object-cover" />
                    <div>
                      <h4 className="font-bold text-stone-900 text-xs">{item.name}</h4>
                      {item.note && <p className="text-[10px] text-amber-700 italic">Note: {item.note}</p>}
                      <p className="text-xs text-stone-500 font-semibold">{formatPrice(item.price)}</p>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-white px-2 py-1 rounded-xl border border-stone-200">
                    <button
                      onClick={() => store.removeFromCart(item.id, item.note)}
                      className="w-6 h-6 rounded-lg bg-stone-100 hover:bg-stone-200 text-stone-800 text-xs font-bold"
                    >
                      -
                    </button>
                    <span className="text-xs font-bold text-stone-900 w-4 text-center">{item.quantity}</span>
                    <button
                      onClick={() => store.addToCart(item, item.note)}
                      className="w-6 h-6 rounded-lg bg-stone-900 text-white text-xs font-bold"
                    >
                      +
                    </button>
                  </div>
                </div>
              ))}

              <div className="mt-4">
                <label className="text-xs font-bold text-stone-700 block mb-1">Overall Kitchen Note (Optional)</label>
                <textarea
                  placeholder="e.g. Please bring drinks first, extra napkins"
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  rows="2"
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs focus:outline-none focus:border-amber-500"
                />
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 bg-stone-50 border-t border-stone-200 space-y-3">
              <div className="flex justify-between items-center text-xs text-stone-600">
                <span>Subtotal</span>
                <span>{formatPrice(cartTotal)}</span>
              </div>
              <div className="flex justify-between items-center text-xs text-stone-600">
                <span>Service & Tax</span>
                <span>Included</span>
              </div>
              <div className="flex justify-between items-center text-sm font-extrabold text-stone-900 pt-2 border-t border-stone-200">
                <span>Total Amount</span>
                <span className="text-amber-600 text-lg">{formatPrice(cartTotal)}</span>
              </div>

              <button
                onClick={handlePlaceOrder}
                disabled={isPlacingOrder}
                className="w-full bg-amber-500 hover:bg-amber-400 text-stone-900 font-extrabold py-3.5 rounded-2xl shadow-lg transition active:scale-95 flex items-center justify-center gap-2"
              >
                {isPlacingOrder ? (
                  <span>Sending to Kitchen...</span>
                ) : (
                  <>
                    <span>Confirm & Place Order</span>
                    <span>→</span>
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ====================================================================
// 2. WAITER DASHBOARD COMPONENT
// ====================================================================
export function WaiterDashboard() {
  const [tables, setTables] = useState(store.getTables());
  const [orders, setOrders] = useState(store.getOrders());
  const [menuItems] = useState(store.getMenuItems());
  const [selectedTableForOrder, setSelectedTableForOrder] = useState(null);
  const [manualCart, setManualCart] = useState([]);
  const [manualNote, setManualNote] = useState("");
  const [filterStatus, setFilterStatus] = useState("all");

  useEffect(() => {
    const handleStoreChange = () => {
      setTables(store.getTables());
      setOrders(store.getOrders());
    };
    store.addEventListener('state-changed', handleStoreChange);
    return () => store.removeEventListener('state-changed', handleStoreChange);
  }, []);

  const activeOrders = useMemo(() => {
    return orders.filter(o => o.status !== 'completed');
  }, [orders]);

  const handleMarkServed = (orderId) => {
    store.updateOrderStatus(orderId, 'served');
  };

  const handleClearTable = (tableNumber) => {
    if (confirm(`Clear Table ${tableNumber} and mark orders as completed?`)) {
      store.clearTable(tableNumber);
    }
  };

  const handleCreateManualOrder = () => {
    if (!selectedTableForOrder || manualCart.length === 0) return;
    store.createOrder({
      tableNumber: selectedTableForOrder,
      items: manualCart,
      specialNote: manualNote
    });
    setSelectedTableForOrder(null);
    setManualCart([]);
    setManualNote("");
  };

  return (
    <div className="min-h-screen bg-stone-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
          <div>
            <div className="flex items-center gap-2 text-xs font-bold text-amber-600 uppercase tracking-wider">
              <span>☕ Chaa Buzz Staff</span>
            </div>
            <h1 className="text-2xl font-bold text-stone-900 mt-1">Waiter Service Dashboard</h1>
          </div>

          <button
            onClick={() => setSelectedTableForOrder(1)}
            className="bg-stone-900 hover:bg-amber-600 text-white text-xs font-extrabold px-5 py-3 rounded-2xl shadow transition flex items-center gap-2"
          >
            <span>+ Create Manual Order</span>
          </button>
        </div>

        {/* Table Map Grid */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
          <h2 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-4">Floor Overview (16 Tables)</h2>
          <div className="grid grid-cols-2 sm:grid-cols-4 md:grid-cols-8 gap-3">
            {tables.map((tbl) => {
              const activeOrd = orders.find(o => Number(o.tableNumber) === Number(tbl.id) && o.status !== 'completed');
              const statusClass = 
                tbl.status === 'available' ? 'bg-stone-50 border-stone-200 text-stone-600' :
                tbl.status === 'order-pending' ? 'bg-amber-50 border-amber-400 text-amber-800 animate-pulse' :
                tbl.status === 'preparing' ? 'bg-blue-50 border-blue-400 text-blue-800' :
                tbl.status === 'ready' ? 'bg-emerald-100 border-emerald-500 text-emerald-900 font-bold glow-amber' :
                'bg-emerald-50 border-emerald-300 text-emerald-800';

              return (
                <div
                  key={tbl.id}
                  onClick={() => {
                    if (activeOrd) {
                      if (activeOrd.status === 'ready') handleMarkServed(activeOrd.id);
                    } else {
                      setSelectedTableForOrder(tbl.id);
                    }
                  }}
                  className={`p-3 rounded-2xl border text-center cursor-pointer transition hover:scale-105 ${statusClass}`}
                >
                  <p className="text-xs font-bold">{tbl.name}</p>
                  <p className="text-[10px] mt-1 capitalize font-medium">
                    {tbl.status === 'available' ? '🟢 Empty' :
                     tbl.status === 'order-pending' ? '⏱️ Order Sent' :
                     tbl.status === 'preparing' ? '👨‍🍳 Preparing' :
                     tbl.status === 'ready' ? '🔔 READY!' : '✅ Served'}
                  </p>
                </div>
              );
            })}
          </div>
        </div>

        {/* Active Orders List */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
          <div className="flex items-center justify-between mb-4">
            <h2 className="text-sm font-bold text-stone-800 uppercase tracking-wider">Active Table Orders</h2>
            <div className="flex gap-2">
              {['all', 'pending', 'preparing', 'ready', 'served'].map((st) => (
                <button
                  key={st}
                  onClick={() => setFilterStatus(st)}
                  className={`px-3 py-1 rounded-xl text-xs font-semibold capitalize ${
                    filterStatus === st ? 'bg-stone-900 text-white' : 'bg-stone-100 text-stone-600'
                  }`}
                >
                  {st}
                </button>
              ))}
            </div>
          </div>

          {activeOrders.length === 0 ? (
            <div className="text-center py-12 text-stone-400 text-xs font-medium">
              No active table orders at the moment.
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {activeOrders
                .filter(o => filterStatus === 'all' || o.status === filterStatus)
                .map((ord) => (
                  <div key={ord.id} className="bg-stone-50 rounded-2xl p-4 border border-stone-200 flex flex-col justify-between">
                    <div>
                      <div className="flex justify-between items-start">
                        <span className="font-black text-stone-900 text-lg">Table {ord.tableNumber}</span>
                        <span className={`text-[10px] font-extrabold px-2.5 py-1 rounded-full uppercase ${
                          ord.status === 'ready' ? 'bg-emerald-500 text-white animate-bounce' :
                          ord.status === 'preparing' ? 'bg-blue-500 text-white' :
                          ord.status === 'served' ? 'bg-stone-300 text-stone-800' :
                          'bg-amber-500 text-stone-900'
                        }`}>
                          {ord.status}
                        </span>
                      </div>

                      <div className="mt-3 space-y-1">
                        {ord.items.map((item, idx) => (
                          <div key={idx} className="flex justify-between text-xs text-stone-700">
                            <span>{item.quantity}x {item.name}</span>
                            <span className="font-semibold">{formatPrice(item.price * item.quantity)}</span>
                          </div>
                        ))}
                      </div>

                      {ord.specialNote && (
                        <p className="mt-2 text-[11px] text-amber-800 bg-amber-100/80 p-2 rounded-xl">
                          <strong>Note:</strong> {ord.specialNote}
                        </p>
                      )}
                    </div>

                    <div className="mt-4 pt-3 border-t border-stone-200 flex gap-2">
                      {ord.status === 'ready' && (
                        <button
                          onClick={() => handleMarkServed(ord.id)}
                          className="flex-1 bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-extrabold py-2.5 rounded-xl transition shadow"
                        >
                          ✓ Mark Served
                        </button>
                      )}
                      {ord.status === 'served' && (
                        <button
                          onClick={() => handleClearTable(ord.tableNumber)}
                          className="flex-1 bg-stone-800 hover:bg-stone-700 text-white text-xs font-extrabold py-2.5 rounded-xl transition"
                        >
                          Clear Table
                        </button>
                      )}
                      {ord.status !== 'ready' && ord.status !== 'served' && (
                        <button
                          onClick={() => handleClearTable(ord.tableNumber)}
                          className="flex-1 bg-stone-200 hover:bg-stone-300 text-stone-700 text-xs font-semibold py-2.5 rounded-xl transition"
                        >
                          Cancel Order
                        </button>
                      )}
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>

      {/* Manual Order Creation Modal */}
      {selectedTableForOrder && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-xl w-full p-6 shadow-2xl">
            <div className="flex justify-between items-center pb-4 border-b border-stone-100">
              <h3 className="font-bold text-stone-900 text-base">Manual Order for Table {selectedTableForOrder}</h3>
              <button onClick={() => setSelectedTableForOrder(null)} className="text-stone-400 hover:text-stone-600">✕</button>
            </div>

            <div className="py-4 space-y-4 max-h-[60vh] overflow-y-auto">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-2">Select Table</label>
                <select
                  value={selectedTableForOrder}
                  onChange={(e) => setSelectedTableForOrder(Number(e.target.value))}
                  className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-bold"
                >
                  {tables.map(t => (
                    <option key={t.id} value={t.id}>{t.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-2">Add Menu Items</label>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {menuItems.map(item => (
                    <div key={item.id} className="p-2.5 bg-stone-50 border border-stone-200 rounded-xl flex items-center justify-between">
                      <div>
                        <p className="text-xs font-bold text-stone-900">{item.name}</p>
                        <p className="text-[10px] text-stone-500">{formatPrice(item.price)}</p>
                      </div>
                      <button
                        onClick={() => setManualCart(prev => [...prev, { ...item, quantity: 1, note: '' }])}
                        className="bg-stone-900 text-white text-xs font-bold px-2.5 py-1 rounded-lg"
                      >
                        + Add
                      </button>
                    </div>
                  ))}
                </div>
              </div>

              {manualCart.length > 0 && (
                <div className="bg-amber-50 p-3 rounded-2xl border border-amber-200">
                  <h4 className="text-xs font-bold text-amber-900 mb-2">Selected Items:</h4>
                  {manualCart.map((item, idx) => (
                    <div key={idx} className="flex justify-between items-center text-xs py-1">
                      <span>{item.name}</span>
                      <span className="font-bold">{formatPrice(item.price)}</span>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="pt-4 border-t border-stone-100 flex gap-3">
              <button onClick={() => setSelectedTableForOrder(null)} className="flex-1 py-3 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl">
                Cancel
              </button>
              <button onClick={handleCreateManualOrder} className="flex-1 py-3 bg-amber-500 text-stone-900 font-extrabold text-xs rounded-xl shadow">
                Submit to Kitchen
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

// ====================================================================
// 3. KITCHEN DISPLAY SYSTEM (KDS) COMPONENT
// ====================================================================
export function KitchenDisplay() {
  const [orders, setOrders] = useState(store.getOrders());

  useEffect(() => {
    const handleStoreChange = () => {
      setOrders(store.getOrders());
    };
    store.addEventListener('state-changed', handleStoreChange);
    return () => store.removeEventListener('state-changed', handleStoreChange);
  }, []);

  const kitchenOrders = useMemo(() => {
    return orders.filter(o => o.status === 'pending' || o.status === 'preparing' || o.status === 'ready');
  }, [orders]);

  const handleStatusChange = (orderId, newStatus) => {
    store.updateOrderStatus(orderId, newStatus);
  };

  return (
    <div className="min-h-screen bg-stone-950 text-stone-100 p-4 md:p-8">
      {/* Header */}
      <div className="max-w-7xl mx-auto flex items-center justify-between pb-6 border-b border-stone-800">
        <div className="flex items-center gap-3">
          <div className="w-12 h-12 bg-amber-500 rounded-2xl flex items-center justify-center text-2xl font-black text-stone-950">
            🍳
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-tight text-white">Kitchen Display System (KDS)</h1>
            <p className="text-xs text-stone-400">Live Real-time Order Stream</p>
          </div>
        </div>

        <div className="flex items-center gap-4 text-xs font-semibold">
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2.5 h-2.5 rounded-full bg-rose-500 animate-pulse" />
            {kitchenOrders.filter(o => o.status === 'pending').length} Pending
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2.5 h-2.5 rounded-full bg-amber-500 animate-pulse" />
            {kitchenOrders.filter(o => o.status === 'preparing').length} Preparing
          </span>
        </div>
      </div>

      {/* Orders Stream Cards */}
      <div className="max-w-7xl mx-auto mt-6">
        {kitchenOrders.length === 0 ? (
          <div className="text-center py-24 text-stone-500">
            <div className="text-5xl mb-3">👨‍🍳</div>
            <h2 className="text-lg font-bold">Kitchen is clear!</h2>
            <p className="text-xs mt-1">Waiting for incoming customer orders...</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
            {kitchenOrders.map((ord) => {
              const statusBg = 
                ord.status === 'pending' ? 'border-rose-500 bg-stone-900' :
                ord.status === 'preparing' ? 'border-amber-500 bg-stone-900' :
                'border-emerald-500 bg-stone-900/80';

              return (
                <div
                  key={ord.id}
                  className={`rounded-3xl border-2 p-5 flex flex-col justify-between shadow-2xl transition duration-300 ${statusBg}`}
                >
                  <div>
                    {/* Header */}
                    <div className="flex justify-between items-start pb-3 border-b border-stone-800">
                      <div>
                        <span className="text-3xl font-black text-amber-400">Table {ord.tableNumber}</span>
                        <p className="text-[11px] text-stone-400 font-mono mt-0.5">#{ord.id}</p>
                      </div>
                      <span className={`text-[10px] font-extrabold uppercase px-3 py-1 rounded-full ${
                        ord.status === 'pending' ? 'bg-rose-500 text-white animate-bounce' :
                        ord.status === 'preparing' ? 'bg-amber-500 text-stone-950' :
                        'bg-emerald-500 text-stone-950'
                      }`}>
                        {ord.status}
                      </span>
                    </div>

                    {/* Order Items */}
                    <div className="py-4 space-y-2.5">
                      {ord.items.map((item, idx) => (
                        <div key={idx} className="bg-stone-800/80 p-2.5 rounded-2xl flex items-center justify-between border border-stone-700/50">
                          <div>
                            <span className="font-extrabold text-amber-400 text-sm mr-2">{item.quantity}x</span>
                            <span className="font-bold text-white text-sm">{item.name}</span>
                            {item.note && <p className="text-[10px] text-amber-300 italic mt-0.5">⚠️ {item.note}</p>}
                          </div>
                        </div>
                      ))}
                    </div>

                    {/* Special Kitchen Note */}
                    {ord.specialNote && (
                      <div className="bg-amber-500/10 border border-amber-500/30 p-2.5 rounded-2xl text-xs text-amber-300 mb-3">
                        <strong>Kitchen Note:</strong> {ord.specialNote}
                      </div>
                    )}
                  </div>

                  {/* Status Change Buttons */}
                  <div className="pt-3 border-t border-stone-800">
                    {ord.status === 'pending' && (
                      <button
                        onClick={() => handleStatusChange(ord.id, 'preparing')}
                        className="w-full py-3 bg-amber-500 hover:bg-amber-400 text-stone-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow transition"
                      >
                        🔥 Start Preparing
                      </button>
                    )}
                    {ord.status === 'preparing' && (
                      <button
                        onClick={() => handleStatusChange(ord.id, 'ready')}
                        className="w-full py-3 bg-emerald-500 hover:bg-emerald-400 text-stone-950 font-black text-xs uppercase tracking-wider rounded-2xl shadow transition"
                      >
                        🔔 Mark Ready for Pickup
                      </button>
                    )}
                    {ord.status === 'ready' && (
                      <button
                        onClick={() => handleStatusChange(ord.id, 'completed')}
                        className="w-full py-3 bg-stone-800 hover:bg-stone-700 text-stone-300 font-extrabold text-xs uppercase tracking-wider rounded-2xl transition"
                      >
                        ✅ Complete Order
                      </button>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}

// ====================================================================
// 4. ADMIN PANEL COMPONENT
// ====================================================================
export function AdminPanel({ onOpenPrintQr }) {
  const [menuItems, setMenuItems] = useState(store.getMenuItems());
  const [categories, setCategories] = useState(store.getCategories());
  const [orders] = useState(store.getOrders());
  const [editingItem, setEditingItem] = useState(null);
  const [isFormOpen, setIsFormOpen] = useState(false);

  useEffect(() => {
    const handleStoreChange = () => {
      setMenuItems(store.getMenuItems());
      setCategories(store.getCategories());
    };
    store.addEventListener('state-changed', handleStoreChange);
    return () => store.removeEventListener('state-changed', handleStoreChange);
  }, []);

  const totalSales = useMemo(() => {
    return orders.reduce((sum, o) => sum + o.totalAmount, 0);
  }, [orders]);

  const handleSaveItem = (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const itemData = {
      id: editingItem ? editingItem.id : undefined,
      name: formData.get('name'),
      category: formData.get('category'),
      price: Number(formData.get('price')),
      description: formData.get('description'),
      image: formData.get('image'),
      isVeg: formData.get('isVeg') === 'on',
      isPopular: formData.get('isPopular') === 'on',
      inStock: true
    };
    store.saveMenuItem(itemData);
    setIsFormOpen(false);
    setEditingItem(null);
  };

  const handleDeleteItem = (id) => {
    if (confirm("Delete this menu item?")) {
      store.deleteMenuItem(id);
    }
  };

  return (
    <div className="min-h-screen bg-stone-100 p-4 md:p-8">
      <div className="max-w-6xl mx-auto space-y-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-white p-6 rounded-3xl shadow-sm border border-stone-200">
          <div>
            <h1 className="text-2xl font-bold text-stone-900">Admin Control Panel</h1>
            <p className="text-xs text-stone-500">Manage Menu, Printable QR Stand Cards & Sales Analytics</p>
          </div>

          <div className="flex gap-2">
            <button
              onClick={onOpenPrintQr}
              className="bg-amber-500 hover:bg-amber-400 text-stone-900 text-xs font-extrabold px-4 py-2.5 rounded-2xl shadow transition"
            >
              🖨️ Printable QR Stand Cards
            </button>
            <button
              onClick={() => { setEditingItem(null); setIsFormOpen(true); }}
              className="bg-stone-900 hover:bg-stone-800 text-white text-xs font-bold px-4 py-2.5 rounded-2xl shadow transition"
            >
              + Add Menu Item
            </button>
          </div>
        </div>

        {/* Analytics Cards */}
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
            <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">Total Sales Today</p>
            <p className="text-2xl font-extrabold text-stone-900 mt-1">{formatPrice(totalSales)}</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
            <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">Total Orders</p>
            <p className="text-2xl font-extrabold text-stone-900 mt-1">{orders.length}</p>
          </div>
          <div className="bg-white p-5 rounded-3xl border border-stone-200 shadow-sm">
            <p className="text-xs text-stone-500 font-bold uppercase tracking-wider">Total Menu Items</p>
            <p className="text-2xl font-extrabold text-stone-900 mt-1">{menuItems.length}</p>
          </div>
        </div>

        {/* Menu Items Table */}
        <div className="bg-white p-6 rounded-3xl shadow-sm border border-stone-200 overflow-x-auto">
          <h2 className="text-sm font-bold text-stone-800 uppercase tracking-wider mb-4">Café Menu Items</h2>
          <table className="w-full text-left text-xs">
            <thead>
              <tr className="border-b border-stone-200 text-stone-400 uppercase font-bold">
                <th className="py-3 px-2">Item</th>
                <th className="py-3 px-2">Category</th>
                <th className="py-3 px-2">Price</th>
                <th className="py-3 px-2">Diet</th>
                <th className="py-3 px-2 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-stone-100">
              {menuItems.map(item => (
                <tr key={item.id} className="hover:bg-stone-50">
                  <td className="py-3 px-2 flex items-center gap-3 font-bold text-stone-900">
                    <img src={item.image} className="w-8 h-8 rounded-lg object-cover" />
                    <span>{item.name}</span>
                  </td>
                  <td className="py-3 px-2 text-stone-600 capitalize">{item.category}</td>
                  <td className="py-3 px-2 font-bold text-stone-900">{formatPrice(item.price)}</td>
                  <td className="py-3 px-2">{item.isVeg ? '🌱 Veg' : '🍖 Non-Veg'}</td>
                  <td className="py-3 px-2 text-right space-x-2">
                    <button
                      onClick={() => { setEditingItem(item); setIsFormOpen(true); }}
                      className="text-amber-600 font-bold hover:underline"
                    >
                      Edit
                    </button>
                    <button
                      onClick={() => handleDeleteItem(item.id)}
                      className="text-rose-600 font-bold hover:underline"
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Add / Edit Form Modal */}
      {isFormOpen && (
        <div className="fixed inset-0 bg-black/60 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <form onSubmit={handleSaveItem} className="bg-white rounded-3xl max-w-lg w-full p-6 shadow-2xl space-y-4">
            <h3 className="font-bold text-stone-900 text-base">{editingItem ? 'Edit Food Item' : 'Add New Food Item'}</h3>
            
            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Item Name</label>
              <input name="name" defaultValue={editingItem?.name} required className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-bold" />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Category</label>
                <select name="category" defaultValue={editingItem?.category || 'coffee'} className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-bold capitalize">
                  {categories.map(c => (
                    <option key={c.id} value={c.id}>{c.name}</option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-bold text-stone-700 block mb-1">Price (৳)</label>
                <input type="number" name="price" defaultValue={editingItem?.price} required className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs font-bold" />
              </div>
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Image URL</label>
              <input name="image" defaultValue={editingItem?.image || 'https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80'} required className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs" />
            </div>

            <div>
              <label className="text-xs font-bold text-stone-700 block mb-1">Description</label>
              <textarea name="description" defaultValue={editingItem?.description} rows="2" className="w-full bg-stone-50 border border-stone-200 rounded-xl p-2.5 text-xs" />
            </div>

            <div className="flex gap-4 text-xs font-bold text-stone-700">
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" name="isVeg" defaultChecked={editingItem ? editingItem.isVeg : true} />
                <span>Vegetarian</span>
              </label>
              <label className="flex items-center gap-1.5 cursor-pointer">
                <input type="checkbox" name="isPopular" defaultChecked={editingItem?.isPopular} />
                <span>Mark Popular</span>
              </label>
            </div>

            <div className="pt-4 border-t border-stone-100 flex gap-3">
              <button type="button" onClick={() => setIsFormOpen(false)} className="flex-1 py-3 bg-stone-100 text-stone-700 font-bold text-xs rounded-xl">
                Cancel
              </button>
              <button type="submit" className="flex-1 py-3 bg-stone-900 text-white font-extrabold text-xs rounded-xl shadow">
                Save Item
              </button>
            </div>
          </form>
        </div>
      )}
    </div>
  );
}

// ====================================================================
// 5. PRINTABLE QR STAND CARDS MODAL
// ====================================================================
export function QrPrintModal({ onClose }) {
  const tables = Array.from({ length: 16 }, (_, i) => i + 1);

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 overflow-y-auto p-4 md:p-8">
      <div className="max-w-5xl mx-auto bg-white rounded-3xl p-6 shadow-2xl">
        <div className="flex justify-between items-center pb-4 border-b border-stone-200 no-print">
          <div>
            <h2 className="text-lg font-bold text-stone-900">Printable QR Table Stand Cards</h2>
            <p className="text-xs text-stone-500">Every card automatically opens the menu locked to its specific table number.</p>
          </div>
          <div className="flex gap-2">
            <button onClick={handlePrint} className="bg-amber-500 text-stone-950 font-extrabold text-xs px-4 py-2 rounded-xl shadow">
              🖨️ Print Now
            </button>
            <button onClick={onClose} className="bg-stone-200 text-stone-800 font-bold text-xs px-3 py-2 rounded-xl">
              Close
            </button>
          </div>
        </div>

        {/* Grid of Printable Cards */}
        <div id="printable-qr-section" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-6 mt-6">
          {tables.map(tblNum => {
            const tableUrl = `${window.location.origin}${window.location.pathname}?table=${tblNum}`;
            const qrApiUrl = `https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=${encodeURIComponent(tableUrl)}`;

            return (
              <div key={tblNum} className="border-2 border-stone-900 rounded-3xl p-6 text-center bg-white flex flex-col items-center justify-between space-y-4 shadow-sm">
                <div>
                  <div className="w-10 h-10 rounded-xl bg-amber-500 text-stone-900 font-black text-lg flex items-center justify-center mx-auto mb-1">
                    ☕
                  </div>
                  <h3 className="font-extrabold text-stone-900 text-base">{CAFE_INFO.name}</h3>
                  <p className="text-[10px] text-stone-500">Scan to Order Food</p>
                </div>

                <div className="bg-stone-50 p-3 rounded-2xl border border-stone-200">
                  <img src={qrApiUrl} alt={`QR Table ${tblNum}`} className="w-36 h-36" />
                </div>

                <div>
                  <span className="inline-block bg-stone-900 text-amber-400 font-black text-lg px-4 py-1 rounded-xl tracking-wider">
                    TABLE {tblNum}
                  </span>
                  <p className="text-[9px] text-stone-400 mt-1">No Login Required</p>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
