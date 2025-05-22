
// Sahte menü verileri

export interface MenuItem {
  id: string;
  name: string;
  description: string;
  price: number;
  takeawayPrice?: number;
  category: string;
  image: string;
  isPopular?: boolean;
  isVegetarian?: boolean;
  isSpicy?: boolean;
  ingredients?: string[];
  allergens?: string[];
  inStock: boolean;
  discount?: number;
}

export interface MenuCategory {
  id: string;
  name: string;
  description?: string;
  image?: string;
}

export const categories: MenuCategory[] = [
  {
    id: "1",
    name: "Ana Yemekler",
    description: "Lezzetli ana yemek seçeneklerimiz",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300",
  },
  {
    id: "2",
    name: "Başlangıçlar",
    description: "İştah açıcı başlangıçlar",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300",
  },
  {
    id: "3",
    name: "Tatlılar",
    description: "Damak tadınıza hitap eden tatlı çeşitleri",
    image: "https://images.unsplash.com/photo-1581091226825-a6a2a5aee158?auto=format&fit=crop&w=300",
  },
  {
    id: "4",
    name: "İçecekler",
    description: "Ferahlatıcı içecek seçenekleri",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300",
  },
];

export const menuItems: MenuItem[] = [
  // Ana Yemekler
  {
    id: "1",
    name: "Izgara Köfte",
    description: "El yapımı %100 dana kıymasından hazırlanmış, yanında pilav ve salata ile",
    price: 120,
    takeawayPrice: 130,
    category: "1",
    image: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=300",
    isPopular: true,
    ingredients: ["Dana kıyma", "Baharatlar", "Soğan", "Sarımsak"],
    allergens: ["Gluten"],
    inStock: true,
  },
  {
    id: "2",
    name: "Tavuk Şiş",
    description: "Özel marine edilmiş tavuk şiş, yanında pilav ve közlenmiş sebzeler ile",
    price: 100,
    takeawayPrice: 110,
    category: "1",
    image: "https://images.unsplash.com/photo-1487058792275-0ad4aaf24ca7?auto=format&fit=crop&w=300",
    isPopular: false,
    ingredients: ["Tavuk göğsü", "Marine sosları", "Baharatlar"],
    inStock: true,
  },
  {
    id: "3",
    name: "Mantarlı Risotto",
    description: "Kremsi İtalyan risottosu, porcini mantarları ve parmesan peyniri ile",
    price: 95,
    takeawayPrice: 105,
    category: "1",
    image: "https://images.unsplash.com/photo-1649972904349-6e44c42644a7?auto=format&fit=crop&w=300",
    isVegetarian: true,
    ingredients: ["Arborio pirinci", "Mantar", "Tereyağı", "Parmesan", "Soğan"],
    allergens: ["Süt ürünleri"],
    inStock: true,
  },
  {
    id: "4",
    name: "İskender Kebap",
    description: "Taze pide üzerine döner, domates sosu ve yoğurt ile",
    price: 135,
    takeawayPrice: 145,
    category: "1",
    image: "https://images.unsplash.com/photo-1531297484001-80022131f5a1?auto=format&fit=crop&w=300",
    isPopular: true,
    ingredients: ["Dana eti", "Pide", "Tereyağı", "Domates sosu", "Yoğurt"],
    allergens: ["Gluten", "Süt ürünleri"],
    inStock: true,
  },
  
  // Başlangıçlar
  {
    id: "5",
    name: "Humus",
    description: "Nohut, tahin ve zeytinyağı ile hazırlanan ev yapımı humus",
    price: 45,
    takeawayPrice: 50,
    category: "2",
    image: "https://images.unsplash.com/photo-1605810230434-7631ac76ec81?auto=format&fit=crop&w=300",
    isVegetarian: true,
    ingredients: ["Nohut", "Tahin", "Limon", "Zeytinyağı"],
    inStock: true,
  },
  {
    id: "6",
    name: "Sigara Böreği",
    description: "Peynir dolu çıtır börekler, 6 adet",
    price: 55,
    takeawayPrice: 60,
    category: "2",
    image: "https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=300",
    isVegetarian: true,
    ingredients: ["Yufka", "Beyaz peynir", "Maydanoz"],
    allergens: ["Gluten", "Süt ürünleri"],
    inStock: true,
  },
  
  // Tatlılar
  {
    id: "7",
    name: "Baklava",
    description: "Antep fıstığı ile ev yapımı baklava, 4 dilim",
    price: 75,
    takeawayPrice: 80,
    category: "3",
    image: "https://images.unsplash.com/photo-1721322800607-8c38375eef04?auto=format&fit=crop&w=300",
    isPopular: true,
    ingredients: ["Yufka", "Antep fıstığı", "Tereyağı", "Şeker"],
    allergens: ["Gluten", "Kuruyemiş"],
    inStock: true,
  },
  {
    id: "8",
    name: "Sütlaç",
    description: "Geleneksel fırında pişmiş sütlaç",
    price: 40,
    takeawayPrice: 45,
    category: "3",
    image: "https://images.unsplash.com/photo-1488590528505-98d2b5aba04b?auto=format&fit=crop&w=300",
    isVegetarian: true,
    ingredients: ["Süt", "Pirinç", "Şeker", "Vanilya"],
    allergens: ["Süt ürünleri"],
    inStock: true,
    discount: 10,
  },
  
  // İçecekler
  {
    id: "9",
    name: "Türk Kahvesi",
    description: "Geleneksel Türk kahvesi",
    price: 25,
    takeawayPrice: 30,
    category: "4",
    image: "https://images.unsplash.com/photo-1461749280684-dccba630e2f6?auto=format&fit=crop&w=300",
    isVegetarian: true,
    ingredients: ["Türk kahvesi"],
    inStock: true,
  },
  {
    id: "10",
    name: "Ayran",
    description: "Ev yapımı ayran",
    price: 15,
    takeawayPrice: 20,
    category: "4",
    image: "https://images.unsplash.com/photo-1518770660439-4636190af475?auto=format&fit=crop&w=300",
    isVegetarian: true,
    ingredients: ["Yoğurt", "Su", "Tuz"],
    allergens: ["Süt ürünleri"],
    inStock: true,
  },
];

export const getMenuItemsByCategory = (categoryId: string): MenuItem[] => {
  return menuItems.filter((item) => item.category === categoryId);
};

export const getPopularItems = (): MenuItem[] => {
  return menuItems.filter((item) => item.isPopular);
};

export const getMenuItemById = (id: string): MenuItem | undefined => {
  return menuItems.find((item) => item.id === id);
};
