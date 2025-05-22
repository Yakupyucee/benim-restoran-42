
import React, { useState } from "react";
import { Link } from "react-router-dom";
import { Menu, X, ShoppingCart, User } from "lucide-react";
import { Logo } from "@/components/ui/custom/logo";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/hooks/use-auth";
import { Badge } from "@/components/ui/badge";
import { useCart } from "@/hooks/use-cart";

export function Header() {
  const [isMenuOpen, setIsMenuOpen] = useState(false);
  const { isAuthenticated, user, logout } = useAuth();
  const { items } = useCart();

  const toggleMenu = () => {
    setIsMenuOpen(!isMenuOpen);
  };

  return (
    <header className="bg-white shadow-sm sticky top-0 z-50">
      <div className="container mx-auto px-4 py-3 flex items-center justify-between">
        <div className="flex items-center">
          <Logo />
        </div>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex space-x-8">
          <Link to="/" className="text-gray-800 hover:text-restaurant-700 font-medium">
            Ana Sayfa
          </Link>
          <Link to="/menu" className="text-gray-800 hover:text-restaurant-700 font-medium">
            Menü
          </Link>
          <Link to="/siparis" className="text-gray-800 hover:text-restaurant-700 font-medium">
            Sipariş Ver
          </Link>
          <Link to="/hakkimizda" className="text-gray-800 hover:text-restaurant-700 font-medium">
            Hakkımızda
          </Link>
          <Link to="/iletisim" className="text-gray-800 hover:text-restaurant-700 font-medium">
            İletişim
          </Link>
        </nav>

        {/* User Actions */}
        <div className="flex items-center space-x-4">
          <Link to="/sepet" className="relative">
            <ShoppingCart className="h-6 w-6 text-gray-800 hover:text-restaurant-700" />
            {items.length > 0 && (
              <Badge className="absolute -top-2 -right-2 bg-restaurant-600">{items.length}</Badge>
            )}
          </Link>

          {isAuthenticated ? (
            <div className="hidden lg:flex items-center space-x-3">
              <Link to="/profil">
                <Button variant="ghost" className="flex items-center space-x-1">
                  <User className="h-5 w-5" />
                  <span>{user?.name}</span>
                </Button>
              </Link>
              <Button onClick={logout} variant="outline" className="text-gray-800">
                Çıkış Yap
              </Button>
            </div>
          ) : (
            <div className="hidden lg:block">
              <Link to="/giris">
                <Button variant="outline" className="mr-2">
                  Giriş Yap
                </Button>
              </Link>
              <Link to="/kayit">
                <Button>Kayıt Ol</Button>
              </Link>
            </div>
          )}

          {/* Mobile Menu Toggle */}
          <button
            onClick={toggleMenu}
            className="lg:hidden text-gray-800 hover:text-restaurant-700"
            aria-label="Toggle menu"
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isMenuOpen && (
        <div className="lg:hidden bg-white border-t">
          <div className="container mx-auto py-4 px-4 space-y-4">
            <Link
              to="/"
              className="block py-2 text-gray-800 hover:text-restaurant-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Ana Sayfa
            </Link>
            <Link
              to="/menu"
              className="block py-2 text-gray-800 hover:text-restaurant-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Menü
            </Link>
            <Link
              to="/siparis"
              className="block py-2 text-gray-800 hover:text-restaurant-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Sipariş Ver
            </Link>
            <Link
              to="/hakkimizda"
              className="block py-2 text-gray-800 hover:text-restaurant-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              Hakkımızda
            </Link>
            <Link
              to="/iletisim"
              className="block py-2 text-gray-800 hover:text-restaurant-700 font-medium"
              onClick={() => setIsMenuOpen(false)}
            >
              İletişim
            </Link>

            <div className="pt-4 border-t">
              {isAuthenticated ? (
                <>
                  <Link
                    to="/profil"
                    className="block py-2 text-gray-800 hover:text-restaurant-700 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Profilim
                  </Link>
                  <button
                    onClick={() => {
                      logout();
                      setIsMenuOpen(false);
                    }}
                    className="block py-2 text-gray-800 hover:text-restaurant-700 font-medium w-full text-left"
                  >
                    Çıkış Yap
                  </button>
                </>
              ) : (
                <>
                  <Link
                    to="/giris"
                    className="block py-2 text-gray-800 hover:text-restaurant-700 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Giriş Yap
                  </Link>
                  <Link
                    to="/kayit"
                    className="block py-2 text-gray-800 hover:text-restaurant-700 font-medium"
                    onClick={() => setIsMenuOpen(false)}
                  >
                    Kayıt Ol
                  </Link>
                </>
              )}
            </div>
          </div>
        </div>
      )}
    </header>
  );
}
