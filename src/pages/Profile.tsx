
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { useAuth } from "@/hooks/use-auth";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";
import { authAPI, addressAPI, orderAPI, menuAPI } from "@/services/api";

interface Address {
  address_id: string;
  user_id: string;
  street: string;
  city: string;
  zip_code: string;
  created_at: string;
}

interface OrderItem {
  order_item_id: string;
  food_id: string;
  quantity: number;
  price: string;
  name?: string; // Yemek adını tutacak alan ekledik
}

interface Order {
  order_id: string;
  user_id: string;
  total_price: string;
  delivery_address: string | null;
  table_number: number | null;
  order_type: "dine_in" | "takeaway";
  order_status: "pending" | "preparing" | "completed" | "cancelled";
  created_at: string;
  updated_at: string;
  items: OrderItem[];
}

interface MenuItem {
  food_id: string;
  name: string;
  price_dine_in: string;
  price_takeaway: string;
  description: string;
  category: string;
  image: string | null;
  availability: boolean;
}

const Profile = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<{[key: string]: MenuItem}>({});
  const [loading, setLoading] = useState(true);
  
  // Form state
  const [name, setName] = useState("");
  const [phone, setPhone] = useState("");
  const [currentPassword, setCurrentPassword] = useState("");
  const [newPassword, setNewPassword] = useState("");
  const [confirmNewPassword, setConfirmNewPassword] = useState("");
  const [formSubmitting, setFormSubmitting] = useState(false);
  
  // Yeni adres alanları
  const [showNewAddressForm, setShowNewAddressForm] = useState(false);
  const [newStreet, setNewStreet] = useState("");
  const [newCity, setNewCity] = useState("");
  const [newZipCode, setNewZipCode] = useState("");
  
  useEffect(() => {
    if (isAuthenticated && user) {
      fetchUserData();
    }
  }, [isAuthenticated, user]);
  
  const fetchUserData = async () => {
    setLoading(true);
    try {
      // Kullanıcı profili
      const profileData = await authAPI.getProfile();
      setName(profileData.name || "");
      setPhone(profileData.phone || "");
      
      // Adresler
      const addressesData = await addressAPI.getAllAddresses();
      setAddresses(addressesData);
      
      // Siparişler
      const ordersData = await orderAPI.getAllOrders();
      
      // Menü öğelerini al
      const menuData = await menuAPI.getAllFoods();
      const menuMap = menuData.reduce((acc: {[key: string]: MenuItem}, item: MenuItem) => {
        acc[item.food_id] = item;
        return acc;
      }, {});
      setMenuItems(menuMap);
      
      // Siparişlerdeki ürünlere isim ekle
      const ordersWithFoodNames = ordersData.map((order: Order) => {
        const itemsWithNames = order.items.map(item => {
          const menuItem = menuMap[item.food_id];
          return {
            ...item,
            name: menuItem ? menuItem.name : "Bilinmeyen Ürün"
          };
        });
        return {
          ...order,
          items: itemsWithNames
        };
      });
      
      setOrders(ordersWithFoodNames);
    } catch (error) {
      console.error("Kullanıcı verileri yüklenirken hata:", error);
      toast.error("Kullanıcı bilgileriniz yüklenemedi");
    } finally {
      setLoading(false);
    }
  };
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/giris" replace />;
  }
  
  // Siparişleri durumlarına göre grupla
  const activeOrders = orders.filter(order => 
    order.order_status === "pending" || order.order_status === "preparing"
  );
  
  const completedOrders = orders.filter(order => 
    order.order_status === "completed" || order.order_status === "cancelled"
  );
  
  const handleProfileUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setFormSubmitting(true);
    
    try {
      await authAPI.updateProfile({
        name,
        phone
      });
      toast.success("Profil bilgileriniz güncellendi");
    } catch (error) {
      console.error("Profil güncelleme hatası:", error);
      toast.error("Profil güncellenirken bir hata oluştu");
    } finally {
      setFormSubmitting(false);
    }
  };
  
  const handlePasswordChange = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (newPassword !== confirmNewPassword) {
      toast.error("Yeni şifreler eşleşmiyor");
      return;
    }
    
    setFormSubmitting(true);
    
    try {
      await authAPI.resetPassword({
        email: user.email,
        old_password: currentPassword,
        new_password: newPassword,
        new_password_confirm: confirmNewPassword
      });
      
      toast.success("Şifreniz başarıyla değiştirildi");
      setCurrentPassword("");
      setNewPassword("");
      setConfirmNewPassword("");
    } catch (error) {
      console.error("Şifre değiştirme hatası:", error);
      toast.error("Şifre değiştirme işlemi başarısız oldu");
    } finally {
      setFormSubmitting(false);
    }
  };
  
  const handleAddAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    
    setFormSubmitting(true);
    
    try {
      await addressAPI.createAddress({
        street: newStreet,
        city: newCity,
        zip_code: newZipCode
      });
      
      toast.success("Adres başarıyla eklendi");
      setNewStreet("");
      setNewCity("");
      setNewZipCode("");
      setShowNewAddressForm(false);
      
      // Adresleri yeniden yükle
      const addressesData = await addressAPI.getAllAddresses();
      setAddresses(addressesData);
    } catch (error) {
      console.error("Adres ekleme hatası:", error);
      toast.error("Adres eklenirken bir hata oluştu");
    } finally {
      setFormSubmitting(false);
    }
  };
  
  const handleDeleteAddress = async (addressId: string) => {
    if (!confirm("Bu adresi silmek istediğinizden emin misiniz?")) {
      return;
    }
    
    try {
      await addressAPI.deleteAddress(addressId);
      toast.success("Adres başarıyla silindi");
      
      // Adres listesini güncelle
      setAddresses(addresses.filter(addr => addr.address_id !== addressId));
    } catch (error) {
      console.error("Adres silme hatası:", error);
      toast.error("Adres silinirken bir hata oluştu");
    }
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('tr-TR', { 
      day: '2-digit', 
      month: '2-digit', 
      year: 'numeric', 
      hour: '2-digit', 
      minute: '2-digit' 
    }).format(date);
  };
  
  const getStatusBadgeClass = (status: string) => {
    switch (status) {
      case "pending":
        return "bg-yellow-100 text-yellow-800";
      case "preparing":
        return "bg-blue-100 text-blue-800";
      case "completed":
        return "bg-green-100 text-green-800";
      case "cancelled":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };
  
  const getStatusText = (status: string) => {
    switch (status) {
      case "pending":
        return "BEKLEMEDE";
      case "preparing":
        return "HAZIRLANIYOR";
      case "completed":
        return "TAMAMLANDI";
      case "cancelled":
        return "İPTAL EDİLDİ";
      default:
        return status.toUpperCase();
    }
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Hesabım</h1>
        
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Sidebar */}
          <div className="lg:w-1/4">
            <div className="bg-white shadow rounded-lg p-6 mb-6">
              <div className="text-center mb-4">
                <div className="w-20 h-20 rounded-full bg-gray-200 mx-auto mb-3 flex items-center justify-center text-2xl text-gray-600">
                  {user.name.substring(0, 1).toUpperCase()}
                </div>
                <h3 className="font-bold text-xl">{user.name}</h3>
                <p className="text-gray-600">{user.email}</p>
              </div>
              
              <div className="border-t pt-4">
                <ul>
                  <li>
                    <button
                      onClick={() => setActiveTab("profile")}
                      className={`w-full text-left py-2 px-3 mb-1 rounded ${
                        activeTab === "profile"
                          ? "bg-restaurant-700 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      Profil Bilgilerim
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("orders")}
                      className={`w-full text-left py-2 px-3 mb-1 rounded ${
                        activeTab === "orders"
                          ? "bg-restaurant-700 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      Siparişlerim
                    </button>
                  </li>
                  <li>
                    <button
                      onClick={() => setActiveTab("addresses")}
                      className={`w-full text-left py-2 px-3 mb-1 rounded ${
                        activeTab === "addresses"
                          ? "bg-restaurant-700 text-white"
                          : "hover:bg-gray-100"
                      }`}
                    >
                      Adreslerim
                    </button>
                  </li>
                </ul>
              </div>
            </div>
          </div>
          
          {/* Main Content */}
          <div className="lg:w-3/4">
            {loading ? (
              <div className="bg-white shadow rounded-lg p-6 flex items-center justify-center h-64">
                <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-restaurant-700"></div>
              </div>
            ) : (
              <>
                {activeTab === "profile" && (
                  <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Profil Bilgilerim</h2>
                    
                    <form onSubmit={handleProfileUpdate}>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Ad Soyad
                          </label>
                          <input
                            type="text"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            value={name}
                            onChange={(e) => setName(e.target.value)}
                          />
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            E-posta
                          </label>
                          <input
                            type="email"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md bg-gray-50"
                            value={user.email}
                            readOnly
                          />
                          <p className="text-sm text-gray-500 mt-1">
                            E-posta adresiniz değiştirilemez
                          </p>
                        </div>
                        
                        <div>
                          <label className="block text-gray-700 font-medium mb-2">
                            Telefon Numarası
                          </label>
                          <input
                            type="tel"
                            className="w-full px-4 py-2 border border-gray-300 rounded-md"
                            value={phone}
                            onChange={(e) => setPhone(e.target.value)}
                          />
                        </div>
                      </div>
                      
                      <div className="mt-6 text-right">
                        <Button type="submit" disabled={formSubmitting}>
                          {formSubmitting ? "Kaydediliyor..." : "Değişiklikleri Kaydet"}
                        </Button>
                      </div>
                    </form>
                    
                    <div className="mt-8 border-t pt-6">
                      <h3 className="font-semibold mb-4">Şifre Değiştir</h3>
                      
                      <form onSubmit={handlePasswordChange}>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Mevcut Şifre
                            </label>
                            <input
                              type="password"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md"
                              placeholder="••••••••"
                              value={currentPassword}
                              onChange={(e) => setCurrentPassword(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div></div>
                          
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Yeni Şifre
                            </label>
                            <input
                              type="password"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md"
                              placeholder="••••••••"
                              value={newPassword}
                              onChange={(e) => setNewPassword(e.target.value)}
                              required
                            />
                          </div>
                          
                          <div>
                            <label className="block text-gray-700 font-medium mb-2">
                              Yeni Şifre (Tekrar)
                            </label>
                            <input
                              type="password"
                              className="w-full px-4 py-2 border border-gray-300 rounded-md"
                              placeholder="••••••••"
                              value={confirmNewPassword}
                              onChange={(e) => setConfirmNewPassword(e.target.value)}
                              required
                            />
                          </div>
                        </div>
                        
                        <div className="mt-6 text-right">
                          <Button type="submit" disabled={formSubmitting}>
                            {formSubmitting ? "Kaydediliyor..." : "Şifre Değiştir"}
                          </Button>
                        </div>
                      </form>
                    </div>
                  </div>
                )}
                
                {activeTab === "orders" && (
                  <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Siparişlerim</h2>
                    
                    {orders.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-600 mb-4">Henüz hiç sipariş vermediniz.</p>
                        <Link to="/menu">
                          <Button>Hemen Sipariş Ver</Button>
                        </Link>
                      </div>
                    ) : (
                      <div className="space-y-6">
                        {/* Aktif Siparişler (Beklemede veya Hazırlanıyor) */}
                        {activeOrders.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold mb-3 text-restaurant-700">
                              Aktif Siparişleriniz
                            </h3>
                            <div className="space-y-4">
                              {activeOrders.map((order) => (
                                <div key={order.order_id} className="border rounded-lg overflow-hidden">
                                  <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div>
                                      <div className="flex items-center mb-1">
                                        <span className="font-semibold mr-2">Sipariş No:</span>
                                        <span>{order.order_id.substring(0, 8)}...</span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="text-gray-600 text-sm">
                                          {formatDate(order.created_at)}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="mt-2 sm:mt-0">
                                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(order.order_status)}`}>
                                        {getStatusText(order.order_status)}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="p-4">
                                    <div className="mb-4">
                                      {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                                          <div>
                                            <span className="font-medium">{item.name || "Bilinmeyen Ürün"}</span>
                                            <span className="text-gray-600 ml-2">x{item.quantity}</span>
                                          </div>
                                          <span>{parseFloat(item.price) * item.quantity} ₺</span>
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row justify-between border-t pt-4">
                                      <div>
                                        <p className="font-semibold mb-1">Sipariş Tipi</p>
                                        <p className="text-gray-700">{order.order_type === "dine_in" ? "Restoranda" : "Eve Sipariş"}</p>
                                        {order.order_type === "dine_in" && order.table_number && (
                                          <p className="text-gray-600 text-sm">Masa: {order.table_number}</p>
                                        )}
                                        {order.order_type === "takeaway" && order.delivery_address && (
                                          <p className="text-gray-600 text-sm">
                                            Adres ID: {order.delivery_address}
                                          </p>
                                        )}
                                      </div>
                                      
                                      <div className="mt-4 sm:mt-0 text-right">
                                        <p className="font-semibold mb-1">Toplam Tutar</p>
                                        <p className="text-xl font-bold text-restaurant-700">
                                          {parseFloat(order.total_price).toFixed(2)} ₺
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}

                        {/* Tamamlanmış veya İptal Edilmiş Siparişler */}
                        {completedOrders.length > 0 && (
                          <div>
                            <h3 className="text-lg font-semibold mb-3 pb-2 border-b">
                              Önceki Siparişleriniz
                            </h3>
                            <div className="space-y-4">
                              {completedOrders.map((order) => (
                                <div key={order.order_id} className="border rounded-lg overflow-hidden">
                                  <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                                    <div>
                                      <div className="flex items-center mb-1">
                                        <span className="font-semibold mr-2">Sipariş No:</span>
                                        <span>{order.order_id.substring(0, 8)}...</span>
                                      </div>
                                      <div className="flex items-center">
                                        <span className="text-gray-600 text-sm">
                                          {formatDate(order.created_at)}
                                        </span>
                                      </div>
                                    </div>
                                    <div className="mt-2 sm:mt-0">
                                      <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(order.order_status)}`}>
                                        {getStatusText(order.order_status)}
                                      </span>
                                    </div>
                                  </div>
                                  
                                  <div className="p-4">
                                    <div className="mb-4">
                                      {order.items.map((item, idx) => (
                                        <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                                          <div>
                                            <span className="font-medium">{item.name || "Bilinmeyen Ürün"}</span>
                                            <span className="text-gray-600 ml-2">x{item.quantity}</span>
                                          </div>
                                          <span>{parseFloat(item.price) * item.quantity} ₺</span>
                                        </div>
                                      ))}
                                    </div>
                                    
                                    <div className="flex flex-col sm:flex-row justify-between border-t pt-4">
                                      <div>
                                        <p className="font-semibold mb-1">Sipariş Tipi</p>
                                        <p className="text-gray-700">{order.order_type === "dine_in" ? "Restoranda" : "Eve Sipariş"}</p>
                                        {order.order_type === "dine_in" && order.table_number && (
                                          <p className="text-gray-600 text-sm">Masa: {order.table_number}</p>
                                        )}
                                        {order.order_type === "takeaway" && order.delivery_address && (
                                          <p className="text-gray-600 text-sm">
                                            Adres ID: {order.delivery_address}
                                          </p>
                                        )}
                                      </div>
                                      
                                      <div className="mt-4 sm:mt-0 text-right">
                                        <p className="font-semibold mb-1">Toplam Tutar</p>
                                        <p className="text-xl font-bold text-restaurant-700">
                                          {parseFloat(order.total_price).toFixed(2)} ₺
                                        </p>
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                )}
                
                {activeTab === "addresses" && (
                  <div className="bg-white shadow rounded-lg p-6">
                    <div className="flex justify-between items-center mb-6">
                      <h2 className="text-xl font-bold">Adreslerim</h2>
                      <Button onClick={() => setShowNewAddressForm(true)}>Yeni Adres Ekle</Button>
                    </div>
                    
                    {showNewAddressForm && (
                      <div className="mb-6 p-4 border rounded-lg">
                        <h3 className="font-bold mb-3">Yeni Adres</h3>
                        <form onSubmit={handleAddAddress}>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                            <div>
                              <label className="block text-gray-700 font-medium mb-2">
                                Adres
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder="Sokak, mahalle, bina no vs."
                                value={newStreet}
                                onChange={(e) => setNewStreet(e.target.value)}
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-gray-700 font-medium mb-2">
                                Şehir
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder="İstanbul"
                                value={newCity}
                                onChange={(e) => setNewCity(e.target.value)}
                                required
                              />
                            </div>
                            
                            <div>
                              <label className="block text-gray-700 font-medium mb-2">
                                Posta Kodu
                              </label>
                              <input
                                type="text"
                                className="w-full px-4 py-2 border border-gray-300 rounded-md"
                                placeholder="34000"
                                value={newZipCode}
                                onChange={(e) => setNewZipCode(e.target.value)}
                                required
                              />
                            </div>
                          </div>
                          
                          <div className="mt-4 flex justify-end gap-2">
                            <Button 
                              type="button" 
                              variant="outline" 
                              onClick={() => setShowNewAddressForm(false)}
                            >
                              İptal
                            </Button>
                            <Button 
                              type="submit"
                              disabled={formSubmitting}
                            >
                              {formSubmitting ? "Kaydediliyor..." : "Adresi Kaydet"}
                            </Button>
                          </div>
                        </form>
                      </div>
                    )}
                    
                    {addresses.length === 0 ? (
                      <div className="text-center py-8">
                        <p className="text-gray-600">Henüz adres eklemediniz.</p>
                      </div>
                    ) : (
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {addresses.map((address) => (
                          <div key={address.address_id} className="border rounded-lg p-4">
                            <div className="flex justify-between items-start mb-2">
                              <div className="flex items-center">
                                <span className="font-bold">Adres</span>
                              </div>
                              <div className="space-x-1">
                                <button 
                                  className="text-red-500 hover:text-red-700"
                                  onClick={() => handleDeleteAddress(address.address_id)}
                                >
                                  Sil
                                </button>
                              </div>
                            </div>
                            
                            <p className="text-gray-700">
                              {address.street}
                            </p>
                            <p className="text-gray-600">
                              {address.city}, {address.zip_code}
                            </p>
                          </div>
                        ))}
                      </div>
                    )}
                  </div>
                )}
              </>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
