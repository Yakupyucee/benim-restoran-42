
export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  totalAmount: number;
  status: "beklemede" | "hazırlanıyor" | "teslim edildi" | "iptal edildi";
  deliveryAddress?: {
    street: string;
    city: string;
    district: string;
    postCode: string;
    details?: string;
  };
  orderType: "restoranda" | "eve sipariş";
  tableNumber?: string;
  paymentMethod: "nakit" | "kredi kartı" | "restoranda ödeme";
  createdAt: string;
  estimatedDeliveryTime?: string;
  notes?: string;
}

export interface OrderItem {
  id: string;
  menuItemId: string;
  name: string;
  price: number;
  quantity: number;
}

// Demo siparişler
export const orders: Order[] = [
  {
    id: "O-1001",
    userId: "1",
    items: [
      { id: "OI-1", menuItemId: "1", name: "Izgara Köfte", price: 120, quantity: 2 },
      { id: "OI-2", menuItemId: "5", name: "Humus", price: 45, quantity: 1 },
      { id: "OI-3", menuItemId: "10", name: "Ayran", price: 15, quantity: 2 },
    ],
    totalAmount: 315,
    status: "teslim edildi",
    orderType: "eve sipariş",
    deliveryAddress: {
      street: "Bağdat Caddesi",
      city: "İstanbul",
      district: "Kadıköy",
      postCode: "34000",
      details: "Apt. 5, Kat 3",
    },
    paymentMethod: "kredi kartı",
    createdAt: "2024-05-15T14:30:00Z",
    estimatedDeliveryTime: "2024-05-15T15:15:00Z",
  },
  {
    id: "O-1002",
    userId: "1",
    items: [
      { id: "OI-4", menuItemId: "3", name: "Mantarlı Risotto", price: 95, quantity: 1 },
      { id: "OI-5", menuItemId: "6", name: "Sigara Böreği", price: 55, quantity: 1 },
      { id: "OI-6", menuItemId: "9", name: "Türk Kahvesi", price: 25, quantity: 1 },
    ],
    totalAmount: 175,
    status: "hazırlanıyor",
    orderType: "restoranda",
    tableNumber: "7",
    paymentMethod: "restoranda ödeme",
    createdAt: new Date().toISOString(),
  },
  {
    id: "O-1003",
    userId: "1",
    items: [
      { id: "OI-7", menuItemId: "2", name: "Tavuk Şiş", price: 100, quantity: 1 },
      { id: "OI-8", menuItemId: "7", name: "Baklava", price: 75, quantity: 1 },
    ],
    totalAmount: 175,
    status: "beklemede",
    orderType: "eve sipariş",
    deliveryAddress: {
      street: "İstiklal Caddesi",
      city: "İstanbul",
      district: "Beyoğlu",
      postCode: "34400",
      details: "No: 102",
    },
    paymentMethod: "nakit",
    createdAt: new Date().toISOString(),
    estimatedDeliveryTime: new Date(Date.now() + 45 * 60000).toISOString(),
    notes: "Kapıda nakit ödeme yapılacak.",
  },
];

export const getUserOrders = (userId: string): Order[] => {
  return orders.filter(order => order.userId === userId)
    .sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
};

export const getOrderById = (orderId: string): Order | undefined => {
  return orders.find(order => order.id === orderId);
};
