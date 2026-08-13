// Chaa Buzz Cafe Main App Entry & Navigation Controller
import { CustomerMenu, WaiterDashboard, KitchenDisplay, AdminPanel, QrPrintModal } from './components.js';

const { useState, useEffect } = React;

export function App() {
  const [activeRole, setActiveRole] = useState("customer"); // "customer" | "waiter" | "kitchen" | "admin"
  const [activeTable, setActiveTable] = useState(null);
  const [isPrintQrOpen, setIsPrintQrOpen] = useState(false);

  useEffect(() => {
    // Check URL parameters for table number (e.g. ?table=7 or /?table=7)
    const urlParams = new URLSearchParams(window.location.search);
    const tableParam = urlParams.get('table');
    if (tableParam) {
      setActiveTable(Number(tableParam));
    }
  }, []);

  return (
    <div className="min-h-screen bg-stone-100 flex flex-col font-sans">
      {/* Top Demo Navigation Switcher */}
      <header className="no-print bg-stone-950 text-stone-300 border-b border-stone-800 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 h-14 flex items-center justify-between">
          {/* Logo & Brand */}
          <div className="flex items-center gap-2">
            <span className="w-8 h-8 rounded-xl bg-amber-500 text-stone-950 font-black text-sm flex items-center justify-center">
              ☕
            </span>
            <span className="font-bold text-white text-sm tracking-tight hidden sm:inline">Chaa Buzz Cafe</span>
          </div>

          {/* Role Navigation Pills */}
          <div className="flex items-center gap-1 bg-stone-900 p-1 rounded-2xl border border-stone-800">
            <button
              onClick={() => setActiveRole("customer")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                activeRole === "customer" ? "bg-amber-500 text-stone-950 shadow font-bold" : "hover:text-white"
              }`}
            >
              <span>📱</span>
              <span>Customer Menu</span>
              {activeTable && <span className="bg-stone-950 text-amber-400 text-[10px] px-1.5 py-0.2 rounded-md font-mono">T{activeTable}</span>}
            </button>

            <button
              onClick={() => setActiveRole("waiter")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                activeRole === "waiter" ? "bg-amber-500 text-stone-950 shadow font-bold" : "hover:text-white"
              }`}
            >
              <span>🤵</span>
              <span>Waiter Panel</span>
            </button>

            <button
              onClick={() => setActiveRole("kitchen")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                activeRole === "kitchen" ? "bg-amber-500 text-stone-950 shadow font-bold" : "hover:text-white"
              }`}
            >
              <span>🍳</span>
              <span>Kitchen (KDS)</span>
            </button>

            <button
              onClick={() => setActiveRole("admin")}
              className={`px-3 py-1.5 rounded-xl text-xs font-semibold transition flex items-center gap-1.5 ${
                activeRole === "admin" ? "bg-amber-500 text-stone-950 shadow font-bold" : "hover:text-white"
              }`}
            >
              <span>⚙️</span>
              <span>Admin</span>
            </button>
          </div>

          {/* Table Quick Switcher (For Demo Testing) */}
          <div className="hidden lg:flex items-center gap-2 text-xs">
            <span className="text-stone-400">Simulate Scan QR:</span>
            <select
              value={activeTable || ''}
              onChange={(e) => {
                const val = e.target.value ? Number(e.target.value) : null;
                setActiveTable(val);
                if (val) {
                  window.history.replaceState({}, '', `?table=${val}`);
                } else {
                  window.history.replaceState({}, '', window.location.pathname);
                }
              }}
              className="bg-stone-800 text-amber-400 border border-stone-700 rounded-xl px-2 py-1 font-bold text-xs"
            >
              <option value="">No Table Lock</option>
              {Array.from({ length: 16 }, (_, i) => i + 1).map(n => (
                <option key={n} value={n}>Table {n}</option>
              ))}
            </select>
          </div>
        </div>
      </header>

      {/* Main Role Content View */}
      <main className="flex-1">
        {activeRole === "customer" && (
          <CustomerMenu
            activeTable={activeTable}
            onSelectTable={(tableNum) => {
              setActiveTable(tableNum);
              window.history.replaceState({}, '', `?table=${tableNum}`);
            }}
          />
        )}

        {activeRole === "waiter" && <WaiterDashboard />}

        {activeRole === "kitchen" && <KitchenDisplay />}

        {activeRole === "admin" && (
          <AdminPanel onOpenPrintQr={() => setIsPrintQrOpen(true)} />
        )}
      </main>

      {/* Printable QR Table Cards Modal */}
      {isPrintQrOpen && (
        <QrPrintModal onClose={() => setIsPrintQrOpen(false)} />
      )}
    </div>
  );
}

// Render React App
const rootElement = document.getElementById('root');
if (rootElement) {
  ReactDOM.createRoot(rootElement).render(<App />);
}
