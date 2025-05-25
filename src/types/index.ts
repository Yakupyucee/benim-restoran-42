export interface User {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  token: string;
}

export interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (
    name: string,
    email: string,
    phone: string,
    password: string,
    passwordConfirm: string
  ) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image: string;
}
