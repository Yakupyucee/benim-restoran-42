import React, { useState, useEffect } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useAuth } from "@/hooks/use-auth";
import { useCart } from "@/hooks/use-cart";
import { addressAPI, orderAPI, menuAPI } from "@/services/api";
import { toast } from "sonner";
import { Navigate, useNavigate } from "react-router-dom";

interface Address {
  address_id: string;
  user_id: string;
  street: string;
  city: string;
  zip_code: string;
  created_at: string;
}

interface MenuItem {
  food_id: string;
  name: string;
  price_dine_in: string;
  price_takeaway: string;
  // ... other properties
}

const Order = () => {
  const { isAuthenticated, user } = useAuth();
  const { items, clearCart, getTotalPrice } = useCart();
  const navigate = useNavigate();
  
  const [orderType, setOrderType] = useState<"takeaway" | "dine_in">("takeaway");
  const [tableNumber, setTableNumber] = useState<string>("1");
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [selectedAddress, setSelectedAddress] = useState<string>("");
  const [paymentMethod, setPaymentMethod] = useState<"cash" | "card">("cash");
  const [isLoading, setIsLoading] = useState(false);
  const [menuItems, setMenuItems] = useState<{[key: string]: MenuItem}>({});
  const [newAddress, setNewAddress] = useState({
    street: "",
    city: "",
    zip_code: ""
  });
  const [showAddressForm, setShowAddressForm] = useState(false);

  useEffect(() => {
    if (isAuthenticated) {
      fetchAddresses();
      fetchMenuItems();
    }
  }, [isAuthenticated]);

  const fetchAddresses = async () => {
    try {
      const addressesData = await addressAPI.getAllAddresses();
      setAddresses(addressesData);
      if (addressesData.length > 0) {
        setSelectedAddress(addressesData[0].address_id);
      }
    } catch (error) {
      console.error("Adresler alınırken hata oluştu:", error);
      toast.error("Adresleriniz yüklenirken bir hata oluştu");
    }
  };

  const fetchMenuItems = async () => {
    try {
      const menuData = await menuAPI.getAllFoods();
      // Yemek öğelerini food_id'ye göre haritala
      const menuMap = menuData.reduce((acc: {[key: string]: MenuItem}, item: MenuItem) => {
        acc[item.food_id] = item;
        return acc;
      }, {});
      setMenuItems(menuMap);
    } catch (error) {
      console.error("Menü öğeleri alınırken hata oluştu:", error);
      toast.error("Menü bilgileri yüklenirken bir hata oluştu");
    }
  };

  // Sipariş tipine göre toplam tutarı hesapla
  const calculateOrderTotal = () => {
    if (Object.keys(menuItems).length === 0) {
      return getTotalPrice();
    }

    return items.reduce((total, item) => {
      const menuItem = menuItems[item.id];
      if (menuItem) {
        const price = orderType === "dine_in" 
          ? parseFloat(menuItem.price_dine_in) 
          : parseFloat(menuItem.price_takeaway);
        return total + price * item.quantity;
      }
      return total + item.price * item.quantity;
    }, 0);
  };

  const handleCreateAddress = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      const response = await addressAPI.createAddress(newAddress);
      setAddresses([...addresses, response]);
      setSelectedAddress(response.address_id);
      setShowAddressForm(false);
      setNewAddress({ street: "", city: "", zip_code: "" });
      toast.success("Adres başarıyla eklendi");
    } catch (error) {
      console.error("Adres eklenirken hata oluştu:", error);
      toast.error("Adres eklenirken bir hata oluştu");
    }
  };

  const handleSubmitOrder = async () => {
    if (items.length === 0) {
      toast.error("Sipariş verebilmek için sepetinizde ürün olmalıdır");
      return;
    }

    if (orderType === "takeaway" && !selectedAddress && addresses.length === 0) {
      toast.error("Lütfen teslimat için bir adres ekleyin");
      return;
    }

    try {
      setIsLoading(true);
      
      // Sipariş tipi ve fiyatlara göre öğeleri hazırla
      const orderItems = items.map(item => {
        const menuItem = menuItems[item.id];
        const price = menuItem 
          ? (orderType === "dine_in" ? parseFloat(menuItem.price_dine_in) : parseFloat(menuItem.price_takeaway))
          : item.price.toString();
        
        return {
          food_id: item.id,
          quantity: item.quantity,
          price: parseFloat(price)
        };
      });
      
      const orderData = {
        total_price: calculateOrderTotal(),
        order_status: "pending",
        payment_method: paymentMethod,
        order_type: orderType,
        items: orderItems
      };
      
      if (orderType === "takeaway") {
        Object.assign(orderData, { delivery_address: selectedAddress });
      } else {
        Object.assign(orderData, { table_number: parseInt(tableNumber) });
      }

      await orderAPI.createOrder(orderData);
      
      clearCart();
      toast.success("Siparişiniz başarıyla alındı!");
      navigate("/profil");
    } catch (error) {
      console.error("Sipariş oluşturulurken hata:", error);
      toast.error("Sipariş oluşturulurken bir hata oluştu");
    } finally {
      setIsLoading(false);
    }
  };

  if (!isAuthenticated) {
    return <Navigate to="/giris" replace />;
  }

  const orderTotal = calculateOrderTotal();

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8 px-4">
        <h1 className="text-3xl font-bold mb-8">Sipariş Ver</h1>

        {items.length === 0 ? (
          <div className="bg-gray-50 border border-gray-200 rounded-lg p-8 text-center">
            <p className="text-gray-600 mb-4">Sepetinizde ürün bulunmamaktadır.</p>
            <Button onClick={() => navigate("/menu")}>Menüye Git</Button>
          </div>
        ) : (
          <>
            <div className="mb-8">
              <h2 className="text-xl font-semibold mb-4">Sepetinizdeki Ürünler</h2>
              <div className="bg-white shadow-md rounded-lg overflow-hidden">
                <table className="min-w-full divide-y divide-gray-200">
                  <thead className="bg-gray-50">
                    <tr>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Ürün
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Fiyat ({orderType === "dine_in" ? "Restoran" : "Paket"})
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Adet
                      </th>
                      <th scope="col" className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                        Toplam
                      </th>
                    </tr>
                  </thead>
                  <tbody className="bg-white divide-y divide-gray-200">
                    {items.map((item) => {
                      const menuItem = menuItems[item.id];
                      const itemPrice = menuItem 
                        ? (orderType === "dine_in" ? parseFloat(menuItem.price_dine_in) : parseFloat(menuItem.price_takeaway))
                        : item.price;
                      
                      return (
                        <tr key={item.id}>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="flex items-center">
                              <div className="h-10 w-10 flex-shrink-0">
                                <img className="h-10 w-10 rounded-full object-cover" src={item.image} alt={item.name} />
                              </div>
                              <div className="ml-4">
                                <div className="text-sm font-medium text-gray-900">{item.name}</div>
                              </div>
                            </div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{itemPrice.toFixed(2)} ₺</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{item.quantity}</div>
                          </td>
                          <td className="px-6 py-4 whitespace-nowrap">
                            <div className="text-sm text-gray-900">{(itemPrice * item.quantity).toFixed(2)} ₺</div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                  <tfoot className="bg-gray-50">
                    <tr>
                      <td colSpan={3} className="px-6 py-4 text-right font-medium">
                        Toplam Tutar:
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <div className="text-lg font-bold text-restaurant-700">{orderTotal.toFixed(2)} ₺</div>
                      </td>
                    </tr>
                  </tfoot>
                </table>
              </div>
            </div>

            <div className="bg-white shadow-md rounded-lg p-6 mb-8">
              <h2 className="text-xl font-semibold mb-6">Sipariş Bilgileri</h2>
              
              <Tabs defaultValue="takeaway" className="mb-6" onValueChange={(value) => setOrderType(value as "takeaway" | "dine_in")}>
                <TabsList className="grid w-full grid-cols-2">
                  <TabsTrigger value="takeaway">Eve Sipariş</TabsTrigger>
                  <TabsTrigger value="dine_in">Restoranda Yeme</TabsTrigger>
                </TabsList>
                
                <TabsContent value="takeaway" className="pt-4">
                  <div className="space-y-6">
                    <div>
                      <h3 className="text-lg font-medium mb-3">Teslimat Adresleri</h3>

                      {addresses.length > 0 ? (
                        <div className="space-y-3">
                          {addresses.map((address) => (
                            <div
                              key={address.address_id}
                              className={`border rounded-lg p-4 cursor-pointer ${
                                selectedAddress === address.address_id
                                  ? "border-restaurant-700 bg-restaurant-50"
                                  : "border-gray-200 hover:bg-gray-50"
                              }`}
                              onClick={() => setSelectedAddress(address.address_id)}
                            >
                              <div className="flex items-center">
                                <input
                                  type="radio"
                                  name="address"
                                  checked={selectedAddress === address.address_id}
                                  onChange={() => setSelectedAddress(address.address_id)}
                                  className="h-4 w-4 text-restaurant-700 focus:ring-restaurant-700 border-gray-300"
                                />
                                <div className="ml-3">
                                  <p className="text-gray-800">{address.street}</p>
                                  <p className="text-gray-600 text-sm">{address.city}, {address.zip_code}</p>
                                </div>
                              </div>
                            </div>
                          ))}
                        </div>
                      ) : (
                        <div className="text-center py-4 border border-dashed border-gray-300 rounded-lg">
                          <p className="text-gray-500 mb-2">Henüz adres eklenmemiş</p>
                        </div>
                      )}
                      
                      {!showAddressForm ? (
                        <Button 
                          variant="outline" 
                          className="mt-4"
                          onClick={() => setShowAddressForm(true)}
                        >
                          Yeni Adres Ekle
                        </Button>
                      ) : (
                        <div className="mt-4 border border-gray-200 rounded-lg p-4">
                          <h4 className="font-medium mb-3">Yeni Adres</h4>
                          <form onSubmit={handleCreateAddress}>
                            <div className="space-y-4">
                              <div>
                                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                                  Sokak/Mahalle
                                </label>
                                <input
                                  type="text"
                                  id="street"
                                  value={newAddress.street}
                                  onChange={(e) => setNewAddress({...newAddress, street: e.target.value})}
                                  required
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-restaurant-700"
                                />
                              </div>
                              <div>
                                <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                                  Şehir
                                </label>
                                <input
                                  type="text"
                                  id="city"
                                  value={newAddress.city}
                                  onChange={(e) => setNewAddress({...newAddress, city: e.target.value})}
                                  required
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-restaurant-700"
                                />
                              </div>
                              <div>
                                <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                                  Posta Kodu
                                </label>
                                <input
                                  type="text"
                                  id="zipCode"
                                  value={newAddress.zip_code}
                                  onChange={(e) => setNewAddress({...newAddress, zip_code: e.target.value})}
                                  required
                                  className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-restaurant-700"
                                />
                              </div>
                              <div className="flex space-x-2">
                                <Button type="submit">Adresi Ekle</Button>
                                <Button 
                                  type="button" 
                                  variant="ghost" 
                                  onClick={() => {
                                    setShowAddressForm(false);
                                    setNewAddress({ street: "", city: "", zip_code: "" });
                                  }}
                                >
                                  İptal
                                </Button>
                              </div>
                            </div>
                          </form>
                        </div>
                      )}
                    </div>
                  </div>
                </TabsContent>
                
                <TabsContent value="dine_in" className="pt-4">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Masa Numarası</h3>
                    <div className="grid grid-cols-5 gap-2 mb-4">
                      {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((num) => (
                        <button
                          key={num}
                          type="button"
                          className={`p-3 border rounded-md text-center ${
                            tableNumber === num.toString()
                              ? "bg-restaurant-700 text-white border-restaurant-700"
                              : "border-gray-200 hover:bg-gray-50"
                          }`}
                          onClick={() => setTableNumber(num.toString())}
                        >
                          {num}
                        </button>
                      ))}
                    </div>
                    
                    <div className="mt-4">
                      <label htmlFor="tableNumber" className="block text-sm font-medium text-gray-700 mb-1">
                        Diğer Masa Numarası
                      </label>
                      <input
                        type="number"
                        id="tableNumber"
                        min="1"
                        value={tableNumber}
                        onChange={(e) => setTableNumber(e.target.value)}
                        className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-1 focus:ring-restaurant-700"
                      />
                    </div>
                  </div>
                </TabsContent>
              </Tabs>
              
              <div className="border-t border-gray-200 pt-6">
                <h3 className="text-lg font-medium mb-3">Ödeme Yöntemi</h3>
                <div className="space-y-2">
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${
                      paymentMethod === "cash" 
                        ? "border-restaurant-700 bg-restaurant-50" 
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => setPaymentMethod("cash")}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "cash"}
                        onChange={() => setPaymentMethod("cash")}
                        className="h-4 w-4 text-restaurant-700 focus:ring-restaurant-700 border-gray-300"
                      />
                      <div className="ml-3">
                        <p className="text-gray-800">Nakit Ödeme</p>
                        <p className="text-gray-600 text-sm">Siparişiniz geldiğinde nakit olarak ödeme yapabilirsiniz.</p>
                      </div>
                    </div>
                  </div>
                  
                  <div 
                    className={`border rounded-lg p-4 cursor-pointer ${
                      paymentMethod === "card" 
                        ? "border-restaurant-700 bg-restaurant-50" 
                        : "border-gray-200 hover:bg-gray-50"
                    }`}
                    onClick={() => setPaymentMethod("card")}
                  >
                    <div className="flex items-center">
                      <input
                        type="radio"
                        name="paymentMethod"
                        checked={paymentMethod === "card"}
                        onChange={() => setPaymentMethod("card")}
                        className="h-4 w-4 text-restaurant-700 focus:ring-restaurant-700 border-gray-300"
                      />
                      <div className="ml-3">
                        <p className="text-gray-800">Kartla Ödeme</p>
                        <p className="text-gray-600 text-sm">Siparişiniz geldiğinde kart ile ödeme yapabilirsiniz.</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>

            <div className="text-right">
              <Button 
                onClick={handleSubmitOrder} 
                size="lg"
                disabled={isLoading || (orderType === "takeaway" && !selectedAddress && addresses.length === 0)}
              >
                {isLoading ? "Sipariş Veriliyor..." : "Siparişi Tamamla"}
              </Button>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Order;
