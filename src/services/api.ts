
import { toast } from "sonner";

const API_BASE_URL = "https://450f-109-228-207-11.ngrok-free.app";

// LocalStorage'dan token alma fonksiyonu
const getToken = (): string | null => {
  const user = localStorage.getItem('user');
  if (!user) return null;
  
  try {
    const userData = JSON.parse(user);
    return userData.token || null;
  } catch (error) {
    console.error('Token parsing error:', error);
    return null;
  }
};

// API isteği yapan genel fonksiyon
const apiRequest = async (
  endpoint: string,
  method: string = 'GET',
  data?: any,
  isFormData: boolean = false,
  addToken: boolean = true
) => {
  try {
    const token = getToken();
    const headers: Record<string, string> = {};
    
    if (addToken && token) {
      headers['Authorization'] = `Bearer ${token}`;
    }
    
    if (!isFormData) {
      headers['Content-Type'] = 'application/json';
    }
    
    const options: RequestInit = { 
      method, 
      headers 
    };
    
    if (data) {
      if (isFormData) {
        // FormData nesnesi zaten oluşturulmuş olmalı
        options.body = data;
      } else {
        options.body = JSON.stringify(data);
      }
    }
    
    const response = await fetch(`${API_BASE_URL}${endpoint}`, options);
    
    // 204 No Content durumunda JSON dönüşü olmaz
    if (response.status === 204) {
      return { success: true };
    }
    
    const result = await response.json();
    
    if (!response.ok) {
      throw new Error(result.message || 'İstek işlenirken bir hata oluştu');
    }
    
    return result;
  } catch (error) {
    console.error(`API Error (${endpoint}):`, error);
    throw error;
  }
};

// Kullanıcı İşlemleri
export const authAPI = {
  register: async (userData: {
    name: string;
    email: string;
    phone: string;
    password: string;
    password_confirm: string;
  }) => {
    try {
      return await apiRequest('/api/user/register/', 'POST', userData, false, false);
    } catch (error) {
      toast.error('Kayıt işlemi başarısız oldu');
      throw error;
    }
  },
  
  login: async (credentials: { email: string; password: string }) => {
    try {
      const result = await apiRequest('/api/user/login/', 'POST', credentials, false, false);
      // Token ve kullanıcı bilgilerini localStorage'a kaydet
      localStorage.setItem('user', JSON.stringify({
        ...result.user,
        token: result.access
      }));
      return result;
    } catch (error) {
      toast.error('Giriş işlemi başarısız oldu');
      throw error;
    }
  },
  
  logout: async () => {
    try {
      await apiRequest('/api/user/logout/', 'POST', {});
      localStorage.removeItem('user');
      return { success: true };
    } catch (error) {
      toast.error('Çıkış yaparken bir hata oluştu');
      throw error;
    }
  },
  
  getProfile: async () => {
    try {
      return await apiRequest('/api/user/profile/');
    } catch (error) {
      toast.error('Profil bilgileri alınamadı');
      throw error;
    }
  },
  
  updateProfile: async (profileData: { name?: string; phone?: string }) => {
    try {
      return await apiRequest('/api/user/profile/', 'PUT', profileData);
    } catch (error) {
      toast.error('Profil güncellenemedi');
      throw error;
    }
  },
  
  resetPassword: async (data: {
    email: string;
    old_password: string;
    new_password: string;
    new_password_confirm: string;
  }) => {
    try {
      return await apiRequest('/api/user/password-reset/', 'POST', data, false, false);
    } catch (error) {
      toast.error('Şifre sıfırlama başarısız oldu');
      throw error;
    }
  },
  
  getUserLogs: async () => {
    try {
      return await apiRequest('/api/user/logs/');
    } catch (error) {
      toast.error('Kullanıcı logları alınamadı');
      throw error;
    }
  },
};

// Menü İşlemleri
export const menuAPI = {
  getAllFoods: async () => {
    try {
      return await apiRequest('/api/menu/foods/');
    } catch (error) {
      toast.error('Menü bilgileri alınamadı');
      throw error;
    }
  },
  
  getFoodById: async (foodId: string) => {
    try {
      return await apiRequest(`/api/menu/foods/${foodId}/`);
    } catch (error) {
      toast.error('Yemek detayları alınamadı');
      throw error;
    }
  },
  
  getFoodsByCategory: async (category: string) => {
    try {
      return await apiRequest(`/api/menu/foods/by_category/?category=${encodeURIComponent(category)}`);
    } catch (error) {
      toast.error('Kategori ürünleri alınamadı');
      throw error;
    }
  },
  
  createFood: async (foodData: FormData) => {
    try {
      return await apiRequest('/api/menu/foods/', 'POST', foodData, true);
    } catch (error) {
      toast.error('Yemek eklenemedi');
      throw error;
    }
  },
  
  updateFood: async (foodId: string, foodData: FormData) => {
    try {
      return await apiRequest(`/api/menu/foods/${foodId}/`, 'PUT', foodData, true);
    } catch (error) {
      toast.error('Yemek güncellenemedi');
      throw error;
    }
  },
  
  deleteFood: async (foodId: string) => {
    try {
      return await apiRequest(`/api/menu/foods/${foodId}/`, 'DELETE');
    } catch (error) {
      toast.error('Yemek silinemedi');
      throw error;
    }
  },
};

