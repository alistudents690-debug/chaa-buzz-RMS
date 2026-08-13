// Chaa Buzz Cafe Initial Menu Dataset & Configuration

export const CAFE_INFO = {
  name: "Chaa Buzz Cafe",
  tagline: "Artisan Teas, Specialty Coffee & Gourmet Bites",
  address: "House 14, Road 7, Block C, Banani, Dhaka",
  phone: "+880 1712-345678",
  currency: "৳",
  colorTheme: {
    primary: "#D97706",    // Warm Amber
    primaryDark: "#B45309",// Deep Honey
    accent: "#451A03",     // Roasted Espresso
    lightBg: "#FAF9F6",    // Cream Linen
    darkBg: "#121214",     // Obsidian Slate
    cardBorder: "#E5E7EB",
  }
};

export const INITIAL_CATEGORIES = [
  { id: "all", name: "All Items", icon: "Utensils" },
  { id: "tea-chaa", name: "Chaa & Teas", icon: "Coffee" },
  { id: "coffee", name: "Specialty Coffee", icon: "CupSoda" },
  { id: "burgers", name: "Gourmet Burgers", icon: "Hamburger" },
  { id: "pizza-pasta", name: "Pizza & Pasta", icon: "Pizza" },
  { id: "desserts", name: "Desserts & Bakery", icon: "Cake" },
  { id: "cold-drinks", name: "Cold Drinks & Shakes", icon: "GlassWater" },
  { id: "snacks", name: "Crispy Snacks", icon: "Popcorn" }
];

