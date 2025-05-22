
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { useAuth } from "@/hooks/use-auth";
import { menuAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { toast } from "sonner";
import { Plus, Edit, Trash2, X } from "lucide-react";
import { Navigate } from "react-router-dom";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";

interface MenuItem {
  food_id: string;
  name: string;
  description: string;
  category: string;
  price_dine_in: string;
  price_takeaway: string;
  image: string | null;
  availability: boolean;
  created_at: string;
  updated_at: string;
}

interface FoodForm {
  name: string;
  description: string;
  category: string;
  price_dine_in: string;
  price_takeaway: string;
  availability: boolean;
  image: File | null;
}

const AdminMenu = () => {
  const { isAuthenticated, user } = useAuth();
  const [menuItems, setMenuItems] = useState<MenuItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [categories, setCategories] = useState<string[]>([]);
  const [activeCategory, setActiveCategory] = useState<string>("");
  const [showAddForm, setShowAddForm] = useState(false);
  const [showEditForm, setShowEditForm] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [selectedFoodId, setSelectedFoodId] = useState<string | null>(null);
  
  const [newFood, setNewFood] = useState<FoodForm>({
    name: "",
    description: "",
    category: "",
    price_dine_in: "",
    price_takeaway: "",
    availability: true,
    image: null
  });

  const [editFood, setEditFood] = useState<FoodForm>({
    name: "",
    description: "",
    category: "",
    price_dine_in: "",
    price_takeaway: "",
    availability: true,
    image: null
  });

  useEffect(() => {
    fetchMenuItems();
  }, []);
  
  const fetchMenuItems = async () => {
    try {
      setLoading(true);
      const data = await menuAPI.getAllFoods();
      setMenuItems(data);
      
      // Kategorileri çıkar
      const uniqueCategories = Array.from(
        new Set(data.map((item: MenuItem) => item.category))
      );
      
      setCategories(uniqueCategories as string[]);
      if (uniqueCategories.length > 0 && !activeCategory) {
        setActiveCategory(uniqueCategories[0] as string);
      }
      
      setLoading(false);
    } catch (error) {
      console.error("Menü öğeleri yüklenirken hata:", error);
      toast.error("Menü öğeleri yüklenirken bir hata oluştu");
      setLoading(false);
    }
  };
  
  const openEditModal = (item: MenuItem) => {
    setEditFood({
      name: item.name,
      description: item.description,
      category: item.category,
      price_dine_in: item.price_dine_in,
      price_takeaway: item.price_takeaway,
      availability: item.availability,
      image: null
    });
    setSelectedFoodId(item.food_id);
    setShowEditForm(true);
  };
  
  const openDeleteModal = (id: string) => {
    setSelectedFoodId(id);
    setShowDeleteConfirm(true);
  };
  
  const handleAddFood = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append("name", newFood.name);
      formData.append("description", newFood.description);
      formData.append("category", newFood.category);
      formData.append("price_dine_in", newFood.price_dine_in);
      formData.append("price_takeaway", newFood.price_takeaway);
      formData.append("availability", newFood.availability ? "true" : "false");
      
      if (newFood.image) {
        formData.append("image", newFood.image);
      }
      
      await menuAPI.createFood(formData);
      
      toast.success("Yemek başarıyla eklendi");
      setNewFood({
        name: "",
        description: "",
        category: "",
        price_dine_in: "",
        price_takeaway: "",
        availability: true,
        image: null
      });
      setShowAddForm(false);
      fetchMenuItems();
    } catch (error) {
      console.error("Yemek eklenirken hata:", error);
      toast.error("Yemek eklenirken bir hata oluştu");
    }
  };
  
  const handleUpdateFood = async (e: React.FormEvent) => {
    e.preventDefault();
    
    try {
      const formData = new FormData();
      formData.append("name", editFood.name);
      formData.append("description", editFood.description);
      formData.append("category", editFood.category);
      formData.append("price_dine_in", editFood.price_dine_in);
      formData.append("price_takeaway", editFood.price_takeaway);
      formData.append("availability", editFood.availability ? "true" : "false");
      
      if (editFood.image) {
        formData.append("image", editFood.image);
      }
      
      await menuAPI.updateFood(selectedFoodId!, formData);
      
      toast.success("Yemek başarıyla güncellendi");
      setShowEditForm(false);
      fetchMenuItems();
    } catch (error) {
      console.error("Yemek güncellenirken hata:", error);
      toast.error("Yemek güncellenirken bir hata oluştu");
    }
  };
  
  const handleDeleteFood = async () => {
    try {
      await menuAPI.deleteFood(selectedFoodId!);
      
      toast.success("Yemek başarıyla silindi");
      setShowDeleteConfirm(false);
      fetchMenuItems();
    } catch (error) {
      console.error("Yemek silinirken hata:", error);
      toast.error("Yemek silinirken bir hata oluştu");
    }
  };
  
  // Admin değilse yönlendir
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  const filteredItems = activeCategory
    ? menuItems.filter(item => item.category === activeCategory)
    : [];

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold">Menü Yönetimi</h1>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Yeni Yemek Ekle
          </Button>
        </div>

        <div className="flex flex-col md:flex-row gap-6">
          <div className="md:w-64 space-y-2">
            <h2 className="font-semibold text-lg mb-2">Kategoriler</h2>
            {categories.map(category => (
              <button
                key={category}
                onClick={() => setActiveCategory(category)}
                className={`w-full text-left px-4 py-2 rounded-md ${
                  activeCategory === category 
                    ? "bg-restaurant-700 text-white" 
                    : "bg-gray-100 hover:bg-gray-200"
                }`}
              >
                {category}
              </button>
            ))}
          </div>

          <div className="flex-1">
            {loading ? (
              <div className="flex justify-center items-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-restaurant-700"></div>
              </div>
            ) : (
              <>
                {filteredItems.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500 mb-4">Bu kategoride ürün bulunamadı.</p>
                    <Button onClick={() => setShowAddForm(true)}>Yeni Ürün Ekle</Button>
                  </div>
                ) : (
                  <div className="bg-white shadow rounded-lg overflow-hidden">
                    <table className="min-w-full divide-y divide-gray-200">
                      <thead className="bg-gray-50">
                        <tr>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Ürün
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Fiyat (Restoran / Paket)
                          </th>
                          <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                            Durum
                          </th>
                          <th scope="col" className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                            İşlemler
                          </th>
                        </tr>
                      </thead>
                      <tbody className="bg-white divide-y divide-gray-200">
                        {filteredItems.map((item) => (
                          <tr key={item.food_id}>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="flex items-center">
                                <div className="flex-shrink-0 h-10 w-10">
                                  <img 
                                    className="h-10 w-10 rounded-full object-cover" 
                                    src={item.image || "/placeholder.svg"} 
                                    alt={item.name} 
                                  />
                                </div>
                                <div className="ml-4">
                                  <div className="text-sm font-medium text-gray-900">{item.name}</div>
                                  <div className="text-sm text-gray-500 truncate max-w-xs">{item.description}</div>
                                </div>
                              </div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <div className="text-sm text-gray-900">{parseFloat(item.price_dine_in).toFixed(2)} ₺ / {parseFloat(item.price_takeaway).toFixed(2)} ₺</div>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap">
                              <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full ${
                                item.availability
                                  ? "bg-green-100 text-green-800"
                                  : "bg-red-100 text-red-800"
                              }`}>
                                {item.availability ? "Mevcut" : "Tükendi"}
                              </span>
                            </td>
                            <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-blue-600 hover:text-blue-800 mr-2"
                                onClick={() => openEditModal(item)}
                              >
                                <Edit className="h-4 w-4" />
                              </Button>
                              <Button 
                                variant="ghost" 
                                size="sm"
                                className="text-red-600 hover:text-red-800"
                                onClick={() => openDeleteModal(item.food_id)}
                              >
                                <Trash2 className="h-4 w-4" />
                              </Button>
                            </td>
                          </tr>
                        ))}
                      </tbody>
                    </table>
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>

      {/* Ürün Ekle Dialog */}
      <Dialog open={showAddForm} onOpenChange={setShowAddForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Yeni Ürün Ekle</DialogTitle>
            <DialogDescription>
              Menüye eklemek istediğiniz ürünün bilgilerini giriniz.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleAddFood} className="space-y-4">
            <div>
              <label htmlFor="name" className="block text-sm font-medium text-gray-700 mb-1">
                Ürün Adı
              </label>
              <input
                type="text"
                id="name"
                value={newFood.name}
                onChange={(e) => setNewFood({...newFood, name: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-restaurant-700"
              />
            </div>

            <div>
              <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <textarea
                id="description"
                rows={3}
                value={newFood.description}
                onChange={(e) => setNewFood({...newFood, description: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-restaurant-700"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="category" className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <div className="relative">
                  <select
                    id="category"
                    value={newFood.category}
                    onChange={(e) => setNewFood({...newFood, category: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-restaurant-700 bg-white"
                  >
                    <option value="" disabled>Kategori seçin</option>
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                    <option value="other">Yeni Kategori</option>
                  </select>
                </div>
              </div>

              <div>
                {newFood.category === "other" && (
                  <div>
                    <label htmlFor="newCategory" className="block text-sm font-medium text-gray-700 mb-1">
                      Yeni Kategori
                    </label>
                    <input
                      type="text"
                      id="newCategory"
                      value={newFood.category === "other" ? "" : newFood.category}
                      onChange={(e) => setNewFood({...newFood, category: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-restaurant-700"
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="price_dine_in" className="block text-sm font-medium text-gray-700 mb-1">
                  Restoran Fiyatı (₺)
                </label>
                <input
                  type="number"
                  id="price_dine_in"
                  min="0"
                  step="0.01"
                  value={newFood.price_dine_in}
                  onChange={(e) => setNewFood({...newFood, price_dine_in: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-restaurant-700"
                />
              </div>

              <div>
                <label htmlFor="price_takeaway" className="block text-sm font-medium text-gray-700 mb-1">
                  Paket Fiyatı (₺)
                </label>
                <input
                  type="number"
                  id="price_takeaway"
                  min="0"
                  step="0.01"
                  value={newFood.price_takeaway}
                  onChange={(e) => setNewFood({...newFood, price_takeaway: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-restaurant-700"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="availability"
                checked={newFood.availability}
                onChange={(e) => setNewFood({...newFood, availability: e.target.checked})}
                className="h-4 w-4 text-restaurant-700 focus:ring-restaurant-500 border-gray-300 rounded"
              />
              <label htmlFor="availability" className="ml-2 block text-sm text-gray-900">
                Stokta mevcut
              </label>
            </div>

            <div>
              <label htmlFor="image" className="block text-sm font-medium text-gray-700 mb-1">
                Ürün Görseli
              </label>
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setNewFood({...newFood, image: e.target.files[0]});
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-restaurant-700"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowAddForm(false)}>
                İptal
              </Button>
              <Button type="submit">Ekle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Ürün Düzenle Dialog */}
      <Dialog open={showEditForm} onOpenChange={setShowEditForm}>
        <DialogContent className="sm:max-w-lg">
          <DialogHeader>
            <DialogTitle>Ürünü Düzenle</DialogTitle>
            <DialogDescription>
              Ürün bilgilerini güncelleyin.
            </DialogDescription>
          </DialogHeader>

          <form onSubmit={handleUpdateFood} className="space-y-4">
            <div>
              <label htmlFor="edit_name" className="block text-sm font-medium text-gray-700 mb-1">
                Ürün Adı
              </label>
              <input
                type="text"
                id="edit_name"
                value={editFood.name}
                onChange={(e) => setEditFood({...editFood, name: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-restaurant-700"
              />
            </div>

            <div>
              <label htmlFor="edit_description" className="block text-sm font-medium text-gray-700 mb-1">
                Açıklama
              </label>
              <textarea
                id="edit_description"
                rows={3}
                value={editFood.description}
                onChange={(e) => setEditFood({...editFood, description: e.target.value})}
                required
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-restaurant-700"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label htmlFor="edit_category" className="block text-sm font-medium text-gray-700 mb-1">
                  Kategori
                </label>
                <div className="relative">
                  <select
                    id="edit_category"
                    value={editFood.category}
                    onChange={(e) => setEditFood({...editFood, category: e.target.value})}
                    required
                    className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-restaurant-700 bg-white"
                  >
                    {categories.map(category => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                    <option value="other">Yeni Kategori</option>
                  </select>
                </div>
              </div>

              <div>
                {editFood.category === "other" && (
                  <div>
                    <label htmlFor="edit_newCategory" className="block text-sm font-medium text-gray-700 mb-1">
                      Yeni Kategori
                    </label>
                    <input
                      type="text"
                      id="edit_newCategory"
                      value={editFood.category === "other" ? "" : editFood.category}
                      onChange={(e) => setEditFood({...editFood, category: e.target.value})}
                      required
                      className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-restaurant-700"
                    />
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="edit_price_dine_in" className="block text-sm font-medium text-gray-700 mb-1">
                  Restoran Fiyatı (₺)
                </label>
                <input
                  type="number"
                  id="edit_price_dine_in"
                  min="0"
                  step="0.01"
                  value={editFood.price_dine_in}
                  onChange={(e) => setEditFood({...editFood, price_dine_in: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-restaurant-700"
                />
              </div>

              <div>
                <label htmlFor="edit_price_takeaway" className="block text-sm font-medium text-gray-700 mb-1">
                  Paket Fiyatı (₺)
                </label>
                <input
                  type="number"
                  id="edit_price_takeaway"
                  min="0"
                  step="0.01"
                  value={editFood.price_takeaway}
                  onChange={(e) => setEditFood({...editFood, price_takeaway: e.target.value})}
                  required
                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-restaurant-700"
                />
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="edit_availability"
                checked={editFood.availability}
                onChange={(e) => setEditFood({...editFood, availability: e.target.checked})}
                className="h-4 w-4 text-restaurant-700 focus:ring-restaurant-500 border-gray-300 rounded"
              />
              <label htmlFor="edit_availability" className="ml-2 block text-sm text-gray-900">
                Stokta mevcut
              </label>
            </div>

            <div>
              <label htmlFor="edit_image" className="block text-sm font-medium text-gray-700 mb-1">
                Ürün Görseli (Değiştirmek istiyorsanız)
              </label>
              <input
                type="file"
                id="edit_image"
                accept="image/*"
                onChange={(e) => {
                  if (e.target.files?.[0]) {
                    setEditFood({...editFood, image: e.target.files[0]});
                  }
                }}
                className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-restaurant-700"
              />
            </div>

            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setShowEditForm(false)}>
                İptal
              </Button>
              <Button type="submit">Güncelle</Button>
            </DialogFooter>
          </form>
        </DialogContent>
      </Dialog>

      {/* Silme Onayı Dialog */}
      <Dialog open={showDeleteConfirm} onOpenChange={setShowDeleteConfirm}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Ürünü Sil</DialogTitle>
            <DialogDescription>
              Bu ürünü silmek istediğinize emin misiniz? Bu işlem geri alınamaz.
            </DialogDescription>
          </DialogHeader>
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowDeleteConfirm(false)}>
              İptal
            </Button>
            <Button variant="destructive" onClick={handleDeleteFood}>
              Sil
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default AdminMenu;