// Değerlendirme İşlemleri
export const reviewAPI = {
  getAllReviews: async () => {
    try {
      return await apiRequest('/api/reviews/');
    } catch (error) {
      toast.error('Değerlendirmeler alınamadı');
      throw error;
    }
  },
  
  getReview: async (reviewId: string) => {
    try {
      return await apiRequest(`/api/reviews/${reviewId}/`);
    } catch (error) {
      toast.error('Değerlendirme alınamadı');
      throw error;
    }
  },
  
  getReviewsByFoodId: async (foodId: string) => {
    try {
      return await apiRequest(`/api/reviews/food/${foodId}/`);
    } catch (error) {
      toast.error('Ürün değerlendirmeleri alınamadı');
      throw error;
    }
  },
  
  createReview: async (reviewData: { food_id: string; rating: number; comment: string }) => {
    try {
      return await apiRequest('/api/reviews/', 'POST', reviewData);
    } catch (error) {
      toast.error('Değerlendirme eklenemedi');
      throw error;
    }
  },
  
  deleteReview: async (reviewId: string) => {
    try {
      return await apiRequest(`/api/reviews/${reviewId}/`, 'DELETE');
    } catch (error) {
      toast.error('Değerlendirme silinemedi');
      throw error;
    }
  },
};

// Sipariş İşlemleri
export const orderAPI = {
  getAllOrders: async () => {
    try {
      return await apiRequest('/api/orders/');
    } catch (error) {
      toast.error('Siparişler alınamadı');
      throw error;
    }
  },
  
  getOrderById: async (orderId: string) => {
    try {
      return await apiRequest(`/api/orders/${orderId}/`);
    } catch (error) {
      toast.error('Sipariş detayları alınamadı');
      throw error;
    }
  },
  
  createOrder: async (orderData: {
    total_price: number;
    order_status: string;
    payment_method: string;
    delivery_address?: string;
    table_number?: number;
    order_type: "takeaway" | "dine_in";
    items: Array<{
      food_id: string;
      quantity: number;
      price: number;
    }>;
  }) => {
    try {
      return await apiRequest('/api/orders/', 'POST', orderData);
    } catch (error) {
      toast.error('Sipariş oluşturulamadı');
      throw error;
    }
  },
  
  updateOrderStatus: async (orderId: string, status: string) => {
    try {
      return await apiRequest(`/api/orders/${orderId}/update_status/`, 'PATCH', { order_status: status });
    } catch (error) {
      toast.error('Sipariş durumu güncellenemedi');
      throw error;
    }
  },
  
  deleteOrder: async (orderId: string) => {
    try {
      return await apiRequest(`/api/orders/${orderId}/`, 'DELETE');
    } catch (error) {
      toast.error('Sipariş silinemedi');
      throw error;
    }
  },
};

// Adres İşlemleri
export const addressAPI = {
  getAllAddresses: async () => {
    try {
      return await apiRequest('/api/delivery-addresses/');
    } catch (error) {
      toast.error('Adresler alınamadı');
      throw error;
    }
  },
  
  getAddress: async (addressId: string) => {
    try {
      return await apiRequest(`/api/delivery-addresses/${addressId}/`);
    } catch (error) {
      toast.error('Adres detayları alınamadı');
      throw error;
    }
  },
  
  createAddress: async (addressData: { street: string; city: string; zip_code: string }) => {
    try {
      return await apiRequest('/api/delivery-addresses/', 'POST', addressData);
    } catch (error) {
      toast.error('Adres eklenemedi');
      throw error;
    }
  },
  
  updateAddress: async (addressId: string, addressData: Partial<{ street: string; city: string; zip_code: string }>) => {
    try {
      return await apiRequest(`/api/delivery-addresses/${addressId}/`, 'PATCH', addressData);
    } catch (error) {
      toast.error('Adres güncellenemedi');
      throw error;
    }
  },
  
  deleteAddress: async (addressId: string) => {
    try {
      return await apiRequest(`/api/delivery-addresses/${addressId}/`, 'DELETE');
    } catch (error) {
      toast.error('Adres silinemedi');
      throw error;
    }
  },
};

// Ödeme İşlemleri
export const paymentAPI = {
  getAllPayments: async () => {
    try {
      return await apiRequest('/api/payment/');
    } catch (error) {
      toast.error('Ödemeler alınamadı');
      throw error;
    }
  },
  
  getPayment: async (paymentId: string) => {
    try {
      return await apiRequest(`/api/payment/${paymentId}/`);
    } catch (error) {
      toast.error('Ödeme detayları alınamadı');
      throw error;
    }
  },
  
  createPayment: async (paymentData: {
    order_id: string;
    payment_method: string;
    total_amount: string;
  }) => {
    try {
      return await apiRequest('/api/payment/', 'POST', paymentData);
    } catch (error) {
      toast.error('Ödeme işlemi başarısız oldu');
      throw error;
    }
  },
  
  updatePaymentStatus: async (paymentId: string, status: string) => {
    try {
      return await apiRequest(`/api/payment/${paymentId}/update_status/`, 'PUT', {
        payment_status: status,
      });
    } catch (error) {
      toast.error('Ödeme durumu güncellenemedi');
      throw error;
    }
  },
};

// Cash işlemleri
export const cashAPI = {
  withdraw: async (amount: number) => {
    try {
      return await apiRequest('/api/user/cash/withdraw/', 'POST', { amount });
    } catch (error) {
      toast.error('Para çekme işlemi başarısız oldu');
      throw error;
    }
  }
};
