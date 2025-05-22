
import React from "react";
import { MainLayout } from "@/layouts/main-layout";
import { Link } from "react-router-dom";
import { menuItems, getPopularItems } from "@/data/menu-data";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";

const Index = () => {
  const popularItems = getPopularItems();
  const { addItem } = useCart();

  return (
    <MainLayout>
      {/* Hero Section */}
      <section className="bg-restaurant-700 text-white rounded-lg p-8 md:p-12 mb-8">
        <div className="container mx-auto flex flex-col md:flex-row items-center">
          <div className="md:w-1/2 mb-6 md:mb-0">
            <h1 className="text-4xl md:text-5xl font-bold mb-4">Benim Restoranım'a Hoş Geldiniz</h1>
            <p className="text-xl mb-6">
              Lezzetli yemekler, kaliteli hizmet ve özel tatlar sizleri bekliyor.
            </p>
            <div className="flex flex-wrap gap-4">
              <Link to="/menu">
                <Button size="lg" className="bg-white text-restaurant-700 hover:bg-gray-100">
                  Menüyü Gör
                </Button>
              </Link>
              <Link to="/siparis">
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-restaurant-800">
                  Sipariş Ver
                </Button>
              </Link>
            </div>
          </div>
          <div className="md:w-1/2 md:pl-8">
            <img
              src="https://images.unsplash.com/photo-1498050108023-c5249f4df085?auto=format&fit=crop&w=600"
              alt="Restoran yemekleri"
              className="rounded-lg shadow-lg"
            />
          </div>
        </div>
      </section>

      {/* Popüler Yemekler */}
      <section className="mb-12">
        <div className="flex justify-between items-center mb-6">
          <h2 className="text-2xl md:text-3xl font-bold">Popüler Yemeklerimiz</h2>
          <Link to="/menu" className="text-restaurant-700 hover:text-restaurant-800 font-medium">
            Tümünü Gör &rarr;
          </Link>
        </div>
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {popularItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow-md overflow-hidden card-hover"
            >
              <img
                src={item.image}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-4">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl">{item.name}</h3>
                  <span className="font-semibold text-restaurant-700">
                    {item.price} ₺
                  </span>
                </div>
                <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                <Button 
                  className="w-full" 
                  onClick={() => addItem({
                    id: item.id,
                    name: item.name,
                    price: item.price,
                    image: item.image
                  })}
                >
                  Sepete Ekle
                </Button>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* Özellikler */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6 text-center">Neden Biz?</h2>
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-4xl text-restaurant-700 mb-3">🍽️</div>
            <h3 className="text-xl font-bold mb-2">Taze Malzemeler</h3>
            <p className="text-gray-600">
              Günlük taze malzemeler ile hazırlanan özel lezzetler
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-4xl text-restaurant-700 mb-3">🚚</div>
            <h3 className="text-xl font-bold mb-2">Hızlı Teslimat</h3>
            <p className="text-gray-600">
              30 dakika içinde kapınızda veya paranız iade
            </p>
          </div>
          <div className="bg-white p-6 rounded-lg shadow text-center">
            <div className="text-4xl text-restaurant-700 mb-3">💳</div>
            <h3 className="text-xl font-bold mb-2">Güvenli Ödeme</h3>
            <p className="text-gray-600">
              Güvenli ödeme seçenekleri ile kolayca ödeme yapın
            </p>
          </div>
        </div>
      </section>

      {/* Kampanya Banner */}
      <section className="bg-restaurant-50 border border-restaurant-100 rounded-lg p-6 mb-12">
        <div className="text-center">
          <span className="inline-block bg-restaurant-700 text-white text-sm font-medium px-3 py-1 rounded-full mb-3">
            ÖZEL TEKLİF
          </span>
          <h2 className="text-2xl md:text-3xl font-bold mb-4">
            İlk Siparişinize Özel %15 İndirim
          </h2>
          <p className="text-lg text-gray-600 mb-6 max-w-2xl mx-auto">
            Yeni üye olan müşterilerimize ilk siparişlerinde geçerli %15 indirim sunuyoruz. Hemen kayıt olun ve bu fırsatı kaçırmayın!
          </p>
          <Link to="/kayit">
            <Button size="lg">Şimdi Kayıt Ol</Button>
          </Link>
        </div>
      </section>

      {/* Müşteri Yorumları */}
      <section className="mb-12">
        <h2 className="text-2xl md:text-3xl font-bold mb-6">Müşteri Yorumları</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center text-restaurant-500 mb-2">
              ★★★★★
            </div>
            <p className="text-gray-600 italic mb-4">
              "İnanılmaz lezzetli yemekler ve çok hızlı servis. Özellikle ızgara köfte favorim oldu. Kesinlikle tekrar geleceğim."
            </p>
            <div className="font-semibold">Ahmet Y.</div>
          </div>
          <div className="bg-white p-6 rounded-lg shadow">
            <div className="flex items-center text-restaurant-500 mb-2">
              ★★★★★
            </div>
            <p className="text-gray-600 italic mb-4">
              "Eve siparişimiz çok hızlı geldi ve yemekler hala sıcaktı. Baklava ise gerçekten harika. Teşekkürler!"
            </p>
            <div className="font-semibold">Ayşe K.</div>
          </div>
        </div>
      </section>
    </MainLayout>
  );
};

export default Index;
