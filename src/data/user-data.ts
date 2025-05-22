
export interface Address {
  id: string;
  userId: string;
  title: string; // Ev, İş, vs.
  street: string;
  district: string;
  city: string;
  postalCode: string;
  details?: string;
  isDefault: boolean;
}

export interface User {
  id: string;
  name: string;
  email: string;
  phone: string;
  addresses: Address[];
}

// Demo kullanıcı verileri
export const users: User[] = [
  {
    id: "1",
    name: "Demo Kullanıcı",
    email: "demo@example.com",
    phone: "+90 555 123 4567",
    addresses: [
      {
        id: "addr1",
        userId: "1",
        title: "Ev",
        street: "Bağdat Caddesi No:123",
        district: "Kadıköy",
        city: "İstanbul",
        postalCode: "34000",
        details: "Kat 3, Daire 7",
        isDefault: true,
      },
      {
        id: "addr2",
        userId: "1",
        title: "İş",
        street: "Büyükdere Caddesi No:208",
        district: "Levent",
        city: "İstanbul",
        postalCode: "34394",
        details: "Plaza, Kat 8",
        isDefault: false,
      },
    ],
  },
  {
    id: "2",
    name: "Admin Kullanıcı",
    email: "admin@example.com",
    phone: "+90 533 987 6543",
    addresses: [
      {
        id: "addr3",
        userId: "2",
        title: "Ana Adres",
        street: "Atatürk Bulvarı No:45",
        district: "Çankaya",
        city: "Ankara",
        postalCode: "06000",
        details: "A Blok, Daire 12",
        isDefault: true,
      },
    ],
  },
];

export const getUserAddresses = (userId: string): Address[] => {
  const user = users.find(u => u.id === userId);
  return user ? user.addresses : [];
};

export const getUserById = (userId: string): User | undefined => {
  return users.find(u => u.id === userId);
};

export const addAddress = (userId: string, address: Omit<Address, "id" | "userId">): Address => {
  const newAddress: Address = {
    id: `addr${Date.now()}`,
    userId,
    ...address,
  };
  
  // Gerçek bir uygulamada burada API çağrısı yapılır
  // Bu demo için sadece bir nesne döndürüyoruz
  return newAddress;
};
