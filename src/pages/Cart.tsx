import React, { useState } from "react";
import { MainLayout } from "@/layouts/main-layout";
import { useCart, CartItem } from "@/hooks/use-cart";
import { Button } from "@/components/ui/button";
import { Trash2, Plus, Minus } from "lucide-react";
import { Link } from "react-router-dom";

const Cart = () => {
  const { items, removeItem, updateQuantity, getTotalPrice, clearCart } = useCart();
  const isEmpty = items.length === 0;

  const handleUpdateQuantity = (id: string, quantity: number) => {
    if (quantity < 1) {
      removeItem(id);
    } else {
      updateQuantity(id, quantity);
    }
  };

  return (
    <MainLayout>
      <div className="max-w-5xl mx-auto" data-testid="cart-container">
        <h1 className="text-3xl font-bold mb-8" data-testid="cart-title">Sepetim</h1>

        {isEmpty ? (
          <div className="text-center py-12" data-testid="empty-cart">
            <div className="text-6xl mb-4">🛒</div>
            <h2 className="text-2xl font-semibold mb-4">Sepetiniz Boş</h2>
            <p className="text-gray-600 mb-6">
              Sepetinize henüz hiç ürün eklemediniz.
            </p>
            <Link to="/menu">
              <Button data-testid="go-to-menu-button">Menüye Git</Button>
            </Link>
          </div>
        ) : (
          <>
            <div className="bg-white rounded-lg shadow-md mb-6" data-testid="cart-items">
              <div className="p-6">
                <div className="flex justify-between border-b pb-4 mb-4 font-medium">
                  <div className="w-2/5">Ürün</div>
                  <div className="w-1/5 text-center">Fiyat</div>
                  <div className="w-1/5 text-center">Miktar</div>
                  <div className="w-1/5 text-right">Toplam</div>
                </div>

                {items.map((item) => (
                  <div key={item.id} className="flex justify-between items-center py-4 border-b" data-testid={`cart-item-${item.id}`}>
                    <div className="w-2/5 flex items-center">
                      <img 
                        src={item.image || "/placeholder.svg"} 
                        alt={item.name}
                        className="w-16 h-16 object-cover rounded mr-4"
                      />
                      <div>
                        <h3 className="font-medium">{item.name}</h3>
                        <button 
                          onClick={() => removeItem(item.id)} 
                          className="text-red-600 text-sm flex items-center mt-1 hover:text-red-800"
                          data-testid={`remove-item-${item.id}`}
                        >
                          <Trash2 className="w-4 h-4 mr-1" /> Kaldır
                        </button>
                      </div>
                    </div>
                    <div className="w-1/5 text-center">
                      {item.price} ₺
                    </div>
                    <div className="w-1/5 flex justify-center items-center">
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity - 1)}
                        className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                        data-testid={`decrease-quantity-${item.id}`}
                      >
                        <Minus className="w-4 h-4" />
                      </button>
                      <span className="mx-3" data-testid={`quantity-${item.id}`}>{item.quantity}</span>
                      <button 
                        onClick={() => handleUpdateQuantity(item.id, item.quantity + 1)}
                        className="bg-gray-200 p-1 rounded hover:bg-gray-300"
                        data-testid={`increase-quantity-${item.id}`}
                      >
                        <Plus className="w-4 h-4" />
                      </button>
                    </div>
                    <div className="w-1/5 text-right font-medium" data-testid={`item-total-${item.id}`}>
                      {(item.price * item.quantity).toFixed(2)} ₺
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Sepet özeti */}
            <div className="flex flex-col md:flex-row justify-between gap-6">
              <div className="md:w-1/2">
                <Button 
                  variant="outline" 
                  onClick={clearCart} 
                  className="text-gray-700"
                  data-testid="clear-cart-button"
                >
                  Sepeti Temizle
                </Button>
              </div>
              <div className="md:w-1/2 bg-white rounded-lg shadow-md p-6" data-testid="order-summary">
                <h3 className="text-lg font-bold mb-4">Sipariş Özeti</h3>
                <div className="space-y-2 mb-4">
                  <div className="flex justify-between">
                    <span>Ara Toplam:</span>
                    <span data-testid="subtotal">{getTotalPrice().toFixed(2)} ₺</span>
                  </div>
                  <div className="flex justify-between">
                    <span>Teslimat Ücreti:</span>
                    <span data-testid="delivery-fee">10.00 ₺</span>
                  </div>
                  <div className="border-t pt-2 font-bold flex justify-between">
                    <span>Toplam:</span>
                    <span data-testid="total-price">{(getTotalPrice() + 10).toFixed(2)} ₺</span>
                  </div>
                </div>
                <Link to="/siparis">
                  <Button className="w-full" data-testid="complete-order-button">Siparişi Tamamla</Button>
                </Link>
              </div>
            </div>
          </>
        )}
      </div>
    </MainLayout>
  );
};

export default Cart;
