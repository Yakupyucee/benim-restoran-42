
import React from "react";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useAuth } from "@/hooks/use-auth";
import { Utensils, Coffee, ShoppingCart, Settings } from "lucide-react";

const Index = () => {
  const { isAuthenticated, user } = useAuth();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="relative bg-restaurant-700 text-white py-16 px-4 sm:px-6 lg:px-8 rounded-lg overflow-hidden">
        <div className="max-w-7xl mx-auto">
          <div className="relative z-10">
            <div className="flex items-center justify-center mb-6">
              <span className="text-4xl md:text-5xl font-bold text-white italic">Benim</span>
              <span className="text-4xl md:text-5xl font-light text-white ml-2">Restoranım</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-extrabold tracking-tight mb-4">
              Lezzetli Yemekler, Hızlı Servis
            </h1>
            <p className="text-xl max-w-3xl mb-8">
              En taze malzemelerle hazırlanan eşsiz lezzetleri keşfedin.
              Restoranımızda yiyin veya eve sipariş verin.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu">
                <Button size="lg" className="bg-white text-restaurant-700 hover:bg-gray-100">
                  Menüyü Görüntüle
                </Button>
              </Link>
              {isAuthenticated ? (
                <Link to="/siparis">
                  <Button size="lg" variant="outline" className="text-red-500 border-white hover:bg-restaurant-600">
                    Sipariş Ver
                  </Button>
                </Link>
              ) : (
                <Link to="/giris">
                  <Button size="lg" variant="outline" className="text-red-500 border-white hover:bg-restaurant-600">
                    Giriş Yap
                  </Button>
                </Link>
              )}
            </div>
          </div>
        </div>
        <div
          className="absolute inset-0 bg-cover bg-center opacity-20"
          style={{ backgroundImage: "url('/food-background.jpg')" }}
        ></div>
      </section>

      {/* Role-based Features Section */}
      {isAuthenticated && (
        <section className="py-12">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <h2 className="text-3xl font-bold text-gray-900 mb-8">
              Hoş geldiniz, {user?.name}!
            </h2>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Admin için özel kartlar */}
              {user?.role === "admin" ? (
                <>
                  <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="w-12 h-12 bg-restaurant-100 rounded-lg flex items-center justify-center mb-4">
                        <Settings className="h-6 w-6 text-restaurant-700" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Admin Paneli</h3>
                      <p className="text-gray-600 mb-4">
                        Restoran ve menü yönetimi için admin paneline erişin.
                      </p>
                      <Link to="/admin">
                        <Button className="w-full">
                          Panele Git
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="w-12 h-12 bg-restaurant-100 rounded-lg flex items-center justify-center mb-4">
                        <Utensils className="h-6 w-6 text-restaurant-700" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Menü Yönetimi</h3>
                      <p className="text-gray-600 mb-4">
                        Yeni yemekler ekleyin, mevcut yemekleri düzenleyin veya silin.
                      </p>
                      <Link to="/admin/menu">
                        <Button className="w-full">
                          Menüyü Yönet
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="w-12 h-12 bg-restaurant-100 rounded-lg flex items-center justify-center mb-4">
                        <ShoppingCart className="h-6 w-6 text-restaurant-700" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Sipariş Yönetimi</h3>
                      <p className="text-gray-600 mb-4">
                        Gelen siparişleri görüntüleyin ve durumlarını güncelleyin.
                      </p>
                      <Link to="/admin/siparisler">
                        <Button className="w-full">
                          Siparişleri Yönet
                        </Button>
                      </Link>
                    </div>
                  </div>
                </>
              ) : (
                <>
                  {/* Normal kullanıcılar için kartlar */}
                  <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="w-12 h-12 bg-restaurant-100 rounded-lg flex items-center justify-center mb-4">
                        <Coffee className="h-6 w-6 text-restaurant-700" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Menüyü Keşfedin</h3>
                      <p className="text-gray-600 mb-4">
                        Restoranımızın zengin menüsünü keşfedin ve favori yemeklerinizi bulun.
                      </p>
                      <Link to="/menu">
                        <Button className="w-full">
                          Menüye Git
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="w-12 h-12 bg-restaurant-100 rounded-lg flex items-center justify-center mb-4">
                        <ShoppingCart className="h-6 w-6 text-restaurant-700" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Sipariş Verin</h3>
                      <p className="text-gray-600 mb-4">
                        Eve teslim veya restoranda yemek için hemen sipariş verin.
                      </p>
                      <Link to="/siparis">
                        <Button className="w-full">
                          Sipariş Ver
                        </Button>
                      </Link>
                    </div>
                  </div>
                  
                  <div className="bg-white shadow-md rounded-lg overflow-hidden hover:shadow-lg transition-shadow">
                    <div className="p-6">
                      <div className="w-12 h-12 bg-restaurant-100 rounded-lg flex items-center justify-center mb-4">
                        <Utensils className="h-6 w-6 text-restaurant-700" />
                      </div>
                      <h3 className="text-xl font-bold mb-2">Profiliniz</h3>
                      <p className="text-gray-600 mb-4">
                        Profil bilgilerinizi görüntüleyin ve sipariş geçmişinize bakın.
                      </p>
                      <Link to="/profil">
                        <Button className="w-full">
                          Profile Git
                        </Button>
                      </Link>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>
        </section>
      )}
    </MainLayout>
  );
};

export default Index;
