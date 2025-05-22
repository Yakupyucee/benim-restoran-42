
import React from "react";
import { Link, useLocation } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { ShoppingCart, User, LogOut, Home, List, Coffee, Settings } from "lucide-react";
import { Button } from "@/components/ui/button";

const MainNavigation = () => {
  const { isAuthenticated, user, logout } = useAuth();
  const { items } = useCart();
  const location = useLocation();

  const handleLogout = async () => {
    await logout();
  };

  const isActive = (path: string) => {
    return location.pathname === path;
  };

  return (
    <nav className="bg-white shadow-md">
      <div className="max-w-7xl mx-auto px-4">
        <div className="flex justify-between h-16">
          <div className="flex items-center">
            <Link to="/" className="flex-shrink-0 flex items-center">
              <Coffee className="h-8 w-8 text-restaurant-700" />
              <span className="ml-2 text-xl font-bold text-restaurant-700">RestaurantApp</span>
            </Link>
            <div className="hidden md:ml-6 md:flex md:space-x-4">
              <Link
                to="/"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                  isActive("/")
                    ? "text-restaurant-700 border-b-2 border-restaurant-700"
                    : "text-gray-600 hover:text-restaurant-700"
                }`}
              >
                <Home className="w-4 h-4 mr-1" />
                Ana Sayfa
              </Link>
              <Link
                to="/menu"
                className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                  isActive("/menu") || location.pathname.startsWith("/menu/")
                    ? "text-restaurant-700 border-b-2 border-restaurant-700"
                    : "text-gray-600 hover:text-restaurant-700"
                }`}
              >
                <List className="w-4 h-4 mr-1" />
                Menü
              </Link>
              
              {/* Admin için özel bağlantılar */}
              {isAuthenticated && user?.role === "admin" && (
                <Link
                  to="/admin"
                  className={`inline-flex items-center px-3 py-2 text-sm font-medium ${
                    location.pathname.startsWith("/admin")
                      ? "text-restaurant-700 border-b-2 border-restaurant-700"
                      : "text-gray-600 hover:text-restaurant-700"
                  }`}
                >
                  <Settings className="w-4 h-4 mr-1" />
                  Admin Paneli
                </Link>
              )}
            </div>
          </div>
          <div className="flex items-center">
            <Link
              to="/sepet"
              className="p-2 rounded-full text-gray-600 hover:text-restaurant-700 relative"
            >
              <ShoppingCart className="h-6 w-6" />
              {items.length > 0 && (
                <span className="absolute top-0 right-0 inline-flex items-center justify-center px-2 py-1 text-xs font-bold leading-none text-white transform translate-x-1/2 -translate-y-1/2 bg-restaurant-700 rounded-full">
                  {items.length}
                </span>
              )}
            </Link>

            {isAuthenticated ? (
              <div className="ml-4 relative flex items-center">
                <Link
                  to="/profil"
                  className={`inline-flex items-center p-2 rounded text-sm font-medium ${
                    isActive("/profil")
                      ? "text-restaurant-700"
                      : "text-gray-600 hover:text-restaurant-700"
                  }`}
                >
                  <User className="h-5 w-5 mr-1" />
                  <span className="hidden md:inline">{user?.name}</span>
                </Link>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleLogout}
                  className="ml-2 text-gray-600 hover:text-restaurant-700"
                >
                  <LogOut className="h-5 w-5" />
                  <span className="hidden md:inline ml-1">Çıkış</span>
                </Button>
              </div>
            ) : (
              <div className="ml-4 flex items-center md:space-x-2">
                <Link to="/giris">
                  <Button variant="outline" size="sm">
                    Giriş Yap
                  </Button>
                </Link>
                <Link to="/kayit" className="hidden md:inline-block">
                  <Button size="sm">Kayıt Ol</Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </div>
    </nav>
  );
};

export default MainNavigation;
