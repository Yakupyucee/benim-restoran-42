
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { useCart } from "@/hooks/use-cart";
import { Badge } from "@/components/ui/badge";
import { menuAPI, reviewAPI } from "@/services/api";
import { toast } from "sonner";
import { Link } from "react-router-dom";
import { Star } from "lucide-react";

interface MenuItem {
  food_id: string;
  name: string;
  description: string;
  category: string;
  price_dine_in: string;
  price_takeaway: string;
  image: string | null;
  availability: boolean;
}

interface Category {
  id: string;
  name: string;
}

interface FoodRatings {
  [key: string]: number;
}

const Menu = () => {
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [categories, setCategories] = useState<Category[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [loading, setLoading] = useState(true);
  const [foodRatings, setFoodRatings] = useState<FoodRatings>({});
  const { addItem } = useCart();

  useEffect(() => {
    // Tüm menü öğelerini getir
    const fetchMenu = async () => {
      try {
        setLoading(true);
        const data = await menuAPI.getAllFoods();
        setMenuItems(data);

        // Kategorileri çıkar
        const uniqueCategories = Array.from(
          new Set(data.map((item: MenuItem) => item.category))
        ).map((category) => ({
          id: category as string,
          name: category as string,
        }));

        setCategories(uniqueCategories);
        
        // İlk kategoriyi aktif olarak ayarla
        if (uniqueCategories.length > 0 && !activeCategory) {
          setActiveCategory(uniqueCategories[0].id);
        }
        
        setLoading(false);
      } catch (error) {
        console.error("Menü yüklenirken hata:", error);
        toast.error("Menü yüklenirken bir hata oluştu");
        setLoading(false);
      }
    };

    fetchMenu();
  }, []);

  // Her kategoriye göre ilk birkaç yemeğin puanlarını al
  useEffect(() => {
    const fetchRatings = async () => {
      try {
        const ratingsObj: FoodRatings = {};
        
        // Sadece görüntülenen kategorideki yemekler için yorum derecelerini getir
        const visibleItems = menuItems.filter(item => item.category === activeCategory && item.availability);
        
        for (const item of visibleItems) {
          try {
            const reviewData = await reviewAPI.getReviewsByFoodId(item.food_id);
            ratingsObj[item.food_id] = reviewData.average_rating;
          } catch (error) {
            console.error(`${item.food_id} için puanlar alınamadı:`, error);
            ratingsObj[item.food_id] = 0;
          }
        }
        
        setFoodRatings(ratingsObj);
      } catch (error) {
        console.error("Puanlar alınırken hata:", error);
      }
    };

    if (activeCategory && menuItems.length > 0) {
      fetchRatings();
    }
  }, [activeCategory, menuItems]);

  // Seçili kategoriye göre menü öğelerini filtrele
  const categoryItems = activeCategory
    ? menuItems.filter((item) => item.category === activeCategory && item.availability)
    : [];

  const activeTab = categories.find((cat) => cat.id === activeCategory);

  const handleAddToCart = (item: MenuItem) => {
    addItem({
      id: item.food_id,
      name: item.name,
      price: parseFloat(item.price_dine_in),
      image: item.image || "/placeholder.svg"
    });
    
    toast.success(`${item.name} sepete eklendi`);
  };

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl md:text-4xl font-bold mb-8">Menümüz</h1>
        
        {loading ? (
          <div className="flex justify-center items-center h-64">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-restaurant-700"></div>
          </div>
        ) : (
          <>
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
            
            {/* Kategori başlığı */}
            {activeTab && (
              <div className="mb-8">
                <h2 className="text-2xl font-bold mb-2">{activeTab.name}</h2>
              </div>
            )}
            
            {/* Menü öğeleri */}
            {categoryItems.length === 0 ? (
              <div className="text-center py-8">
                <p className="text-gray-600">Bu kategoride ürün bulunamadı.</p>
              </div>
            ) : (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                {categoryItems.map((item) => (
                  <div
                    key={item.food_id}
                    className="bg-white rounded-lg shadow overflow-hidden card-hover"
                  >
                    <Link to={`/menu/${item.food_id}`}>
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.name}
                        className="w-full h-48 object-cover cursor-pointer"
                      />
                    </Link>
                    <div className="p-5">
                      <div className="flex justify-between items-start mb-2">
                        <Link to={`/menu/${item.food_id}`} className="hover:text-restaurant-700">
                          <h3 className="font-bold text-xl">{item.name}</h3>
                        </Link>
                        <div className="text-right">
                          <span className="font-semibold text-restaurant-700">
                            {parseFloat(item.price_dine_in).toFixed(2)} ₺
                          </span>
                          {parseFloat(item.price_takeaway) < parseFloat(item.price_dine_in) && (
                            <div className="text-sm text-gray-500">
                              Paket: {parseFloat(item.price_takeaway).toFixed(2)} ₺
                            </div>
                          )}
                        </div>
                      </div>
                      
                      {foodRatings[item.food_id] !== undefined && (
                        <div className="flex items-center mb-2">
                          <div className="flex space-x-1">
                            {[1, 2, 3, 4, 5].map((star) => (
                              <Star 
                                key={star} 
                                className={`h-4 w-4 ${star <= foodRatings[item.food_id] ? "fill-yellow-400 text-yellow-400" : "text-gray-300"}`}
                              />
                            ))}
                          </div>
                          <span className="ml-2 text-xs text-gray-500">
                            ({foodRatings[item.food_id].toFixed(1)})
                          </span>
                        </div>
                      )}
                      
                      <p className="text-gray-600 mb-4 line-clamp-2">{item.description}</p>
                      
                      <div className="flex justify-between items-center mt-4">
                        <Link to={`/menu/${item.food_id}`}>
                          <Button variant="outline" size="sm">Detaylar</Button>
                        </Link>
                        <Button
                          onClick={() => handleAddToCart(item)}
                        >
                          Sepete Ekle
                        </Button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Menu;
