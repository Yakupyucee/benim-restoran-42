
import React, { useState, useEffect } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { useAuth } from "@/hooks/use-auth";
import { orderAPI } from "@/services/api";
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

const AdminOrders = () => {
  const { isAuthenticated, user } = useAuth();
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [showStatusDialog, setShowStatusDialog] = useState(false);
  const [statusToUpdate, setStatusToUpdate] = useState<"pending" | "preparing" | "completed" | "cancelled">("pending");

  useEffect(() => {
    fetchOrders();
  }, []);

  const fetchOrders = async () => {
    try {
      setLoading(true);
      const data = await orderAPI.getAllOrders();
      setOrders(data);
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

  const dineInOrders = orders.filter(order => order.order_type === "dine_in");
  const takeawayOrders = orders.filter(order => order.order_type === "takeaway");

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
              Restoran İçi Siparişler ({dineInOrders.length})
            </TabsTrigger>
            <TabsTrigger value="takeaway">
              Paket Siparişleri ({takeawayOrders.length})
            </TabsTrigger>
          </TabsList>

          {loading ? (
            <div className="flex justify-center items-center h-64">
              <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-restaurant-700"></div>
            </div>
          ) : (
            <>
              <TabsContent value="dine_in">
                {dineInOrders.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">Restoran içi sipariş bulunmamaktadır.</p>
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
                        {dineInOrders.map((order) => (
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
              </TabsContent>

              <TabsContent value="takeaway">
                {takeawayOrders.length === 0 ? (
                  <div className="text-center py-10 border border-dashed border-gray-300 rounded-lg">
                    <p className="text-gray-500">Paket sipariş bulunmamaktadır.</p>
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
                        {takeawayOrders.map((order) => (
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
              </TabsContent>
            </>
          )}
        </Tabs>
      </div>

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
