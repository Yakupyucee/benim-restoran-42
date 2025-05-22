
import React, { useState } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { useAuth } from "@/hooks/use-auth";
import { getUserAddresses, getUserById } from "@/data/user-data";
import { getUserOrders } from "@/data/orders-data";
import { Button } from "@/components/ui/button";
import { Link, Navigate } from "react-router-dom";
import { toast } from "sonner";

const Profile = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState("profile"); // profile, orders, addresses
  
  if (!isAuthenticated || !user) {
    return <Navigate to="/giris" replace />;
  }
  
  const userDetails = getUserById(user.id);
  const userAddresses = getUserAddresses(user.id);
  const userOrders = getUserOrders(user.id);
  
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
      case "beklemede":
        return "bg-yellow-100 text-yellow-800";
      case "hazırlanıyor":
        return "bg-blue-100 text-blue-800";
      case "teslim edildi":
        return "bg-green-100 text-green-800";
      case "iptal edildi":
        return "bg-red-100 text-red-800";
      default:
        return "bg-gray-100 text-gray-800";
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
            {activeTab === "profile" && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Profil Bilgilerim</h2>
                
                <form onSubmit={(e) => {
                  e.preventDefault();
                  toast.success("Profil bilgileriniz güncellendi");
                }}>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        Ad Soyad
                      </label>
                      <input
                        type="text"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        defaultValue={userDetails?.name || ""}
                      />
                    </div>
                    
                    <div>
                      <label className="block text-gray-700 font-medium mb-2">
                        E-posta
                      </label>
                      <input
                        type="email"
                        className="w-full px-4 py-2 border border-gray-300 rounded-md"
                        defaultValue={userDetails?.email || ""}
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
                        defaultValue={userDetails?.phone || ""}
                      />
                    </div>
                  </div>
                  
                  <div className="mt-6 border-t pt-6">
                    <h3 className="font-semibold mb-4">Şifre Değiştir</h3>
                    
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <label className="block text-gray-700 font-medium mb-2">
                          Mevcut Şifre
                        </label>
                        <input
                          type="password"
                          className="w-full px-4 py-2 border border-gray-300 rounded-md"
                          placeholder="••••••••"
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
                        />
                      </div>
                    </div>
                  </div>
                  
                  <div className="mt-6 text-right">
                    <Button type="submit">Değişiklikleri Kaydet</Button>
                  </div>
                </form>
              </div>
            )}
            
            {activeTab === "orders" && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Siparişlerim</h2>
                
                {userOrders.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600 mb-4">Henüz hiç sipariş vermediniz.</p>
                    <Link to="/menu">
                      <Button>Hemen Sipariş Ver</Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {userOrders.map((order) => (
                      <div key={order.id} className="border rounded-lg overflow-hidden">
                        <div className="bg-gray-50 p-4 flex flex-col sm:flex-row justify-between items-start sm:items-center">
                          <div>
                            <div className="flex items-center mb-1">
                              <span className="font-semibold mr-2">Sipariş No:</span>
                              <span>{order.id}</span>
                            </div>
                            <div className="flex items-center">
                              <span className="text-gray-600 text-sm">
                                {formatDate(order.createdAt)}
                              </span>
                            </div>
                          </div>
                          <div className="mt-2 sm:mt-0">
                            <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold ${getStatusBadgeClass(order.status)}`}>
                              {order.status.toUpperCase()}
                            </span>
                          </div>
                        </div>
                        
                        <div className="p-4">
                          <div className="mb-4">
                            {order.items.map((item, idx) => (
                              <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                                <div>
                                  <span className="font-medium">{item.name}</span>
                                  <span className="text-gray-600 ml-2">x{item.quantity}</span>
                                </div>
                                <span>{(item.price * item.quantity).toFixed(2)} ₺</span>
                              </div>
                            ))}
                          </div>
                          
                          <div className="flex flex-col sm:flex-row justify-between border-t pt-4">
                            <div>
                              <p className="font-semibold mb-1">Sipariş Tipi</p>
                              <p className="text-gray-700">{order.orderType === "restoranda" ? "Restoranda" : "Eve Sipariş"}</p>
                              {order.orderType === "restoranda" && order.tableNumber && (
                                <p className="text-gray-600 text-sm">Masa: {order.tableNumber}</p>
                              )}
                              {order.orderType === "eve sipariş" && order.deliveryAddress && (
                                <p className="text-gray-600 text-sm">
                                  {`${order.deliveryAddress.street}, ${order.deliveryAddress.district}/${order.deliveryAddress.city}`}
                                </p>
                              )}
                            </div>
                            
                            <div className="mt-4 sm:mt-0 text-right">
                              <p className="font-semibold mb-1">Toplam Tutar</p>
                              <p className="text-xl font-bold text-restaurant-700">
                                {order.totalAmount.toFixed(2)} ₺
                              </p>
                              <p className="text-gray-600 text-sm">
                                {order.paymentMethod === "kredi kartı" 
                                  ? "Kredi Kartı ile Ödendi" 
                                  : order.paymentMethod === "nakit" 
                                    ? "Nakit Ödeme" 
                                    : "Restoranda Ödenecek"}
                              </p>
                            </div>
                          </div>
                        </div>
                        
                        <div className="bg-gray-50 p-4 border-t flex justify-end">
                          <Button variant="outline" size="sm">
                            Sipariş Detayı
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
            
            {activeTab === "addresses" && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Adreslerim</h2>
                  <Button>Yeni Adres Ekle</Button>
                </div>
                
                {userAddresses.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-600">Henüz adres eklemediniz.</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    {userAddresses.map((address) => (
                      <div key={address.id} className="border rounded-lg p-4">
                        <div className="flex justify-between items-start mb-2">
                          <div className="flex items-center">
                            <span className="font-bold">{address.title}</span>
                            {address.isDefault && (
                              <span className="ml-2 bg-gray-100 px-2 py-0.5 rounded text-xs text-gray-600">
                                Varsayılan
                              </span>
                            )}
                          </div>
                          <div className="space-x-1">
                            <button className="text-gray-500 hover:text-gray-700">
                              Düzenle
                            </button>
                            <span className="text-gray-400">|</span>
                            <button className="text-red-500 hover:text-red-700">
                              Sil
                            </button>
                          </div>
                        </div>
                        
                        <p className="text-gray-700">
                          {address.street}
                        </p>
                        <p className="text-gray-600">
                          {address.district}, {address.city}, {address.postalCode}
                        </p>
                        {address.details && (
                          <p className="text-gray-600 mt-1">{address.details}</p>
                        )}
                      </div>
                    ))}
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Profile;
