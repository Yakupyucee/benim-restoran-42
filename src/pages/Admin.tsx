
import React, { useState } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { useAuth } from "@/hooks/use-auth";
import { Navigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { menuItems } from "@/data/menu-data";
import { orders } from "@/data/orders-data";
import { users } from "@/data/user-data";

const Admin = () => {
  const { isAuthenticated, user } = useAuth();
  const [activeTab, setActiveTab] = useState<string>("dashboard");

  // Admin değilse yönlendir
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/giris" replace />;
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto">
        <h1 className="text-3xl font-bold mb-8">Admin Paneli</h1>

        <div className="flex flex-col md:flex-row gap-8">
          {/* Sol Sidebar */}
          <div className="md:w-1/4">
            <div className="bg-white shadow rounded-lg p-4">
              <ul>
                <li>
                  <button
                    onClick={() => setActiveTab("dashboard")}
                    className={`w-full text-left py-2 px-3 mb-2 rounded ${
                      activeTab === "dashboard"
                        ? "bg-restaurant-700 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Dashboard
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("orders")}
                    className={`w-full text-left py-2 px-3 mb-2 rounded ${
                      activeTab === "orders"
                        ? "bg-restaurant-700 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Siparişler
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("menu")}
                    className={`w-full text-left py-2 px-3 mb-2 rounded ${
                      activeTab === "menu"
                        ? "bg-restaurant-700 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Menü Yönetimi
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("users")}
                    className={`w-full text-left py-2 px-3 mb-2 rounded ${
                      activeTab === "users"
                        ? "bg-restaurant-700 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Kullanıcılar
                  </button>
                </li>
                <li>
                  <button
                    onClick={() => setActiveTab("reports")}
                    className={`w-full text-left py-2 px-3 mb-2 rounded ${
                      activeTab === "reports"
                        ? "bg-restaurant-700 text-white"
                        : "hover:bg-gray-100"
                    }`}
                  >
                    Raporlar
                  </button>
                </li>
              </ul>
            </div>
          </div>

          {/* Ana İçerik */}
          <div className="md:w-3/4">
            {activeTab === "dashboard" && (
              <div className="space-y-6">
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="bg-white shadow rounded-lg p-4">
                    <div className="text-gray-500 mb-1">Toplam Sipariş</div>
                    <div className="text-2xl font-bold">{orders.length}</div>
                  </div>
                  <div className="bg-white shadow rounded-lg p-4">
                    <div className="text-gray-500 mb-1">Aktif Kullanıcılar</div>
                    <div className="text-2xl font-bold">{users.length}</div>
                  </div>
                  <div className="bg-white shadow rounded-lg p-4">
                    <div className="text-gray-500 mb-1">Menü Öğeleri</div>
                    <div className="text-2xl font-bold">{menuItems.length}</div>
                  </div>
                  <div className="bg-white shadow rounded-lg p-4">
                    <div className="text-gray-500 mb-1">Günlük Gelir</div>
                    <div className="text-2xl font-bold">865 ₺</div>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Son 7 Gündeki Siparişler</h2>
                  <div className="h-64 flex justify-center items-center bg-gray-50 rounded border">
                    {/* Burada grafik bileşeni olacak */}
                    <div className="text-gray-500">Grafik Gösterimi</div>
                  </div>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Son Siparişler</h2>
                    <div className="space-y-4">
                      {orders.slice(0, 3).map((order) => (
                        <div key={order.id} className="border-b pb-3 last:border-0">
                          <div className="flex justify-between">
                            <div>
                              <div className="font-semibold">{order.id}</div>
                              <div className="text-sm text-gray-500">
                                {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                              </div>
                            </div>
                            <div className="font-semibold">
                              {order.totalAmount} ₺
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="bg-white shadow rounded-lg p-6">
                    <h2 className="text-xl font-bold mb-4">Popüler Ürünler</h2>
                    <div className="space-y-4">
                      {menuItems.filter(item => item.isPopular).slice(0, 3).map((item) => (
                        <div key={item.id} className="border-b pb-3 last:border-0">
                          <div className="flex justify-between">
                            <div>
                              <div className="font-semibold">{item.name}</div>
                              <div className="text-sm text-gray-500">
                                {item.category === "1" ? "Ana Yemekler" : 
                                 item.category === "2" ? "Başlangıçlar" : 
                                 item.category === "3" ? "Tatlılar" : "İçecekler"}
                              </div>
                            </div>
                            <div className="font-semibold">
                              {item.price} ₺
                            </div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            )}

            {activeTab === "orders" && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-4">Sipariş Yönetimi</h2>
                
                <div className="mb-6">
                  <input
                    type="text"
                    placeholder="Sipariş ara..."
                    className="w-full px-4 py-2 border border-gray-300 rounded-md"
                  />
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Sipariş No
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Tarih
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Müşteri
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Toplam
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {orders.map((order) => (
                        <tr key={order.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="font-medium text-gray-900">
                              {order.id}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {new Date(order.createdAt).toLocaleDateString("tr-TR")}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {users.find(u => u.id === order.userId)?.name || 'Kullanıcı Bulunamadı'}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${order.status === 'beklemede' ? 'bg-yellow-100 text-yellow-800' : 
                                order.status === 'hazırlanıyor' ? 'bg-blue-100 text-blue-800' :
                                order.status === 'teslim edildi' ? 'bg-green-100 text-green-800' :
                                'bg-red-100 text-red-800'}`}>
                              {order.status.toUpperCase()}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {order.totalAmount} ₺
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-restaurant-700 hover:text-restaurant-800 mr-3">
                              Detay
                            </button>
                            <button className="text-blue-600 hover:text-blue-800">
                              Güncelle
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "menu" && (
              <div className="bg-white shadow rounded-lg p-6">
                <div className="flex justify-between items-center mb-6">
                  <h2 className="text-xl font-bold">Menü Yönetimi</h2>
                  <Button>Yeni Ürün Ekle</Button>
                </div>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Ürün
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kategori
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Fiyat
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Durum
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {menuItems.map((item) => (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="flex-shrink-0 h-10 w-10">
                                <img
                                  className="h-10 w-10 rounded-full object-cover"
                                  src={item.image}
                                  alt={item.name}
                                />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">
                                  {item.name}
                                </div>
                                <div className="text-sm text-gray-500 truncate max-w-xs">
                                  {item.description}
                                </div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.category === "1" ? "Ana Yemekler" : 
                             item.category === "2" ? "Başlangıçlar" : 
                             item.category === "3" ? "Tatlılar" : "İçecekler"}
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            {item.price} ₺
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <span className={`px-2 inline-flex text-xs leading-5 font-semibold rounded-full 
                              ${item.inStock ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}`}>
                              {item.inStock ? 'MEVCUT' : 'TÜKENDİ'}
                            </span>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-restaurant-700 hover:text-restaurant-800 mr-3">
                              Düzenle
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "users" && (
              <div className="bg-white shadow rounded-lg p-6">
                <h2 className="text-xl font-bold mb-6">Kullanıcı Yönetimi</h2>

                <div className="overflow-x-auto">
                  <table className="min-w-full divide-y divide-gray-200">
                    <thead>
                      <tr>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Kullanıcı
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          E-posta
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Telefon
                        </th>
                        <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                          Adres Sayısı
                        </th>
                        <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">
                          İşlemler
                        </th>
                      </tr>
                    </thead>
                    <tbody className="bg-white divide-y divide-gray-200">
                      {users.map((user) => (
                        <tr key={user.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm font-medium text-gray-900">
                              {user.name}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {user.email}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-500">
                              {user.phone}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">
                              {user.addresses.length}
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                            <button className="text-blue-600 hover:text-blue-800 mr-3">
                              Görüntüle
                            </button>
                            <button className="text-red-600 hover:text-red-800">
                              Sil
                            </button>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>
            )}

            {activeTab === "reports" && (
              <div className="space-y-6">
                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">Satış Raporları</h2>
                  <div className="flex flex-wrap gap-4 mb-4">
                    <Button variant="outline">Günlük</Button>
                    <Button variant="outline">Haftalık</Button>
                    <Button variant="outline">Aylık</Button>
                    <Button variant="outline">Yıllık</Button>
                  </div>
                  <div className="h-64 flex justify-center items-center bg-gray-50 rounded border">
                    {/* Burada grafik bileşeni olacak */}
                    <div className="text-gray-500">Grafik Gösterimi</div>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <h2 className="text-xl font-bold mb-4">En Çok Satan Ürünler</h2>
                  <div className="h-64 flex justify-center items-center bg-gray-50 rounded border">
                    {/* Burada grafik bileşeni olacak */}
                    <div className="text-gray-500">Grafik Gösterimi</div>
                  </div>
                </div>

                <div className="bg-white shadow rounded-lg p-6">
                  <div className="flex justify-between items-center mb-4">
                    <h2 className="text-xl font-bold">Rapor İndir</h2>
                  </div>
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="font-semibold mb-2">Satış Raporu (PDF)</div>
                      <div className="text-sm text-gray-500">
                        Tüm satış detayları ile PDF raporu
                      </div>
                    </div>
                    <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="font-semibold mb-2">Ürün Analizi (Excel)</div>
                      <div className="text-sm text-gray-500">
                        Ürün satış performansı Excel raporu
                      </div>
                    </div>
                    <div className="border rounded-lg p-4 hover:bg-gray-50 cursor-pointer">
                      <div className="font-semibold mb-2">Müşteri Raporu (Excel)</div>
                      <div className="text-sm text-gray-500">
                        Müşteri bilgileri ve sipariş detayları
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </MainLayout>
  );
};

export default Admin;
