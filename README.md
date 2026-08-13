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

### 2. ⚡ Live Cross-Device Real-Time Order Syncing
- **Real-Time Order Relay**: Orders placed on any customer's mobile phone instantly broadcast across the internet to the **Chef's Kitchen KDS** and **Waiter Panel** on any device or network with audio chime alerts!

### 3. 🛡️ Staff Security & Auto-Role Passcodes
- **Single Input Passcode Portal**: Enter your passcode directly, and the system automatically detects your role and unlocks the correct panel:
  - ⚙️ **Admin Control Passcode**: `6002` (Unlocks Admin Control Panel)
  - 🍳 **Chef / Kitchen KDS Passcode**: `1210` (Unlocks Kitchen Display System)
  - 🤵 **Waiter Service Passcode**: `9100` (Unlocks Waiter Floor Panel)

### 4. ⚙️ Admin Control Panel & Printable QR Generator
- **Food Item Manager**: Add new food items or edit existing ones (Item Name, Category, Price, Description).
- **Image Selector & Custom URL Upload**: Upload custom image URLs or use 1-click high-resolution preset imagery.
- **Stock Status Toggle**: One-click `In Stock` / `Out of Stock` toggle.
- **Printable QR Stand Cards**: Auto-generates high-resolution vector printable table stand cards for Tables 1 through 16 ready for printing.

---

## 📁 Codebase Structure ("What is for What")

```
chaa-buzz-cafe/
├── index.html                # Single Page Application HTML entrypoint loading Tailwind CSS & React 18
├── server.py                 # Lightweight Python dev server serving static files with no-cache headers
├── css/
│   └── styles.css            # Custom CSS tokens: glassmorphism, 16px radius, KDS dark styles, print layouts
├── js/
│   ├── bundle.js             # Unified React application code (Dataset, Store, Cross-Device Sync, Single Passcode Auth, Food/Image Admin, Vector QR Generator)
│   └── supabase-schema.sql   # Supabase SQL script with tables (orders, menu_items, etc.) & RLS policies
└── README.md                 # Complete documentation & usage guide
```
