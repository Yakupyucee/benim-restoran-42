
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { useAuth } from "@/hooks/use-auth";
import { orderAPI, menuAPI } from "@/services/api";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { toast } from "sonner";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Navigate } from "react-router-dom";

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
  order_type: "takeaway" | "dine_in";
  order_status: "pending" | "preparing" | "completed" | "cancelled";
  payment_method: "cash" | "card";
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

const AdminOrders = () => {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [menuItems, setMenuItems] = useState<{[key: string]: MenuItem}>({});
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [showOrderDetailsDialog, setShowOrderDetailsDialog] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState<"pending" | "preparing" | "completed" | "cancelled">("pending");

  useEffect(() => {
    fetchOrders();
    fetchMenuItems();
  }, []);

  const fetchMenuItems = async () => {
    try {
      const data = await menuAPI.getAllFoods();
      const menuMap = data.reduce((acc: {[key: string]: MenuItem}, item: MenuItem) => {
        acc[item.food_id] = item;
        return acc;
      }, {});
      setMenuItems(menuMap);
    } catch (error) {
      console.error("Menü yüklenirken hata:", error);
      toast.error("Menü yüklenirken bir hata oluştu");
    }
  };

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderAPI.getAllOrders();
      
      // Siparişleri zenginleştir ve food_id'ye göre isim ekle
      const enrichedOrders = data.map((order: Order) => {
        const enrichedItems = order.items.map(item => ({
          ...item,
          name: menuItems[item.food_id]?.name || "Bilinmeyen Ürün"
        }));
        
        return {
          ...order,
          items: enrichedItems
        };
      });
      
      setOrders(enrichedOrders);
      setLoading(false);
    } catch (error) {
      console.error("Siparişler yüklenirken hata:", error);
      toast.error("Siparişler yüklenirken bir hata oluştu");
      setLoading(false);
    }
  };

  const openStatusUpdateDialog = (order: Order) => {
    setSelectedOrder(order);
    setStatusToUpdate(order.order_status);
    setShowStatusDialog(true);
  };
  
  const openOrderDetailsDialog = (order: Order) => {
    setSelectedOrder(order);
    setShowOrderDetailsDialog(true);
  };

  const handleUpdateStatus = async () => {
    if (!selectedOrder) return;
    
    try {
      await orderAPI.updateOrderStatus(selectedOrder.order_id, statusToUpdate);
      toast.success("Sipariş durumu güncellendi");
      setShowStatusDialog(false);
      fetchOrders();
    } catch (error) {
      console.error("Sipariş durumu güncellenirken hata:", error);
      toast.error("Sipariş durumu güncellenirken bir hata oluştu");
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString('tr-TR');
  };

  const getStatusClass = (status: string) => {
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
        return "Beklemede";
      case "preparing":
        return "Hazırlanıyor";
      case "completed":
        return "Tamamlandı";
      case "cancelled":
        return "İptal Edildi";
      default:
        return status;
    }
  };

  // Siparişleri durumlarına göre ayır
  const activeOrders = orders.filter(order => 
    order.order_status === "pending" || order.order_status === "preparing"
  );
  const inactiveOrders = orders.filter(order => 
    order.order_status === "completed" || order.order_status === "cancelled"
  );

  // Sipariş tipine göre ayır
  const activeDineInOrders = activeOrders.filter(order => order.order_type === "dine_in");
  const activeTakeawayOrders = activeOrders.filter(order => order.order_type === "takeaway");
  const inactiveDineInOrders = inactiveOrders.filter(order => order.order_type === "dine_in");
  const inactiveTakeawayOrders = inactiveOrders.filter(order => order.order_type === "takeaway");

  // Admin değilse yönlendir
  if (!isAuthenticated || user?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  return (
    <MainLayout>
      <div className="max-w-7xl mx-auto py-8 px-4">
        <h1 className="text-2xl font-bold mb-8">Sipariş Yönetimi</h1>

        <Tabs defaultValue="dine_in" className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-8">
            <TabsTrigger value="dine_in">
              Restoran İçi Siparişler ({activeDineInOrders.length})
            </TabsTrigger>
            <TabsTrigger value="takeaway">
              Paket Siparişleri ({activeTakeawayOrders.length})
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-restaurant-700"></div>
            </div>
          ) : (
            <>
              <TabsContent value="dine_in">
                {/* Aktif Siparişler */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Aktif Siparişler</h2>
                  {activeDineInOrders.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">Aktif restoran içi sipariş bulunmamaktadır.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sipariş ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tarih
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Masa
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Toplam Tutar
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ödeme
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
                          {activeDineInOrders.map((order) => (
                            <tr key={order.order_id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {order.order_id.substring(0, 8)}...
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {formatDate(order.created_at)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {order.table_number}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {parseFloat(order.total_price).toFixed(2)} ₺
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {order.payment_method === "cash" ? "Nakit" : "Kart"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.order_status)}`}>
                                  {getStatusText(order.order_status)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mr-2"
                                  onClick={() => openOrderDetailsDialog(order)}
                                >
                                  Detaylar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openStatusUpdateDialog(order)}
                                >
                                  Durumu Güncelle
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Tamamlanmış/İptal Edilmiş Siparişler */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Geçmiş Siparişler</h2>
                  {inactiveDineInOrders.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">Geçmiş restoran içi sipariş bulunmamaktadır.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sipariş ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tarih
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Masa
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Toplam Tutar
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ödeme
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
                          {inactiveDineInOrders.map((order) => (
                            <tr key={order.order_id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {order.order_id.substring(0, 8)}...
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {formatDate(order.created_at)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {order.table_number}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {parseFloat(order.total_price).toFixed(2)} ₺
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {order.payment_method === "cash" ? "Nakit" : "Kart"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.order_status)}`}>
                                  {getStatusText(order.order_status)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openOrderDetailsDialog(order)}
                                >
                                  Detaylar
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </TabsContent>

              <TabsContent value="takeaway">
                {/* Aktif Siparişler */}
                <div className="mb-8">
                  <h2 className="text-xl font-semibold mb-4">Aktif Siparişler</h2>
                  {activeTakeawayOrders.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">Aktif paket sipariş bulunmamaktadır.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sipariş ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tarih
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Adres ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Toplam Tutar
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ödeme
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
                          {activeTakeawayOrders.map((order) => (
                            <tr key={order.order_id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {order.order_id.substring(0, 8)}...
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {formatDate(order.created_at)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {order.delivery_address ? order.delivery_address.substring(0, 8) + "..." : "N/A"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {parseFloat(order.total_price).toFixed(2)} ₺
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {order.payment_method === "cash" ? "Nakit" : "Kart"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.order_status)}`}>
                                  {getStatusText(order.order_status)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  className="mr-2"
                                  onClick={() => openOrderDetailsDialog(order)}
                                >
                                  Detaylar
                                </Button>
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openStatusUpdateDialog(order)}
                                >
                                  Durumu Güncelle
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>

                {/* Tamamlanmış/İptal Edilmiş Siparişler */}
                <div>
                  <h2 className="text-xl font-semibold mb-4">Geçmiş Siparişler</h2>
                  {inactiveTakeawayOrders.length === 0 ? (
                    <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
                      <p className="text-gray-500">Geçmiş paket sipariş bulunmamaktadır.</p>
                    </div>
                  ) : (
                    <div className="overflow-x-auto">
                      <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50">
                          <tr>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Sipariş ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Tarih
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Adres ID
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Toplam Tutar
                            </th>
                            <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                              Ödeme
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
                          {inactiveTakeawayOrders.map((order) => (
                            <tr key={order.order_id}>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {order.order_id.substring(0, 8)}...
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {formatDate(order.created_at)}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-500">
                                  {order.delivery_address ? order.delivery_address.substring(0, 8) + "..." : "N/A"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm font-medium text-gray-900">
                                  {parseFloat(order.total_price).toFixed(2)} ₺
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <div className="text-sm text-gray-900">
                                  {order.payment_method === "cash" ? "Nakit" : "Kart"}
                                </div>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap">
                                <span className={`px-2 py-1 inline-flex text-xs leading-5 font-semibold rounded-full ${getStatusClass(order.order_status)}`}>
                                  {getStatusText(order.order_status)}
                                </span>
                              </td>
                              <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                <Button
                                  variant="outline"
                                  size="sm"
                                  onClick={() => openOrderDetailsDialog(order)}
                                >
                                  Detaylar
                                </Button>
                              </td>
                            </tr>
                          ))}
                        </tbody>
                      </table>
                    </div>
                  )}
                </div>
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

      {/* Sipariş Detayları Dialog */}
      <Dialog open={showOrderDetailsDialog} onOpenChange={setShowOrderDetailsDialog}>
        <DialogContent className="max-w-md">
          <DialogHeader>
            <DialogTitle>Sipariş Detayları</DialogTitle>
            <DialogDescription>
              Sipariş #{selectedOrder?.order_id?.substring(0, 8)} detayları
            </DialogDescription>
          </DialogHeader>
          
          {selectedOrder && (
            <div className="py-4">
              <div className="space-y-4">
                <div>
                  <h3 className="font-semibold text-lg mb-2">Sipariş Bilgileri</h3>
                  <div className="grid grid-cols-2 gap-2 text-sm">
                    <div className="text-gray-600">Sipariş Durumu:</div>
                    <div className="font-medium">{getStatusText(selectedOrder.order_status)}</div>
                    
                    <div className="text-gray-600">Sipariş Tarihi:</div>
                    <div>{formatDate(selectedOrder.created_at)}</div>
                    
                    <div className="text-gray-600">Ödeme Yöntemi:</div>
                    <div>{selectedOrder.payment_method === "cash" ? "Nakit" : "Kart"}</div>
                    
                    <div className="text-gray-600">Sipariş Tipi:</div>
                    <div>{selectedOrder.order_type === "dine_in" ? "Restoranda" : "Eve Sipariş"}</div>
                    
                    {selectedOrder.order_type === "dine_in" && (
                      <>
                        <div className="text-gray-600">Masa No:</div>
                        <div>{selectedOrder.table_number}</div>
                      </>
                    )}
                    
                    {selectedOrder.order_type === "takeaway" && selectedOrder.delivery_address && (
                      <>
                        <div className="text-gray-600">Adres ID:</div>
                        <div>{selectedOrder.delivery_address}</div>
                      </>
                    )}
                  </div>
                </div>
                
                <div>
                  <h3 className="font-semibold text-lg mb-2">Sipariş Ürünleri</h3>
                  <div className="space-y-2">
                    {selectedOrder.items.map((item, idx) => (
                      <div key={idx} className="flex justify-between items-center py-2 border-b last:border-0">
                        <div>
                          <div className="font-medium">{item.name || "Bilinmeyen Ürün"}</div>
                          <div className="text-sm text-gray-500">{item.quantity} adet</div>
                        </div>
                        <div className="text-right">
                          <div className="font-semibold">{(parseFloat(item.price) * item.quantity).toFixed(2)} ₺</div>
                          <div className="text-sm text-gray-500">Birim: {parseFloat(item.price).toFixed(2)} ₺</div>
                        </div>
                      </div>
                    ))}
                    <div className="flex justify-between items-center pt-2 font-semibold">
                      <div>Toplam Tutar:</div>
                      <div className="text-restaurant-700">{parseFloat(selectedOrder.total_price).toFixed(2)} ₺</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowOrderDetailsDialog(false)}>
              Kapat
            </Button>
            {(selectedOrder?.order_status === 'pending' || selectedOrder?.order_status === 'preparing') && (
              <Button onClick={() => {
                setShowOrderDetailsDialog(false);
                openStatusUpdateDialog(selectedOrder);
              }}>
                Durumu Güncelle
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Sipariş Durumu Güncelleme Dialog */}
      <Dialog open={showStatusDialog} onOpenChange={setShowStatusDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Sipariş Durumunu Güncelle</DialogTitle>
            <DialogDescription>
              Sipariş #{selectedOrder?.order_id.substring(0, 8)} için yeni bir durum seçin.
            </DialogDescription>
          </DialogHeader>
          
          <div className="py-4">
            <div className="space-y-2">
              <div 
                className={`border rounded-lg p-3 cursor-pointer ${statusToUpdate === "pending" ? "border-restaurant-700 bg-restaurant-50" : "border-gray-200"}`}
                onClick={() => setStatusToUpdate("pending")}
              >
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    name="status" 
                    checked={statusToUpdate === "pending"} 
                    onChange={() => setStatusToUpdate("pending")} 
                    className="h-4 w-4 text-restaurant-700 focus:ring-restaurant-500" 
                  />
                  <label htmlFor="status-pending" className="ml-2 block text-sm text-gray-900">Beklemede</label>
                </div>
              </div>
              
              <div 
                className={`border rounded-lg p-3 cursor-pointer ${statusToUpdate === "preparing" ? "border-restaurant-700 bg-restaurant-50" : "border-gray-200"}`}
                onClick={() => setStatusToUpdate("preparing")}
              >
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    name="status" 
                    checked={statusToUpdate === "preparing"} 
                    onChange={() => setStatusToUpdate("preparing")} 
                    className="h-4 w-4 text-restaurant-700 focus:ring-restaurant-500" 
                  />
                  <label htmlFor="status-preparing" className="ml-2 block text-sm text-gray-900">Hazırlanıyor</label>
                </div>
              </div>
              
              <div 
                className={`border rounded-lg p-3 cursor-pointer ${statusToUpdate === "completed" ? "border-restaurant-700 bg-restaurant-50" : "border-gray-200"}`}
                onClick={() => setStatusToUpdate("completed")}
              >
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    name="status" 
                    checked={statusToUpdate === "completed"} 
                    onChange={() => setStatusToUpdate("completed")} 
                    className="h-4 w-4 text-restaurant-700 focus:ring-restaurant-500" 
                  />
                  <label htmlFor="status-completed" className="ml-2 block text-sm text-gray-900">Tamamlandı</label>
                </div>
              </div>
              
              <div 
                className={`border rounded-lg p-3 cursor-pointer ${statusToUpdate === "cancelled" ? "border-restaurant-700 bg-restaurant-50" : "border-gray-200"}`}
                onClick={() => setStatusToUpdate("cancelled")}
              >
                <div className="flex items-center">
                  <input 
                    type="radio" 
                    name="status" 
                    checked={statusToUpdate === "cancelled"} 
                    onChange={() => setStatusToUpdate("cancelled")} 
                    className="h-4 w-4 text-restaurant-700 focus:ring-restaurant-500" 
                  />
                  <label htmlFor="status-cancelled" className="ml-2 block text-sm text-gray-900">İptal Edildi</label>
                </div>
              </div>
            </div>
          </div>
          
          <DialogFooter>
            <Button variant="outline" onClick={() => setShowStatusDialog(false)}>
              İptal
            </Button>
            <Button onClick={handleUpdateStatus}>
              Güncelle
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </MainLayout>
  );
};

export default AdminOrders;
