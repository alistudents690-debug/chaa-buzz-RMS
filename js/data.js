// Data Module - ChaaBuzz Cafe Official Menu Dataset & Configuration
const CAFE_INFO = {
  name: "ChaaBuzz Cafe",
  tagline: "Specialty Tea, Fried Buns, Gourmet Burgers & Refreshments",
  address: "House 14, Road 7, Block C, Banani, Dhaka",
  phone: "+880 1725-514927",
  social: "@ChaaBuzz",
  currency: "৳"
};

const PASSCODE_ROLES = {
  "6002": "admin",
  "1210": "kitchen",
  "9100": "waiter"
};

const PRESET_IMAGES = [
  { label: "☕ Dud Chaa", url: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80" },
  { label: "🍵 Malai Chaa", url: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80" },
  { label: "🍞 Fried Bun", url: "https://images.unsplash.com/photo-1589301760014-d929f39729f6?auto=format&fit=crop&w=600&q=80" },
  { label: "🍔 Chicken Burger", url: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80" },
  { label: "🍟 French Fry", url: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=600&q=80" },
  { label: "🌯 Porota Burger", url: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=80" },
  { label: "📦 Meatbox", url: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80" },
  { label: "🥤 Lacci", url: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80" },
  { label: "🍌 Banana Shake", url: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80" },
  { label: "🍨 Doi Chira", url: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=600&q=80" },
  { label: "🍰 Dream Cake", url: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80" }
];

const INITIAL_CATEGORIES = [
  { id: "all", name: "All Items" },
  { id: "chaa", name: "☕ Chaa" },
  { id: "fried-bun", name: "🍞 Fried Bun" },
  { id: "burger", name: "🍔 Burger & Snacks" },
  { id: "juice", name: "🥤 Juice & Shakes" },
  { id: "others", name: "🍰 Others & Desserts" }
];

const INITIAL_MENU_ITEMS = [
  {
    id: "c1",
    name: "Dud Chaa",
    category: "chaa",
    price: 20,
    description: "Classic slow-brewed milk tea made with fresh milk and fragrant tea leaves.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    isPopular: false,
    inStock: true
  },
  {
    id: "c2",
    name: "Special Powder Dud chaa",
    category: "chaa",
    price: 30,
    description: "Rich and aromatic milk tea prepared with premium full-cream milk powder.",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "c3",
    name: "Malai Chaa",
    category: "chaa",
    price: 40,
    description: "Creamy milk tea topped with a rich layer of clotted milk cream (malai).",
    image: "https://images.unsplash.com/photo-1544787219-7f47ccb76574?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "c4",
    name: "Malai Chaa Special",
    category: "chaa",
    price: 60,
    description: "Extra thick spiced malai tea served with double cream in a traditional earthen pot.",
    image: "https://images.unsplash.com/photo-1561336313-0bd5e0b27ec8?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "c5",
    name: "Shahi Malai Chaa",
    category: "chaa",
    price: 99,
    description: "Royal malai tea infused with saffron strands, crushed almonds, pistachios & cardamom.",
    image: "https://images.unsplash.com/photo-1571934811356-5cc531766b34?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "c6",
    name: "Bread Malai",
    category: "chaa",
    price: 80,
    description: "Warm butter-toasted bread slice soaked in thick sweet cardamom malai cream.",
    image: "https://images.unsplash.com/photo-1525351484163-7529414344d8?auto=format&fit=crop&w=600&q=80",
    isPopular: false,
    inStock: true
  },
  {
    id: "fb1",
    name: "Pura ruti",
    category: "fried-bun",
    price: 20,
    description: "Traditional crisp toasted butter roti bun cooked to golden perfection.",
    image: "https://images.unsplash.com/photo-1589301760014-d929f39729f6?auto=format&fit=crop&w=600&q=80",
    isPopular: false,
    inStock: true
  },
  {
    id: "fb2",
    name: "Pura ruti special",
    category: "fried-bun",
    price: 25,
    description: "Special butter-fried toasted roti bun with a caramelized sugar crust.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "fb3",
    name: "shahi Pura ruti",
    category: "fried-bun",
    price: 35,
    description: "Royal toasted bun glazed with butter, condensed milk, and sweet aromatic spices.",
    image: "https://images.unsplash.com/photo-1608198093002-ad4e005484ec?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "fb4",
    name: "Puran Dhakar Bakarkhani",
    category: "fried-bun",
    price: 20,
    description: "Authentic Old Dhaka crisp layered sweet biscuit bread.",
    image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=600&q=80",
    isPopular: false,
    inStock: true
  },
  {
    id: "b1",
    name: "Mini Burger",
    category: "burger",
    price: 50,
    description: "Juicy mini chicken patty slider with fresh lettuce, mayo, and cheddar cheese.",
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=600&q=80",
    isPopular: false,
    inStock: true
  },
  {
    id: "b2",
    name: "French Fry",
    category: "burger",
    price: 50,
    description: "Crispy golden salted french fries served with spicy mayo dip.",
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "b3",
    name: "Chicken Burger",
    category: "burger",
    price: 90,
    description: "Crispy double-fried chicken breast patty with special sauce, lettuce, and bun.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "b4",
    name: "Porota Burger",
    category: "burger",
    price: 170,
    description: "Flaky crispy paratha wrap layered with double spiced chicken patties and melted cheese.",
    image: "https://images.unsplash.com/photo-1627308595229-7830a5c91f9f?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "b5",
    name: "Meatbox",
    category: "burger",
    price: 120,
    description: "Loaded box of crispy fries, fried chicken chunks, sliced sausage, and melted cheese sauce.",
    image: "https://images.unsplash.com/photo-1544025162-d76694265947?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "j1",
    name: "Lacci",
    category: "juice",
    price: 70,
    description: "Traditional chilled sweet yogurt lassi blended with ice and rose water.",
    image: "https://images.unsplash.com/photo-1553530666-ba11a7da3888?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "j2",
    name: "Banana shake",
    category: "juice",
    price: 80,
    description: "Creamy fresh banana milkshake topped with crushed nuts.",
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=600&q=80",
    isPopular: false,
    inStock: true
  },
  {
    id: "o1",
    name: "Doi Chira",
    category: "others",
    price: 90,
    description: "Traditional sweet yogurt blended with flattened rice (chira), ripe banana slices, and honey.",
    image: "https://images.unsplash.com/photo-1511690656952-34342bb7c2f2?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "o2",
    name: "Doi Chira Special",
    category: "others",
    price: 120,
    description: "Special doi chira layered with sweet curd, seasonal fruits, cashews, raisins, and pure honey.",
    image: "https://images.unsplash.com/photo-1546069901-ba9599a7e63c?auto=format&fit=crop&w=600&q=80",
    isPopular: true,
    inStock: true
  },
  {
    id: "o3",
    name: "American Mixed Chips",
    category: "others",
    price: 90,
    description: "Assorted bowl of crunchy potato chips and seasoned corn crisps.",
    image: "https://images.unsplash.com/photo-1566478989037-eec170784d0b?auto=format&fit=crop&w=600&q=80",
    isPopular: false,
    inStock: true
  },
  {
    id: "o4",
    name: "Dream Cake",
    category: "others",
    price: 50,
    description: "Moist double-chocolate layered dessert slice cake.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
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
