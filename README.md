# ☕ Chaa Buzz Cafe - Restaurant Management & QR Ordering System

A state-of-the-art, premium Restaurant Management System built specifically for **Chaa Buzz Cafe**. Inspired by the design aesthetics of **Apple, Linear, Stripe, and Notion** — minimalistic, elegant, spacious, rounded (16px), with real-time order syncing across Customer, Waiter, Kitchen, and Admin roles.

---

## 🌟 Key System Features

### 1. 📱 Customer Flow (Zero-Click Table Detection)
- **Automatic QR Scan**: When a customer scans a table QR code (e.g., `Table 7`), the website opens with `?table=7` already locked in. The customer **never** has to select a table manually.
- **Browse & Search**: Instant food search bar and category tabs (`Chaa & Teas`, `Specialty Coffee`, `Gourmet Burgers`, `Pizza & Pasta`, `Desserts`, `Cold Drinks`, `Snacks`).
- **Food Detail & Special Notes**: Add custom notes per item (`e.g., Less sugar, extra malai`).
- **Cart & Instant Ordering**: Floating cart bar, breakdown of total amount, and one-tap order submission without requiring login, account, or online payment.
- **Live Order Status Tracker**: Real-time progress timeline (`Order Received` → `Preparing` → `Ready for Pickup/Serving` → `Served`).

### 2. 🛡️ Staff Security & Panel Access
- **Hidden Staff Navigation**: Customers see only the menu interface.
- **PIN Authentication**: Accessing staff panels requires entering a security PIN code:
  - 🤵 Waiter Panel PIN: `1234`
  - 🍳 Kitchen (Chef) Panel PIN: `5555`
  - ⚙️ Admin Control Panel PIN: `9999`

### 3. ⚙️ Admin Food & Image Control Panel + QR Stand Card Generator
- **Food Item Manager**: Add new food items or edit existing ones (Item Name, Category, Price, Description).
- **Image Selector & Custom URL Upload**: Upload custom image URLs or use 1-click high-resolution preset imagery (Matka Chaa, Cappuccino, Smash Burgers, Pizza, Lava Cake, Mojitos, Loaded Fries).
- **Stock Status Toggle**: One-click `In Stock` / `Out of Stock` toggle. When out of stock, customers cannot add the item to cart.
- **Printable QR Stand Cards**: Auto-generates high-resolution vector printable table stand cards for Tables 1 through 16 with QR codes and Chaa Buzz Cafe branding ready for printing.

---

## 📁 Codebase Structure ("What is for What")

```
chaa-buzz-cafe/
├── index.html                # Single Page Application HTML entrypoint loading Tailwind CSS & React 18
├── server.py                 # Lightweight Python dev server serving static files with no-cache headers
├── css/
│   └── styles.css            # Custom CSS tokens: glassmorphism, 16px radius, KDS dark styles, print layouts
├── js/
│   ├── bundle.js             # Unified React application code (Dataset, Store, UI Components, PIN Auth, Food/Image Admin, Vector QR Generator)
│   └── supabase-schema.sql   # Supabase SQL script with tables (orders, menu_items, etc.) & RLS policies
└── README.md                 # Complete documentation & usage guide
```

---

## 🚀 How to Run Locally

### Option 1: Double-Click File
Simply double-click [`index.html`](file:///Users/aliakbor/.gemini/antigravity/scratch/chaa-buzz-cafe/index.html) to open in any web browser!

### Option 2: Live Multi-Tab Real-time Testing
Open two or three browser windows side by side:
1. Window 1: `http://localhost:3000/?table=7` (Customer places order)
2. Window 2: Log into Staff Mode using `5555` to open Kitchen KDS.
3. Window 3: Log into Staff Mode using `1234` to open Waiter Panel.