export const INITIAL_MENU_ITEMS = [
  // Chaa & Teas
  {
    id: "m1",
    name: "Special Matka Milk Chaa",
    category: "tea-chaa",
    price: 60,
    description: "Traditional slow-brewed spiced milk tea served in an authentic earthen clay pot (matka). Rich, creamy, and fragrant.",
    image: "https://images.unsplash.com/photo-1576092768241-dec231879fc3?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isPopular: true,
    inStock: true,
    prepTime: "5 mins",
    tags: ["Bestseller", "Clay Pot"]
  },
  {
    id: "m2",
    name: "Zafrani Elaichi Tea",
    category: "tea-chaa",
    price: 80,
    description: "Premium Assam tea leaves infused with saffron strands and freshly crushed green cardamom.",
    image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isPopular: false,
    inStock: true,
    prepTime: "5 mins",
    tags: ["Aromatic", "Saffron"]
  },
  {
    id: "m3",
    name: "Honey Lemon Ginger Tea",
    category: "tea-chaa",
    price: 90,
    description: "Soothing hot green tea steeped with fresh ginger root, squeezed lemon juice, and pure organic honey.",
    image: "https://images.unsplash.com/photo-1556679343-c7306c1976bc?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isPopular: false,
    inStock: true,
    prepTime: "4 mins",
    tags: ["Healthy", "Detox"]
  },

  // Specialty Coffee
  {
    id: "m4",
    name: "Hazelnut Cappuccino",
    category: "coffee",
    price: 240,
    description: "Double shot espresso with silky microfoam milk and roasted hazelnut syrup, dusted with dark cocoa powder.",
    image: "https://images.unsplash.com/photo-1534778101976-62847782c213?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isPopular: true,
    inStock: true,
    prepTime: "6 mins",
    tags: ["Artisan", "Bestseller"]
  },
  {
    id: "m5",
    name: "Spanish Iced Latte",
    category: "coffee",
    price: 280,
    description: "Rich espresso poured over sweet condensed milk, fresh whole milk, and clear ice spheres.",
    image: "https://images.unsplash.com/photo-1517701604599-bb29b565090c?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isPopular: true,
    inStock: true,
    prepTime: "5 mins",
    tags: ["Cold", "Popular"]
  },
  {
    id: "m6",
    name: "Caramel Macchiato",
    category: "coffee",
    price: 290,
    description: "Freshly steamed milk with vanilla syrup, marked with espresso and drizzled with buttery caramel sauce.",
    image: "https://images.unsplash.com/photo-1485808191679-5f86510681a2?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isPopular: false,
    inStock: true,
    prepTime: "6 mins",
    tags: ["Sweet", "Signature"]
  },

  // Gourmet Burgers
  {
    id: "m7",
    name: "Smokey Buzz Chicken Burger",
    category: "burgers",
    price: 320,
    description: "Crispy double-fried chicken breast, smoked cheddar cheese, honey mustard coleslaw, and house buzz sauce in a toasted brioche bun.",
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=600&q=80",
    isVeg: false,
    isPopular: true,
    inStock: true,
    prepTime: "12 mins",
    tags: ["Chef Special", "Crispy"]
  },
  {
    id: "m8",
    name: "Classic Cheese Smash Beef Burger",
    category: "burgers",
    price: 380,
    description: "100% Angus beef patty smashed crispy on the grill, melted American cheese, caramelized onions, pickles, and burger relish.",
    image: "https://images.unsplash.com/photo-1586190848861-99aa4a171e90?auto=format&fit=crop&w=600&q=80",
    isVeg: false,
    isPopular: true,
    inStock: true,
    prepTime: "15 mins",
    tags: ["Juicy Beef", "Bestseller"]
  },

  // Pizza & Pasta
  {
    id: "m9",
    name: "Truffle Mushroom Pizza (10\")",
    category: "pizza-pasta",
    price: 550,
    description: "Hand-tossed sourdough pizza topped with roasted wild mushrooms, mozzarella, garlic butter, and black truffle oil spray.",
    image: "https://images.unsplash.com/photo-1513104890138-7c749659a591?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isPopular: false,
    inStock: true,
    prepTime: "18 mins",
    tags: ["Wood-fired", "Gourmet"]
  },
  {
    id: "m10",
    name: "Creamy Chicken Alfredo Pasta",
    category: "pizza-pasta",
    price: 420,
    description: "Fettuccine pasta tossed in rich parmesan cream sauce with tender grilled chicken breast, fresh parsley, and cracked black pepper.",
    image: "https://images.unsplash.com/photo-1645112411341-6c4fd023714a?auto=format&fit=crop&w=600&q=80",
    isVeg: false,
    isPopular: true,
    inStock: true,
    prepTime: "14 mins",
    tags: ["Rich Creamy"]
  },

  // Desserts
  {
    id: "m11",
    name: "Belgian Chocolate Lava Cake",
    category: "desserts",
    price: 260,
    description: "Warm chocolate cake with a molten Belgian dark chocolate center, served with a scoop of Madagascar vanilla bean ice cream.",
    image: "https://images.unsplash.com/photo-1606313564200-e75d5e30476c?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isPopular: true,
    inStock: true,
    prepTime: "10 mins",
    tags: ["Warm & Molten"]
  },
  {
    id: "m12",
    name: "New York Creamy Cheesecake",
    category: "desserts",
    price: 290,
    description: "Classic dense and velvety cream cheesecake on a buttery Graham cracker crust, topped with fresh blueberry compote.",
    image: "https://images.unsplash.com/photo-1533134242443-d4fd215305ad?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isPopular: false,
    inStock: true,
    prepTime: "3 mins",
    tags: ["Signature"]
  },

  // Cold Drinks
  {
    id: "m13",
    name: "Mango Passionfruit Mojito",
    category: "cold-drinks",
    price: 210,
    description: "Sparkling soda layered with Alphonso mango puree, passionfruit nectar, muddled mint leaves, and lime juice.",
    image: "https://images.unsplash.com/photo-1513558161293-cdaf765ed2fd?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isPopular: true,
    inStock: true,
    prepTime: "4 mins",
    tags: ["Refreshing"]
  },

  // Crispy Snacks
  {
    id: "m14",
    name: "Loaded Buzz Fries",
    category: "snacks",
    price: 190,
    description: "Golden seasoned french fries topped with melted cheddar sauce, jalapeno slices, crispy fried onions, and spicy mayo drizzle.",
    image: "https://images.unsplash.com/photo-1576107232684-1279f390859f?auto=format&fit=crop&w=600&q=80",
    isVeg: true,
    isPopular: true,
    inStock: true,
    prepTime: "8 mins",
    tags: ["Crispy", "Shareable"]
  }
];

export const INITIAL_TABLES = Array.from({ length: 16 }, (_, i) => ({
  id: i + 1,
  name: `Table ${i + 1}`,
  capacity: i % 2 === 0 ? 4 : 2,
  status: "available", // "available" | "occupied" | "order-pending" | "preparing" | "ready"
  activeOrderId: null,
}));
