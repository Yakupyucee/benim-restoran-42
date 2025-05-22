
import React, { useState } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { categories, menuItems, getMenuItemsByCategory } from "@/data/menu-data";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";

const Menu = () => {
  const [activeCategory, setActiveCategory] = useState(categories[0].id);
  const { addItem } = useCart();
  
  const categoryItems = getMenuItemsByCategory(activeCategory);
  const activeTab = categories.find(cat => cat.id === activeCategory);

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Menümüz</h1>
        
        {/* Kategoriler */}
        <div className="mb-8 overflow-x-auto">
          <div className="flex space-x-2 min-w-max pb-3">
            {categories.map((category) => (
              <button
                key={category.id}
                onClick={() => setActiveCategory(category.id)}
                className={`px-4 py-2 rounded-lg transition-all ${
                  activeCategory === category.id
                    ? "bg-restaurant-700 text-white"
                    : "bg-gray-100 hover:bg-gray-200 text-gray-800"
                }`}
              >
                {category.name}
              </button>
            ))}
          </div>
        </div>
        
        {/* Kategori başlığı ve açıklaması */}
        {activeTab && (
          <div className="mb-8">
            <h2 className="text-2xl font-bold mb-2">{activeTab.name}</h2>
            {activeTab.description && (
              <p className="text-gray-600">{activeTab.description}</p>
            )}
          </div>
        )}
        
        {/* Menü öğeleri */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {categoryItems.map((item) => (
            <div
              key={item.id}
              className="bg-white rounded-lg shadow overflow-hidden card-hover"
            >
              <img
                src={item.image || "/placeholder.svg"}
                alt={item.name}
                className="w-full h-48 object-cover"
              />
              <div className="p-5">
                <div className="flex justify-between items-start mb-2">
                  <h3 className="font-bold text-xl">{item.name}</h3>
                  <div>
                    {item.discount ? (
                      <div className="text-right">
                        <span className="line-through text-gray-400 text-sm mr-2">
                          {item.price} ₺
                        </span>
                        <span className="font-semibold text-restaurant-700">
                          {item.price - (item.price * item.discount / 100)} ₺
                        </span>
                      </div>
                    ) : (
                      <span className="font-semibold text-restaurant-700">
                        {item.price} ₺
                      </span>
                    )}
                  </div>
                </div>
                
                {/* Rozetler */}
                <div className="flex flex-wrap gap-2 mb-3">
                  {item.isPopular && (
                    <Badge variant="default" className="bg-restaurant-500">Popüler</Badge>
                  )}
                  {item.isVegetarian && (
                    <Badge variant="outline" className="text-green-700 border-green-700">Vejetaryen</Badge>
                  )}
                  {item.isSpicy && (
                    <Badge variant="outline" className="text-red-600 border-red-600">Acılı</Badge>
                  )}
                </div>
                
                <p className="text-gray-600 mb-4">{item.description}</p>
                
                {item.ingredients && (
                  <p className="text-sm text-gray-500 mb-4">
                    <span className="font-medium">İçindekiler:</span> {item.ingredients.join(", ")}
                  </p>
                )}
                
                <div className="flex justify-between items-center mt-4">
                  <div className="text-sm text-gray-500">
                    {item.takeawayPrice && (
                      <div>Paket Servis: {item.takeawayPrice} ₺</div>
                    )}
                  </div>
                  <Button
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
            </div>
          ))}
        </div>
      </div>
    </MainLayout>
  );
};

export default Menu;
