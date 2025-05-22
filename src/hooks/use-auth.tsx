
import React, { createContext, useContext, useState, useEffect } from "react";
import { toast } from "sonner";
import { authAPI } from "@/services/api";

interface User {
  user_id: string;
  name: string;
  email: string;
  phone?: string;
  role: "user" | "admin";
  token: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  user: User | null;
  login: (email: string, password: string) => Promise<boolean>;
  register: (name: string, email: string, phone: string, password: string, passwordConfirm: string) => Promise<boolean>;
  logout: () => void;
  isLoading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);

  useEffect(() => {
    // Kullanıcı bilgilerini local storage'dan kontrol et
    const storedUser = localStorage.getItem("user");
    if (storedUser) {
      try {
        const parsedUser = JSON.parse(storedUser);
        setUser(parsedUser);
        setIsAuthenticated(true);
      } catch (error) {
        console.error("User parsing error:", error);
        localStorage.removeItem("user");
      }
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      const response = await authAPI.login({ email, password });
      
      if (response && response.access) {
        const userData = {
          user_id: response.user.user_id,
          name: response.user.name,
          email: response.user.email,
          phone: response.user.phone,
          role: response.user.role,
          token: response.access
        };
        
        localStorage.setItem("user", JSON.stringify(userData));
        setUser(userData);
        setIsAuthenticated(true);
        toast.success("Giriş başarılı!");
        return true;
      } else {
        toast.error("Giriş bilgileri geçersiz!");
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
    password: string,
    passwordConfirm: string
  ): Promise<boolean> => {
    setIsLoading(true);
    
    try {
      await authAPI.register({
        name,
        email,
        phone,
        password,
        password_confirm: passwordConfirm
      });
      
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

  const logout = async () => {
    setIsLoading(true);
    try {
      await authAPI.logout();
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
      toast.info("Çıkış yapıldı");
    } catch (error) {
      console.error("Logout error:", error);
      toast.error("Çıkış yapılırken bir hata oluştu!");
      // Hata olsa bile kullanıcıyı çıkış yapmış say
      localStorage.removeItem("user");
      setUser(null);
      setIsAuthenticated(false);
    } finally {
      setIsLoading(false);
    }
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
