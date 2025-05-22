
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";

interface User {
  id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

// Demo kullanıcılar
const DEMO_USERS = [
  {
    id: "1",
    name: "Demo Kullanıcı",
    email: "demo@example.com",
    password: "demo123",
    role: "user" as const,
  },
  {
    id: "2",
    name: "Admin Kullanıcı",
    email: "admin@example.com", 
    password: "admin123",
    role: "admin" as const,
  },
];

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Kullanıcı bilgilerini local storage'dan kontrol et
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      const parsedUser = JSON.parse(storedUser);
      setUser(parsedUser);
      setIsAuthenticated(true);
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    // Demo amaçlı giriş simülasyonu
    setIsLoading(true);
    
    try {
      // Gerçek bir API çağrısını simüle etmek için kısa bir gecikme
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      const foundUser = DEMO_USERS.find(
        (u) => u.email === email && u.password === password
      );
      
      if (foundUser) {
        const { password, ...userWithoutPassword } = foundUser;
        setUser(userWithoutPassword);
        setIsAuthenticated(true);
        localStorage.setItem("user", JSON.stringify(userWithoutPassword));
        toast.success("Giriş başarılı!");
        return true;
      } else {
        toast.error("Geçersiz e-posta veya şifre!");
        return false;
      }
    } catch (error) {
      console.error("Login error:", error);
      toast.error("Giriş yapılırken bir hata oluştu!");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const register = async (
    name: string,
    email: string,
    phone: string,
    password: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      // Gerçek bir API çağrısını simüle etmek için kısa bir gecikme
      await new Promise((resolve) => setTimeout(resolve, 800));
      
      // E-posta zaten kullanımda mı kontrolü
      const existingUser = DEMO_USERS.find((u) => u.email === email);
      
      if (existingUser) {
        toast.error("Bu e-posta adresi zaten kullanımda!");
        return false;
      }
      
      // Normalde burada API'ye bir istekte bulunulur
      // Şimdilik sadece başarılı bir kayıt simüle edelim
      toast.success("Kayıt başarılı! Şimdi giriş yapabilirsiniz.");
      return true;
    } catch (error) {
      console.error("Registration error:", error);
      toast.error("Kayıt olurken bir hata oluştu!");
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    setIsAuthenticated(false);
    localStorage.removeItem("user");
    toast.info("Çıkış yapıldı");
  };

  return (
    <AuthContext.Provider
      value={{
        isAuthenticated,
        user,
        login,
        register,
        logout,
        isLoading,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
